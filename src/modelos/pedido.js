import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Horario from './horario.js';

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
    id_horario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Horario,
            key: 'id_horario'
        }
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

Pedido.belongsTo(Horario, { foreignKey: 'id_horario' });

export default Pedido;