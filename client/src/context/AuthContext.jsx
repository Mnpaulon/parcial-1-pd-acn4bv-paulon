
// client/src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  async function login(username, password) {
    setAuthError(null);

    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json().catch(() => null);

    console.log("LOGIN status:", res.status, "body:", data); // 👈 para debug

    if (!res.ok) {
      // acá mostramos el error real que manda el backend
      const msg = data?.error || "Credenciales inválidas";
      setAuthError(msg);
      throw new Error(msg);
    }

    setToken(data.token);
    setUser(data.user);
    return data;
  }

  function logout() {
    setToken(null);
    setUser(null);
    setAuthError(null);
  }

  const value = {
    token,
    user,
    authError,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
