import express from 'express';
import { criarItem, listarItens, atualizarItem, excluirItem, listarCategoriasUnicas } from '../controladores/itemControlador.js';
import { itemValidador } from '../utilitarios/validadores/itemValidador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';

const router = express.Router();

router.use(autenticador);

router.post('/criar', itemValidador, criarItem);
router.get('/listar', listarItens);
router.put('/atualizar/:id', itemValidador, atualizarItem);
router.delete('/excluir/:id', excluirItem);
router.get('/categorias', listarCategoriasUnicas);

export default router;
