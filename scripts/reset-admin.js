const bcrypt = require('bcrypt');
require('dotenv').config();
const { sequelize, User } = require('../models');

async function resetAdmin() {
  try {
    await sequelize.authenticate();
    console.log('🔌 Connected to database for resetting admin...');

    const hash = await bcrypt.hash('password123', 10);
    const admin = await User.findOne({ where: { email: 'admin@debesmscat.edu.ph' } });

    if (admin) {
      admin.password_hash = hash;
      await admin.save();
      console.log('✅ Hashed password successfully updated/reset for admin@debesmscat.edu.ph!');
    } else {
      await User.create({
        full_name: 'Admin User',
        role: 'Admin',
        contact_number: '09001234567',
        email: 'admin@debesmscat.edu.ph',
        password_hash: hash
      });
      console.log('✅ Admin user did not exist, so created a new record with hashed password.');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Reset failed:', err);
    process.exit(1);
  }
}

resetAdmin();
