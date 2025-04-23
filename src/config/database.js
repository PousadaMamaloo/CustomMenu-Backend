import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log,
});

try {
  await sequelize.authenticate();
  console.log('✅ Conectado ao PostgreSQL com sucesso!');
} catch (err) {
  console.error('❌ Erro ao conectar no PostgreSQL:', err);
}

export default sequelize;
