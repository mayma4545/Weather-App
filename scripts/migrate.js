const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let envArg = args.find(arg => arg.startsWith('--env='));
let env = 'development'; // default

if (envArg) {
  env = envArg.split('=')[1];
}

if (env !== 'production' && env !== 'development') {
  console.error('\x1b[31m❌ Invalid environment specified. Must be either "production" or "development".\x1b[0m');
  console.log('Usage: node scripts/migrate.js --env=production OR node scripts/migrate.js --env=development');
  console.log('You can also append --force to recreate tables (WARNING: this drops existing tables).');
  process.exit(1);
}

// Set environment variables before importing configuration
process.env.NODE_ENV = env;
process.env.DB_ENV = env;

// Load environment variables from .env
require('dotenv').config();

console.log(`\n\x1b[36m========================================================\x1b[0m`);
console.log(`🚀 \x1b[1mWEATHER APP DATABASE MIGRATION SCRIPT\x1b[0m`);
console.log(`🌎 Target Environment: \x1b[33m\x1b[1m${env.toUpperCase()}\x1b[0m`);
console.log(`\x1b[36m========================================================\x1b[0m\n`);

const { sequelize, User, CropRepository, FarmPlot, PlantingRecord, WeatherLog, Alert, Trivia, Otp } = require('../models');

async function runMigration() {
  try {
    console.log(`🔌 Connecting to the \x1b[33m${env}\x1b[0m database...`);
    await sequelize.authenticate();
    console.log('✅ \x1b[32mDatabase connection successfully established!\x1b[0m');

    const forceReset = args.includes('--force') || args.includes('-f');
    if (forceReset) {
      console.log('⚠️  \x1b[31m\x1b[1m--force flag detected! Recreating tables (existing tables will be dropped)...\x1b[0m');
    } else {
      console.log('🔄 Checking and migrating tables...');
    }

    // Synchronize the database
    await sequelize.sync({ force: forceReset });
    
    console.log('\n✨ \x1b[32mAll tables have been successfully migrated and configured:\x1b[0m');
    console.log('   🔹 \x1b[1musers\x1b[0m (User accounts, roles, contact fields)');
    console.log('   🔹 \x1b[1mcrop_repository\x1b[0m (Crop parameters, temp ranges, water tolerance, days to harvest)');
    console.log('   🔹 \x1b[1mfarm_plots\x1b[0m (Farm lands, size, owner reference)');
    console.log('   🔹 \x1b[1mplanting_records\x1b[0m (Planting tracking, dates, status)');
    console.log('   🔹 \x1b[1mweather_logs\x1b[0m (Weather metrics: temp, humidity, wind, rain)');
    console.log('   🔹 \x1b[1malerts\x1b[0m (Extreme weather notifications, recommendations)');
    console.log('   🔹 \x1b[1mtrivia\x1b[0m (Agricultural tips, trivia, best practices)');
    console.log('   🔹 \x1b[1motps\x1b[0m (Temporary verification OTP codes and pending user data)');

    // Seed initial crop repository data if empty
    const cropCount = await CropRepository.count();
    if (cropCount === 0) {
      console.log('\n🌱 \x1b[36mSeeding initial crops into crop_repository...\x1b[0m');
      await CropRepository.bulkCreate([
        {
          crop_name: 'Rice',
          ideal_temp_min: 20.0,
          ideal_temp_max: 35.0,
          rain_tolerance: 200.0,
          days_to_harvest: 120,
          best_practices: 'Ensure fields have standing water during early growth. Drain 2 weeks before harvest.',
          growth_stages: 'Seedling 25d||Tillering 35d||Flowering 30d||Mature 30d',
          vulnerabilities: 'Stem blast disease, water flooding > 15cm'
        },
        {
          crop_name: 'Corn',
          ideal_temp_min: 18.0,
          ideal_temp_max: 30.0,
          rain_tolerance: 100.0,
          days_to_harvest: 90,
          best_practices: 'Avoid waterlogging. Plant in well-drained loamy soil. Apply fertilizer in early vegetative stages.',
          growth_stages: 'Seedling 20d||Vegetative 35d||Tasseling 25d||Harvest 40d',
          vulnerabilities: 'Saturated soil (drowning), cob worms, wind gust > 30km/h'
        },
        {
          crop_name: 'Cabbage',
          ideal_temp_min: 15.0,
          ideal_temp_max: 20.0,
          rain_tolerance: 80.0,
          days_to_harvest: 70,
          best_practices: 'Prefers cool weather. Keep soil moist but not wet. Watch out for cabbage worms.',
          growth_stages: 'Seedling 15d||Vegetative 25d||Heading 20d||Harvest 10d',
          vulnerabilities: 'Cabbage worms, root rot, aphids'
        }
      ]);
      console.log('✅ \x1b[32mInitial crops successfully seeded!\x1b[0m');
    } else {
      console.log('\n🌱 \x1b[33mCrop repository already contains data. Skipping initial crop seeding.\x1b[0m');
    }

    console.log('\n🎉 \x1b[32m\x1b[1mMigration process finished successfully!\x1b[0m\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ \x1b[31mDatabase migration failed:\x1b[0m', error);
    process.exit(1);
  }
}

runMigration();
