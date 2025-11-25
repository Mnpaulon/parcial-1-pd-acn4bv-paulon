

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Resolver ruta a usuarios.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "usuarios.json");

// Leer archivo JSON
async function leerUsuarios() {
  const data = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

// Guardar archivo JSON
async function guardarUsuarios(lista) {
  await fs.writeFile(DATA_FILE, JSON.stringify(lista, null, 2));
}

// GET /api/usuarios

export async function getUsuarios(req, res) {
  try {
    const usuarios = await leerUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error("Error cargando usuarios:", error);
    res.status(500).json({ error: "No se pudieron cargar los usuarios" });
  }
}


// POST /api/usuarios

export async function crearUsuario(req, res) {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Usuario y contraseña son obligatorios" });
    }

    const usuarios = await leerUsuarios();

    // Evitar usuarios duplicados
    if (usuarios.some((u) => u.username === username)) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const nuevo = {
      id: Date.now(),
      username,
      password,
      role: role?.toLowerCase() || "lector",
    };

    usuarios.push(nuevo);
    await guardarUsuarios(usuarios);

    res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error creando usuario:", error);
    res.status(500).json({ error: "No se pudo crear el usuario" });
  }
}


// DELETE /api/usuarios/:id

export async function eliminarUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    const usuarios = await leerUsuarios();

    const existe = usuarios.find((u) => u.id === id);
    if (!existe) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // NO permitir eliminar al único admin
    const admins = usuarios.filter((u) => u.role === "admin");
    if (admins.length === 1 && existe.role === "admin") {
      return res
        .status(400)
        .json({ error: "No se puede eliminar el único usuario administrador" });
    }

    const listaActualizada = usuarios.filter((u) => u.id !== id);
    await guardarUsuarios(listaActualizada);

    res.json({ mensaje: "Usuario eliminado" });
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    res.status(500).json({ error: "No se pudo eliminar el usuario" });
  }
}
