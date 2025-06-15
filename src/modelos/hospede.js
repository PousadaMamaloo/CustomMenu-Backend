import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Hospede = sequelize.define('Hospede', {
  id_hospede: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome_hospede: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email_hospede: DataTypes.STRING,
  telef_hospede: DataTypes.STRING,
  data_chegada: DataTypes.DATE,
  data_saida: DataTypes.DATE,
  senha_hash: DataTypes.TEXT
}, {
  tableName: 'tab_hospede',
  schema: 'mamaloo',
  timestamps: false
});

export default Hospede;
