import express from 'express';
import { criarItem, listarItens, atualizarItem, excluirItem, listarCategoriasUnicas, buscarItem } from '../controladores/itemControlador.js';
import { itemValidador } from '../utilitarios/validadores/itemValidador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';
import autorizaAdministrador from '../utilitarios/autenticacao/autorizaAdministrador.js';

const router = express.Router();

router.use(autenticador);

router.post('/', autorizaAdministrador, itemValidador, criarItem);
router.put('/:id', autorizaAdministrador, itemValidador, atualizarItem);
router.delete('/:id', autorizaAdministrador, excluirItem);
router.get('/', listarItens);
router.get('/:id', buscarItem)
router.get('/categorias', listarCategoriasUnicas);

export default router;

