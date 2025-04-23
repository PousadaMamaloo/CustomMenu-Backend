import express from "express";
import dotenv from "dotenv";
import sequelize from './config/database.js'; 

import bodyParser from 'body-parser';
import quartoRotas from './rotas/quartoRotas.js'; 


dotenv.config();

const app = express();
const PORT = 3000;


app.get("/", (req, res) => {
  res.send("Finalmente saiu nosso Hello World! 🚀");
});

app.use(bodyParser.json()); 

app.use('/api', quartoRotas); 

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
