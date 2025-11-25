
import { Router } from "express";
import {
  getUsuarios,
  crearUsuario,
  eliminarUsuario,
} from "./usuarios.controller.js";

import { verificarToken, soloAdmin } from "./auth.middleware.js";

const router = Router();

// Todas las rutas de usuarios SOLO las puede usar un admin

// GET /api/usuarios  → listar usuarios
router.get("/", verificarToken, soloAdmin, getUsuarios);

// POST /api/usuarios → crear usuario
router.post("/", verificarToken, soloAdmin, crearUsuario);

// DELETE /api/usuarios/:id → eliminar usuario
router.delete("/:id", verificarToken, soloAdmin, eliminarUsuario);

export default router;
