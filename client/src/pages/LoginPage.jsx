

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      await login(username, password);
      navigate("/inventario");
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">
          Ingresá con tu usuario administrador para modificar el inventario.
        </p>

        {error && <p style={{ color: "#fb7185", fontSize: "0.8rem" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="usuario">
              Usuario
            </label>
            <input
              id="usuario"
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            />
          </div>

          <div className="auth-actions">
            <button type="submit" className="btn btn-primary">
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
