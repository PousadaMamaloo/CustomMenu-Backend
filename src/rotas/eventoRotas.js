import express from 'express';
import {
  listarEventos,
  criarEvento,
  atualizarEvento,
  excluirEvento,
  vincularItensEvento,
  desvincularItemEvento,
  listarEventosHospede,
  listarEventoPorId,
  listarItensEventosHoje,
  relatorioGeralEvento,
  listarItensPorEvento,
  listarPedidosEventosAtivos
} from '../controladores/eventoControlador.js';
import { eventoValidador, eventoItemValidador, validarRequisicao } from '../utilitarios/validadores/eventoValidador.js';
import autorizaAdministrador from '../utilitarios/autenticacao/autorizaAdministrador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';

const router = express.Router();

router.use(autenticador);

router.get('/', listarEventos);
router.get('/ativos', autorizaAdministrador, listarPedidosEventosAtivos); 
router.post('/:id/itens', autorizaAdministrador, vincularItensEvento);
router.delete('/:id/itens/:id_item', autorizaAdministrador, desvincularItemEvento);
router.post('/', autorizaAdministrador, eventoValidador, criarEvento);
router.put('/:id', autorizaAdministrador, eventoValidador, atualizarEvento);
router.delete('/:id', autorizaAdministrador, excluirEvento);
router.get('/hoje', autorizaAdministrador, listarItensEventosHoje); 
router.get('/:id', autorizaAdministrador, listarEventoPorId);
router.get("/disponiveis", listarEventosHospede);
router.get('/:id/relatorio', autorizaAdministrador, relatorioGeralEvento);
router.get('/:id_evento/itens', listarItensPorEvento);

export default router;