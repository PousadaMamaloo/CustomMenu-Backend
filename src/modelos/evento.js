import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Item from './item.js'; // Importar Item para definir a associação

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

// Definir a associação Many-to-Many com Item
// Assumindo que a tabela de junção é 'tab_re_evento_item'
// e as chaves estrangeiras são 'id_evento' e 'id_item'
Evento.belongsToMany(Item, {
  through: 'tab_re_evento_item',
  foreignKey: 'id_evento',
  otherKey: 'id_item',
  as: 'Itens' // Alias para acessar os itens associados
});

export default Evento;

