
// src/App.jsx
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import InventarioPage from "./pages/InventarioPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import "./App.css";

function AppHeader() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  // ¿Estamos en la ruta /login?
  const isLoginPage = location.pathname === "/login";

  return (
    <header className="app-header">
      <div className="app-header-inner">
        {/* Logo clickeable que lleva al inventario */}
        <Link to="/inventario" className="app-logo">
          <span className="app-logo-dot" />
          <span className="app-logo-text">Inventario</span>
        </Link>

        <nav className="app-nav">
          {/* Cuando NO estoy logueado → mostrar Login
              PERO NO si ya estoy en /login */}
          {!user && !isLoginPage && (
            <Link to="/login" className="btn btn-primary app-nav-logout">
              Login
            </Link>
          )}

          {/* Cuando SÍ estoy logueado → mostrar Logout */}
          {user && (
            <button
              type="button"
              className="btn btn-primary app-nav-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

// Componente para proteger rutas: solo entra si hay user en el contexto
function PrivateRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // Si no hay usuario logueado → mandar a /login
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario → renderiza la página protegida
  return children;
}

export default function App() {
  return (
    <>
      <AppHeader />
      <main className="app-main">
        <Routes>
          {/* Raíz: redirige a /inventario (que está protegido) */}
          <Route path="/" element={<Navigate to="/inventario" replace />} />

          {/* Inventario protegido: requiere estar logueado */}
          <Route
            path="/inventario"
            element={
              <PrivateRoute>
                <InventarioPage />
              </PrivateRoute>
            }
          />

          {/* Login siempre público */}
          <Route path="/login" element={<LoginPage />} />

          {/*Ruta para cualquier otra URL → login o inventario */}
          <Route
            path="*"
            element={<Navigate to="/inventario" replace />}
          />
        </Routes>
      </main>
    </>
  );
}
