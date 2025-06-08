import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Item from './item.js'; 

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
  }
}, {
  tableName: 'tab_evento',
  schema: 'mamaloo',
  timestamps: false
});

export default Evento;