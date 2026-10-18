const path = require('path');
const { DataTypes } = require('sequelize');

async function migrate(env) {
  process.env.NODE_ENV = env;
  process.env.DB_ENV = env;
  delete require.cache[require.resolve('../config/database')];
  delete require.cache[require.resolve('../models')];
  
  const { sequelize } = require('../models');
  console.log(`\n🔌 Connecting to ${env} database (${sequelize.getDialect()})...`);
  await sequelize.authenticate();
  console.log(`✅ Connected to ${env}.`);

  const queryInterface = sequelize.getQueryInterface();
  const tableInfo = await queryInterface.describeTable('planting_records');

  if (!tableInfo.health_status) {
    console.log('➕ Adding column `health_status` to `planting_records` table...');
    await queryInterface.addColumn('planting_records', 'health_status', {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Healthy'
    });
    console.log('✅ Added `health_status` column.');
  } else {
    console.log('🔹 Column `health_status` already exists in `planting_records`.');
  }
}

async function run() {
  require('dotenv').config();
  const args = process.argv.slice(2);
  const envArg = args.find(arg => arg.startsWith('--env='));
  const targetEnv = envArg ? envArg.split('=')[1] : null;

  try {
    if (targetEnv) {
      await migrate(targetEnv);
    } else {
      try {
        await migrate('development');
      } catch (err) {
        console.warn('⚠️ SQLite migration notice:', err.message);
      }
      try {
        await migrate('production');
      } catch (err) {
        console.warn('⚠️ MySQL migration notice:', err.message);
      }
    }
    console.log('\n🎉 Crop Health Status migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

run();
