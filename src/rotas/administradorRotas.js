import express from 'express';
import { loginAdministrador } from '../controladores/administradorControlador.js';

const router = express.Router();

router.post('/login', loginAdministrador);

export default router;
