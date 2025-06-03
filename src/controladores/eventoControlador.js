import Evento from '../modelos/evento.js';
import Item from '../modelos/item.js'; // Importar Item
// Remover import de RestricaoAlimentar
import sequelize from '../config/database.js';
import { validationResult } from 'express-validator';
import Horario from '../modelos/horario.js';
import { respostaHelper } from '../utilitarios/helpers/respostaHelper.js'; // Importar helper de resposta

// Função para listar todos os eventos (mantida como estava)
export const listarEventos = async (req, res) => {
    try {
        // A query original busca eventos com horários agregados.
        // Mantendo a lógica original para esta rota específica.
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

// Função para listar itens de um evento específico (SEM RESTRIÇÕES ALIMENTARES)
export const listarItensPorEvento = async (req, res) => {
    const { id } = req.params;

    try {
        const evento = await Evento.findByPk(id, {
            include: [{
                model: Item,
                as: 'Itens', // Alias definido na associação Evento -> Item
                attributes: ['id_item', 'nome_item', 'valor_item', 'qntd_max_hospede', 'categ_item'], // Campos específicos do Item
                through: { attributes: [] } // Não incluir atributos da tabela de junção Evento-Item
                // Remover include aninhado para RestricaoAlimentar
            }]
        });

        if (!evento) {
            return res.status(404).json(respostaHelper({
                status: 404,
                mensagem: 'Evento não encontrado.'
            }));
        }

        // Formatar a resposta para corresponder ao requisito (SEM RESTRIÇÕES)
        const itensFormatados = evento.Itens ? evento.Itens.map(item => ({
            id_item: item.id_item,
            nome_item: item.nome_item,
            valor_item: item.valor_item,
            qntd_max_hospede: item.qntd_max_hospede,
            categoria: item.categ_item // Renomear para 'categoria'
            // Remover campo 'restricoes'
        })) : [];

        return res.status(200).json(respostaHelper({
            status: 200,
            mensagem: 'Itens do evento listados com sucesso.',
            data: itensFormatados // Retorna array vazio se não houver itens
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


// Função para criar evento (mantida como estava, mas usando respostaHelper)
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

    const t = await sequelize.transaction(); // Iniciar transação

    try {
        const evento = await Evento.create({ nome_evento, desc_evento, sts_evento }, { transaction: t });

        if (horarios && horarios.length > 0) {
            for (const horario of horarios) {
                let [hor, created] = await Horario.findOrCreate({
                    where: { horario },
                    transaction: t
                });
                // Usar método de associação do Sequelize se disponível, ou query bruta
                // Exemplo com query bruta (ajustar se houver método Sequelize)
                await sequelize.query(`
                    INSERT INTO mamaloo.tab_re_evento_horario (id_evento, id_horario)
                    VALUES (:id_evento, :id_horario)
                `, {
                    replacements: { id_evento: evento.id_evento, id_horario: hor.id_horario },
                    transaction: t
                });
            }
        }

        await t.commit(); // Commit da transação

        return res.status(201).json(respostaHelper({
            status: 201,
            mensagem: 'Evento criado com sucesso.',
            data: { id_evento: evento.id_evento }
        }));
    } catch (err) {
        await t.rollback(); // Rollback em caso de erro
        console.error("Erro ao criar evento:", err);
        return res.status(500).json(respostaHelper({
            status: 500,
            mensagem: 'Erro ao criar evento.',
            errors: [err.message]
        }));
    }
};

// Função para atualizar evento (mantida como estava, mas usando respostaHelper e transação)
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

    const t = await sequelize.transaction(); // Iniciar transação

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

        // Remover horários antigos
        await sequelize.query(`
            DELETE FROM mamaloo.tab_re_evento_horario WHERE id_evento = :id_evento
        `, { replacements: { id_evento: id }, transaction: t });

        // Adicionar novos horários
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

        await t.commit(); // Commit da transação

        return res.status(200).json(respostaHelper({
            status: 200,
            mensagem: 'Evento atualizado com sucesso.'
        }));
    } catch (err) {
        await t.rollback(); // Rollback em caso de erro
        console.error(`Erro ao atualizar evento ${id}:`, err);
        return res.status(500).json(respostaHelper({
            status: 500,
            mensagem: 'Erro ao atualizar evento.',
            errors: [err.message]
        }));
    }
};

// Função para excluir evento (mantida como estava, mas usando respostaHelper e transação)
export const excluirEvento = async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction(); // Iniciar transação

    try {
        const evento = await Evento.findByPk(id, { transaction: t });
        if (!evento) {
            await t.rollback();
            return res.status(404).json(respostaHelper({
                status: 404,
                mensagem: 'Evento não encontrado.'
            }));
        }

        // Remover associações primeiro (ex: horários, itens se houver cascade configurado ou manualmente)
        await sequelize.query(`
            DELETE FROM mamaloo.tab_re_evento_horario WHERE id_evento = :id_evento
        `, { replacements: { id_evento: id }, transaction: t });
        
        // Adicionar aqui a remoção de associações com itens, se necessário
        // await sequelize.query(`DELETE FROM mamaloo.tab_re_evento_item WHERE id_evento = :id_evento`, { replacements: { id_evento: id }, transaction: t });

        await evento.destroy({ transaction: t });

        await t.commit(); // Commit da transação

        return res.status(200).json(respostaHelper({
            status: 200,
            mensagem: 'Evento excluído com sucesso.'
        }));
    } catch (err) {
        await t.rollback(); // Rollback em caso de erro
        console.error(`Erro ao excluir evento ${id}:`, err);
        return res.status(500).json(respostaHelper({
            status: 500,
            mensagem: 'Erro ao excluir evento.',
            errors: [err.message]
        }));
    }
};
