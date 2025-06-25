import Pedido from '../modelos/pedido.js';
import Item from '../modelos/item.js';
import itemPedido from '../modelos/itemPedido.js';
import Evento from '../modelos/evento.js';
import Quarto from '../modelos/quarto.js';
import EventoData from '../modelos/eventoData.js';
import { respostaHelper } from '../utilitarios/helpers/respostaHelper.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize'

export const criarPedido = async (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json(respostaHelper({
      status: 400,
      message: 'Erro de validação.',
      errors: erros.array()
    }));
  }
  const { id_quarto, id_evento, itens, horario_cafe_manha } = req.body;
  try {
    const agora = new Date();
    const novoPedido = await Pedido.create({ id_quarto, id_evento, data_pedido: agora, horario_cafe_manha });

    
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

    
    const itens = pedido.Items.map(it => ({
      id_item: it.id_item,
      nome: it.nome_item,
      quantidade: it.itemPedido.qntd_item,
      valor_unitario: it.valor_item,
      valor_total: it.valor_item * it.itemPedido.qntd_item,
      foto_item: it.foto_item
    }));

    return res.status(200).json(respostaHelper({
      status: 200,
      data: {
        id_pedido: pedido.id_pedido,
        evento: pedido.Evento ? pedido.Evento.nome_evento : null,
        data_pedido: pedido.data_pedido,
        horario_cafe_manha: pedido.horario_cafe_manha,
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


export const listarPedidosPorQuarto = async (req, res) => {
  const { numQuarto } = req.params;
  try {
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


export const listarPedidosEventosAtivos = async (req, res) => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); 

    const pedidos = await Pedido.findAll({
      include: [
        {
          model: Evento,
          where: {
            sts_evento: true
          },
          required: true
        },
        {
          model: Item,
          through: { attributes: ['qntd_item'] }
        },
        {
          model: Quarto,
          attributes: ['num_quarto']
        }
      ],
      order: [['data_pedido', 'DESC']]
    });

    
    const pedidosFiltrados = [];
    
    for (const pedido of pedidos) {
      const evento = pedido.Evento;
      let eventoAtivo = false;

      
      if (evento.recorrencia) {
        eventoAtivo = true;
      } else {
        const dataEvento = await EventoData.findOne({
          where: {
            id_evento: evento.id_evento,
            data_evento: hoje
          }
        });
        if (dataEvento) {
          eventoAtivo = true;
        }
      }

      if (eventoAtivo) {
        pedidosFiltrados.push({
          id_pedido: pedido.id_pedido,
          data_pedido: pedido.data_pedido,
          horario_cafe_manha: pedido.horario_cafe_manha,
          quarto: pedido.Quarto.num_quarto,
          evento: {
            id_evento: evento.id_evento,
            nome_evento: evento.nome_evento,
            desc_evento: evento.desc_evento
          },
          itens: pedido.Items.map(item => ({
            id_item: item.id_item,
            nome_item: item.nome_item,
            quantidade: item.itemPedido.qntd_item,
            valor_unitario: item.valor_item,
            valor_total: item.valor_item * item.itemPedido.qntd_item,
            foto_item: item.foto_item
          }))
        });
      }
    }

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Pedidos de eventos ativos listados com sucesso.',
      data: pedidosFiltrados
    }));

  } catch (err) {
    console.error('Erro ao listar pedidos de eventos ativos:', err);
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao listar pedidos de eventos ativos.',
      errors: [err.message]
    }));
  }
};

