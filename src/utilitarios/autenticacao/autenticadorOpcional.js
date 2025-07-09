import jwt from "jsonwebtoken";
import tokenBlacklist from "./tokenBlacklist.js";

/**
 * @description Middleware para autenticação opcional. Tenta validar um token, se presente e válido, e anexa os dados do usuário ao 'req.user'. 
 * Se o token não existir, for inválido ou estiver na blacklist, a requisição continua sem um usuário autenticado, sem gerar erro.
 */

const autenticadorOpcional = (req, res, next) => {
  const token =
    (req.cookies && req.cookies.token) ||
    (req.headers["authorization"]?.startsWith("Bearer ")
      ? req.headers["authorization"].slice(7)
      : req.headers["authorization"]);

  if (!token) {
    return next();
  }

  if (tokenBlacklist.isTokenBlacklisted(token)) {
    console.warn("Token na blacklist ignorado durante a validação opcional.");
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "seu-segredo-jwt");
    req.user = decoded;
  } catch (error) {
    console.warn("Token inválido ou expirado ignorado durante a validação opcional.");
  }

  next();
};

export default autenticadorOpcional;