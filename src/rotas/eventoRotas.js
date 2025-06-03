import express from 'express';
import {
  listarEventos,
  criarEvento,
  atualizarEvento,
  excluirEvento,
  listarItensPorEvento 
} from '../controladores/eventoControlador.js';
import { eventoValidador } from '../utilitarios/validadores/eventoValidador.js';
import autorizaAdministrador from '../utilitarios/autenticacao/autorizaAdministrador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';

const router = express.Router();

router.use(autenticador);

router.get('/', listarEventos);

router.get('/:id/itens', autorizaAdministrador, listarItensPorEvento);

router.post('/', autorizaAdministrador, eventoValidador, criarEvento);

router.put('/:id', autorizaAdministrador, eventoValidador, atualizarEvento);

router.delete('/:id', autorizaAdministrador, excluirEvento);

export default router;

