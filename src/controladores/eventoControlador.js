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

export const vincularItensEvento = async (req, res) => {
    const { id } = req.params;
    const { itens } = req.body;
    
    if (!Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json(respostaHelper({
            status: 400,
            mensagem: 'É necessário fornecer um array de IDs de itens.',
            errors: ['O campo "itens" deve ser um array não vazio.']
        }));
    }

    const t = await sequelize.transaction();

    try {
        // Verificar se o evento existe
        const evento = await Evento.findByPk(id, { transaction: t });
        if (!evento) {
            await t.rollback();
            return res.status(404).json(respostaHelper({
                status: 404,
                mensagem: 'Evento não encontrado.'
            }));
        }

        // Verificar se todos os itens existem
        const itensExistentes = await Item.findAll({
            where: {
                id_item: itens
            },
            transaction: t
        });

        if (itensExistentes.length !== itens.length) {
            await t.rollback();
            return res.status(404).json(respostaHelper({
                status: 404,
                mensagem: 'Um ou mais itens não foram encontrados.'
            }));
        }

        // Obter itens já associados para evitar duplicidade
        const itensAssociados = await evento.getItens({
            where: {
                id_item: itens
            },
            transaction: t
        });

        const itensJaAssociados = itensAssociados.map(item => item.id_item);
        const itensParaAdicionar = itens.filter(id => !itensJaAssociados.includes(id));

        if (itensParaAdicionar.length > 0) {
            // Usar o método addItem do Sequelize para associar os itens
            await evento.addItens(itensParaAdicionar, { 
                through: { disp_item: true },
                transaction: t 
            });
        }

        await t.commit();

        return res.status(200).json(respostaHelper({
            status: 200,
            mensagem: 'Itens vinculados ao evento com sucesso.',
            data: {
                itens_adicionados: itensParaAdicionar,
                itens_ja_existentes: itensJaAssociados
            }
        }));
    } catch (err) {
        await t.rollback();
        console.error(`Erro ao vincular itens ao evento ${id}:`, err);
        return res.status(500).json(respostaHelper({
            status: 500,
            mensagem: 'Erro ao vincular itens ao evento.',
            errors: [err.message]
        }));
    }
};

export const desvincularItemEvento = async (req, res) => {
    const { id, id_item } = req.params;
    
    const t = await sequelize.transaction();

    try {
        // Verificar se o evento existe
        const evento = await Evento.findByPk(id, { transaction: t });
        if (!evento) {
            await t.rollback();
            return res.status(404).json(respostaHelper({
                status: 404,
                mensagem: 'Evento não encontrado.'
            }));
        }

        // Verificar se o item existe
        const item = await Item.findByPk(id_item, { transaction: t });
        if (!item) {
            await t.rollback();
            return res.status(404).json(respostaHelper({
                status: 404,
                mensagem: 'Item não encontrado.'
            }));
        }

        // Verificar se a associação existe
        const associacao = await evento.hasItem(item, { transaction: t });
        if (!associacao) {
            await t.rollback();
            return res.status(404).json(respostaHelper({
                status: 404,
                mensagem: 'Item não está associado a este evento.'
            }));
        }

        // Usar o método removeItem do Sequelize para remover a associação
        await evento.removeItem(item, { transaction: t });

        await t.commit();

        return res.status(200).json(respostaHelper({
            status: 200,
            mensagem: 'Item desvinculado do evento com sucesso.'
        }));
    } catch (err) {
        await t.rollback();
        console.error(`Erro ao desvincular item ${id_item} do evento ${id}:`, err);
        return res.status(500).json(respostaHelper({
            status: 500,
            mensagem: 'Erro ao desvincular item do evento.',
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
