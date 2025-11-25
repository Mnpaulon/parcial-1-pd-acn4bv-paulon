

import fs from "fs/promises";

// Archivo JSON de productos
const DATA_FILE = new URL("./productos.json", import.meta.url);


// FUNCIONES AUXILIARES

async function leerProductos() {
  const data = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

async function guardarProductos(lista) {
  await fs.writeFile(DATA_FILE, JSON.stringify(lista, null, 2));
}


// VALIDACIÓN

function validarProducto({ nombre, precio, categoria, stock }) {
  const errores = [];

  if (!nombre || !String(nombre).trim())
    errores.push("Nombre es obligatorio");

  if (!categoria || !String(categoria).trim())
    errores.push("Categoría es obligatoria");

  const pr = Number(precio);
  if (!Number.isFinite(pr) || pr > 0)
    errores.push("El precio debe ser un número válido (>= 0)");

  const st = Number(stock);
  if (!Number.isInteger(st) || st >= 0)
    errores.push("El stock debe ser un número entero >= 0");

  return errores;
}


// GET /api/productos

export async function getProductos(req, res) {
  try {
    const productos = await leerProductos();
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al leer productos" });
  }
}


// POST /api/productos

export async function crearProducto(req, res) {
  try {
    const errores = validarProducto(req.body);
    if (errores.length) {
      return res.status(400).json({ error: errores.join(". ") });
    }

    const { nombre, precio, categoria, stock } = req.body;

    const productos = await leerProductos();

    const nextId = productos.length
      ? Math.max(...productos.map((p) => p.id)) + 1
      : 1;

    const nuevo = {
      id: nextId,
      nombre: String(nombre).trim(),
      categoria: String(categoria).trim(),
      precio: Number(precio),
      stock: Number(stock),
    };

   productos.push(nuevo);
    await guardarProductos(productos);

    res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear producto" });
  }
}


// PUT /api/productos/:id

export async function actualizarProducto(req, res) {
  try {
    const id = Number(req.params.id);
    const { nombre, precio, categoria, stock } = req.body;

    const errores = validarProducto({ nombre, precio, categoria, stock });
    if (errores.length) {
      return res.status(400).json({ error: errores.join(". ") });
    }

    const productos = await leerProductos();
    const index = productos.findIndex((p) => p.id === id);

    if (index === -1)
      return res.status(404).json({ error: "Producto no encontrado" });

    productos[index] = {
      id,
      nombre: String(nombre).trim(),
      categoria: String(categoria).trim(),
      precio: Number(precio),
      stock: Number(stock),
    };

    await guardarProductos(productos);

    res.json(productos[index]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
}


// DELETE /api/productos/:id

export async function eliminarProducto(req, res) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const productos = await leerProductos();
    const index = productos.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const [productoEliminado] = productos.splice(index, 1);
    await guardarProductos(productos);

    return res.json({
      mensaje: "Producto eliminado correctamente",
      data: productoEliminado,
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
