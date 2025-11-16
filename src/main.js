// ===============================
//  Inventario de Productos (UI + API)
// ===============================

// --- Estado y utilidades ---
const STORAGE_KEY = "productos";     // usado SOLO como fallback
let productos = [];
let nextId = 1;

const $ = (sel) => document.querySelector(sel);

// Elementos de UI
const form      = $("#form-producto");
const nombre    = $("#nombre");
const precio    = $("#precio");
const categoria = $("#categoria");
const stock     = $("#stock");
const msg       = $("#msg");
const tbody     = $("#tbody");
const buscar    = $("#buscar");
const btnApi    = $("#btn-api");
const btnAgregar = form ? form.querySelector(".btn-primary") : null;

// Clase de dominio
class Producto {
  constructor(id, nombre, precio, categoria, stock) {
    this.id = id;
    this.nombre = nombre;
    this.precio = Number(precio);
    this.categoria = categoria;
    this.stock = Number(stock);
  }
  precioConIVA() {
    return +(this.precio * 1.21).toFixed(2);
  }
}

// -------------------------------------
// API REST
// -------------------------------------
const BASE_URL = "http://localhost:3000/api/productos";

async function apiGet() {
  const r = await fetch(BASE_URL);
  if (!r.ok) throw new Error("Error GET " + r.status);
  return r.json();
}

async function apiPost(payload) {
  const r = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.error || ("Error POST " + r.status));
  }

  return r.json();
}

async function apiPatch(id, payload) {
  const r = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.error || ("Error PATCH " + r.status));
  }

  return r.json();
}

async function apiDelete(id) {
  const r = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Error DELETE " + r.status);
  return r.json();
}

// -----------------
// Render de la tabla
// -----------------
function render(filtro = "") {
  const term = filtro.trim().toLowerCase();
  const list = term
    ? productos.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        p.categoria.toLowerCase().includes(term)
      )
    : productos;

  tbody.innerHTML = list.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>$ ${p.precio.toFixed(2)} 
        <small style="opacity:.6">(c/IVA: $${p.precioConIVA()})</small>
      </td>
      <td>${p.stock}</td>

      <td>
        <button class="btn-edit" data-edit="${p.id}">Editar</button>
        <button class="btn-danger" data-del="${p.id}">Eliminar</button>
      </td>
    </tr>
  `).join("");
}


// ------------
// Validación
// ------------
function validarEntrada() {
  const errores = [];

  if (!nombre.value.trim()) errores.push("El nombre es obligatorio.");

  const pr = Number(precio.value);
  if (!Number.isFinite(pr) || pr <= 0) errores.push("El precio debe ser mayor a 0.");

  if (!categoria.value.trim()) errores.push("Seleccioná una categoría.");

  const st = Number(stock.value);
  if (!Number.isInteger(st) || st <= 0) errores.push("El stock debe ser un entero > 0.");

  return errores;
}

function setMsg(texto, tipo = "ok") {
  msg.textContent = texto;
  msg.style.color = tipo === "error" ? "#b00020" : "#155724";
}

// -----------------
// Cargar desde API
// -----------------
async function loadFromAPI() {
  const data = await apiGet();
  productos = data.map(p => new Producto(p.id, p.nombre, p.precio, p.categoria, p.stock));
  nextId = productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1;
  render(buscar.value);
}

// ------------------------
// Eventos
// ------------------------
function wireEvents() {

  // POST
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("");

    const errores = validarEntrada();
    if (errores.length) {
      setMsg("⚠ " + errores.join(" "), "error");
      return;
    }

    const payload = {
      nombre: nombre.value.trim(),
      precio: Number(precio.value),
      categoria: categoria.value.trim(),
      stock: Number(stock.value),
    };

    try {
      await apiPost(payload);
      await loadFromAPI();
      form.reset();
      categoria.value = "";
      setMsg("✅ Producto agregado.");
    } catch (err) {
      setMsg("❌ " + err.message, "error");
    }
  });

  // DELETE + PATCH
  tbody.addEventListener("click", async (e) => {
    const delId = e.target.dataset.del;
    const editId = e.target.dataset.edit;

    // --- DELETE ---
    if (delId) {
      if (!confirm("¿Eliminar este producto?")) return;
      try {
        await apiDelete(Number(delId));
        await loadFromAPI();
        setMsg("🗑️ Producto eliminado.");
      } catch (err) {
        setMsg("❌ No se pudo eliminar: " + err.message, "error");
      }
      return;
    }

    // --- EDITAR (PATCH) ---
    if (editId) {
      const id = Number(editId);
      const prod = productos.find(p => p.id === id);
      if (!prod) return;

      const nuevoNombre = prompt("Nuevo nombre:", prod.nombre);
      if (!nuevoNombre) return;

      const nuevoPrecio = prompt("Nuevo precio:", prod.precio);
      if (!nuevoPrecio) return;

      const nuevoStock = prompt("Nuevo stock:", prod.stock);
      if (!nuevoStock) return;

      const nuevaCategoria = prompt("Nueva categoría:", prod.categoria);
      if (!nuevaCategoria) return;

      const payload = {
        nombre: nuevoNombre.trim(),
        precio: Number(nuevoPrecio),
        categoria: nuevaCategoria.trim(),
        stock: Number(nuevoStock)
      };

      try {
        await apiPatch(id, payload);
        await loadFromAPI();
        setMsg("✏️ Producto editado correctamente.");
      } catch (err) {
        setMsg("❌ Error al editar: " + err.message, "error");
      }
    }
  });

  // Búsqueda
  buscar.addEventListener("keyup", () => render(buscar.value));

  // API externa Fakestore
  btnApi.addEventListener("click", async () => {
    setMsg("Cargando desde API de ejemplo…");
    btnApi.disabled = true;

    try {
      const res = await fetch("https://fakestoreapi.com/products/category/electronics");
      if (!res.ok) throw new Error("HTTP " + res.status);

      const data = await res.json();

      for (const item of data) {
        const payload = {
          nombre: String(item.title).slice(0,60),
          precio: Number(item.price) || 1,
          categoria: "Periférico",
          stock: Math.floor(Math.random()*50)+1
        };
        await apiPost(payload);
      }

      await loadFromAPI();
      setMsg("✅ Productos de ejemplo cargados.");
    } catch (err) {
      setMsg("❌ " + err.message, "error");
    } finally {
      btnApi.disabled = false;
    }
  });
}

// ---------------
// Inicialización
// ---------------
async function init() {
  try {
    await loadFromAPI();
  } catch (err) {
    console.warn("Backend offline. Cargando cache local.");
    loadLocal();
    render();
    setMsg("⚠ Mostrando datos locales.", "error");
  }
  wireEvents();
}

document.addEventListener("DOMContentLoaded", init);
