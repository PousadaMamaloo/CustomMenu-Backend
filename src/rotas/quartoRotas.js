import express from 'express';
import {
  criarQuarto,
  listarQuartos,
  buscarQuarto,
  atualizarQuarto,
  deletarQuarto
} from '../controladores/quartoControlador.js';

import { quartoValidador } from '../utilitarios/validadores/quartoValidador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';

const router = express.Router();

router.use(autenticador);

router.post('/criar', quartoValidador, criarQuarto);

router.get('/listar', listarQuartos);

router.get('/buscar', buscarQuarto);

router.put('/:id', atualizarQuarto);

router.delete('/:id', deletarQuarto);

export default router;
