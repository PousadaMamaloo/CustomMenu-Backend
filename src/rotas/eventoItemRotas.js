import express from 'express';
import { 
  associarItemEvento, 
  listarAssociacoes,
  listarItensPorEvento
} from '../controladores/eventoItemControlador.js';
import { validarRequisicao, eventoItemValidador } from '../utilitarios/validadores/eventoItemValidador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';
import autorizaAdministrador from '../utilitarios/autenticacao/autorizaAdministrador.js';

const router = express.Router();

router.use(autenticador);

router.get('/:id', listarItensPorEvento);
router.post('/', autorizaAdministrador, eventoItemValidador, validarRequisicao, associarItemEvento);
router.get('/', autorizaAdministrador, listarAssociacoes);

export default router;
