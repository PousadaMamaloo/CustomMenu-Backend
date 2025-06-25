import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Evento = sequelize.define('Evento', {
  id_evento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome_evento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  desc_evento: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sts_evento: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  recorrencia: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  publico_alvo: {
    type: DataTypes.BOOLEAN, 
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'tab_evento',
  schema: 'mamaloo',
  timestamps: false
});

export default Evento;