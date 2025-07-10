import express from 'express';
import {
  criarHospede,
  listarHospedes,
  buscarHospedePorId,
  atualizarHospede,
  deletarHospede,
} from '../controladores/hospedeControlador.js';
import { hospedeValidador } from '../utilitarios/validadores/hospedeValidador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';
import autorizaAdministrador from '../utilitarios/autenticacao/autorizaAdministrador.js';

const router = express.Router();
router.use(autenticador);

router.post('/', autorizaAdministrador, hospedeValidador, criarHospede);
router.get('/', autorizaAdministrador, listarHospedes);
router.get('/:id', autorizaAdministrador, buscarHospedePorId);
router.put('/:id', autorizaAdministrador, hospedeValidador, atualizarHospede);
router.delete('/:id', autorizaAdministrador, deletarHospede);

export default router;

