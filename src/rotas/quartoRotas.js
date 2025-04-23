import express from 'express';
import { criarQuarto, listarQuartos } from '../controladores/quartoControlador.js';
import { quartoValidador } from '../utiles/validadores/quartoValidador.js';
const router = express.Router();

router.post('/quartos', quartoValidador, criarQuarto);
router.get('/quartos', listarQuartos);

export default router;
