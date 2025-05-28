import { body } from 'express-validator';
import Evento from '../../modelos/evento.js';

export const eventoValidador = [
  body('nome_evento')
    .notEmpty().withMessage('O nome do evento é obrigatório.'),
  body('horarios')
    .isArray({ min: 1 }).withMessage('Pelo menos um horário é obrigatório.')
    .custom((horarios) => {
      for (const h of horarios) {
        if (!/^\d{2}:\d{2}$/.test(h)) {
          throw new Error('Horário deve estar no formato HH:MM.');
        }
      }
      return true;
    })
];