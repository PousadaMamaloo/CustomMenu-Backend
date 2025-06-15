import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EventoItem = sequelize.define('EventoItem', {
  id_evento: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_item: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  disp_item: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: true
  }
}, {
  tableName: 'tab_re_evento_item',
  schema: 'mamaloo',
  timestamps: false
});

export default EventoItem;
