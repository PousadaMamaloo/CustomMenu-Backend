import express from 'express';
import { associarItemEvento, listarAssociacoes } from '../controladores/eventoItemControlador.js';
import { validarRequisicao, eventoItemValidador } from '../utilitarios/validadores/eventoItemValidador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';

const router = express.Router();

router.use(autenticador);
router.post('/', eventoItemValidador, validarRequisicao, associarItemEvento);
router.get('/', listarAssociacoes);

export default router;
