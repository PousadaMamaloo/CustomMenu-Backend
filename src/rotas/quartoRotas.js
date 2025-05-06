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

// Criar quarto
router.post('/criar', quartoValidador, criarQuarto);

// Listar todos os quartos
router.get('/listar', listarQuartos);

// Buscar por ID ou número (ex: /buscar?id=1 ou /buscar?num=101)
router.get('/buscar', buscarQuarto);

// Atualizar quarto
router.put('/:id', atualizarQuarto);

// Excluir quarto
router.delete('/:id', deletarQuarto);

export default router;
