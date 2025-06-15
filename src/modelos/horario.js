import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Horario = sequelize.define('Horario', {
  id_horario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  horario: {
    type: DataTypes.TIME,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'tab_horario',
  schema: 'mamaloo',
  timestamps: false
});

export default Horario;
