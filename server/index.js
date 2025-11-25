

import express from "express";
import cors from "cors";
import morgan from "morgan";

import productosRouter from "./productos.routes.js";
import { login } from "./auth.controller.js";
import usuariosRouter from "./usuarios.routes.js";

const app = express();
const PORT = 3000;


// MIDDLEWARES

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


// RUTA BASE (SALUD / TEST)

app.get("/", (req, res) => {
  res.json({ mensaje: "API de Inventario funcionando" });
});


// RUTAS PRINCIPALES

app.use("/api/productos", productosRouter);
app.post("/api/login", login);
app.use("/api/usuarios", usuariosRouter);


// 404 - RUTA NO ENCONTRADA

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});


// MANEJO GLOBAL DE ERRORES

app.use((err, req, res, next) => {
  console.error("Error no manejado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});


// SERVER START

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
