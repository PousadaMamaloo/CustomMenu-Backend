import express from "express";
import dotenv from "dotenv";
import sequelize from './config/database.js';
import bodyParser from 'body-parser';
//import cors from 'cors';

import quartoRotas from './rotas/quartoRotas.js';
import hospedeRotas from './rotas/hospedeRotas.js'; // Se quiser já importar

import bcrypt from 'bcryptjs';

const hash = await bcrypt.hash('81999998888', 10);
console.log(hash);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
//app.use(cors());
app.use(bodyParser.json());

// Rota de teste
app.get("/", (req, res) => {
  res.send("Finalmente saiu nosso Hello World! 🚀");
});

// Rotas da API
app.use('/api/quartos', quartoRotas);
app.use('/api/hospedes', hospedeRotas); // Rota para login e CRUD de hóspedes

// Teste de conexão com o banco
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar no banco:', error.message);
  }
})();

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});