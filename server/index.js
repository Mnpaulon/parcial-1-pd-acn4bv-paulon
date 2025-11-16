
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import morgan from "morgan";

console.log("BOOT FILE:", import.meta.url);


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
// VALIDACIONES
// ------------------------------
function validarProductoCompleto(req, res, next) {
  const { nombre, precio, stock } = req.body;
  const errores = [];

  if (!nombre || typeof nombre !== "string" || nombre.trim().length < 3) {
    errores.push("El nombre es obligatorio y debe tener al menos 3 caracteres.");
  }

  if (precio === undefined || typeof precio !== "number" || precio < 0) {
    errores.push("El precio es obligatorio y debe ser un número mayor o igual a 0.");
  }

  if (stock === undefined || !Number.isInteger(stock) || stock < 0) {
    errores.push("El stock es obligatorio y debe ser un entero mayor o igual a 0.");
  }

  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  next();
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

// GET /api/productos/:id → detalle por id
app.get("/api/productos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const productos = await leerProductos();
    const prod = productos.find(p => p.id === id);
    if (!prod) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al leer producto" });
  }
});



// POST /api/productos → agregar uno nuevo
app.post("/api/productos", async (req, res) => {
  try {
    const errores = validarProducto(req.body);
    if (errores.length) return res.status(400).json({ error: errores.join(". ") });

    const { nombre, precio, categoria, stock } = req.body;

    const productos = await leerProductos();
    const nextId = productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1;

    const nuevo = {
      id: nextId,
      nombre: String(nombre).trim(),
      precio: Number(precio),
      categoria: String(categoria).trim(),
      stock: Number(stock),
    };

    productos.push(nuevo);
    await guardarProductos(productos);

    res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear producto" });
  }
});




// PUT /api/productos/:id → actualizar un producto existente
app.put("/api/productos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, precio, categoria, stock } = req.body;

    // Validaciones básicas (mismas que POST)
    const errores = validarProducto({ nombre, precio, categoria, stock });
    if (errores.length) return res.status(400).json({ error: errores.join(". ") });


    const productos = await leerProductos();
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Producto no encontrado" });

    // Actualizar manteniendo el mismo id
    productos[index] = { id, nombre, precio, categoria, stock };
    await guardarProductos(productos);

    res.json(productos[index]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

// PATCH /api/productos/:id → actualización parcial
app.patch("/api/productos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const body = req.body ?? {};

    // Campos permitidos para actualizar
    const permitidos = ["nombre", "precio", "categoria", "stock"];
    const campos = Object.keys(body).filter(k => permitidos.includes(k));

    if (campos.length === 0) {
      return res.status(400).json({ error: "Nada para actualizar" });
    }

    const productos = await leerProductos();
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Producto no encontrado" });

    // Copia del producto actual
    const actual = { ...productos[index] };

    // Validaciones específicas
    if ("nombre" in body) {
      const v = String(body.nombre).trim();
      if (!v) return res.status(400).json({ error: "Nombre es obligatorio" });
      actual.nombre = v;
    }

    if ("categoria" in body) {
      const v = String(body.categoria).trim();
      if (!v) return res.status(400).json({ error: "Categoría es obligatoria" });
      actual.categoria = v;
    }

    if ("precio" in body) {
      const pr = Number(body.precio);
      if (!Number.isFinite(pr) || pr <= 0) {
        return res.status(400).json({ error: "El precio debe ser mayor a 0" });
      }
      actual.precio = pr;
    }

    if ("stock" in body) {
      const st = Number(body.stock);
      if (!Number.isInteger(st) || st <= 0) {
        return res.status(400).json({ error: "El stock debe ser un entero > 0" });
      }
      actual.stock = st;
    }

    // Guardar cambios
    productos[index] = actual;
    await guardarProductos(productos);

    res.json(actual);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar parcialmente" });
  }
});




// ------------------------------
// DELETE /productos/:id
// ------------------------------
app.delete("/api/productos/:id", async (req, res) => {
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
});


const routes = app._router?.stack
  ?.filter(l => l.route)
  ?.map(l => `${Object.keys(l.route.methods).join(",").toUpperCase()} ${l.route.path}`) || [];

console.log("RUTAS REGISTRADAS:", routes);

// ------------------------------
// SERVIDOR
// ------------------------------
app.listen(PORT, () =>
  console.log(`✅ Servidor API corriendo en http://localhost:${PORT}`)
);
