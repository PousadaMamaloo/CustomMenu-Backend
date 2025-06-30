import EventoItem from '../modelos/eventoItem.js';
import Evento from '../modelos/evento.js'; // Importar o modelo Evento
import Item from '../modelos/item.js'; // Importar o modelo Item
import { respostaHelper } from '../utilitarios/helpers/respostaHelper.js';

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

/**
 * @description Lista todas as associações cruas entre eventos e itens.
 */
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

/**
 * @description Busca um evento pelo ID e lista todos os itens associados a ele.
 * Esta é a função que o hóspede usará.
 */
export const listarItensPorEvento = async (req, res) => {
  try {
    const { id_evento } = req.params; // Pega o ID do evento da URL

    const evento = await Evento.findByPk(id_evento, {
      include: [{
        model: Item,
        as: 'Itens', 
        through: { attributes: [] } 
      }]
    });

    if (!evento) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Evento não encontrado.'
      }));
    }

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Itens do evento listados com sucesso!',
      data: evento.Itens 
    }));

  } catch (err) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao listar os itens do evento.',
      errors: [err.message]
    }));
  }
};
