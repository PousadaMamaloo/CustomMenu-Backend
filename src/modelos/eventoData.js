import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EventoData = sequelize.define('EventoData', {
  id_evento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  data_evento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    primaryKey: true
  }
}, {
  tableName: 'tab_re_evento_data',
  schema: 'mamaloo',
  timestamps: false
});

export default EventoData;
