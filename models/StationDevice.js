const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StationDevice = sequelize.define('StationDevice', {
  device_id: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  location_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: true
  },
  last_seen: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'station_devices',
  timestamps: true,
  underscored: true
});

module.exports = StationDevice;
