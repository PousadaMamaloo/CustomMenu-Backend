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

router.post('/', autorizaAdministrador, quartoValidador, criarQuarto);
router.put('/:num', autorizaAdministrador, atualizarQuarto);
router.delete('/:num', autorizaAdministrador, deletarQuarto);
router.get('/', autorizaAdministrador, listarQuartos);
router.get('/:num', autorizaAdministrador, buscarQuarto);

export default router;

