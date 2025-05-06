// src/rotas/administradorRotas.js
import express from 'express';
import { loginAdministrador } from '../controladores/administradorControlador.js';

const router = express.Router();

// Rota pública para login
router.post('/login', loginAdministrador);

export default router;
