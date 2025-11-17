
// server/auth.routes.js
import { Router } from "express";
import { login } from "./auth.controller.js";

const router = Router();

// POST /api/login
router.post("/login", login);

export default router;
