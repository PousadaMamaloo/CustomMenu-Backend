import { body } from 'express-validator';

export const itemValidador = [
  body('nome_item')
    .notEmpty().withMessage('O nome do item é obrigatório.')
    .isLength({ max: 255 }).withMessage('O nome do item deve ter no máximo 255 caracteres.'),

  body('desc_item')
    .optional()
    .isLength({ max: 255 }).withMessage('A descrição do item deve ter no máximo 255 caracteres.'),

  body('foto_item')
    .isString().withMessage('A foto do item deve ser uma string em base64.')
    .notEmpty().withMessage('A foto do item é obrigatória.'),

  body('categ_item')
    .optional()
    .isString().withMessage('A categoria deve ser uma string.')
    .isLength({ min: 2, max: 255 }).withMessage('A categoria deve ter entre 2 e 255 caracteres.'),

  body('qntd_max_hospede')
    .optional()
    .isInt({ min: 0 }).withMessage('A quantidade máxima de hóspedes deve ser um número inteiro não negativo.'),

  body('valor_item')
    .notEmpty().withMessage('O valor do item é obrigatório.')
    .isFloat({ min: 0 }).withMessage('O valor do item deve ser um número não negativo.')
];
