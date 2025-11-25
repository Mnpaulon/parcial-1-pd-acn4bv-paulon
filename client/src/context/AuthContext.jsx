

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Cargar sesión guardada al iniciar la app
  useEffect(() => {
    const saved = localStorage.getItem("session");
    if (saved) {
      const parsed = JSON.parse(saved);
      setToken(parsed.token);
      setUser(parsed.user);
    }
  }, []);

  // Guardar sesión cada vez que cambia token o user
  useEffect(() => {
    if (token && user) {
      localStorage.setItem("session", JSON.stringify({ token, user }));
    }
  }, [token, user]);

  const login = async (username, password) => {
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
      console.log("LOGIN status:", res.status, "body:", data);

      if (!res.ok) {
        // el backend devolvió error (por ejemplo 400)
        const msg = data?.error || "Credenciales inválidas";
        setAuthError(msg);
        throw new Error(msg);
      }

      const loggedUser = { username };

      setToken(data.token);
      setUser(loggedUser);

      // persistimos sesión
      localStorage.setItem(
        "session",
        JSON.stringify({ token: data.token, user: loggedUser })
      );

      return true;
    } catch (err) {
      console.error("Error en login:", err);
      if (!authError) {
        setAuthError(err.message || "Error al conectar con el servidor");
      }
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthError(null);
    localStorage.removeItem("session");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        authError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
