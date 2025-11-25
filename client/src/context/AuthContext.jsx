
// client/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { id, username, role }
  const [token, setToken] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  async function login(username, password) {
    setAuthError(null);

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || "Error al iniciar sesión");
        return false;
      }

      // data: { mensaje, token, user: { id, username, role } }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return true;
    } catch (err) {
      console.error("Error en login:", err);
      setAuthError("No se pudo conectar al servidor");
      return false;
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    setAuthError(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  const value = {
    user,
    token,
    authError,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
