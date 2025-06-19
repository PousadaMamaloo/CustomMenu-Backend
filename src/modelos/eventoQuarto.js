import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EventoQuarto = sequelize.define('EventoQuarto', {
  id_evento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_quarto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  }
}, {
  tableName: 'tab_re_evento_quarto',
  schema: 'mamaloo',
  timestamps: false
});

export default EventoQuarto;
