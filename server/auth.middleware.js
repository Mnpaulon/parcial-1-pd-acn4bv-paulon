
// server/auth.middleware.js
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./auth.controller.js";

// Middleware para verificar token
export function verificarToken(req, res, next) {
  const header = req.headers.authorization;

  // Si no mandan header Authorization → error
  if (!header) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  // Formato esperado: "Bearer asdasd.asdasd.asdasd"
  const [tipo, token] = header.split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(400).json({ error: "Formato de token inválido" });
  }

  try {
    // Decodificamos y verificamos token
    const payload = jwt.verify(token, JWT_SECRET);

    // Guardamos los datos del usuario dentro de req
    req.user = payload;

    // Continua a la ruta original
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
