

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ProductoForm from "../components/ProductoForm.jsx";
import ProductoEditar from "../components/ProductoEditar.jsx";
import "./InventarioPage.css";

export default function InventarioPage() {
  const { user, token } = useAuth();
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [mostrarFormNuevo, setMostrarFormNuevo] = useState(false);

  const isLoggedIn = !!user;

  // GET de productos (no requiere token)
  async function cargarProductos() {
    const res = await fetch("http://localhost:3000/api/productos");
    const data = await res.json();
    setProductos(data);
  }

  // DELETE (requiere token)
  async function eliminar(id) {
    await fetch(`http://localhost:3000/api/productos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    cargarProductos();
  }

  // cuando se crea un producto nuevo desde el form
  function handleCreated(nuevo) {
    setProductos((prev) => [...prev, nuevo]);
    setMostrarFormNuevo(false);
  }

  // cuando se actualiza un producto desde el form de edición
  function handleUpdated(actualizado) {
    setProductos((prev) =>
      prev.map((p) => (p.id === actualizado.id ? actualizado : p))
    );
    setEditando(null);
  }

  // acciones de UI
  function handleNuevoProducto() {
    setEditando(null);
    setMostrarFormNuevo(true);
  }

  function handleEditarProducto(prod) {
    setMostrarFormNuevo(false);
    setEditando(prod);
  }

  // FILTRO
  const productosFiltrados = productos.filter((p) => {
    const texto = (p.nombre || "").toLowerCase();
    return texto.includes(filtroNombre.toLowerCase());
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div className="inventario-layout">
      {/* SIDEBAR */}
      <aside className="inventario-sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">📦</span>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">Inventario</span>
            <span className="sidebar-logo-subtitle">Panel interno</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="sidebar-nav-item sidebar-nav-item--active">
            <span>Productos</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-user">
            <span className="sidebar-user-avatar">M</span>
            <span className="sidebar-user-name">Matias Paulon</span>
          </span>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="inventario-main">
        <div className="inventario-container">
          {/* HEADER */}
          <header className="inventario-header">
            <div>
              <p className="inventario-kicker">Panel de control</p>
              <h1 className="inventario-title">Gestión de inventario</h1>
              <p className="inventario-subtitle">
                Visualizá tus productos.
              </p>
            </div>

            <div className="inventario-header-actions">
              {/* BUSCADOR */}
              <div className="inventario-search">
                <span className="inventario-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar por nombre o código..."
                  value={filtroNombre}
                  onChange={(e) => setFiltroNombre(e.target.value)}
                />
              </div>

              {/* RECARGAR DESDE LA API (GET) */}
              <button
                type="button"
                className="btn btn-ghost"
                onClick={cargarProductos}
              >
                ↻ Recargar
              </button>

              {/* BOTÓN NUEVO PRODUCTO SOLO SI HAY LOGIN */}
              {isLoggedIn ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNuevoProducto}
                >
                  + Nuevo producto
                </button>
              ) : (
                <span className="inventario-readonly-badge">
                  Modo lectura (logueate para editar)
                </span>
              )}
            </div>
          </header>

          {/* FORMULARIO DE ALTA */}
          {isLoggedIn && mostrarFormNuevo && (
            <section className="inventario-form-card">
              <h2 className="inventario-form-title">Crear nuevo producto</h2>
              <ProductoForm onCreated={handleCreated} />
            </section>
          )}

          {/* FORMULARIO DE EDICIÓN */}
          {isLoggedIn && editando && (
            <section className="inventario-form-card">
              <h2 className="inventario-form-title">
                Editar producto: {editando.nombre}
              </h2>
              <ProductoEditar
                producto={editando}
                onUpdated={handleUpdated}
                onCancel={() => setEditando(null)}
              />
            </section>
          )}

          {/* TARJETAS RESUMEN */}
          <section className="inventario-resumen">
            <div className="inventario-card">
              <span className="inventario-card-label">Total de productos</span>
              <span className="inventario-card-value">{productos.length}</span>
              <span className="inventario-card-helper">
                Registrados en el sistema
              </span>
            </div>

            <div className="inventario-card">
              <span className="inventario-card-label">Stock global</span>
              <span className="inventario-card-value">
                {productos.reduce((total, p) => total + (p.stock || 0), 0)}
              </span>
              <span className="inventario-card-helper">
                Unidades disponibles
              </span>
            </div>

            <div className="inventario-card">
              <span className="inventario-card-label">Valor estimado</span>
              <span className="inventario-card-value">
                $
                {productos
                  .reduce(
                    (total, p) => total + (p.stock || 0) * (p.precio || 0),
                    0
                  )
                  .toLocaleString("es-AR")}
              </span>
              <span className="inventario-card-helper">Stock valorizado</span>
            </div>
          </section>

          {/* TABLA PRINCIPAL */}
          <section className="inventario-table-card">
            <div className="inventario-table-header">
              <div>
                <h2>Listado de productos</h2>
                <p>Administrá los datos básicos de cada ítem.</p>
              </div>
            </div>

            <div className="inventario-table-wrapper">
              <table className="inventario-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    <th className="th-actions">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.nombre}</td>
                      <td>{producto.categoria}</td>
                      <td>{producto.stock}</td>
                      <td>${producto.precio?.toLocaleString("es-AR")}</td>
                      <td className="td-actions">
                        {isLoggedIn ? (
                          <>
                            <button
                              type="button"
                              className="btn btn-ghost"
                              onClick={() => handleEditarProducto(producto)}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => eliminar(producto.id)}
                            >
                              Eliminar
                            </button>
                          </>
                        ) : (
                          <span className="acciones-lectura">
                            Login para editar
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {productosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan={6} className="inventario-empty">
                        No se encontraron productos para el criterio de
                        búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
