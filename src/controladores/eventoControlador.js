import { Op } from 'sequelize';
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

export const listarItensPorEvento = async (req, res) => {
    const { id } = req.params;
    try {
        const evento = await Evento.findByPk(id, {
            include: [{
                model: Item,
                as: 'Itens',
                attributes: ['id_item', 'nome_item', 'valor_item', 'qntd_max_hospede', 'categ_item'],
                through: { attributes: [] }
            }]
        });

        if (!evento) {
            return res.status(404).json(respostaHelper({ status: 404, message: 'Evento não encontrado.' }));
        }

        const itensFormatados = evento.Itens ? evento.Itens.map(item => ({
            id_item: item.id_item,
            nome_item: item.nome_item,
            valor_item: item.valor_item,
            qntd_max_hospede: item.qntd_max_hospede,
            categoria: item.categ_item
        })) : [];

        return res.status(200).json(respostaHelper({
            status: 200,
            message: 'Itens do evento listados com sucesso.',
            data: itensFormatados
        }));
    } catch (err) {
        console.error(`Erro ao buscar itens para o evento ${id}:`, err);
        return res.status(500).json(respostaHelper({ status: 500, message: 'Erro interno ao buscar itens do evento.', errors: [err.message] }));
    }
};

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

export const listarItensEventosHoje = async (req, res) => {
    try {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataHoje = hoje.toISOString().split('T')[0];

        const eventosHoje = await Evento.findAll({
            where: {
                sts_evento: true,
                [Op.or]: [
                    { recorrencia: true },
                    { '$Datas.data_evento$': dataHoje }
                ]
            },
            include: {
                model: EventoData,
                as: 'Datas',
                attributes: [],
                required: false
            }
        });

        const idsEventosHoje = eventosHoje.map(ev => ev.id_evento);

        if (idsEventosHoje.length === 0) {
            return res.status(200).json(respostaHelper({
                status: 200,
                message: "Nenhum evento encontrado para hoje.",
                data: []
            }));
        }

        const pedidosHoje = await Pedido.findAll({
            where: {
                id_evento: { [Op.in]: idsEventosHoje },
                data_pedido: dataHoje
            },
            include: [{
                model: Item,
                through: { attributes: ["qntd_item"] }
            }]
        });

        let relatorio = [];
        for (const evento of eventosHoje) {
            const pedidosEvento = pedidosHoje.filter(p => p.id_evento === evento.id_evento);
            let itensEvento = {};

            pedidosEvento.forEach(pedido => {
                pedido.Items.forEach(item => {
                    if (!itensEvento[item.id_item]) {
                        itensEvento[item.id_item] = {
                            id_item: item.id_item,
                            nome_item: item.nome_item,
                            foto_item: item.foto_item,
                            preco_unitario: item.valor_item,
                            quantidade_total: 0,
                            valor_total: 0
                        };
                    }
                    const qntd = item.itemPedido?.qntd_item || 0;
                    itensEvento[item.id_item].quantidade_total += qntd;
                    itensEvento[item.id_item].valor_total += qntd * (item.valor_item || 0);
                });
            });

            relatorio.push({
                id_evento: evento.id_evento,
                nome_evento: evento.nome_evento,
                itens: Object.values(itensEvento)
            });
        }

        return res.status(200).json(respostaHelper({
            status: 200,
            message: "Relatório de itens dos eventos de hoje gerado com sucesso.",
            data: relatorio
        }));

    } catch (err) {
        console.error("Erro ao gerar relatório de itens dos eventos de hoje:", err);
        return res.status(500).json(respostaHelper({ status: 500, message: "Erro ao gerar relatório de itens dos eventos de hoje.", errors: [err.message] }));
    }
};
