import express from 'express';
import { criarItem, listarItens, atualizarItem, excluirItem, listarCategoriasUnicas } from '../controladores/itemControlador.js';
import { itemValidador } from '../utilitarios/validadores/itemValidador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';
import autorizaAdministrador from '../utilitarios/autenticacao/autorizaAdministrador.js';

const router = express.Router();

router.use(autenticador);

router.post('/criar', autorizaAdministrador, itemValidador, criarItem);
router.put('/atualizar/:id', autorizaAdministrador, itemValidador, atualizarItem);
router.delete('/excluir/:id', autorizaAdministrador, excluirItem);

router.get('/listar', listarItens);
router.get('/categorias', listarCategoriasUnicas);

export default router;

