import { Op, literal } from 'sequelize';
import { validationResult } from 'express-validator';
import sequelize from '../config/database.js';

import Evento from '../modelos/evento.js';
import Item from '../modelos/item.js';
import Horario from '../modelos/horario.js';
import EventoData from '../modelos/eventoData.js';
import EventoQuarto from '../modelos/eventoQuarto.js';
import Quarto from '../modelos/quarto.js';
import Pedido from '../modelos/pedido.js';
import ItemPedido from '../modelos/itemPedido.js';
import EventoItem from '../modelos/eventoItem.js';
import EventoHorario from '../modelos/eventoHorario.js';
import { respostaHelper } from '../utilitarios/helpers/respostaHelper.js';
import { QueryTypes } from 'sequelize';

/**
 * @description Lista todos os eventos, agregando seus horários, datas e quartos associados diretamente via query nativa para otimização.
 */

export const listarEventos = async (req, res) => {
    try {
        const [result] = await sequelize.query(`
        SELECT 
          e.id_evento, e.nome_evento, e.desc_evento, e.sts_evento, e.recorrencia, e.publico_alvo,
          array_remove(array_agg(DISTINCT h.horario::text), NULL) AS horarios,
          array_remove(array_agg(DISTINCT to_char(red.data_evento, 'YYYY-MM-DD')), NULL) AS datas,
          array_remove(array_agg(DISTINCT q.num_quarto), NULL) AS quartos
        FROM mamaloo.tab_evento e
        LEFT JOIN mamaloo.tab_re_evento_horario reh ON reh.id_evento = e.id_evento
        LEFT JOIN mamaloo.tab_horario h ON h.id_horario = reh.id_horario
        LEFT JOIN mamaloo.tab_re_evento_data red ON red.id_evento = e.id_evento
        LEFT JOIN mamaloo.tab_re_evento_quarto req ON req.id_evento = e.id_evento
        LEFT JOIN mamaloo.tab_quarto q ON q.id_quarto = req.id_quarto
        GROUP BY e.id_evento, e.nome_evento, e.desc_evento, e.sts_evento, e.recorrencia, e.publico_alvo
        ORDER BY e.id_evento;
      `);

        return res.status(200).json(respostaHelper({
            status: 200,
            message: 'Eventos encontrados.',
            data: result
        }));
    } catch (err) {
        console.error("Erro ao buscar eventos:", err);
        return res.status(500).json(respostaHelper({
            status: 500,
            message: 'Erro ao buscar eventos.',
            errors: [err.message]
        }));
    }
};

/**
 * @description Cria um novo evento e suas associações (horários, datas, quartos) de forma transacional e atômica.
 */

export const criarEvento = async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        return res.status(400).json(respostaHelper({
            status: 400,
            message: 'Falha de validação.',
            errors: erros.array()
        }));
    }

    const {
        nome_evento, desc_evento, horarios,
        sts_evento, recorrencia, publico_alvo,
        datas, quartos
    } = req.body;

    const t = await sequelize.transaction();

    try {
        const evento = await Evento.create({
            nome_evento, desc_evento, sts_evento,
            recorrencia, publico_alvo
        }, { transaction: t });

        if (horarios && horarios.length > 0) {
            const horarioInstances = await Promise.all(
                horarios.map(horarioStr => Horario.findOrCreate({
                    where: { horario: horarioStr },
                    transaction: t
                }).then(([instance]) => instance))
            );
            await evento.addHorarios(horarioInstances, { transaction: t });
        }

        if (!recorrencia && datas && datas.length > 0) {
            const datasParaCriar = datas.map(data => ({
                id_evento: evento.id_evento,
                data_evento: data
            }));
            await EventoData.bulkCreate(datasParaCriar, { transaction: t });
        }

        if (!publico_alvo && quartos && quartos.length > 0) {
            const quartosEncontrados = await Quarto.findAll({ where: { num_quarto: quartos }, transaction: t });
            if (quartosEncontrados.length !== quartos.length) {
                const numerosEncontrados = quartosEncontrados.map(q => q.num_quarto);
                const numerosInexistentes = quartos.filter(num => !numerosEncontrados.includes(num));
                throw new Error(`Os seguintes quartos não existem: ${numerosInexistentes.join(', ')}`);
            }
            const quartosParaCriar = quartosEncontrados.map(quarto => ({
                id_evento: evento.id_evento,
                id_quarto: quarto.id_quarto
            }));
            await EventoQuarto.bulkCreate(quartosParaCriar, { transaction: t });
        }

        await t.commit();

        return res.status(201).json(respostaHelper({
            status: 201,
            message: 'Evento criado com sucesso.',
            data: { id_evento: evento.id_evento }
        }));

    } catch (err) {
        await t.rollback();
        console.error("Erro ao criar evento:", err);
        return res.status(500).json(respostaHelper({
            status: 500,
            message: 'Erro ao criar evento.',
            errors: [err.message]
        }));
    }
};

