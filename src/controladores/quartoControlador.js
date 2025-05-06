import Quarto from '../modelos/quarto.js';
import { respostaHelper } from '../utilitarios/helpers/respostaHelper.js';
import { validationResult } from 'express-validator';

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
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao criar quarto.',
      errors: err.message
    }));
  }
};

export const listarQuartos = async (req, res) => {
  try {
    const quartos = await Quarto.findAll();
    return res.status(200).json(respostaHelper({
      status: 200,
      data: quartos,
      message: 'Lista de quartos obtida com sucesso!'
    }));
  } catch (err) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao listar quartos.',
      errors: err.message
    }));
  }
};

export const buscarQuarto = async (req, res) => {
  try {
    const { id, num } = req.query;

    let quarto;
    if (id) {
      quarto = await Quarto.findByPk(id);
    } else if (num) {
      quarto = await Quarto.findOne({ where: { num_quarto: num } });
    } else {
      return res.status(400).json(respostaHelper({
        status: 400,
        message: 'Informe o ID ou o número do quarto para a busca.'
      }));
    }

    if (!quarto) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Quarto não encontrado.'
      }));
    }

    return res.status(200).json(respostaHelper({
      status: 200,
      data: quarto,
      message: 'Quarto encontrado com sucesso!'
    }));
  } catch (err) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao buscar quarto.',
      errors: err.message
    }));
  }
};

export const atualizarQuarto = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    const [linhasAfetadas] = await Quarto.update(dados, {
      where: { id_quarto: id }
    });

    if (linhasAfetadas === 0) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Quarto não encontrado para atualizar.'
      }));
    }

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Quarto atualizado com sucesso!'
    }));
  } catch (err) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao atualizar quarto.',
      errors: err.message
    }));
  }
};

export const deletarQuarto = async (req, res) => {
  try {
    const { id } = req.params;

    const linhasRemovidas = await Quarto.destroy({
      where: { id_quarto: id }
    });

    if (linhasRemovidas === 0) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Quarto não encontrado para exclusão.'
      }));
    }

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Quarto excluído com sucesso!'
    }));
  } catch (err) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao excluir quarto.',
      errors: err.message
    }));
  }
};
