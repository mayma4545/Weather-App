const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PlantingRecord = sequelize.define('PlantingRecord', {
  record_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  plot_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'farm_plots',
      key: 'plot_id'
    }
  },
  crop_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'crop_repository',
      key: 'crop_id'
    }
  },
  planting_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Growing'
  },
  health_status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Healthy'
  }
}, {
  tableName: 'planting_records',
  timestamps: true,
  underscored: true
});

module.exports = PlantingRecord;