/**
 * @description Atualiza um evento e substitui completamente suas associações (horários, datas, quartos) em uma única transação.
 */

export const atualizarEvento = async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        return res.status(400).json(respostaHelper({
            status: 400,
            message: 'Falha de validação.',
            errors: erros.array()
        }));
    }

    const { id } = req.params;
    const {
        nome_evento, desc_evento, horarios,
        sts_evento, recorrencia, publico_alvo,
        datas, quartos
    } = req.body;

    const t = await sequelize.transaction();

    try {
        const evento = await Evento.findByPk(id, { transaction: t });
        if (!evento) {
            await t.rollback();
            return res.status(404).json(respostaHelper({
                status: 404,
                message: 'Evento não encontrado.'
            }));
        }

        await evento.update({
            nome_evento, desc_evento, sts_evento,
            recorrencia, publico_alvo
        }, { transaction: t });

        if (horarios && Array.isArray(horarios)) {
            const horarioInstances = await Promise.all(
                horarios.map(horarioStr => Horario.findOrCreate({
                    where: { horario: horarioStr },
                    transaction: t
                }).then(([instance]) => instance))
            );
            await evento.setHorarios(horarioInstances, { transaction: t });
        }

        await EventoData.destroy({ where: { id_evento: id }, transaction: t });
        if (!recorrencia && datas && datas.length > 0) {
            const datasParaCriar = datas.map(data => ({
                id_evento: id,
                data_evento: data
            }));
            await EventoData.bulkCreate(datasParaCriar, { transaction: t });
        }

        await EventoQuarto.destroy({ where: { id_evento: id }, transaction: t });
        if (!publico_alvo && quartos && quartos.length > 0) {
            const quartosEncontrados = await Quarto.findAll({ where: { num_quarto: quartos }, transaction: t });

            if (quartosEncontrados.length !== quartos.length) {
                const numerosEncontrados = quartosEncontrados.map(q => q.num_quarto);
                const numerosInexistentes = quartos.filter(num => !numerosEncontrados.includes(num));
                throw new Error(`Os seguintes quartos não existem: ${numerosInexistentes.join(', ')}`);
            }
            
            const quartosParaVincular = quartosEncontrados.map(quarto => ({
                id_evento: id,
                id_quarto: quarto.id_quarto
            }));
            await EventoQuarto.bulkCreate(quartosParaVincular, { transaction: t });
        }

        await t.commit();

        return res.status(200).json(respostaHelper({
            status: 200,
            message: 'Evento atualizado com sucesso.'
        }));

    } catch (err) {
        await t.rollback();
        console.error(`Erro ao atualizar evento ${id}:`, err);
        return res.status(500).json(respostaHelper({
            status: 500,
            message: 'Erro ao atualizar evento.',
            errors: [err.message]
        }));
    }
};

/**
 * @description Exclui um evento e realiza a exclusão em cascata de todos os seus dados dependentes (pedidos, itens de pedidos, etc.) de forma transacional.
 */

export const excluirEvento = async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction();

    try {
        const evento = await Evento.findByPk(id, { transaction: t });
        if (!evento) {
            await t.rollback();
            return res.status(404).json(respostaHelper({ status: 404, message: 'Evento não encontrado.' }));
        }

        const pedidos = await Pedido.findAll({ where: { id_evento: id }, attributes: ['id_pedido'], transaction: t });
        const pedidoIds = pedidos.map(p => p.id_pedido);

        if (pedidoIds.length > 0) {
            await ItemPedido.destroy({ where: { id_pedido: pedidoIds }, transaction: t });
            await Pedido.destroy({ where: { id_evento: id }, transaction: t });
        }

        await EventoItem.destroy({ where: { id_evento: id }, transaction: t });
        await EventoQuarto.destroy({ where: { id_evento: id }, transaction: t });
        await EventoData.destroy({ where: { id_evento: id }, transaction: t });
        await EventoHorario.destroy({ where: { id_evento: id }, transaction: t });
        await evento.destroy({ transaction: t });

        await t.commit();

        return res.status(200).json(respostaHelper({ status: 200, message: 'Evento e todas as suas associações foram excluídos com sucesso.' }));

    } catch (err) {
        await t.rollback();
        console.error(`Erro ao excluir evento ${id}:`, err);
        return res.status(500).json(respostaHelper({ status: 500, message: 'Erro interno ao excluir evento.', errors: [err.message] }));
    }
};

