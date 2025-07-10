import express from 'express';
import {
  criarPedido,
  obterPedido,
  atualizarPedido,
  deletarPedido,
  listarPedidosPorQuarto,
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
router.get('/:id/:num/:data', obterPedidoEventoQuartoData); 
router.get('/:id', obterPedido);  
router.get('/quarto/:num', listarPedidosPorQuarto); 
router.put('/:id', pedidoValidadorAtualizar, atualizarPedido); 
router.delete('/:id', deletarPedido); 
router.post('/', pedidoValidadorCriar, criarPedido); 

export default router;


