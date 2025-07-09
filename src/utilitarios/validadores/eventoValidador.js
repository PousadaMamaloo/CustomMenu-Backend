import { body } from 'express-validator';
import Item from '../../modelos/item.js';
import Evento from '../../modelos/evento.js';
import { validationResult } from 'express-validator';

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

export const validarRequisicao = (req, res, next) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({
      status: 400,
      message: 'Erro de validação.',
      errors: erros.array()
    });
  }
  next();
};

export const eventoItemValidador = [
  body('id_evento')
    .isInt({ min: 1 }).withMessage('ID do evento inválido')
    .bail()
    .custom(async (valor) => {
      const existe = await Evento.findByPk(valor);
      if (!existe) throw new Error('Evento não encontrado');
    }),

  body('id_item')
    .isInt({ min: 1 }).withMessage('ID do item inválido')
    .bail()
    .custom(async (valor) => {
      const existe = await Item.findByPk(valor);
      if (!existe) throw new Error('Item não encontrado');
    }),

  body('disp_item')
    .isBoolean().withMessage('Disponibilidade deve ser true ou false')
];