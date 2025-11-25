
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./auth.controller.js";

// Middleware genérico para verificar el token JWT
export function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization || "";

  // Esperamos algo tipo: "Bearer token"
  const [scheme, token] = authHeader.split(" ");

  if (!token || scheme !== "Bearer") {
    return res
      .status(401)
      .json({ error: "Token no enviado o formato inválido" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // Guardamos los datos del usuario en la request
    // Ej: { id, username, role }
    req.user = payload;
    next();
  } catch (err) {
    console.error("Error al verificar token:", err);
    return res
      .status(401)
      .json({ error: "Token inválido o expirado" });
  }
}

// Middleware para rutas solo de admin
export function soloAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Acceso restringido a usuarios administradores" });
  }
  next();
}


