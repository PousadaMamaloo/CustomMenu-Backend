import Hospede from '../modelos/hospede.js';
import Quarto from '../modelos/quarto.js';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { respostaHelper } from '../utilitarios/helpers/respostaHelper.js';

const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-jwt';
const JWT_EXPIRES = '1h';

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

    const hoje = new Date();
    const dataChegada = new Date(hospede.data_chegada);
    const dataSaida = new Date(hospede.data_saida);

    if (hoje < dataChegada || hoje > dataSaida) {
      return res.status(403).json(respostaHelper({
        status: 403,
        message: 'Sua estadia não está ativa. Acesso negado!'
      }));
    }

    const token = jwt.sign({
      id_hospede: hospede.id_hospede,
      nome: hospede.nome_hospede,
      num_quarto: quarto.num_quarto,
      role: 'hospede'
    }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    });

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Login realizado com sucesso.'
    }));

  } catch (error) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro interno ao realizar login.',
      errors: [error.message]
    }));
  }
};

export const criarHospede = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id_quarto, nome_hospede, email_hospede, telef_hospede, data_chegada, data_saida } = req.body;

    if (!id_quarto) {
      await t.rollback();
      return res.status(400).json(respostaHelper({
        status: 400,
        message: 'O ID do quarto (id_quarto) é obrigatório para criar e associar um hóspede.'
      }));
    }

    const quarto = await Quarto.findByPk(id_quarto, { transaction: t });

    if (!quarto) {
      await t.rollback();
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Quarto não encontrado.'
      }));
    }

    if (quarto.id_hospede_responsavel) {
      await t.rollback();
      return res.status(409).json(respostaHelper({
        status: 409,
        message: 'Este quarto já possui um hóspede responsável.'
      }));
    }

    const senha_hash = await bcrypt.hash(telef_hospede, 10);

    const novoHospede = await Hospede.create({
      nome_hospede,
      email_hospede,
      telef_hospede,
      data_chegada,
      data_saida,
      senha_hash
    }, { transaction: t });

    quarto.id_hospede_responsavel = novoHospede.id_hospede;
    await quarto.save({ transaction: t });

    await t.commit();

    return res.status(201).json(respostaHelper({
      status: 201,
      message: 'Hóspede criado e associado ao quarto com sucesso!',
      data: {}
    }));

  } catch (error) {
    await t.rollback();
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro interno ao criar hóspede.',
      errors: [error.message]
    }));
  }
};

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

export const atualizarHospede = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;
    const { id_quarto: novoQuartoId, ...outrosDados } = dadosAtualizados;

    const hospede = await Hospede.findByPk(id, { transaction: t });
    if (!hospede) {
      await t.rollback();
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Hóspede não encontrado para atualizar.'
      }));
    }

    if (outrosDados.telef_hospede) {
      outrosDados.senha_hash = await bcrypt.hash(outrosDados.telef_hospede, 10);
    }

    await hospede.update(outrosDados, { transaction: t });

    if (novoQuartoId) {
      const quartoAntigo = await Quarto.findOne({ where: { id_hospede_responsavel: id }, transaction: t });
      const novoQuarto = await Quarto.findByPk(novoQuartoId, { transaction: t });

      if (!novoQuarto) {
        await t.rollback();
        return res.status(404).json(respostaHelper({ status: 404, message: `O novo quarto com ID ${novoQuartoId} não foi encontrado.` }));
      }

      if (novoQuarto.id_hospede_responsavel && novoQuarto.id_hospede_responsavel !== id) {
        await t.rollback();
        return res.status(409).json(respostaHelper({ status: 409, message: 'O novo quarto já está ocupado por outro hóspede.' }));
      }

      if (quartoAntigo && quartoAntigo.id_quarto !== novoQuarto.id_quarto) {
        quartoAntigo.id_hospede_responsavel = null;
        await quartoAntigo.save({ transaction: t });
      }

      novoQuarto.id_hospede_responsavel = id;
      await novoQuarto.save({ transaction: t });
    }

    await t.commit();

    const hospedeAtualizado = await Hospede.findByPk(id);

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Hóspede atualizado com sucesso.'
    }));

  } catch (error) {
    await t.rollback();
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao atualizar hóspede.',
      errors: [error.message]
    }));
  }
};

export const deletarHospede = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const hospede = await Hospede.findByPk(id, { transaction: t });

    if (!hospede) {
      await t.rollback();
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Hóspede não encontrado para exclusão.'
      }));
    }

    const quartoAssociado = await Quarto.findOne({
      where: { id_hospede_responsavel: id },
      transaction: t
    });

    if (quartoAssociado) {
      quartoAssociado.id_hospede_responsavel = null;
      await quartoAssociado.save({ transaction: t });
    }

    await hospede.destroy({ transaction: t });

    await t.commit();

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Hóspede excluído e quarto desassociado com sucesso.'
    }));
  } catch (error) {
    await t.rollback();
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro ao excluir hóspede.',
      errors: [error.message]
    }));
  }
};
