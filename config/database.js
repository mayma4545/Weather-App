const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

// Check if environment is production (e.g. NODE_ENV=production or DB_ENV=production)
const isProduction = process.env.NODE_ENV === 'production' || process.env.DB_ENV === 'production';

if (isProduction) {
  console.log('Connecting to Production Database (MySQL from Aiven.io)...');
  console.log(`Database Host: ${process.env.PROD_DB_HOST || 'NOT SET'}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  
  if (process.env.PROD_DATABASE_URL) {
    // Connect using connection string/URI (RECOMMENDED for Render)
    console.log('Using PROD_DATABASE_URL connection string');
    sequelize = new Sequelize(process.env.PROD_DATABASE_URL, {
      dialect: 'mysql',
      logging: false, // Set to console.log for debugging
      dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          },
        supportBigNumbers: true,
        bigNumberStrings: true
      }
    });
  } else {
    // Fallback: Connect using individual parameters
    console.log('Using individual database parameters');
    sequelize = new Sequelize(
      process.env.PROD_DB_NAME || 'weather_app_prod',
      process.env.PROD_DB_USER || 'admin',
      process.env.PROD_DB_PASSWORD,
      {
        host: process.env.PROD_DB_HOST || 'localhost',
        port: parseInt(process.env.PROD_DB_PORT) || 3306,
        dialect: 'mysql',
        logging: false, // Set to console.log for debugging
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          },
          supportBigNumbers: true,
          bigNumberStrings: true
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
