import jwt from 'jsonwebtoken';
import {respostaHelper} from '../helpers/respostaHelper.js';

const autenticador = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json(
            respostaHelper({
                status: 'Erro',
                message: 'Erro ao realizar a consulta!',
                errors: [{ msg: 'Token não fornecido.' }],
            })
        );
    }

    try {
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET || 'seu-segredo-jwt');
        req.user = decoded;
        next();
    } catch (error) {
        const msg = error.name === 'TokenExpiredError' ? 'Token expirado.' : 'Token inválido.';
        return res.status(401).json(
            respostaHelper({
                status: 'Erro',
                message: 'Erro ao realizar a consulta!',
                errors: [{ msg }],
            })
        );
    }
};

export default autenticador;