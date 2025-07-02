import { respostaHelper } from '../utilitarios/helpers/respostaHelper.js';
import sequelize from '../config/database.js';
import { QueryTypes } from 'sequelize';
import EventoItem from '../modelos/eventoItem.js';
import Evento from '../modelos/evento.js';
import Item from '../modelos/item.js';

export const associarItemEvento = async (req, res) => {
  const { id_evento, id_item, disp_item } = req.body;

  try {
    await EventoItem.create({ id_evento, id_item, disp_item });

    return res.status(201).json(respostaHelper({
      status: 201,
      message: 'Item associado ao evento com sucesso!'
    }));
  } catch (err) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao associar item ao evento.',
      errors: [err.message]
    }));
  }
};

export const listarAssociacoes = async (req, res) => {
  try {
    const associacoes = await EventoItem.findAll();
    return res.status(200).json(respostaHelper({
      status: 200,
      data: associacoes,
      message: 'Associações listadas com sucesso!'
    }));
  } catch (err) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao listar associações.',
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
