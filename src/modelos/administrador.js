import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Administrador = sequelize.define('Administrador', {
  id_admin: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  usuario_admin: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senha_hash: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'tab_admin',
  schema: 'mamaloo',
  timestamps: false
});

export default Administrador;
