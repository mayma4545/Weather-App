const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SoilProfile = sequelize.define('SoilProfile', {
  soil_profile_id: {
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
  soil_type: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['Clay', 'Clay Loam', 'Silt Loam', 'Sandy Loam', 'Sandy']]
    }
  },
  ph: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: true
  },
  nitrogen_level: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['Low', 'Medium', 'High']]
    }
  },
  phosphorus_level: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['Low', 'Medium', 'High']]
    }
  },
  potassium_level: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['Low', 'Medium', 'High']]
    }
  },
  organic_matter: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  tested_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'soil_profiles',
  timestamps: true,
  underscored: true
});

module.exports = SoilProfile;
