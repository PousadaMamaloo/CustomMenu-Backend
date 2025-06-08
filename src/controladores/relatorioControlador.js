import Evento from '../modelos/evento.js';
import Item from '../modelos/item.js';
import Pedido from '../modelos/pedido.js';
import ItemPedido from '../modelos/itemPedido.js';
import sequelize from '../config/database.js';
import { respostaHelper } from '../utilitarios/helpers/respostaHelper.js';
import { QueryTypes } from 'sequelize';

export const gerarRelatorioPorEvento = async (req, res) => {
    const { idEvento } = req.params;

    try {
        // Verificar se o evento existe
        const evento = await Evento.findByPk(idEvento);
        if (!evento) {
            return res.status(404).json(respostaHelper({
                status: 404,
                mensagem: 'Evento não encontrado.'
            }));
        }

        // Query SQL com JOIN e GROUP BY para consolidar os dados por item
        const query = `
            SELECT 
                i.nome_item AS item,
                i.categ_item AS categoria,
                SUM(ip.qntd_item) AS quantidade,
                SUM(ip.qntd_item * i.valor_item) AS valor_total
            FROM 
                mamaloo.tab_pedido p
                JOIN mamaloo.tab_re_item_pedido ip ON p.id_pedido = ip.id_pedido
                JOIN mamaloo.tab_item i ON ip.id_item = i.id_item
            WHERE 
                p.id_evento = :idEvento
            GROUP BY 
                i.nome_item, i.categ_item
            ORDER BY 
                i.categ_item, i.nome_item
        `;

        const resultado = await sequelize.query(query, {
            replacements: { idEvento },
            type: QueryTypes.SELECT
        });

        // Formatar a resposta conforme o padrão solicitado
        const relatorio = {
            evento: evento.nome_evento,
            dados: resultado.map(item => ({
                item: item.item,
                quantidade: parseInt(item.quantidade),
                categoria: item.categoria,
                valor_total: parseFloat(item.valor_total)
            }))
        };

        return res.status(200).json(respostaHelper({
            status: 200,
            mensagem: 'Relatório gerado com sucesso.',
            data: relatorio
        }));
    } catch (err) {
        console.error(`Erro ao gerar relatório para o evento ${idEvento}:`, err);
        return res.status(500).json(respostaHelper({
            status: 500,
            mensagem: 'Erro ao gerar relatório.',
            errors: [err.message]
        }));
    }
};
