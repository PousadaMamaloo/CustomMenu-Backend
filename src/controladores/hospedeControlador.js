import Hospede from '../modelos/hospede.js';
import Quarto from '../modelos/quarto.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {respostaHelper} from '../utilitarios/helpers/respostaHelper.js';

const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-jwt';
const JWT_EXPIRES = '1d';

// 🔐 LOGIN
export const loginHospede = async (req, res) => {
  const { num_quarto, telef_hospede } = req.body;

  try {
    const quarto = await Quarto.findOne({ where: { num_quarto } });

    if (!quarto || !quarto.id_hospede_responsavel) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Quarto não encontrado ou sem hóspede responsável.'
      }));
    }

    const hospede = await Hospede.findByPk(quarto.id_hospede_responsavel);

    if (!hospede) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Hóspede responsável não encontrado.'
      }));
    }

    const senhaCorreta = await bcrypt.compare(telef_hospede, hospede.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).json(respostaHelper({
        status: 401,
        message: 'Telefone incorreto.'
      }));
    }

    const token = jwt.sign({
      id_hospede: hospede.id_hospede,
      nome: hospede.nome_hospede,
      num_quarto: quarto.num_quarto,
      role: 'hospede'
    }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Login realizado com sucesso.',
      data: { token }
    }));

  } catch (error) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro interno ao realizar login.',
      errors: [error.message]
    }));
  }
};

// 🧾 CRIAR
export const criarHospede = async (req, res) => {
  try {
    const { nome_hospede, email_hospede, telef_hospede, data_chegada, data_saida } = req.body;

    const senha_hash = await bcrypt.hash(telef_hospede, 10);

    const novo = await Hospede.create({
      nome_hospede,
      email_hospede,
      telef_hospede,
      data_chegada,
      data_saida,
      senha_hash
    });

    return res.status(201).json(respostaHelper({
      status: 201,
      message: 'Hóspede criado com sucesso.',
      data: novo
    }));

  } catch (error) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao criar hóspede.',
      errors: [error.message]
    }));
  }
};

// 📋 LISTAR TODOS
export const listarHospedes = async (req, res) => {
  try {
    const hospedes = await Hospede.findAll();
    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Lista de hóspedes.',
      data: hospedes
    }));
  } catch (error) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao listar hóspedes.',
      errors: [error.message]
    }));
  }
};

// 🔍 BUSCAR POR ID
export const buscarHospedePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const hospede = await Hospede.findByPk(id);

    if (!hospede) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Hóspede não encontrado.'
      }));
    }

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Hóspede encontrado.',
      data: hospede
    }));
  } catch (error) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao buscar hóspede.',
      errors: [error.message]
    }));
  }
};

// ✏️ ATUALIZAR
export const atualizarHospede = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;

    if (dadosAtualizados.telef_hospede) {
      dadosAtualizados.senha_hash = await bcrypt.hash(dadosAtualizados.telef_hospede, 10);
    }

    const [linhasAfetadas] = await Hospede.update(dadosAtualizados, {
      where: { id_hospede: id }
    });

    if (linhasAfetadas === 0) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Hóspede não encontrado para atualizar.'
      }));
    }

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Hóspede atualizado com sucesso.'
    }));

  } catch (error) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao atualizar hóspede.',
      errors: [error.message]
    }));
  }
};

// 🗑 DELETAR
export const deletarHospede = async (req, res) => {
  try {
    const { id } = req.params;

    const linhasRemovidas = await Hospede.destroy({
      where: { id_hospede: id }
    });

    if (linhasRemovidas === 0) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Hóspede não encontrado para exclusão.'
      }));
    }

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Hóspede excluído com sucesso.'
    }));
  } catch (error) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao excluir hóspede.',
      errors: [error.message]
    }));
  }
};
