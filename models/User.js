const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Admin', 'Agriculturist']]
    }
  },
  contact_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  language_pref: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: 'filipino'
  },
  sms_opt_in: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true, // adds createdAt and updatedAt
  underscored: true // converts user_id to user_id (and camelCase fields to snake_case in db)
});

module.exports = User;
