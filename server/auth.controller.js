
// server/auth.controller.js
import jwt from "jsonwebtoken";

// Usuario mock (para el parcial, sin base de datos)
const USER_MOCK = {
  username: "admin",
  password: "1234" // en un caso real iría hasheada
};

// Clave secreta para firmar el token (en la vida real va en variables de entorno)
const JWT_SECRET = "clave-super-secreta-del-parcial";

// ------------------------------
// LOGIN: POST /api/login
// ------------------------------
export function login(req, res) {
  const { username, password } = req.body || {};

  // Validación básica
  if (!username || !password) {
    return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
  }

  // Validación contra usuario mock
  if (username !== USER_MOCK.username || password !== USER_MOCK.password) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  // Payload del token
  const payload = {
    username: USER_MOCK.username,
    role: "admin"
  };

  // Generar token JWT (expira en 1 hora)
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  res.json({
    mensaje: "Login exitoso",
    token,
    user: payload
  });
}

export { JWT_SECRET };
