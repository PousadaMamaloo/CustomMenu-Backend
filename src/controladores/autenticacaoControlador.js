import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Quarto from '../modelos/quarto.js';
import Hospede from '../modelos/hospede.js';
import respostaHelper from '../utilitarios/helpers/respostaHelper.js';

const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-jwt';
const JWT_EXPIRES_IN = '1d';

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

    const hospede = await Hospede.findOne({
      where: {
        id_hospede: quarto.id_hospede_responsavel
      }
    });

    if (!hospede) {
      return res.status(404).json(respostaHelper({
        status: 404,
        message: 'Hóspede responsável não encontrado.'
      }));
    }

    const senhaValida = await bcrypt.compare(telef_hospede, hospede.senha_hash);

    if (!senhaValida) {
      return res.status(401).json(respostaHelper({
        status: 401,
        message: 'Telefone incorreto.'
      }));
    }

    const payload = {
      id_hospede: hospede.id_hospede,
      nome: hospede.nome_hospede,
      num_quarto,
      role: 'hospede'
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Login realizado com sucesso.',
      data: { token }
    }));

  } catch (err) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro interno ao realizar login.',
      errors: [err.message]
    }));
  }
};
