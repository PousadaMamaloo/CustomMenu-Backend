import { body } from 'express-validator';
import Item from '../../modelos/item.js';
import Evento from '../../modelos/evento.js';
import Quarto from '../../modelos/quarto.js';
import Horario from '../../modelos/horario.js';

export const pedidoValidadorCriar = [
  body('id_quarto')
    .isInt({ min: 1 }).withMessage('Informe um id_quarto válido.')
    .custom(async (id_quarto) => {
      const quarto = await Quarto.findByPk(id_quarto);
      if (!quarto) throw new Error('Quarto não encontrado.');
      return true;
    }),

  body('id_evento')
    .isInt({ min: 1 }).withMessage('Informe um id_evento válido.')
    .custom(async (id_evento) => {
      const evento = await Evento.findByPk(id_evento);
      if (!evento || !evento.sts_evento) throw new Error('Evento inexistente ou inativo.');
      return true;
    }),
  
  body('id_horario')
  .isInt({ min: 1 }).withMessage('Informe um id_horario válido.')
  .custom(async (id_horario) => {
    const horario = await Horario.findByPk(id_horario);
    if (!horario) throw new Error('Horário não encontrado.');
    return true;
  }),

  body('itens')
    .isArray({ min: 1 }).withMessage('O pedido deve conter pelo menos um item.'),

  body('itens.*.id_item')
    .isInt({ min: 1 }).withMessage('id_item de cada item deve ser um inteiro válido.')
    .custom(async (id_item) => {
      const item = await Item.findByPk(id_item);
      if (!item) throw new Error(`Item não encontrado: id_item=${id_item}`);
      return true;
    }),

  body('itens.*.qntd_item')
    .isInt({ min: 1 }).withMessage('A quantidade deve ser um inteiro positivo.')
    .custom(async (qntd_item, { req, path }) => {
      const index = Number(path.match(/\d+/)[0]);
      const id_item = req.body.itens[index]?.id_item;
      const item = await Item.findByPk(id_item);
      return true;
    }),

  body('obs_pedido')
    .optional()
    .isString().withMessage('A observação deve ser uma string.')
    .isLength({ max: 300 }).withMessage('A observação deve ter no máximo 300 caracteres.')
];

export const pedidoValidadorAtualizar = [
  body('itens')
    .isArray({ min: 1 }).withMessage('O pedido deve conter pelo menos um item.'),

  body('itens.*.id_item')
    .isInt({ min: 1 }).withMessage('id_item de cada item deve ser um inteiro válido.')
    .custom(async (id_item) => {
      const item = await Item.findByPk(id_item);
      if (!item) throw new Error(`Item não encontrado: id_item=${id_item}`);
      return true;
    }),

  body('id_horario')
  .isInt({ min: 1 }).withMessage('Informe um id_horario válido.')
  .custom(async (id_horario) => {
    const horario = await Horario.findByPk(id_horario);
    if (!horario) throw new Error('Horário não encontrado.');
    return true;
  }),

  body('itens.*.qntd_item')
    .isInt({ min: 1 }).withMessage('A quantidade deve ser um inteiro positivo.')
    .custom(async (qntd_item, { req, path }) => {
      const index = Number(path.match(/\d+/)[0]);
      const id_item = req.body.itens[index]?.id_item;
      const item = await Item.findByPk(id_item);
      return true;
    }),

  body('obs_pedido')
    .optional()
    .isString().withMessage('A observação deve ser uma string.')
    .isLength({ max: 300 }).withMessage('A observação deve ter no máximo 300 caracteres.')
];
