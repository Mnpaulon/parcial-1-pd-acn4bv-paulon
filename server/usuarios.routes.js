
// server/usuarios.routes.js
import { Router } from "express";
import {
  getUsuarios,
  crearUsuario,
  eliminarUsuario,
} from "./usuarios.controller.js";

const router = Router();

// GET /api/usuarios
router.get("/", getUsuarios);

// POST /api/usuarios
router.post("/", crearUsuario);

// DELETE /api/usuarios/:id
router.delete("/:id", eliminarUsuario);

export default router;
