import Item from '../modelos/item.js';
import { Op } from 'sequelize';
import { respostaHelper } from '../utilitarios/helpers/respostaHelper.js';
import { validationResult } from 'express-validator';

export const criarItem = async (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json(respostaHelper({
      status: 400,
      errors: erros.array(),
      message: "Erro de validação"
    }));
  }

  try {
    const { nome_item, desc_item, foto_item, categ_item, qntd_max_hospede, valor_item } = req.body;

    const novoItem = await Item.create({
      nome_item,
      desc_item,
      foto_item,
      categ_item,
      qntd_max_hospede,
      valor_item
    });

    return res.status(201).json(respostaHelper({
      status: 201,
      data: novoItem,
      message: 'Item criado com sucesso!'
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao criar item.',
      errors: err.message
    }));
  }
};

export const listarItens = async (req, res) => {
  try {
    const itens = await Item.findAll();

    return res.status(200).json(respostaHelper({
      status: 200,
      data: itens,
      message: 'Itens listados com sucesso!'
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao listar itens.',
      errors: err.message
    }));
  }
};

export const atualizarItem = async (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json(respostaHelper({
      status: 400,
      errors: erros.array(),
      message: "Erro de validação"
    }));
  }

  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;

    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Item não encontrado.'
      }));
    }

    await item.update(dadosAtualizados);

    return res.status(200).json(respostaHelper({
      status: 200,
      data: item,
      message: 'Item atualizado com sucesso!'
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao atualizar item.',
      errors: err.message
    }));
  }
};

export const excluirItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Item não encontrado.'
      }));
    }

    await item.destroy();

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Item excluído com sucesso!'
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao excluir item.',
      errors: err.message
    }));
  }
};

export const listarCategoriasUnicas = async (req, res) => {
  try {
    const categorias = await Item.findAll({
      attributes: [[Item.sequelize.fn('DISTINCT', Item.sequelize.col('categ_item')), 'categ_item']],
      where: {
        categ_item: { [Op.not]: null }
      },
      raw: true
    });

    return res.status(200).json(respostaHelper({
      status: 200,
      data: categorias.map(c => c.categ_item),
      message: 'Categorias únicas obtidas com sucesso!'
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao listar categorias.',
      errors: err.message
    }));
  }
};

export const buscarItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: `Item com ID ${id} não encontrado.`,
      }));
    }

    return res.status(200).json(respostaHelper({
      status: 200,
      data: item,
      message: 'Item encontrado com sucesso!'
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao buscar item.',
      errors: err.message
    }));
  }
};
