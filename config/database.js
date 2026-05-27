const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

// Check if environment is production (e.g. NODE_ENV=production or DB_ENV=production)
const isProduction = process.env.NODE_ENV === 'production' || process.env.DB_ENV === 'production';

if (isProduction) {
  console.log('Connecting to Production Database (MySQL from Aiven.io)...');
  
  if (process.env.DATABASE_URL) {
    // Connect using connection string/URI
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
      logging: console.log,
      dialectOptions: {
        ssl: {
          rejectUnauthorized: true, // Required for SSL connections to Aiven
          ca: process.env.DB_SSL_CA
        }
      }
    });
  } else {
    // Connect using individual parameters
    sequelize = new Sequelize(
      process.env.DB_NAME || 'weather_app',
      process.env.DB_USER || 'admin',
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: console.log,
        dialectOptions: {
          ssl: {
            rejectUnauthorized: true,
            ca: process.env.DB_SSL_CA
          }
        }
      }
    );
  }
} else {
  console.log('Connecting to Development Database (SQLite)...');
  
  const dbPath = path.resolve(__dirname, '..', process.env.DB_FILE || 'database.sqlite');
  console.log(`SQLite database file path: ${dbPath}`);
  
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: console.log
  });
}

module.exports = sequelize;
