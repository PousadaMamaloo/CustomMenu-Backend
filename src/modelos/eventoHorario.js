import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EventoHorario = sequelize.define('EventoHorario', {
  id_evento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  id_horario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  }
}, {
  tableName: 'tab_re_evento_horario',
  schema: 'mamaloo',
  timestamps: false,
});

export default EventoHorario;
