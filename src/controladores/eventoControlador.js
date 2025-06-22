import Evento from '../modelos/evento.js';
import Item from '../modelos/item.js'; 
import sequelize from '../config/database.js';
import { validationResult } from 'express-validator';
import Horario from '../modelos/horario.js';
import { respostaHelper } from '../utilitarios/helpers/respostaHelper.js'; 
import EventoData from '../modelos/eventoData.js';
import EventoQuarto from '../modelos/eventoQuarto.js';
import Quarto from '../modelos/quarto.js';

export const listarEventos = async (req, res) => {
    try {
      const [result] = await sequelize.query(`
        SELECT 
          e.id_evento, 
          e.nome_evento, 
          e.desc_evento, 
          e.sts_evento,
          e.recorrencia,
          e.publico_alvo,
          -- Agrupa horários
          array_remove(array_agg(DISTINCT h.horario::text), NULL) AS horarios,
          -- Agrupa datas específicas
          array_remove(array_agg(DISTINCT to_char(red.data_evento, 'YYYY-MM-DD')), NULL) AS datas,
          -- Agrupa quartos
          array_remove(array_agg(DISTINCT q.numero_quarto), NULL) AS quartos
        FROM mamaloo.tab_evento e
        -- LEFT JOINs
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
            for (const horario of horarios) {
                const [hor] = await Horario.findOrCreate({
                    where: { horario },
                    transaction: t
                });
                await sequelize.query(`
                    INSERT INTO mamaloo.tab_re_evento_horario (id_evento, id_horario)
                    VALUES (:id_evento, :id_horario)
                `, {
                    replacements: {
                        id_evento: evento.id_evento,
                        id_horario: hor.id_horario
                    },
                    transaction: t
                });
            }
        }

        if (!recorrencia && datas?.length) {
            for (const data of datas) {
                await EventoData.create({
                    id_evento: evento.id_evento,
                    data_evento: data
                }, { transaction: t });
            }
        }

        if (!publico_alvo && quartos?.length) {
            for (const id_quarto of quartos) {
                await EventoQuarto.create({
                    id_evento: evento.id_evento,
                    id_quarto
                }, { transaction: t });
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
                mensagem: 'Evento não encontrado.'
            }));
        }

        await evento.update({
            nome_evento, desc_evento, sts_evento,
            recorrencia, publico_alvo
        }, { transaction: t });

        // Remover e reinserir horários
        await sequelize.query(
            `DELETE FROM mamaloo.tab_re_evento_horario WHERE id_evento = :id_evento`,
            { replacements: { id_evento: id }, transaction: t }
        );

        if (horarios && horarios.length > 0) {
            for (const horario of horarios) {
                const [hor] = await Horario.findOrCreate({
                    where: { horario },
                    transaction: t
                });
                await sequelize.query(`
                    INSERT INTO mamaloo.tab_re_evento_horario (id_evento, id_horario)
                    VALUES (:id_evento, :id_horario)
                `, {
                    replacements: {
                        id_evento: id,
                        id_horario: hor.id_horario
                    },
                    transaction: t
                });
            }
        }

        // Atualizar datas (se não for recorrente)
        await EventoData.destroy({ where: { id_evento: id }, transaction: t });
        if (!recorrencia && datas?.length) {
            for (const data of datas) {
                await EventoData.create({
                    id_evento: id,
                    data_evento: data
                }, { transaction: t });
            }
        }

        // Atualizar quartos (se não for público geral)
        await EventoQuarto.destroy({ where: { id_evento: id }, transaction: t });
        if (!publico_alvo && quartos?.length) {
            for (const id_quarto of quartos) {
                await EventoQuarto.create({
                    id_evento: id,
                    id_quarto
                }, { transaction: t });
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


export const listarEventosHospede = async (req, res) => {
    try {
        const { id_hospede, num_quarto } = req.user; // Assumindo que o id_hospede e num_quarto estão no token

        if (!num_quarto) {
            return res.status(400).json(respostaHelper({
                status: 400,
                mensagem: 'Número do quarto do hóspede não encontrado no token.'
            }));
        }

        const quarto = await Quarto.findOne({ where: { num_quarto } });
        if (!quarto) {
            return res.status(404).json(respostaHelper({
                status: 404,
                mensagem: 'Quarto do hóspede não encontrado.'
            }));
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Normaliza para o início do dia

        const [eventos] = await sequelize.query(`
            SELECT 
                e.id_evento, 
                e.nome_evento, 
                e.desc_evento, 
                e.sts_evento,
                e.recorrencia,
                e.publico_alvo,
                array_remove(array_agg(DISTINCT h.horario::text), NULL) AS horarios,
                array_remove(array_agg(DISTINCT to_char(red.data_evento, 'YYYY-MM-DD')), NULL) AS datas,
                array_remove(array_agg(DISTINCT q.numero_quarto), NULL) AS quartos
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
                hoje: hoje.toISOString().split('T')[0], // Formata para YYYY-MM-DD
                id_quarto: quarto.id_quarto
            }
        });

        return res.status(200).json(respostaHelper({
            status: 200,
            mensagem: 'Eventos disponíveis para o hóspede listados com sucesso.',
            data: eventos
        }));

    } catch (err) {
        console.error('Erro ao listar eventos para hóspede:', err);
        return res.status(500).json(respostaHelper({
            status: 500,
            mensagem: 'Erro ao listar eventos para hóspede.',
            errors: [err.message]
        }));
    }
};


