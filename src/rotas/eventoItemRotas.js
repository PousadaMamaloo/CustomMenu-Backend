import express from 'express';
import { 
  associarItemEvento, 
  listarAssociacoes,
  listarItensPorEvento // 1. Importa a nova função
} from '../controladores/eventoItemControlador.js';
import { validarRequisicao, eventoItemValidador } from '../utilitarios/validadores/eventoItemValidador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';
import autorizaAdministrador from '../utilitarios/autenticacao/autorizaAdministrador.js';

const router = express.Router();

router.use(autenticador);

router.get('/:id_evento', listarItensPorEvento);


router.post('/', autorizaAdministrador, eventoItemValidador, validarRequisicao, associarItemEvento);

router.get('/', autorizaAdministrador, listarAssociacoes);

export default router;
