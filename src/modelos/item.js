import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Evento from './evento.js'; // Importar Evento para definir a associação
// Remover import de RestricaoAlimentar

const Item = sequelize.define('Item', {
  id_item: {
    type: DataTypes.INTEGER,
    defaultValue: Sequelize.literal("nextval('mamaloo.seq_tab_item')"), 
    primaryKey: true,
    allowNull: false,
  },
  nome_item: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  desc_item: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  foto_item: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  categ_item: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'categ_item', // Explicitamente mapear para o campo do banco, se necessário
    set(value) {
        if (typeof value === 'string') {
            const formatado = value.toLowerCase().replace(/^\w/, c => c.toUpperCase());
            this.setDataValue('categ_item', formatado);
        } else {
            this.setDataValue('categ_item', value);
        }
    }
  },
  qntd_max_hospede: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  valor_item: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: true,
  },
}, {
  tableName: 'tab_item',
  schema: 'mamaloo',
  timestamps: false,
});

// Associação Many-to-Many com Evento
Item.belongsToMany(Evento, {
  through: 'tab_re_evento_item',
  foreignKey: 'id_item',
  otherKey: 'id_evento',
  as: 'Eventos' // Alias para acessar os eventos associados
});

// Remover Associação Many-to-Many com RestricaoAlimentar

export default Item;

