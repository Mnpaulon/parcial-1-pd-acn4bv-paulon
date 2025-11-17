
// server/productos.routes.js
import { Router } from "express";
import {
  getProductos,
  getProductoPorId,
  crearProducto,
  actualizarProducto,
  actualizarParcialProducto,
  eliminarProducto,
} from "./productos.controller.js";

import { verificarToken } from "./auth.middleware.js";

const router = Router();

// Públicas (no requieren login)
router.get("/", getProductos);
router.get("/:id", getProductoPorId);

// Protegidas (requieren token válido)
router.post("/", verificarToken, crearProducto);
router.put("/:id", verificarToken, actualizarProducto);
router.patch("/:id", verificarToken, actualizarParcialProducto);
router.delete("/:id", verificarToken, eliminarProducto);

export default router;
