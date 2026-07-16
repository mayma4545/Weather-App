const path = require('path');
const args = process.argv.slice(2);
let envArg = args.find(arg => arg.startsWith('--env='));
let env = 'development';

if (envArg) {
  env = envArg.split('=')[1];
}

process.env.NODE_ENV = env;
process.env.DB_ENV = env;
require('dotenv').config();

const { sequelize, User, Otp } = require('../models');
const { DataTypes } = require('sequelize');

async function migrateOtpAndIdentity() {
  try {
    console.log(`🔌 Connecting to ${env} database...`);
    await sequelize.authenticate();
    console.log('✅ Connected.');

    const queryInterface = sequelize.getQueryInterface();
    const tableInfo = await queryInterface.describeTable('users');

    if (!tableInfo.identity_type) {
      console.log('➕ Adding column `identity_type` to `users` table...');
      await queryInterface.addColumn('users', 'identity_type', {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'Farmer'
      });
      console.log('✅ Added `identity_type` column.');
    } else {
      console.log('🔹 Column `identity_type` already exists in `users`.');
    }

    if (!tableInfo.identity_specification) {
      console.log('➕ Adding column `identity_specification` to `users` table...');
      await queryInterface.addColumn('users', 'identity_specification', {
        type: DataTypes.STRING(255),
        allowNull: true
      });
      console.log('✅ Added `identity_specification` column.');
    } else {
      console.log('🔹 Column `identity_specification` already exists in `users`.');
    }

    console.log('🔄 Syncing `otps` table...');
    await Otp.sync({ alter: true });
    console.log('✅ `otps` table synced.');

    console.log('\n🎉 Migration for OTP and User Identity fields completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrateOtpAndIdentity();
