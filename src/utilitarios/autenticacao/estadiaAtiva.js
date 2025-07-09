import Hospede from '../modelos/hospede.js';

/**
 * @description Middleware que verifica se a estadia do hóspede autenticado está ativa, comparando a data atual com as datas de chegada e saída. 
 * Deve ser usado após um middleware de autenticação.
 */

export const verificaEstadiaAtiva = async (req, res, next) => {
  try {
    const { id_hospede } = req.user;

    const hospede = await Hospede.findByPk(id_hospede);
    if (!hospede) {
      return res.status(401).json({ message: 'Hóspede não encontrado.' });
    }

    const hoje = new Date();
    const dataChegada = new Date(hospede.data_chegada);
    const dataSaida = new Date(hospede.data_saida);

    if (hoje < dataChegada || hoje > dataSaida) {
      return res.status(403).json({
        message: 'Sua estadia não está ativa. Acesso negado!'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao validar estadia.' });
  }
};