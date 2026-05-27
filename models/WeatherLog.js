const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WeatherLog = sequelize.define('WeatherLog', {
  log_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  temperature: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  humidity: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  wind_speed: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  rainfall: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  data_source: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['API', 'Station']]
    }
  }
}, {
  tableName: 'weather_logs',
  timestamps: true,
  underscored: true
});

module.exports = WeatherLog;