export const relatorioGeralEvento = async (req, res) => {
  try {
    const { idEvento } = req.params;

    const evento = await Evento.findByPk(idEvento);
    if (!evento) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Evento não encontrado.'
      }));
    }

    const pedidos = await Pedido.findAll({
      where: { id_evento: idEvento },
      include: [
        {
          model: Item,
          through: { attributes: ['qntd_item'] }
        },
        {
          model: Quarto,
          attributes: ['num_quarto']
        }
      ],
      order: [['data_pedido', 'DESC']]
    });

    let totalPedidos = pedidos.length;
    let valorTotal = 0;
    let itensResumo = {};
    let quartos = new Set();

    pedidos.forEach(pedido => {
      quartos.add(pedido.Quarto.num_quarto);
      
      pedido.Items.forEach(item => {
        const quantidade = item.itemPedido.qntd_item;
        const valorItem = item.valor_item * quantidade;
        valorTotal += valorItem;

        if (itensResumo[item.nome_item]) {
          itensResumo[item.nome_item].quantidade += quantidade;
          itensResumo[item.nome_item].valor_total += valorItem;
        } else {
          itensResumo[item.nome_item] = {
            nome_item: item.nome_item,
            quantidade: quantidade,
            valor_unitario: item.valor_item,
            valor_total: valorItem
          };
        }
      });
    });

    const relatorio = {
      evento: {
        id_evento: evento.id_evento,
        nome_evento: evento.nome_evento,
        desc_evento: evento.desc_evento
      },
      resumo: {
        total_pedidos: totalPedidos,
        total_quartos_participantes: quartos.size,
        valor_total: valorTotal
      },
      itens_mais_pedidos: Object.values(itensResumo).sort((a, b) => b.quantidade - a.quantidade),
      pedidos_detalhados: pedidos.map(pedido => ({
        id_pedido: pedido.id_pedido,
        data_pedido: pedido.data_pedido,
        quarto: pedido.Quarto.num_quarto,
        horario_cafe_manha: pedido.horario_cafe_manha,
        itens: pedido.Items.map(item => ({
          nome_item: item.nome_item,
          quantidade: item.itemPedido.qntd_item,
          valor_unitario: item.valor_item,
          valor_total: item.valor_item * item.itemPedido.qntd_item,
          foto_item: item.foto_item
        }))
      }))
    };

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Relatório geral do evento gerado com sucesso.',
      data: relatorio
    }));

  } catch (err) {
    console.error('Erro ao gerar relatório do evento:', err);
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao gerar relatório do evento.',
      errors: [err.message]
    }));
  }
};

export const historicoComPaginacao = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: pedidos } = await Pedido.findAndCountAll({
      include: [
        {
          model: Item,
          through: { attributes: ['qntd_item'] }
        },
        {
          model: Evento,
          attributes: ['nome_evento', 'desc_evento']
        },
        {
          model: Quarto,
          attributes: ['num_quarto']
        }
      ],
      order: [['data_pedido', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    const pedidosFormatados = pedidos.map(pedido => ({
      id_pedido: pedido.id_pedido,
      data_pedido: pedido.data_pedido,
      quarto: pedido.Quarto.num_quarto,
      horario_cafe_manha: pedido.horario_cafe_manha,
      evento: pedido.Evento ? {
        nome_evento: pedido.Evento.nome_evento,
        desc_evento: pedido.Evento.desc_evento
      } : null
    }));

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Histórico de pedidos listado com sucesso.',
      data: {
        pedidos: pedidosFormatados,
        paginacao: {
          pagina_atual: parseInt(page),
          total_paginas: totalPages,
          total_registros: count,
          registros_por_pagina: parseInt(limit)
        }
      }
    }));

  } catch (err) {
    console.error('Erro ao listar histórico de pedidos:', err);
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao listar histórico de pedidos.',
      errors: [err.message]
    }));
  }
};



export const listarPedidosHoje = async (req, res) => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    const pedidos = await Pedido.findAll({
      where: {
        data_pedido: {
          [Op.or]: [hoje, amanha]
        }
      },
      include: [
        {
          model: Evento,
          attributes: ["nome_evento", "desc_evento"]
        },
        {
          model: Quarto,
          attributes: ["num_quarto"]
        }
      ],
      order: [["data_pedido", "DESC"]]
    });

    const pedidosFormatados = pedidos.map(pedido => ({
      id_pedido: pedido.id_pedido,
      data_pedido: pedido.data_pedido,
      quarto: pedido.Quarto.num_quarto,
      horario_cafe_manha: pedido.horario_cafe_manha,
      evento: pedido.Evento ? {
        nome_evento: pedido.Evento.nome_evento,
        desc_evento: pedido.Evento.desc_evento
      } : null
    }));

    return res.status(200).json(respostaHelper({
      status: 200,
      message: "Pedidos de hoje listados com sucesso.",
      data: pedidosFormatados
    }));

  } catch (err) {
    console.error("Erro ao listar pedidos de hoje:", err);
    return res.status(500).json(respostaHelper({
      status: 500,
      message: "Erro ao listar pedidos de hoje.",
      errors: [err.message]
    }));
  }
};


