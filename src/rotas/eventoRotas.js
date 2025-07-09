import express from 'express';
import {
  listarEventos,
  criarEvento,
  atualizarEvento,
  excluirEvento,
  listarItensPorEventoAdmin,
  vincularItensEvento,
  desvincularItemEvento,
  listarEventosHospede,
  listarEventoPorId,
  listarItensEventosHoje,
  gerarRelatorioPorEvento,
  listarItensPorEvento,
  associarItemEvento,
  listarAssociacoes
} from '../controladores/eventoControlador.js';
import { eventoValidador, eventoItemValidador, validarRequisicao } from '../utilitarios/validadores/eventoValidador.js';
import autorizaAdministrador from '../utilitarios/autenticacao/autorizaAdministrador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';

const router = express.Router();

router.use(autenticador);

router.get('/', listarEventos);
router.get('/:id/itens', autorizaAdministrador, listarItensPorEventoAdmin);
router.post('/:id/itens', autorizaAdministrador, vincularItensEvento);
router.delete('/:id/itens/:id_item', autorizaAdministrador, desvincularItemEvento);
router.post('/', autorizaAdministrador, eventoValidador, criarEvento);
router.put('/:id', autorizaAdministrador, eventoValidador, atualizarEvento);
router.delete('/:id', autorizaAdministrador, excluirEvento);
router.get('/hoje', autorizaAdministrador, listarItensEventosHoje); 
router.get('/:id', autorizaAdministrador, listarEventoPorId);
router.get("/disponiveis", listarEventosHospede);
router.get('/:id/relatorio', autorizaAdministrador, gerarRelatorioPorEvento);
router.get('/eventoItem/:id_evento', listarItensPorEvento);
router.post('/eventoItem', autorizaAdministrador, eventoItemValidador, validarRequisicao, associarItemEvento);
router.get('/eventoItem', autorizaAdministrador, listarAssociacoes);

export default router;