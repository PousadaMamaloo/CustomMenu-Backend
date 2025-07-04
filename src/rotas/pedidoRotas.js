import express from 'express';
import {
  criarPedido,
  obterPedido,
  atualizarPedido,
  deletarPedido,
  listarPedidosPorQuarto,
  listarPedidosEventosAtivos,
  relatorioGeralEvento,
  historicoComPaginacao,
  listarPedidosHoje,
  obterPedidoEventoQuartoData
} from '../controladores/pedidoControlador.js';
import { pedidoValidadorCriar, pedidoValidadorAtualizar } from '../utilitarios/validadores/pedidoValidador.js';
import autorizaAdministrador from '../utilitarios/autenticacao/autorizaAdministrador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';

const router = express.Router();

router.use(autenticador);

router.get('/historico', autorizaAdministrador, historicoComPaginacao);
router.get('/hoje', autorizaAdministrador, listarPedidosHoje);
router.get('/eventos/ativos', autorizaAdministrador, listarPedidosEventosAtivos);
router.get('/relatorio/:idEvento', autorizaAdministrador, relatorioGeralEvento);
router.get('/quarto/:numQuarto', listarPedidosPorQuarto);
router.get('/:idPedido', obterPedido);
router.get('/evento/:id_evento/quarto/:num_quarto/data/:data_pedido', obterPedidoEventoQuartoData);
router.put('/:idPedido', pedidoValidadorAtualizar, atualizarPedido);
router.delete('/:idPedido', deletarPedido);
router.post('/', pedidoValidadorCriar, criarPedido);

export default router;


