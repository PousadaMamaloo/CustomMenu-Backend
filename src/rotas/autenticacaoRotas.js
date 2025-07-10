import express from "express";
import { loginHospede, logout, validarToken } from "../controladores/autenticacaoControlador.js";
import autenticador from "../utilitarios/autenticacao/autenticador.js";
import autenticadorOpcional from "../utilitarios/autenticacao/autenticadorOpcional.js";

const router = express.Router();

router.post("/login", loginHospede);
router.post("/logout", autenticador, logout);
router.get("/validar-token", autenticadorOpcional, validarToken);

export default router;