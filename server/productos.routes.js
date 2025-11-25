

import { Router } from "express";
import {
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "./productos.controller.js";

import { verificarToken } from "./auth.middleware.js";

const router = Router();

// Todas las rutas de productos requieren login
router.get("/", verificarToken, getProductos);
router.post("/", verificarToken, crearProducto);
router.put("/:id", verificarToken, actualizarProducto);
router.delete("/:id", verificarToken, eliminarProducto);

export default router;
