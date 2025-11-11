
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import morgan from "morgan";

const app = express();
const PORT = 3000;
const DATA_FILE = new URL("./productos.json", import.meta.url);

// ------------------------------
// MIDDLEWARES
// ------------------------------
app.use(cors()); // ✅ permite peticiones desde otros puertos (ej. Live Server)
app.use(express.json());
app.use(morgan("dev"));

// ------------------------------
// FUNCIONES AUXILIARES
// ------------------------------
async function leerProductos() {
  const data = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

async function guardarProductos(lista) {
  await fs.writeFile(DATA_FILE, JSON.stringify(lista, null, 2));
}

// ------------------------------
// ENDPOINTS
// ------------------------------

// GET /api/productos → listar todos
app.get("/api/productos", async (req, res) => {
  try {
    const productos = await leerProductos();
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al leer productos" });
  }
});

// POST /api/productos → agregar uno nuevo
app.post("/api/productos", async (req, res) => {
  try {
    const { nombre, precio, categoria, stock } = req.body;

    // Validaciones básicas
    if (!nombre || !categoria)
      return res.status(400).json({ error: "Nombre y categoría son obligatorios" });
    if (isNaN(precio) || precio <= 0)
      return res.status(400).json({ error: "El precio debe ser mayor a 0" });
    if (!Number.isInteger(stock) || stock <= 0)
      return res.status(400).json({ error: "El stock debe ser un entero > 0" });

    const productos = await leerProductos();

    const nuevo = {
      id: productos.length ? Math.max(...productos.map((p) => p.id)) + 1 : 1,
      nombre,
      precio,
      categoria,
      stock,
    };

    productos.push(nuevo);
    await guardarProductos(productos);
    res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar producto" });
  }
});

// DELETE /api/productos/:id → eliminar producto por id
app.delete("/api/productos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const productos = await leerProductos();
    const index = productos.findIndex((p) => p.id === id);

    if (index === -1)
      return res.status(404).json({ error: "Producto no encontrado" });

    productos.splice(index, 1);
    await guardarProductos(productos);
    res.json({ message: "Producto eliminado", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

// ------------------------------
// SERVIDOR
// ------------------------------
app.listen(PORT, () =>
  console.log(`✅ Servidor API corriendo en http://localhost:${PORT}`)
);
