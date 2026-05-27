const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Connect to SQLite (Development)
const sqliteDbPath = path.resolve(__dirname, '..', process.env.DB_FILE || 'database.sqlite');
const sqliteSeq = new Sequelize({
  dialect: 'sqlite',
  storage: sqliteDbPath,
  logging: false
});

// Connect to MySQL (Production)
const mysqlSeq = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_SSL_CA
      }
    }
  }
);

async function migrateData() {
  try {
    await sqliteSeq.authenticate();
    await mysqlSeq.authenticate();
    console.log('Connected to both SQLite and MySQL');

    // The order of tables is important to avoid foreign key constraints
    const tables = [
      'users',
      'crop_repository',
      'farm_plots',
      'planting_records',
      'weather_logs',
      'alerts',
      'trivia'
    ];

    // Disable foreign key checks on MySQL temporarily
    await mysqlSeq.query('SET FOREIGN_KEY_CHECKS = 0');
    
    for (const table of tables) {
      console.log(`Migrating data for table: ${table}...`);
      
      // Read all records from SQLite
      const [records] = await sqliteSeq.query(`SELECT * FROM ${table}`);
      
      if (records.length === 0) {
        console.log(`  No records found in ${table}. Skipping.`);
        continue;
      }
      
      console.log(`  Found ${records.length} records in ${table}. Transferring...`);
      
      // Optionally, clear the table in MySQL before inserting to avoid duplicates
      await mysqlSeq.query(`TRUNCATE TABLE ${table}`);

      // Insert in chunks to avoid max packet size issues
      const chunkSize = 100;
      for (let i = 0; i < records.length; i += chunkSize) {
        const chunk = records.slice(i, i + chunkSize);
        
        // Build INSERT query
        const columns = Object.keys(chunk[0]);
        const colsStr = columns.map(c => `\`${c}\``).join(', ');
        
        const placeholdersStr = chunk.map(() => `(${columns.map(() => '?').join(',')})`).join(', ');
        const values = chunk.flatMap(row => columns.map(col => {
          let val = row[col];
          // Fix SQLite ISO date strings to MySQL DATETIME strings
          if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}/)) {
            val = val.replace('T', ' ').substring(0, 19);
          }
          return val;
        }));
        
        const query = `INSERT INTO \`${table}\` (${colsStr}) VALUES ${placeholdersStr}`;
        await mysqlSeq.query(query, { replacements: values });
      }
      console.log(`  Finished table: ${table}.`);
    }

    // Re-enable foreign key checks
    await mysqlSeq.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Data migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error during data migration:', error);
    process.exit(1);
  }
}

migrateData();