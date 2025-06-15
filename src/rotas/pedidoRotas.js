import express from 'express';
import {
  criarPedido,
  obterPedido,
  atualizarPedido,
  deletarPedido,
  listarPedidosPorQuarto
} from '../controladores/pedidoControlador.js';
import { pedidoValidadorCriar, pedidoValidadorAtualizar } from '../utilitarios/validadores/pedidoValidador.js';
import autorizaAdministrador from '../utilitarios/autenticacao/autorizaAdministrador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';

const router = express.Router();

router.use(autenticador);

router.post('/', pedidoValidadorCriar, criarPedido);

router.get('/:idPedido', obterPedido); // 

router.put('/:idPedido', pedidoValidadorAtualizar, atualizarPedido);

router.delete('/:idPedido', autorizaAdministrador, deletarPedido);

router.get('/quarto/:numQuarto', listarPedidosPorQuarto);

export default router;
