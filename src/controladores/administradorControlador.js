import Administrador from '../modelos/administrador.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { respostaHelper } from '../utilitarios/helpers/respostaHelper.js';

const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-jwt';
const JWT_EXPIRES = '1d';

export const loginAdministrador = async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    const admin = await Administrador.findOne({ where: { usuario_admin: usuario } });

    if (!admin) {
      return res.status(401).json(respostaHelper({
        status: 401,
        message: 'Usuário ou senha inválidos.'
      }));
    }

    const senhaCorreta = await bcrypt.compare(senha, admin.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).json(respostaHelper({
        status: 401,
        message: 'Usuário ou senha inválidos.'
      }));
    }

    const token = jwt.sign({
      id_administrador: admin.id_administrador,
      usuario: admin.usuario_admin,
      role: 'administrador'
    }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json(respostaHelper({
      status: 200,
      message: 'Login realizado com sucesso.',
      data: {
        usuario: admin.usuario_admin
      }
    }));

  } catch (error) {
    return res.status(500).json(respostaHelper({
      status: 500,
      message: 'Erro interno ao realizar login.',
      errors: [error.message]
    }));
  }
};
