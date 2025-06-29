import jwt from "jsonwebtoken";
import tokenBlacklist from "./tokenBlacklist.js";

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
    req.user = decoded; // Se for válido, anexa o usuário.
  } catch (error) {
    console.warn("Token inválido ou expirado ignorado durante a validação opcional.");
  }

  next();
};

export default autenticadorOpcional;