import { Op } from 'sequelize';
import { respostaHelper } from '../utilitarios/helpers/respostaHelper.js';
import { validationResult } from 'express-validator';
import sharp from 'sharp';
import Item from '../modelos/item.js';
import EventoItem from '../modelos/eventoItem.js';
import ItemPedido from '../modelos/itemPedido.js';
import sequelize from '../config/database.js';

/**
 * @description Comprime e redimensiona uma imagem em formato base64 usando a biblioteca sharp.
 */

async function comprimirImagemBase64(foto_item) {
  if (foto_item && foto_item.startsWith('data:image/')) {
    const [header, base64Data] = foto_item.split(',');
    const buffer = Buffer.from(base64Data, 'base64');

    const outputBuffer = await sharp(buffer)
      .resize({ width: 500 })
      .jpeg({ quality: 80 })
      .toBuffer();

    return `${header.split(';')[0]};base64,${outputBuffer.toString('base64')}`;
  }
  return foto_item;
}

/**
 * @description Valida os dados e cria um novo item no banco, comprimindo a imagem antes de salvar.
 */

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
    let { nome_item, desc_item, foto_item, categ_item, qntd_max_hospede, valor_item } = req.body;

    foto_item = await comprimirImagemBase64(foto_item);

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

/**
 * @description Retorna a lista completa de todos os itens cadastrados no sistema.
 */

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

/**
 * @description Atualiza os dados de um item existente a partir do seu ID, com compressão de imagem se houver.
 */

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
    let dadosAtualizados = req.body;

    if (dadosAtualizados.foto_item) {
      dadosAtualizados.foto_item = await comprimirImagemBase64(dadosAtualizados.foto_item);
    }

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

/**
 * @description Exclui um item e suas associações (ItemPedido, EventoItem) de forma transacional.
 */

export async function excluirItem(req, res) {
  const id = req.params.id;
  const transacao = await sequelize.transaction();

  try {
    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ mensagem: 'Item não encontrado.' });
    }

    await ItemPedido.destroy({
      where: { id_item: id },
      transaction: transacao
    });

    await EventoItem.destroy({
      where: { id_item: id },
      transaction: transacao
    });

    await item.destroy({ transaction: transacao });
    await transacao.commit();

    res.status(200).json({ mensagem: 'Item excluído com sucesso!' });
    
  } catch (erro) {
    await transacao.rollback();
    console.error('Erro ao excluir item:', erro);
    res.status(500).json({
      mensagem: 'Erro interno ao excluir item.',
      errors: [erro.message || 'Erro desconhecido']
    });
  }
}

/**
 * @description Retorna uma lista com todas as categorias de itens únicas e não nulas.
 */

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

/**
 * @description Busca e retorna os dados de um item específico pelo seu ID.
 */

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
