const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trivia = sequelize.define('Trivia', {
  trivia_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  crop_tag: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'General'
  },
  published_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  }
}, {
  tableName: 'trivia',
  timestamps: true,
  underscored: true
});

module.exports = Trivia;
