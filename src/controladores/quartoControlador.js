import Quarto from '../modelos/quarto.js'; // Importa o modelo Quarto
import {respostaHelper} from '../utilitarios/helpers/respostaHelper.js'; // Importa o helper de resposta
import { validationResult } from 'express-validator'; 

// Função para criar um novo quarto
export const criarQuarto = async (req, res) => {
  const erros = validationResult(req);
  
  if (!erros.isEmpty()) {
    return res.status(400).json(respostaHelper({
      status: 400,
      errors: erros.array(),
      message: "Erro de validação"
    }));
  }

  try {
    const { num_quarto, capa_adultos, capa_criancas, id_hospede_responsavel } = req.body;

    // Cria o quarto no banco
    const novoQuarto = await Quarto.create({
      num_quarto,
      capa_adultos,
      capa_criancas,
      id_hospede_responsavel,
    });

    return res.status(201).json(respostaHelper({
      status: 201,
      data: novoQuarto,
      message: 'Quarto criado com sucesso!'
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao criar quarto.',
      errors: err.message
    }));
  }
};

// Função para listar todos os quartos
export const listarQuartos = async (req, res) => {
  try {
    const quartos = await Quarto.findAll();
    return res.status(200).json(respostaHelper({
      status: 200,
      data: quartos,
      message: 'Lista de quartos obtida com sucesso!'
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao listar quartos.',
      errors: err.message
    }));
  }
};
