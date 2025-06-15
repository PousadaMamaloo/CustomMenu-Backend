import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const itemPedido = sequelize.define('itemPedido', {
    id_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_item: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    qntd_item: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    tableName: 'tab_re_item_pedido',
    schema: 'mamaloo',
    timestamps: false
});

export default itemPedido;
