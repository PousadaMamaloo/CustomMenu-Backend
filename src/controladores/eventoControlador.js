import Evento from '../modelos/evento.js';
import sequelize from '../config/database.js';
import { validationResult } from 'express-validator';
import Horario from '../modelos/horario.js';

export const listarEventos = async (req, res) => {
    try {
        const eventos = await Evento.findAll();
        const [result] = await sequelize.query(`
      SELECT e.id_evento, e.nome_evento, e.desc_evento, e.sts_evento,
        array_agg(h.horario::text) AS horarios
      FROM mamaloo.tab_evento e
      JOIN mamaloo.tab_re_evento_horario reh ON reh.id_evento = e.id_evento
      JOIN mamaloo.tab_horario h ON h.id_horario = reh.id_horario
      GROUP BY e.id_evento, e.nome_evento, e.desc_evento, e.sts_evento
    `);

        return res.json({
            status: 'success',
            mensagem: 'Eventos encontrados.',
            dados: result
        });
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            mensagem: 'Erro ao buscar eventos.',
            dados: {},
            errors: [err.message]
        });
    }
};

export const criarEvento = async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            mensagem: 'Falha de validação.',
            dados: {},
            errors: erros.array()
        });
    }
    const { nome_evento, desc_evento, horarios, sts_evento } = req.body;

    try {
        const evento = await Evento.create({ nome_evento, desc_evento, sts_evento });
        for (const horario of horarios) {
            let [hor, created] = await Horario.findOrCreate({
                where: { horario }
            });
            await sequelize.query(`
        INSERT INTO mamaloo.tab_re_evento_horario (id_evento, id_horario)
        VALUES (${evento.id_evento}, ${hor.id_horario})
      `);
        }

        return res.status(201).json({
            status: 'success',
            mensagem: 'Evento criado com sucesso.',
            dados: { id_evento: evento.id_evento }
        });
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            mensagem: 'Erro ao criar evento.',
            dados: {},
            errors: [err.message]
        });
    }
};

export const atualizarEvento = async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            mensagem: 'Falha de validação.',
            dados: {},
            errors: erros.array()
        });
    }
    const { id } = req.params;
    const { nome_evento, desc_evento, horarios, sts_evento } = req.body;

    try {
        const evento = await Evento.findByPk(id);
        if (!evento) {
            return res.status(404).json({
                status: 'error',
                mensagem: 'Evento não encontrado.',
                dados: {}
            });
        }

        await evento.update({ nome_evento, desc_evento, sts_evento });

        await sequelize.query(`
      DELETE FROM mamaloo.tab_re_evento_horario WHERE id_evento = ${id}
    `);

        for (const horario of horarios) {
            let [hor, created] = await sequelize.models.Horario.findOrCreate({
                where: { horario }
            });
            await sequelize.query(`
        INSERT INTO mamaloo.tab_re_evento_horario (id_evento, id_horario)
        VALUES (${id}, ${hor.id_horario})
      `);
        }

        return res.json({
            status: 'success',
            mensagem: 'Evento atualizado com sucesso.',
            dados: {}
        });
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            mensagem: 'Erro ao atualizar evento.',
            dados: {},
            errors: [err.message]
        });
    }
};

export const excluirEvento = async (req, res) => {
    const { id } = req.params;
    try {
        const evento = await Evento.findByPk(id);
        if (!evento) {
            return res.status(404).json({
                status: 'error',
                mensagem: 'Evento não encontrado.',
                dados: {}
            });
        }

        await sequelize.query(`
      DELETE FROM mamaloo.tab_re_evento_horario WHERE id_evento = ${id}
    `);

        await evento.destroy();

        return res.json({
            status: 'success',
            mensagem: 'Evento excluído com sucesso.',
            dados: {}
        });
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            mensagem: 'Erro ao excluir evento.',
            dados: {},
            errors: [err.message]
        });
    }
};