/**
 * @description Vincula um ou mais itens a um evento, criando as associações na tabela pivo.
 */

export const vincularItensEvento = async (req, res) => {
    const { id } = req.params;
    const { itens } = req.body;

    if (!Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json(respostaHelper({ status: 400, message: 'É necessário fornecer um array de IDs de itens.' }));
    }

    const t = await sequelize.transaction();
    try {
        const evento = await Evento.findByPk(id, { transaction: t });
        if (!evento) {
            await t.rollback();
            return res.status(404).json(respostaHelper({ status: 404, message: 'Evento não encontrado.' }));
        }

        await evento.addItens(itens, { transaction: t });

        await t.commit();

        return res.status(200).json(respostaHelper({
            status: 200,
            message: 'Itens vinculados ao evento com sucesso.'
        }));
    } catch (err) {
        await t.rollback();
        console.error(`Erro ao vincular itens ao evento ${id}:`, err);
        if (err.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json(respostaHelper({ status: 404, message: 'Um ou mais itens não foram encontrados.' }));
        }
        return res.status(500).json(respostaHelper({ status: 500, message: 'Erro ao vincular itens ao evento.', errors: [err.message] }));
    }
};

/**
 * @description Desvincula um item específico de um evento, removendo a associação da tabela pivo.
 */

export const desvincularItemEvento = async (req, res) => {
    const { id, id_item } = req.params;
    const t = await sequelize.transaction();
    try {
        const evento = await Evento.findByPk(id, { transaction: t });
        if (!evento) {
            await t.rollback();
            return res.status(404).json(respostaHelper({ status: 404, message: 'Evento não encontrado.' }));
        }

        const item = await Item.findByPk(id_item, { transaction: t });
        if (!item) {
            await t.rollback();
            return res.status(404).json(respostaHelper({ status: 404, message: 'Item não encontrado.' }));
        }

        await evento.removeItem(item, { transaction: t });
        await t.commit();

        return res.status(200).json(respostaHelper({ status: 200, message: 'Item desvinculado do evento com sucesso.' }));
    } catch (err) {
        await t.rollback();
        console.error(`Erro ao desvincular item ${id_item} do evento ${id}:`, err);
        return res.status(500).json(respostaHelper({ status: 500, message: 'Erro ao desvincular item do evento.', errors: [err.message] }));
    }
};

/**
 * @description Lista os eventos disponíveis para o hóspede autenticado com base em regras de visibilidade (público, recorrente, data ou quarto específico).
 */

