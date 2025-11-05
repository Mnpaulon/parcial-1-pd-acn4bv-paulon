
// server/index.js
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

app.listen(PORT, () => {
   console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
