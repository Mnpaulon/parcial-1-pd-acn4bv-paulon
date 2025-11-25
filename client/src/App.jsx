
// client/src/App.jsx
import { Routes, Route, Link, useLocation } from "react-router-dom";
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

  // estamos en la ruta /login ?
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

          {/* Cuando SÍ estoy logueado → solo mostrar Logout */}
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

export default function App() {
  return (
    <>
      <AppHeader />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<InventarioPage />} />
          <Route path="/inventario" element={<InventarioPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </>
  );
}
