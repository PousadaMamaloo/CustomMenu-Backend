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
import autorizaAdministrador from '../utilitarios/autenticacao/autorizaAdministrador.js';

const router = express.Router();

router.use(autenticador);

router.post('/criar', autorizaAdministrador, quartoValidador, criarQuarto);
router.put('/:num', autorizaAdministrador, atualizarQuarto);
router.delete('/:num', autorizaAdministrador, deletarQuarto);

router.get('/listar', listarQuartos);
router.get('/buscar/:num', buscarQuarto);

export default router;

