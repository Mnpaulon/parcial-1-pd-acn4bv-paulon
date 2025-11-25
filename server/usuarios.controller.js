
// server/usuarios.controller.js
import fs from "fs/promises";

// Archivo donde guardamos los usuarios
const USERS_FILE = new URL("./usuarios.json", import.meta.url);

async function leerUsuarios() {
  const data = await fs.readFile(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

async function guardarUsuarios(lista) {
  await fs.writeFile(USERS_FILE, JSON.stringify(lista, null, 2));
}

// GET /api/usuarios
export async function getUsuarios(req, res) {
  try {
    const usuarios = await leerUsuarios();
    // No mandamos la contraseña al front
    const sinPassword = usuarios.map(({ password, ...resto }) => resto);
    res.json(sinPassword);
  } catch (err) {
    console.error("Error al leer usuarios:", err);
    res
      .status(500)
      .json({ error: "No se pudieron obtener los usuarios" });
  }
}

// POST /api/usuarios
export async function crearUsuario(req, res) {
  const { username, password, role } = req.body || {};

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Usuario y contraseña son obligatorios" });
  }

  try {
    const usuarios = await leerUsuarios();

    // Evitar duplicados por username
    if (usuarios.some((u) => u.username === username)) {
      return res
        .status(400)
        .json({ error: "Ya existe un usuario con ese nombre" });
    }

    const nuevo = {
      id: usuarios.length
        ? Math.max(...usuarios.map((u) => u.id)) + 1
        : 1,
      username,
      password,
      role: role || "editor",
    };

    usuarios.push(nuevo);
    await guardarUsuarios(usuarios);

    const { password: _, ...sinPassword } = nuevo;
    res.status(201).json(sinPassword);
  } catch (err) {
    console.error("Error al crear usuario:", err);
    res.status(500).json({ error: "No se pudo crear el usuario" });
  }
}

// DELETE /api/usuarios/:id
export async function eliminarUsuario(req, res) {
  const id = Number(req.params.id);

  try {
    const usuarios = await leerUsuarios();
    const existe = usuarios.some((u) => u.id === id);

    if (!existe) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const filtrados = usuarios.filter((u) => u.id !== id);
    await guardarUsuarios(filtrados);

    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ error: "No se pudo eliminar el usuario" });
  }
}
