
// server/index.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import productosRouter from "./productos.routes.js";
import authRouter from "./auth.routes.js";


console.log("BOOT FILE:", import.meta.url);

const app = express();
const PORT = 3000;

// ------------------------------
// MIDDLEWARES
// ------------------------------
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ------------------------------
// RUTAS
// ------------------------------
app.use("/api", authRouter);
app.use("/api/productos", productosRouter);

// (opcional) loguear rutas registradas
const routes =
  app._router?.stack
    ?.filter((l) => l.route)
    ?.map((l) => `${Object.keys(l.route.methods).join(",").toUpperCase()} ${l.route.path}`) || [];

console.log("RUTAS REGISTRADAS:", routes);

// ------------------------------
// SERVIDOR
// ------------------------------
app.listen(PORT, () => {
  console.log(`✅ Servidor API corriendo en http://localhost:${PORT}`);
});
