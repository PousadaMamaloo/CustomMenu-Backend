import { body } from 'express-validator';
import Hospede from '../../modelos/hospede.js';

export const hospedeValidador = [
  body('nome_hospede')
    .notEmpty().withMessage('O nome do hóspede é obrigatório.')
    .isLength({ min: 3 }).withMessage('O nome do hóspede deve ter no mínimo 3 caracteres.'),

  body('telef_hospede')
    .notEmpty().withMessage('O telefone do hóspede é obrigatório.')
    .isMobilePhone('pt-BR').withMessage('O telefone informado não é válido.')
    .custom(async (value, { req }) => {
      const id = req.params.id;
      const existente = await Hospede.findOne({ where: { telef_hospede: value } });

      if (existente && (!id || existente.id_hospede != id)) {
        throw new Error('Já existe um hóspede com este telefone.');
      }

      return true;
    }),

  body('email_hospede')
    .optional()
    .isEmail().withMessage('O e-mail informado não é válido.'),

  body('data_chegada')
    .optional()
    .isISO8601().withMessage('A data de chegada deve estar no formato YYYY-MM-DD.'),

  body('data_saida')
    .optional()
    .isISO8601().withMessage('A data de saída deve estar no formato YYYY-MM-DD.')
];
