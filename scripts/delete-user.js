const path = require('path');

// 1. Parse command line arguments
const args = process.argv.slice(2);

// Extract --env argument if provided (defaults to development)
const envArg = args.find(arg => arg.startsWith('--env='));
let env = 'development';
if (envArg) {
  env = envArg.split('=')[1];
}

if (env !== 'production' && env !== 'development') {
  console.error('\x1b[31m❌ Invalid environment specified. Must be either "production" or "development".\x1b[0m');
  console.log('Usage: node scripts/delete-user.js <email> [--env=development|production]');
  process.exit(1);
}

process.env.NODE_ENV = env;
process.env.DB_ENV = env;

// Load environment variables
require('dotenv').config();

// Extract email argument (handles positional argument or --email=value)
let emailArg = args.find(arg => !arg.startsWith('--'));
if (!emailArg) {
  const namedEmail = args.find(arg => arg.startsWith('--email='));
  if (namedEmail) {
    emailArg = namedEmail.split('=')[1];
  }
}

if (!emailArg || !emailArg.trim()) {
  console.error('\x1b[31m❌ Error: Email argument is required.\x1b[0m\n');
  console.log('Usage:');
  console.log('  node scripts/delete-user.js <email> [--env=development|production]');
  console.log('  node scripts/delete-user.js --email=<email> [--env=development|production]');
  console.log('\nExamples:');
  console.log('  node scripts/delete-user.js farmer@example.com');
  console.log('  node scripts/delete-user.js farmer@example.com --env=production');
  process.exit(1);
}

const targetEmail = emailArg.trim().toLowerCase();

const {
  sequelize,
  User,
  FarmPlot,
  PlantingRecord,
  SoilProfile,
  Alert,
  Trivia,
  StationDevice,
  WeatherLog,
  Otp
} = require('../models');

async function deleteUserAndRecords() {
  console.log(`\n\x1b[36m========================================================\x1b[0m`);
  console.log(`🗑️  \x1b[1mDELETE USER AND ALL ASSOCIATED RECORDS\x1b[0m`);
  console.log(`🎯 Target Email: \x1b[33m\x1b[1m${targetEmail}\x1b[0m`);
  console.log(`🌎 Environment:  \x1b[35m\x1b[1m${env.toUpperCase()}\x1b[0m`);
  console.log(`\x1b[36m========================================================\x1b[0m\n`);

  try {
    await sequelize.authenticate();
    console.log('🔌 Database connection established.');

    const resultSummary = await sequelize.transaction(async (t) => {
      // Find user
      const user = await User.findOne({
        where: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('email')),
          targetEmail
        ),
        transaction: t
      });

      // Find any OTP entries for this email
      const otpCount = await Otp.count({
        where: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('email')),
          targetEmail
        ),
        transaction: t
      });

      if (!user && otpCount === 0) {
        return null;
      }

      const summary = {
        userFound: Boolean(user),
        userId: user ? user.user_id : null,
        userName: user ? user.full_name : null,
        userRole: user ? user.role : null,
        plotsDeleted: 0,
        plantingRecordsDeleted: 0,
        soilProfilesDeleted: 0,
        alertsDeleted: 0,
        triviaDeleted: 0,
        stationDevicesDeleted: 0,
        weatherLogsDeleted: 0,
        otpsDeleted: 0
      };

      if (user) {
        const userId = user.user_id;

        // 1. FarmPlots and dependent records (PlantingRecords, SoilProfiles)
        const plots = await FarmPlot.findAll({
          where: { user_id: userId },
          attributes: ['plot_id'],
          transaction: t
        });
        const plotIds = plots.map(p => p.plot_id);

        if (plotIds.length > 0) {
          summary.plantingRecordsDeleted = await PlantingRecord.destroy({
            where: { plot_id: plotIds },
            transaction: t
          });

          summary.soilProfilesDeleted = await SoilProfile.destroy({
            where: { plot_id: plotIds },
            transaction: t
          });

          summary.plotsDeleted = await FarmPlot.destroy({
            where: { plot_id: plotIds },
            transaction: t
          });
        }

        // 2. StationDevices and dependent records (WeatherLogs)
        const stations = await StationDevice.findAll({
          where: { owner_id: userId },
          attributes: ['device_id'],
          transaction: t
        });
        const deviceIds = stations.map(s => s.device_id);

        if (deviceIds.length > 0) {
          summary.weatherLogsDeleted = await WeatherLog.destroy({
            where: { station_id: deviceIds },
            transaction: t
          });

          summary.stationDevicesDeleted = await StationDevice.destroy({
            where: { device_id: deviceIds },
            transaction: t
          });
        }

        // 3. Alerts
        summary.alertsDeleted = await Alert.destroy({
          where: { user_id: userId },
          transaction: t
        });

        // 4. Trivia published by user
        summary.triviaDeleted = await Trivia.destroy({
          where: { published_by: userId },
          transaction: t
        });

        // 5. User record
        await user.destroy({ transaction: t });
      }

      // 6. OTP records
      if (otpCount > 0) {
        summary.otpsDeleted = await Otp.destroy({
          where: sequelize.where(
            sequelize.fn('LOWER', sequelize.col('email')),
            targetEmail
          ),
          transaction: t
        });
      }

      return summary;
    });

    if (!resultSummary) {
      console.log(`⚠️  \x1b[33mNo user or records found matching email:\x1b[0m ${targetEmail}\n`);
      process.exit(0);
    }

    console.log(`✅ \x1b[32m\x1b[1mSuccessfully deleted user and all associated records!\x1b[0m\n`);
    console.log(`📋 \x1b[1mSummary of Deletions:\x1b[0m`);
    if (resultSummary.userFound) {
      console.log(`   👤 User Account:       ID #${resultSummary.userId} (${resultSummary.userName} - ${resultSummary.userRole}) [DELETED]`);
    } else {
      console.log(`   👤 User Account:       None (orphan OTP data cleaned)`);
    }
    console.log(`   🌾 Farm Plots:         ${resultSummary.plotsDeleted} removed`);
    console.log(`   🌱 Planting Records:    ${resultSummary.plantingRecordsDeleted} removed`);
    console.log(`   🧪 Soil Profiles:       ${resultSummary.soilProfilesDeleted} removed`);
    console.log(`   📡 Station Devices:     ${resultSummary.stationDevicesDeleted} removed`);
    console.log(`   📊 Weather Logs:        ${resultSummary.weatherLogsDeleted} removed`);
    console.log(`   🔔 Alerts:              ${resultSummary.alertsDeleted} removed`);
    console.log(`   💡 Trivia:              ${resultSummary.triviaDeleted} removed`);
    console.log(`   🔑 OTP Entries:         ${resultSummary.otpsDeleted} removed`);
    console.log(`\n\x1b[36m========================================================\x1b[0m\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ \x1b[31mFailed to delete user and records:\x1b[0m', error);
    process.exit(1);
  }
}

deleteUserAndRecords();
