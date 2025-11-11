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
// API REST (server Express en localhost)
// -------------------------------------
const BASE_URL = "http://localhost:3000/api/productos";

async function apiGet() {
  const r = await fetch(BASE_URL, { headers: { "Accept": "application/json" } });
  if (!r.ok) throw new Error("Error GET " + r.status);
  return r.json();
}

async function apiPost(payload) {
  const r = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.error || ("Error POST " + r.status));
  }
  return r.json();
}

async function apiDelete(id) {
  const r = await fetch(`${BASE_URL}/${id}`, { method: "DELETE", headers: { "Accept": "application/json" } });
  if (!r.ok) throw new Error("Error DELETE " + r.status);
  return r.json();
}

// -------------------------------------
// Fallback localStorage (solo emergencia)
// -------------------------------------
function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
}
function loadLocal() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    productos = parsed.map(p => new Producto(p.id, p.nombre, p.precio, p.categoria, p.stock));
    nextId = productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1;
  } catch {
    console.warn("No se pudo leer localStorage. Se reinicia el inventario.");
    productos = [];
    nextId = 1;
  }
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

  tbody.innerHTML = list.map((p, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>$ ${p.precio.toFixed(2)} <small style="opacity:.6">(c/IVA: $${p.precioConIVA()})</small></td>
      <td>${p.stock}</td>
      <td><button class="btn-danger" data-del="${p.id}">Eliminar</button></td>
    </tr>
  `).join("");
}

// ------------
// Validación UI
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

function updateAgregarState() {
  if (!btnAgregar) return;
  btnAgregar.disabled = validarEntrada().length > 0;
}

function setMsg(texto, tipo = "ok") {
  if (!msg) return;
  msg.textContent = texto;
  msg.style.color = tipo === "error" ? "#b00020" : "#155724";
}

// -----------------
// Carga desde la API
// -----------------
async function loadFromAPI() {
  const data = await apiGet();
  productos = data.map(p => new Producto(p.id, p.nombre, p.precio, p.categoria, p.stock));
  nextId = productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1;
  render(buscar.value);
}

// ------------------------
// Handlers de interacción
// ------------------------
function wireEvents() {
  // Submit (POST)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("");

    btnAgregar.disabled = true;

    const errores = validarEntrada();
    if (errores.length) {
      setMsg("⚠ " + errores.join(" "), "error");
      updateAgregarState();
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
      await loadFromAPI();         // refrescar la tabla desde el server
      form.reset();
      categoria.value = "";
      setMsg("✅ Producto agregado.");
    } catch (err) {
      console.error(err);
      setMsg("❌ " + err.message, "error");
    } finally {
      updateAgregarState();
    }
  });

  // Delegación para eliminar (DELETE)
  tbody.addEventListener("click", async (e) => {
    const id = e.target.dataset.del;
    if (!id) return;

    if (!confirm("¿Eliminar este producto?")) return;

    try {
      await apiDelete(Number(id));
      await loadFromAPI();
      setMsg("🗑️ Producto eliminado.");
    } catch (err) {
      console.error(err);
      setMsg("❌ No se pudo eliminar: " + err.message, "error");
    }
  });

  // Búsqueda
  buscar.addEventListener("keyup", () => render(buscar.value));

  // Cargar ejemplos (fakestore) -> se cargan al backend con POST
  btnApi.addEventListener("click", async () => {
    setMsg("Cargando desde API de ejemplo…");
    btnApi.disabled = true;
    btnAgregar.disabled = true;

    try {
      const res = await fetch("https://fakestoreapi.com/products/category/electronics");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();

      // Guardar cada item en nuestro backend
      for (const item of data) {
        const payload = {
          nombre: String(item.title).slice(0, 60),
          precio: Number(item.price) || 1,
          categoria: "Periférico",
          stock: Math.floor(Math.random() * 50) + 1
        };
        await apiPost(payload);
      }

      await loadFromAPI();
      setMsg("✅ Productos de ejemplo (electrónica) cargados.");
    } catch (err) {
      console.error(err);
      setMsg("❌ No se pudo cargar la API de ejemplo. " + err.message, "error");
    } finally {
      btnApi.disabled = false;
      updateAgregarState();
    }
  });

  // Validación en vivo para habilitar/deshabilitar el botón Agregar
  [nombre, precio, categoria, stock].forEach(inp => {
    inp.addEventListener("input", updateAgregarState);
    inp.addEventListener("change", updateAgregarState);
  });
}

// ---------------
// Inicialización
// ---------------
async function init() {
  try {
    await loadFromAPI();          // Fuente de verdad: servidor
  } catch (e) {
    console.warn("Fallo el GET al backend. Fallback a cache local.", e);
    loadLocal();                  // fallback solo para mostrar algo si el server no responde
    render(buscar.value);
    setMsg("⚠ Mostrando datos de cache local (server offline).", "error");
  } finally {
    updateAgregarState();
  }
  wireEvents();
}

// Iniciar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  if (!form || !tbody) return;
  init();
});
