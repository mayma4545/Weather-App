const Sequelize = require('sequelize');
const sequelize = require('../config/database');

// Import models
const User = require('./User');
const CropRepository = require('./CropRepository');
const FarmPlot = require('./FarmPlot');
const PlantingRecord = require('./PlantingRecord');
const WeatherLog = require('./WeatherLog');
const Alert = require('./Alert');
const Trivia = require('./Trivia');

// Define Associations

// User <-> FarmPlot (One-to-Many)
User.hasMany(FarmPlot, { foreignKey: 'user_id', as: 'plots', onDelete: 'CASCADE' });
FarmPlot.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> Alert (One-to-Many)
User.hasMany(Alert, { foreignKey: 'user_id', as: 'alerts', onDelete: 'CASCADE' });
Alert.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// FarmPlot <-> PlantingRecord (One-to-Many)
FarmPlot.hasMany(PlantingRecord, { foreignKey: 'plot_id', as: 'plantingRecords', onDelete: 'CASCADE' });
PlantingRecord.belongsTo(FarmPlot, { foreignKey: 'plot_id', as: 'plot' });

// CropRepository <-> PlantingRecord (One-to-Many)
CropRepository.hasMany(PlantingRecord, { foreignKey: 'crop_id', as: 'plantingRecords', onDelete: 'CASCADE' });
PlantingRecord.belongsTo(CropRepository, { foreignKey: 'crop_id', as: 'crop' });

// User <-> Trivia (One-to-Many)
User.hasMany(Trivia, { foreignKey: 'published_by', as: 'trivia', onDelete: 'CASCADE' });
Trivia.belongsTo(User, { foreignKey: 'published_by', as: 'publisher' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  CropRepository,
  FarmPlot,
  PlantingRecord,
  WeatherLog,
  Alert,
  Trivia
};
