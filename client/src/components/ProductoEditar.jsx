
// client/src/components/ProductoEditar.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProductoEditar({ producto, onUpdated, onCancel }) {
  const { token } = useAuth();

  const [form, setForm] = useState({
    nombre: producto.nombre ?? "",
    categoria: producto.categoria ?? "",
    stock: producto.stock ?? "",
    precio: producto.precio ?? "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:3000/api/productos/${producto.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: form.nombre,
          categoria: form.categoria,
          stock: Number(form.stock),
          precio: Number(form.precio),
        }),
      }
    );

    const data = await res.json();
    if (onUpdated) onUpdated(data);
  }

  return (
    <form className="form-panel" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Nombre</label>
        <input
          className="form-input"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Categoría</label>
        <input
          className="form-input"
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Stock</label>
        <input
          type="number"
          className="form-input"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Precio</label>
        <input
          type="number"
          className="form-input"
          name="precio"
          value={form.precio}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          Guardar cambios
        </button>
      </div>
    </form>
  );
}