export const listarEventosHospede = async (req, res) => {
    try {
        const { id_hospede, num_quarto } = req.user;

        if (!num_quarto) {
            return res.status(400).json(respostaHelper({
                status: 400,
                message: 'Número do quarto do hóspede não encontrado no token.'
            }));
        }

        const quarto = await Quarto.findOne({ where: { num_quarto } });
        if (!quarto) {
            return res.status(404).json(respostaHelper({
                status: 404,
                message: 'Quarto do hóspede não encontrado.'
            }));
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const [eventos] = await sequelize.query(`
            SELECT 
                e.id_evento, e.nome_evento, e.desc_evento, e.sts_evento, e.recorrencia, e.publico_alvo,
                array_remove(array_agg(DISTINCT h.horario::text), NULL) AS horarios,
                array_remove(array_agg(DISTINCT to_char(red.data_evento, 'YYYY-MM-DD')), NULL) AS datas,
                array_remove(array_agg(DISTINCT q.num_quarto), NULL) AS quartos
            FROM mamaloo.tab_evento e
            LEFT JOIN mamaloo.tab_re_evento_horario reh ON reh.id_evento = e.id_evento
            LEFT JOIN mamaloo.tab_horario h ON h.id_horario = reh.id_horario
            LEFT JOIN mamaloo.tab_re_evento_data red ON red.id_evento = e.id_evento
            LEFT JOIN mamaloo.tab_re_evento_quarto req ON req.id_evento = e.id_evento
            LEFT JOIN mamaloo.tab_quarto q ON q.id_quarto = req.id_quarto
            WHERE e.sts_evento = TRUE AND (
                e.recorrencia = TRUE OR 
                e.publico_alvo = TRUE OR 
                red.data_evento = :hoje OR 
                req.id_quarto = :id_quarto
            )
            GROUP BY e.id_evento, e.nome_evento, e.desc_evento, e.sts_evento, e.recorrencia, e.publico_alvo
            ORDER BY e.id_evento;
        `, {
            replacements: {
                hoje: hoje.toISOString().split('T')[0],
                id_quarto: quarto.id_quarto
            }
        });

        return res.status(200).json(respostaHelper({
            status: 200,
            message: 'Eventos disponíveis para o hóspede listados com sucesso.',
            data: eventos
        }));

    } catch (err) {
        console.error('Erro ao listar eventos para hóspede:', err);
        return res.status(500).json(respostaHelper({ status: 500, message: 'Erro ao listar eventos para hóspede.', errors: [err.message] }));
    }
};

/**
 * @description Busca um evento por ID e retorna todos os seus dados e associações (horários, datas, quartos, itens) agregados via query nativa.
 */

export const listarEventoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await sequelize.query(`
            SELECT 
                e.id_evento, e.nome_evento, e.desc_evento, e.sts_evento, e.recorrencia, e.publico_alvo,
                array_remove(array_agg(DISTINCT h.horario::text), NULL) AS horarios,
                array_remove(array_agg(DISTINCT to_char(red.data_evento, 'YYYY-MM-DD')), NULL) AS datas,
                array_remove(array_agg(DISTINCT q.num_quarto), NULL) AS quartos,
                array_remove(array_agg(DISTINCT i.nome_item), NULL) AS itens
            FROM mamaloo.tab_evento e
            LEFT JOIN mamaloo.tab_re_evento_horario reh ON reh.id_evento = e.id_evento
            LEFT JOIN mamaloo.tab_horario h ON h.id_horario = reh.id_horario
            LEFT JOIN mamaloo.tab_re_evento_data red ON red.id_evento = e.id_evento
            LEFT JOIN mamaloo.tab_re_evento_quarto req ON req.id_evento = e.id_evento
            LEFT JOIN mamaloo.tab_quarto q ON q.id_quarto = req.id_quarto
            LEFT JOIN mamaloo.tab_re_evento_item rei ON rei.id_evento = e.id_evento
            LEFT JOIN mamaloo.tab_item i ON i.id_item = rei.id_item
            WHERE e.id_evento = :id_evento
            GROUP BY e.id_evento, e.nome_evento, e.desc_evento, e.sts_evento, e.recorrencia, e.publico_alvo;
        `, {
            replacements: { id_evento: id }
        });

        if (result.length === 0) {
            return res.status(404).json(respostaHelper({ status: 404, message: 'Evento não encontrado.' }));
        }

        return res.status(200).json(respostaHelper({
            status: 200,
            message: 'Evento encontrado.',
            data: result[0]
        }));
    } catch (err) {
        console.error(`Erro ao buscar evento ${id}:`, err);
        return res.status(500).json(respostaHelper({ status: 500, message: 'Erro ao buscar evento.', errors: [err.message] }));
    }
};

/**
 * @description Gera um relatório consolidado dos itens pedidos hoje para todos os eventos que ocorrem no dia, somando quantidades e valores.
 */

export const listarItensEventosHoje = async (req, res) => {
    try {
        // 1. Gera a string de data 'hoje' de forma segura, à prova de fuso horário
        const agoraEmUTC = Date.now();
        const tresHorasEmMs = 3 * 60 * 60 * 1000;
        const agoraNoBrasil = new Date(agoraEmUTC - tresHorasEmMs);
        const dataHoje = agoraNoBrasil.toISOString().split('T')[0];

        // 2. Busca todos os pedidos feitos hoje para eventos ativos
        const pedidosHoje = await Pedido.findAll({
            where: {
                [Op.and]: [
                    literal(`CAST(data_pedido AS DATE) = '${dataHoje}'`)
                ]
            },
            include: [
                {
                    model: Evento,
                    where: { sts_evento: true },
                    required: true 
                },
                {
                    model: Item,
                    through: { attributes: ["qntd_item"] }
                }
            ]
        });

        if (pedidosHoje.length === 0) {
            return res.status(200).json(respostaHelper({
                status: 200,
                message: "Nenhum pedido encontrado para hoje.",
                data: []
            }));
        }

        // 3. NOVA LÓGICA DE AGREGAÇÃO - Unificada por item para a comanda do dia
        const comandaDoDia = {};

        pedidosHoje.forEach(pedido => {
            pedido.Items.forEach(item => {
                const id_item = item.id_item;

                // Se o item ainda não está na nossa comanda, inicializa ele com os campos necessários
                if (!comandaDoDia[id_item]) {
                    comandaDoDia[id_item] = {
                        nome_item: item.nome_item,
                        foto_item: item.foto_item,
                        quantidade_total: 0
                    };
                }

                // Soma a quantidade do item neste pedido à quantidade total
                const qntd = item.itemPedido?.qntd_item || 0;
                comandaDoDia[id_item].quantidade_total += qntd;
            });
        });

        // Converte o objeto de comanda para o array final que será retornado
        const relatorioFinal = Object.values(comandaDoDia);

        return res.status(200).json(respostaHelper({
            status: 200,
            message: "Comanda do dia gerada com sucesso.",
            data: relatorioFinal
        }));

    } catch (err) {
        console.error("Erro ao gerar relatório de itens dos eventos de hoje:", err);
        return res.status(500).json(respostaHelper({ status: 500, message: "Erro ao gerar relatório de itens dos eventos de hoje.", errors: [err.message] }));
    }
};

