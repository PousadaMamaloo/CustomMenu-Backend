import express from 'express';
import {
  criarHospede,
  listarHospedes,
  buscarHospedePorId,
  atualizarHospede,
  deletarHospede,
  loginHospede
} from '../controladores/hospedeControlador.js';

import { hospedeValidador } from '../utilitarios/validadores/hospedeValidador.js'; // se já tiver criado
import autenticador from '../utilitarios/autenticacao/autenticador.js';

const router = express.Router();

// 🔓 Rota pública
router.post('/login', loginHospede);

// 🔐 Rotas protegidas
router.use(autenticador);

router.post('/cadastrar', hospedeValidador, criarHospede);
router.get('/listar', listarHospedes);
router.get('/:id', buscarHospedePorId);
router.put('/:id', hospedeValidador, atualizarHospede);
router.delete('/:id', deletarHospede);

export default router;