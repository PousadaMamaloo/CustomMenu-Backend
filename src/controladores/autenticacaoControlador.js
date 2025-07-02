import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Quarto from '../modelos/quarto.js';
import Hospede from '../modelos/hospede.js';
import { respostaHelper } from '../utilitarios/helpers/respostaHelper.js';
import tokenBlacklist from '../utilitarios/autenticacao/tokenBlacklist.js';

const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-jwt';
const JWT_EXPIRES_IN = '1h';

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
      where: { id_hospede: quarto.id_hospede_responsavel }
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

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    });

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Login realizado com sucesso.',
      data: {
        usuario: hospede.nome_hospede,
        id_quarto: quarto.id_quarto,
        num_quarto: quarto.num_quarto
      }
    }));

  } catch (err) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro interno ao realizar login.',
      errors: [err.message]
    }));
  }
};

export const logout = async (req, res) => {
  try {
  
    const token =
      (req.cookies && req.cookies.token) ||
      (req.headers['authorization']?.startsWith('Bearer ')
        ? req.headers['authorization'].slice(7)
        : req.headers['authorization']);

    if (!token) {
      return res.status(400).json(respostaHelper({
        status: 400,
        message: 'Token não fornecido para logout.'
      }));
    }

    
    const decoded = jwt.decode(token);
    
    if (!decoded || !decoded.exp) {
      return res.status(400).json(respostaHelper({
        status: 400,
        message: 'Token inválido para logout.'
      }));
    }

    
    tokenBlacklist.addToken(token, decoded.exp);

    
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Logout realizado com sucesso.'
    }));

  } catch (err) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro interno ao realizar logout.',
      errors: [err.message]
    }));
  }
};



export const validarToken = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json(respostaHelper({
        status: 401,
        message: "Acesso não autorizado.",
        errors: [{ msg: "Token não fornecido ou inválido." }]
      }));
    }

    return res.status(200).json(respostaHelper({
      status: 200,
      message: "Token JWT válido.",
      data: { usuario: req.user }
    }));

  } catch (error) {
    console.error("Erro interno ao validar token:", error); 
    return res.status(500).json(respostaHelper({
      status: 500,
      message: "Erro interno do servidor ao validar o token.",
      errors: [error.message]
    }));
  }
};


