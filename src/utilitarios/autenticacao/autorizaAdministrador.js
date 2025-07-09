/**
 * @description Middleware de autorização que restringe o acesso a uma rota apenas para usuários com o papel (role) de 'administrador'. 
 * Deve ser usado após um middleware de autenticação.
 */

export default function autorizaAdministrador(req, res, next) {
  if (req.user && req.user.role === 'administrador') {
    return next();
  }
  return res.status(403).json({
    status: 'erro',
    mensagem: 'Acesso restrito: apenas administradores podem realizar esta ação.',
    dados: {}
  });
}