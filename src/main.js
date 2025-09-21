

// ----- Estado y utilidades -----
const STORAGE_KEY = "productos";

const $ = (sel) => document.querySelector(sel); // función flecha
const form = $("#form-producto");
const nombre = $("#nombre");
const precio = $("#precio");
const categoria = $("#categoria");
const stock = $("#stock");
const msg = $("#msg");
const tbody = $("#tbody");
const buscar = $("#buscar");
const btnApi = $("#btn-api");

let productos = [];
let nextId = 1;

// Clase con constructor + método
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

// ----- Persistencia -----
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
}
function load() {
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

// ----- Render -----
const render = (filtro = "") => {
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
};

// ----- Validación -----
function validarEntrada() {
  const errores = [];
  if (!nombre.value.trim()) errores.push("El nombre es obligatorio.");
  const pr = Number(precio.value);
  if (!(pr > 0)) errores.push("El precio debe ser mayor a 0.");
  if (!categoria.value.trim()) errores.push("Seleccioná una categoría.");
  const st = Number(stock.value);
  if (!(Number.isInteger(st) && st >= 0)) errores.push("El stock debe ser un entero ≥ 0.");
  return errores;
}

// ----- Handlers -----
form.addEventListener("submit", (e) => {
  e.preventDefault();
  msg.textContent = "";

  const errores = validarEntrada();
  if (errores.length) {
    msg.textContent = "⚠ " + errores.join(" ");
    msg.style.color = "#b00020";
    return;
  }

  const nuevo = new Producto(
    nextId++,
    nombre.value.trim(),
    Number(precio.value),
    categoria.value.trim(),
    Number(stock.value)
  );

  productos.push(nuevo);
  save();
  render(buscar.value);
  form.reset();
  categoria.value = "";
  msg.textContent = "✅ Producto agregado.";
  msg.style.color = "#155724";
});

// Delegación para eliminar
tbody.addEventListener("click", (e) => {
  const id = e.target.dataset.del;
  if (!id) return;
  // callback de confirmación:
  if (!confirm("¿Eliminar este producto?")) return;

  productos = productos.filter(p => p.id !== Number(id));
  save();
  render(buscar.value);
});

// Búsqueda
buscar.addEventListener("keyup", () => render(buscar.value));

// Cargar ejemplos desde API (extra hoja 3)
btnApi.addEventListener("click", async () => {
  msg.textContent = "Cargando desde API…";
  msg.style.color = "#555";
  try {
    const res = await fetch("https://fakestoreapi.com/products?limit=5");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    // Mapear a nuestro modelo
    data.forEach(item => {
      const prod = new Producto(
        nextId++,
        String(item.title).slice(0, 60),
        Number(item.price) || 1,
        item.category ? String(item.category) : "Otros",
        Math.floor(Math.random() * 50) + 1 // stock aleatorio 1-50
      );
      productos.push(prod);
    });
    save();
    render(buscar.value);
    msg.textContent = "✅ Productos de ejemplo cargados.";
    msg.style.color = "#155724";
  } catch (err) {
    console.error(err);
    msg.textContent = "❌ No se pudo cargar la API. Probá de nuevo.";
    msg.style.color = "#b00020";
  }
});

// ----- Inicialización -----
load();
render();
