import express from 'express';
import {
  listarEventos,
  criarEvento,
  atualizarEvento,
  excluirEvento,
  listarItensPorEvento,
  vincularItensEvento,
  desvincularItemEvento,
  listarEventosHospede,
  listarEventoPorId
} from '../controladores/eventoControlador.js';
import { eventoValidador } from '../utilitarios/validadores/eventoValidador.js';
import autorizaAdministrador from '../utilitarios/autenticacao/autorizaAdministrador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';

const router = express.Router();

router.use(autenticador);

router.get('/', listarEventos);
router.get('/:id/itens', autorizaAdministrador, listarItensPorEvento);
router.post('/:id/itens', autorizaAdministrador, vincularItensEvento);
router.delete('/:id/itens/:id_item', autorizaAdministrador, desvincularItemEvento);
router.post('/', autorizaAdministrador, eventoValidador, criarEvento);
router.put('/:id', autorizaAdministrador, eventoValidador, atualizarEvento);
router.delete('/:id', autorizaAdministrador, excluirEvento);

export default router;


router.get("/hospede", listarEventosHospede);



router.get("/:id", autorizaAdministrador, listarEventoPorId);

