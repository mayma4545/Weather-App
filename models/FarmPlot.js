const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FarmPlot = sequelize.define('FarmPlot', {
  plot_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  plot_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  area_size: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'farm_plots',
  timestamps: true,
  underscored: true
});

module.exports = FarmPlot;
