import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Variáveis de conexão:');
console.log('DB:', process.env.POSTGRES_DB);
console.log('HOST:', process.env.POSTGRES_HOST);
console.log('PORT:', process.env.POSTGRES_PORT);

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    port: Number(process.env.POSTGRES_PORT),
    logging: console.log,
  }
);

try {
  await sequelize.authenticate();
  console.log('✅ Conectado ao PostgreSQL com sucesso!');
} catch (err) {
  console.error('❌ Erro ao conectar no PostgreSQL:', err);
}

export default sequelize;
