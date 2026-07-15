const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CropRepository = sequelize.define('CropRepository', {
  crop_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  crop_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ideal_temp_min: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  ideal_temp_max: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  rain_tolerance: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false
  },
  days_to_harvest: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  best_practices: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  growth_stages: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  vulnerabilities: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'crop_repository',
  timestamps: true,
  underscored: true
});

module.exports = CropRepository;
