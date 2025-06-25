import express from "express";
import { loginHospede, logout, validarToken } from "../controladores/autenticacaoControlador.js";
import autenticador from "../utilitarios/autenticacao/autenticador.js";

const router = express.Router();


router.post("/login", loginHospede);
router.post("/logout", autenticador, logout);
router.get("/validar_token", autenticador, validarToken);

export default router;


