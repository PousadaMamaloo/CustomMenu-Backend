import Evento from '../modelos/evento.js';
import Item from '../modelos/item.js'; 
import sequelize from '../config/database.js';
import { validationResult } from 'express-validator';
import Horario from '../modelos/horario.js';
import { respostaHelper } from '../utilitarios/helpers/respostaHelper.js'; 


export const listarEventos = async (req, res) => {
    try {
        
        const [result] = await sequelize.query(`
      SELECT e.id_evento, e.nome_evento, e.desc_evento, e.sts_evento,
        array_agg(h.horario::text) AS horarios
      FROM mamaloo.tab_evento e
      LEFT JOIN mamaloo.tab_re_evento_horario reh ON reh.id_evento = e.id_evento
      LEFT JOIN mamaloo.tab_horario h ON h.id_horario = reh.id_horario
      GROUP BY e.id_evento, e.nome_evento, e.desc_evento, e.sts_evento
      ORDER BY e.id_evento
    `);

        return res.status(200).json(respostaHelper({
            status: 200,
            mensagem: 'Eventos encontrados.',
            data: result
        }));
    } catch (err) {
        console.error("Erro ao buscar eventos:", err);
        return res.status(500).json(respostaHelper({
            status: 500,
            mensagem: 'Erro ao buscar eventos.',
            errors: [err.message]
        }));
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
            return res.status(404).json(respostaHelper({
                status: 404,
                mensagem: 'Evento não encontrado.'
            }));
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
            mensagem: 'Itens do evento listados com sucesso.',
            data: itensFormatados 
        }));

    } catch (err) {
        console.error(`Erro ao buscar itens para o evento ${id}:`, err);
        return res.status(500).json(respostaHelper({
            status: 500,
            mensagem: 'Erro interno ao buscar itens do evento.',
            errors: [err.message]
        }));
    }
};



export const criarEvento = async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        return res.status(400).json(respostaHelper({
            status: 400,
            mensagem: 'Falha de validação.',
            errors: erros.array()
        }));
    }
    const { nome_evento, desc_evento, horarios, sts_evento } = req.body;

    const t = await sequelize.transaction(); 

    try {
        const evento = await Evento.create({ nome_evento, desc_evento, sts_evento }, { transaction: t });

        if (horarios && horarios.length > 0) {
            for (const horario of horarios) {
                let [hor, created] = await Horario.findOrCreate({
                    where: { horario },
                    transaction: t
                });
                
                await sequelize.query(`
                    INSERT INTO mamaloo.tab_re_evento_horario (id_evento, id_horario)
                    VALUES (:id_evento, :id_horario)
                `, {
                    replacements: { id_evento: evento.id_evento, id_horario: hor.id_horario },
                    transaction: t
                });
            }
        }

        await t.commit(); 

        return res.status(201).json(respostaHelper({
            status: 201,
            mensagem: 'Evento criado com sucesso.',
            data: { id_evento: evento.id_evento }
        }));
    } catch (err) {
        await t.rollback(); 
        console.error("Erro ao criar evento:", err);
        return res.status(500).json(respostaHelper({
            status: 500,
            mensagem: 'Erro ao criar evento.',
            errors: [err.message]
        }));
    }
};


export const atualizarEvento = async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        return res.status(400).json(respostaHelper({
            status: 400,
            mensagem: 'Falha de validação.',
            errors: erros.array()
        }));
    }
    const { id } = req.params;
    const { nome_evento, desc_evento, horarios, sts_evento } = req.body;

    const t = await sequelize.transaction(); 

    try {
        const evento = await Evento.findByPk(id, { transaction: t });
        if (!evento) {
            await t.rollback();
            return res.status(404).json(respostaHelper({
                status: 404,
                mensagem: 'Evento não encontrado.'
            }));
        }

        await evento.update({ nome_evento, desc_evento, sts_evento }, { transaction: t });

        
        await sequelize.query(`
            DELETE FROM mamaloo.tab_re_evento_horario WHERE id_evento = :id_evento
        `, { replacements: { id_evento: id }, transaction: t });

        
        if (horarios && horarios.length > 0) {
            for (const horario of horarios) {
                let [hor, created] = await Horario.findOrCreate({
                    where: { horario },
                    transaction: t
                });
                await sequelize.query(`
                    INSERT INTO mamaloo.tab_re_evento_horario (id_evento, id_horario)
                    VALUES (:id_evento, :id_horario)
                `, { replacements: { id_evento: id, id_horario: hor.id_horario }, transaction: t });
            }
        }

        await t.commit(); 

        return res.status(200).json(respostaHelper({
            status: 200,
            mensagem: 'Evento atualizado com sucesso.'
        }));
    } catch (err) {
        await t.rollback(); 
        console.error(`Erro ao atualizar evento ${id}:`, err);
        return res.status(500).json(respostaHelper({
            status: 500,
            mensagem: 'Erro ao atualizar evento.',
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
            return res.status(404).json(respostaHelper({
                status: 404,
                mensagem: 'Evento não encontrado.'
            }));
        }

        
        await sequelize.query(`
            DELETE FROM mamaloo.tab_re_evento_horario WHERE id_evento = :id_evento
        `, { replacements: { id_evento: id }, transaction: t });
        
        

        await evento.destroy({ transaction: t });

        await t.commit(); 

        return res.status(200).json(respostaHelper({
            status: 200,
            mensagem: 'Evento excluído com sucesso.'
        }));
    } catch (err) {
        await t.rollback(); 
        console.error(`Erro ao excluir evento ${id}:`, err);
        return res.status(500).json(respostaHelper({
            status: 500,
            mensagem: 'Erro ao excluir evento.',
            errors: [err.message]
        }));
    }
};
