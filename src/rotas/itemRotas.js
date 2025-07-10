import express from 'express';
import { criarItem, listarItens, atualizarItem, excluirItem, listarCategoriasUnicas, buscarItem } from '../controladores/itemControlador.js';
import { itemValidador } from '../utilitarios/validadores/itemValidador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';
import autorizaAdministrador from '../utilitarios/autenticacao/autorizaAdministrador.js';

const router = express.Router();

router.use(autenticador);

<<<<<<< Updated upstream
router.post('/criar', autorizaAdministrador, itemValidador, criarItem);
router.put('/atualizar/:id', autorizaAdministrador, itemValidador, atualizarItem);
router.delete('/excluir/:id', autorizaAdministrador, excluirItem);
router.get('/listar/:id', buscarItem)
router.get('/listar', listarItens);
router.get('/categorias', listarCategoriasUnicas);
=======
router.post('/', autorizaAdministrador, itemValidador, criarItem);
router.get('/categorias', listarCategoriasUnicas);
router.put('/:id', autorizaAdministrador, itemValidador, atualizarItem);
router.delete('/:id', autorizaAdministrador, excluirItem);
router.get('/', listarItens);
router.get('/:id', buscarItem)
>>>>>>> Stashed changes

export default router;

