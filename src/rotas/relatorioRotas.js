import express from 'express';
import { gerarRelatorioPorEvento } from '../controladores/relatorioControlador.js';
import autenticador from '../utilitarios/autenticacao/autenticador.js';
import autorizaAdministrador from '../utilitarios/autenticacao/autorizaAdministrador.js';

const router = express.Router();

router.use(autenticador);
router.use(autorizaAdministrador);

router.get('/por-evento/:idEvento', gerarRelatorioPorEvento);

export default router;
