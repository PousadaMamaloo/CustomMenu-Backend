import express from "express";
import dotenv from "dotenv";
import sequelize from './config/database.js';
import bodyParser from 'body-parser';
import cors from 'cors';

import quartoRotas from './rotas/quartoRotas.js';
import hospedeRotas from './rotas/hospedeRotas.js';
import administradorRotas from './rotas/administradorRotas.js';
import itemRotas from './rotas/itemRotas.js';
import eventoRotas from './rotas/eventoRotas.js';
import eventoItemRotas from './rotas/eventoItemRotas.js';
import './modelos/associacoes.js';
import pedidoRotas from './rotas/pedidoRotas.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Finalmente saiu nosso Hello World! 🚀");
});

app.use('/api/quartos', quartoRotas);
app.use('/api/hospedes', hospedeRotas);
app.use('/api/administrador', administradorRotas);
app.use('/api/itens', itemRotas);
app.use('/api/eventos', eventoRotas);
app.use('/api/eventoItem', eventoItemRotas);
app.use('/api/pedidos', pedidoRotas);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar no banco:', error.message);
  }
})();

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

