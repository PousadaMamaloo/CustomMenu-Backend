import express from 'express';
import { criarQuarto, listarQuartos } from '../controladores/quartoControlador.js';

const router = express.Router();

router.post('/quartos', criarQuarto);
router.get('/quartos', listarQuartos);

export default router;
