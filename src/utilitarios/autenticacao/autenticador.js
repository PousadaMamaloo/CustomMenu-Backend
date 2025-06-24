import jwt from "jsonwebtoken";
import { respostaHelper } from "../helpers/respostaHelper.js";
import tokenBlacklist from "./tokenBlacklist.js";

const autenticador = (req, res, next) => {
  const token =
    (req.cookies && req.cookies.token) ||
    (req.headers["authorization"]?.startsWith("Bearer ")
      ? req.headers["authorization"].slice(7)
      : req.headers["authorization"]);

  if (!token) {
    return res.status(401).json(
      respostaHelper({
        status: "Erro",
        message: "Erro ao realizar a consulta!",
        errors: [{ msg: "Token não fornecido." }],
      })
    );
  }

  if (tokenBlacklist.isTokenBlacklisted(token)) {
    return res.status(401).json(
      respostaHelper({
        status: "Erro",
        message: "Erro ao realizar a consulta!",
        errors: [{ msg: "Token invalidado (logout)." }],
      })
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "seu-segredo-jwt");
    req.user = decoded;
    next();
  } catch (error) {
    const msg = error.name === "TokenExpiredError" ? "Token expirado." : "Token inválido.";
    return res.status(401).json(
      respostaHelper({
        status: "Erro",
        message: "Erro ao realizar a consulta!",
        errors: [{ msg }],
      })
    );
  }
};

export default autenticador;


