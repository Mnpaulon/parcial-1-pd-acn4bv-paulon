

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login, user, authError } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Si ya estoy logueado, no tiene sentido ver el login:
  // redirigimos automáticamente al inventario.
  useEffect(() => {
    if (user) {
      navigate("/inventario");
    }
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);

    const ok = await login(username, password);

    setLoading(false);

    if (ok) {
      navigate("/inventario");
    } else {
      // mostramos error genérico si no vino algo desde el backend
      setLocalError("No se pudo iniciar sesión. Verificá tus datos.");
    }
  }

  const errorToShow = authError || localError;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">
          Ingresá con tu usuario y contraseña para modificar el inventario.
        </p>

        {/* Mensaje de error del backend o local*/}
        {errorToShow && (
          <div className="login-error">
            {errorToShow}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="username">
              Usuario
            </label>
            <input
              id="username"
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="auth-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
