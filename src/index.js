import express from "express";
import dotenv from "dotenv";
import sequelize from './config/database.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import quartoRotas from './rotas/quartoRotas.js';
import hospedeRotas from './rotas/hospedeRotas.js';
import administradorRotas from './rotas/administradorRotas.js';
import itemRotas from './rotas/itemRotas.js';
import eventoRotas from './rotas/eventoRotas.js';
import eventoItemRotas from './rotas/eventoItemRotas.js';
import relatorioRotas from './rotas/relatorioRotas.js';
import pedidoRotas from './rotas/pedidoRotas.js';
import autenticacaoRotas from './rotas/autenticacaoRotas.js';
import './modelos/associacoes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(cookieParser());

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.get("/", (req, res) => {
  res.send("Testando o get princiapl com mudança!");
});

app.use('/api/quartos', quartoRotas);
app.use('/api/hospedes', hospedeRotas);
app.use('/api/administrador', administradorRotas);
app.use('/api/itens', itemRotas); // relatorio do evento ficaria aqui 
app.use('/api/eventos', eventoRotas);
app.use('/api/eventoItem', eventoItemRotas);
app.use('/api/pedidos', pedidoRotas);
// app.use('/admin/relatorios', relatorioRotas); DEIXARIA DE EXISTIR
app.use('/api/auth', autenticacaoRotas);

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
