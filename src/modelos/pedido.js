import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Pedido = sequelize.define('Pedido', {
    id_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true, autoIncrement: true
    },
    id_quarto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_evento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data_pedido: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    horario_cafe_manha: {
        type: DataTypes.TIME,
        allowNull: true
    },
    obs_pedido: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
}, {
    tableName: 'tab_pedido',
    schema: 'mamaloo',
    timestamps: false
});

export default Pedido;