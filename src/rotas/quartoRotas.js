import express from 'express';
import { criarQuarto, listarQuartos } from '../controladores/quartoControlador.js';
import { quartoValidador } from '../utilitarios/validadores/quartoValidador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';

const router = express.Router();

router.use(autenticador)

router.post('/quartos', quartoValidador, criarQuarto);
router.get('/quartos', listarQuartos);

export default router;
