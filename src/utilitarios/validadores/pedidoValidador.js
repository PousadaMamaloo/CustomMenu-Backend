import { body } from 'express-validator';
import Item from '../../modelos/item.js';
import Evento from '../../modelos/evento.js';
import Quarto from '../../modelos/quarto.js';

// Validador para CRIAÇÃO de pedido (POST)
export const pedidoValidadorCriar = [
  // ID do quarto
  body('id_quarto')
    .isInt({ min: 1 }).withMessage('Informe um id_quarto válido.')
    .custom(async (id_quarto) => {
      const quarto = await Quarto.findByPk(id_quarto);
      if (!quarto) throw new Error('Quarto não encontrado.');
      return true;
    }),

  // ID do evento
  body('id_evento')
    .isInt({ min: 1 }).withMessage('Informe um id_evento válido.')
    .custom(async (id_evento) => {
      const evento = await Evento.findByPk(id_evento);
      if (!evento || !evento.sts_evento) throw new Error('Evento inexistente ou inativo.');
      return true;
    }),

  // Array de itens
  body('itens')
    .isArray({ min: 1 }).withMessage('O pedido deve conter pelo menos um item.'),

  // Cada item: id_item e qntd_item
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
      // Captura o índice do item
      const index = Number(path.match(/\d+/)[0]);
      const id_item = req.body.itens[index]?.id_item;
      const item = await Item.findByPk(id_item);
      if (item && item.qntd_max_hospede && qntd_item > item.qntd_max_hospede) {
        throw new Error(`Quantidade para "${item.nome_item}" excede o limite de ${item.qntd_max_hospede}.`);
      }
      return true;
    })
];

// Validador para ATUALIZAÇÃO de pedido (PUT)
// Só valida os itens!
export const pedidoValidadorAtualizar = [
  // Array de itens
  body('itens')
    .isArray({ min: 1 }).withMessage('O pedido deve conter pelo menos um item.'),

  // Cada item: id_item e qntd_item
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
      // Captura o índice do item
      const index = Number(path.match(/\d+/)[0]);
      const id_item = req.body.itens[index]?.id_item;
      const item = await Item.findByPk(id_item);
      if (item && item.qntd_max_hospede && qntd_item > item.qntd_max_hospede) {
        throw new Error(`Quantidade para "${item.nome_item}" excede o limite de ${item.qntd_max_hospede}.`);
      }
      return true;
    })
];
