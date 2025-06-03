import express from 'express';
import {
  listarEventos,
  criarEvento,
  atualizarEvento,
  excluirEvento,
  listarItensPorEvento // Importar a nova função do controlador
} from '../controladores/eventoControlador.js';
import { eventoValidador } from '../utilitarios/validadores/eventoValidador.js';
import autorizaAdministrador from '../utilitarios/autenticacao/autorizaAdministrador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';

const router = express.Router();

// Aplicar autenticação para todas as rotas de evento
router.use(autenticador);

// Rota para listar todos os eventos
router.get('/', listarEventos);

// Rota para listar itens de um evento específico (requer autorização de administrador)
// A rota deve ser /:id/itens conforme solicitado
router.get('/:id/itens', autorizaAdministrador, listarItensPorEvento);

// Rota para criar um novo evento (requer autorização de administrador)
router.post('/', autorizaAdministrador, eventoValidador, criarEvento);

// Rota para atualizar um evento existente (requer autorização de administrador)
router.put('/:id', autorizaAdministrador, eventoValidador, atualizarEvento);

// Rota para excluir um evento existente (requer autorização de administrador)
router.delete('/:id', autorizaAdministrador, excluirEvento);

export default router;

