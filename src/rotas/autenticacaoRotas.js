import express from "express";
import { loginHospede, logout, validarToken } from "../controladores/autenticacaoControlador.js";
import autenticador from "../utilitarios/autenticacao/autenticador.js";

const router = express.Router();

// Rota de login (não requer autenticação)
router.post("/login", loginHospede);

// Rota de logout (requer autenticação)
router.post("/logout", autenticador, logout);

// Rota para validar token (requer autenticação)
router.get("/validar-token", autenticador, validarToken);

export default router;


