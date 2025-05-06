import { body } from 'express-validator';
import Hospede from '../../modelos/hospede.js';
import  Quarto  from '../../modelos/quarto.js';
export const quartoValidador = [
  // Validação para o número do quarto
  body('num_quarto')
    .isInt({ min: 1 }).withMessage('O número do quarto deve ser um número inteiro e maior que 0.')
    .custom(async (value) => {
      const quartoExistente = await Quarto.findOne({ where: { num_quarto: value } });
      if (quartoExistente) {
        throw new Error('O número do quarto deve ser único.');
      }
      return true;
    }),

  // Validação para a capacidade de adultos
  body('capa_adultos')
    .optional() // Campo opcional
    .isInt({ min: 0 }).withMessage('A capacidade de adultos deve ser um número inteiro e não negativo.'),

  // Validação para a capacidade de crianças
  body('capa_criancas')
    .optional() // Campo opcional
    .isInt({ min: 0 }).withMessage('A capacidade de crianças deve ser um número inteiro e não negativo.'),

  // Validação para o ID do hóspede responsável
  body('id_hospede_responsavel')
    .optional() // Campo opcional
    .isInt({ min: 1 }).withMessage('O ID do hóspede responsável deve ser um número inteiro válido.')
    .custom(async (value) => {
      const hospedeExistente = await Hospede.findOne({ where: { id_hospede: value } });
      if (!hospedeExistente) {
        throw new Error('O hóspede responsável não existe.');
      }
      return true;
    })
];