/**
 * @description Gera um relatório geral e detalhado para um evento específico, com resumo de totais, itens mais pedidos e lista de todos os pedidos.
 */

export const relatorioGeralEvento = async (req, res) => {
  try {
    const { id } = req.params;

    const evento = await Evento.findByPk(id);
    if (!evento) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Evento não encontrado.'
      }));
    }

    const pedidos = await Pedido.findAll({
      where: { id_evento: id },
      include: [
        {
          model: Item,
          through: { attributes: ['qntd_item'] }
        },
        {
          model: Quarto,
          attributes: ['num_quarto'],
          required: true
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
        id_horario: pedido.id_horario,
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

export const listarItensPorEvento = async (req, res) => {
  try {
    const { id_evento } = req.params;

    const sqlEvento = `
      SELECT nome_evento, desc_evento
      FROM mamaloo.tab_evento
      WHERE id_evento = :id_evento;
    `;
    const eventoInfo = await sequelize.query(sqlEvento, {
      replacements: { id_evento },
      type: QueryTypes.SELECT,
      plain: true
    });

    if (!eventoInfo) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Evento não encontrado.'
      }));
    }

    const sqlItens = `
      SELECT i.*
      FROM mamaloo.tab_item AS i
      INNER JOIN mamaloo.tab_re_evento_item AS rei ON i.id_item = rei.id_item
      WHERE rei.id_evento = :id_evento;
    `;
    const itens = await sequelize.query(sqlItens, {
      replacements: { id_evento },
      type: QueryTypes.SELECT
    });

    const sqlDatas = `
      SELECT data_evento
      FROM mamaloo.tab_re_evento_data
      WHERE id_evento = :id_evento;
    `;
    const datasResult = await sequelize.query(sqlDatas, {
      replacements: { id_evento },
      type: QueryTypes.SELECT
    });
    const datas = datasResult.map(d => d.data_evento);


    const sqlHorarios = `
      SELECT h.id_horario, h.horario
      FROM mamaloo.tab_horario AS h
      INNER JOIN mamaloo.tab_re_evento_horario AS reh ON h.id_horario = reh.id_horario
      WHERE reh.id_evento = :id_evento;
    `;
    const horarios = await sequelize.query(sqlHorarios, {
      replacements: { id_evento },
      type: QueryTypes.SELECT
    });

    const resultadoFinal = {
      ...eventoInfo,
      datas,        
      horarios,     
      itens         
    };

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Detalhes do evento listados com sucesso!',
      data: resultadoFinal
    }));

  } catch (err) {
    console.error("Erro na consulta SQL:", err);
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao listar os detalhes do evento.',
      errors: [err.message]
    }));
  }
};

/**
 * @description Lista os pedidos associados a eventos que estão ativos no dia corrente (recorrentes ou com data para hoje).
 */

export const listarPedidosEventosAtivos = async (req, res) => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const pedidos = await Pedido.findAll({
      include: [
        {
          model: Evento,
          where: { sts_evento: true },
          required: true
        },
        {
          model: Item,
          through: { attributes: ['qntd_item'] }
        },
        {
          model: Quarto,
          attributes: ['num_quarto'],
          required: true
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
        const hojeString = hoje.toISOString().split('T')[0];

        const dataEvento = await EventoData.findOne({
          where: {
            id_evento: evento.id_evento,
            data_evento: hojeString
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
          id_horario: pedido.id_horario,
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