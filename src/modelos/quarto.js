import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const Quarto = sequelize.define('Quarto', {
  id_quarto: {
    type: DataTypes.INTEGER,
    defaultValue: Sequelize.literal("nextval('mamaloo.seq_tab_quarto')"),
    primaryKey: true,
    allowNull: false,
  },
  num_quarto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, 
  },
  capa_adultos: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0, 
    },
  },
  capa_criancas: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  id_hospede_responsavel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tab_hospede',
      key: 'id_hospede',
    },
  },
}, {
  tableName: 'tab_quarto',
  schema: 'mamaloo',

  timestamps: false, 
  validate: {
    // Validações adicionais
    capa_adultos_min: function() {
      if (this.capa_adultos < 0) {
        throw new Error('A capacidade de adultos não pode ser negativa');
      }
    },
    capa_criancas_min: function() {
      if (this.capa_criancas < 0) {
        throw new Error('A capacidade de crianças não pode ser negativa');
      }
    },
  },
});

export default Quarto;
