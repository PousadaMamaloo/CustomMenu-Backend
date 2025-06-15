import EventoItem from '../modelos/eventoItem.js';
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
      errors: err.message
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
      errors: err.message
    }));
  }
};
