import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

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

export default Item;
