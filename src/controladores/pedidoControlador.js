import Pedido from '../modelos/pedido.js';
import Item from '../modelos/item.js';
import itemPedido from '../modelos/itemPedido.js';
import Evento from '../modelos/evento.js';
import Quarto from '../modelos/quarto.js';
import { respostaHelper } from '../utilitarios/helpers/respostaHelper.js';
import { validationResult } from 'express-validator';

// POST /api/pedidos
export const criarPedido = async (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json(respostaHelper({
      status: 400,
      message: 'Erro de validação.',
      errors: erros.array()
    }));
  }
  const { id_quarto, id_evento, itens } = req.body;
  try {
    const agora = new Date();
    const novoPedido = await Pedido.create({ id_quarto, id_evento, data_pedido: agora });

    // Relaciona itens ao pedido
    for (const it of itens) {
      await itemPedido.create({
        id_pedido: novoPedido.id_pedido,
        id_item: it.id_item,
        qntd_item: it.qntd_item
      });
    }

    return res.status(201).json(respostaHelper({
      status: 201,
      message: 'Pedido criado com sucesso.',
      data: { id_pedido: novoPedido.id_pedido }
    }));
  } catch (err) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao criar pedido.',
      errors: [err.message]
    }));
  }
};

// GET /api/pedidos/:idPedido
export const obterPedido = async (req, res) => {
  try {
    const { idPedido } = req.params;
    const pedido = await Pedido.findByPk(idPedido, {
      include: [
        {
          model: Item,
          through: { attributes: ['qntd_item'] }
        },
        {
          model: Evento
        }
      ]
    });

    if (!pedido) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Pedido não encontrado.'
      }));
    }

    // Estrutura resposta detalhada
    const itens = pedido.Items.map(it => ({
      id_item: it.id_item,
      nome: it.nome_item,
      quantidade: it.itemPedido.qntd_item,
      valor_unitario: it.valor_item,
      valor_total: it.valor_item * it.itemPedido.qntd_item
    }));

    return res.status(200).json(respostaHelper({
      status: 200,
      data: {
        id_pedido: pedido.id_pedido,
        evento: pedido.Evento ? pedido.Evento.nome_evento : null,
        data_pedido: pedido.data_pedido,
        itens
      },
      message: 'Pedido encontrado com sucesso.'
    }));
  } catch (err) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao buscar pedido.',
      errors: [err.message]
    }));
  }
};

// PUT /api/pedidos/:idPedido
export const atualizarPedido = async (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json(respostaHelper({
      status: 400,
      message: 'Erro de validação.',
      errors: erros.array()
    }));
  }
  const { idPedido } = req.params;
  const { itens } = req.body;
  try {
    const pedido = await Pedido.findByPk(idPedido);
    if (!pedido) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Pedido não encontrado.'
      }));
    }

    // (Valide se pode editar conforme regras de prazo/finalização)

    // Remove todos os itens antigos e adiciona os novos
    await itemPedido.destroy({ where: { id_pedido: idPedido } });
    for (const it of itens) {
      await itemPedido.create({
        id_pedido: idPedido,
        id_item: it.id_item,
        qntd_item: it.qntd_item
      });
    }

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Pedido atualizado com sucesso.'
    }));
  } catch (err) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao atualizar pedido.',
      errors: [err.message]
    }));
  }
};

// DELETE /api/pedidos/:idPedido
export const deletarPedido = async (req, res) => {
  const { idPedido } = req.params;
  try {
    const pedido = await Pedido.findByPk(idPedido);
    if (!pedido) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Pedido não encontrado.'
      }));
    }
    await itemPedido.destroy({ where: { id_pedido: idPedido } });
    await pedido.destroy();
    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Pedido excluído com sucesso.'
    }));
  } catch (err) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao excluir pedido.',
      errors: [err.message]
    }));
  }
};

// GET /api/pedidos/quarto/:numQuarto
export const listarPedidosPorQuarto = async (req, res) => {
  const { numQuarto } = req.params;
  try {
    // Busca o quarto pelo número
    const quarto = await Quarto.findOne({ where: { num_quarto: numQuarto } });
    if (!quarto) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Quarto não encontrado.'
      }));
    }

    const pedidos = await Pedido.findAll({
      where: { id_quarto: quarto.id_quarto },
      include: [
        {
          model: Item,
          through: { attributes: ['qntd_item'] }
        },
        {
          model: Evento
        }
      ]
    });

    return res.status(200).json(respostaHelper({
      status: 200,
      data: pedidos,
      message: 'Pedidos do quarto listados com sucesso.'
    }));
  } catch (err) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao listar pedidos.',
      errors: [err.message]
    }));
  }
};