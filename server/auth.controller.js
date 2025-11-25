
// server/auth.controller.js
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Resolución de ruta al archivo usuarios.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "usuarios.json");

// Clave secreta para firmar el token (en la vida real va en variables de entorno)
const JWT_SECRET = "clave-super-secreta-del-parcial";

// Helper para leer usuarios
async function leerUsuarios() {
  const data = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

// ------------------------------
// LOGIN: POST /api/login
// ------------------------------
export async function login(req, res) {
  try {
    const { username, password } = req.body || {};

    // Validación básica
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Usuario y contraseña son obligatorios" });
    }

    const usuarios = await leerUsuarios();

    // Buscamos usuario por username y password (texto plano para el parcial)
    const usuario = usuarios.find(
      (u) => u.username === username && u.password === password
    );

    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Payload del token (NO incluimos password)
    const payload = {
      id: usuario.id,
      username: usuario.username,
      role: usuario.role || "admin",
    };

    // Generar token JWT (expira en 1 hora)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      mensaje: "Login exitoso",
      token,
      user: payload,
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error interno en login" });
  }
}

export { JWT_SECRET };
