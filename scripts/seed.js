const bcrypt = require('bcrypt');
require('dotenv').config();
const { sequelize, User, CropRepository, FarmPlot, PlantingRecord, WeatherLog, Trivia } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('🔌 Connected to database for seeding...');

    // Sync database (recreate if needed, but safe to just sync)
    await sequelize.sync();

    // Migrate: add new columns if they don't exist (safe, wrapped in try/catch)
    try {
      await sequelize.query(`ALTER TABLE crop_repository ADD COLUMN growth_stages TEXT`);
      console.log('📦 Added growth_stages column to crop_repository');
    } catch (e) { /* column already exists */ }
    try {
      await sequelize.query(`ALTER TABLE crop_repository ADD COLUMN vulnerabilities TEXT`);
      console.log('📦 Added vulnerabilities column to crop_repository');
    } catch (e) { /* column already exists */ }

    const defaultHash = await bcrypt.hash('password123', 10);

    // 1. Create or find default Farmer User
    let user = await User.findOne({ where: { email: 'juan.ramos@masbatefarming.ph' } });
    if (!user) {
      user = await User.create({
        full_name: 'Juan Ramos',
        role: 'Agriculturist',
        contact_number: '09123456789',
        email: 'juan.ramos@masbatefarming.ph',
        password_hash: defaultHash
      });
      console.log('👤 Seeded farmer user: Juan Ramos');
    } else {
      // Fix role if previously seeded as Admin
      if (user.role !== 'Agriculturist') {
        user.role = 'Agriculturist';
        await user.save();
        console.log('👤 Fixed Juan Ramos role to Agriculturist');
      }
      console.log('👤 Farmer Juan Ramos already exists');
    }

    // 1b. Create or find Admin User
    let admin = await User.findOne({ where: { email: 'admin@debesmscat.edu.ph' } });
    if (!admin) {
      admin = await User.create({
        full_name: 'Admin User',
        role: 'Admin',
        contact_number: '09001234567',
        email: 'admin@debesmscat.edu.ph',
        password_hash: defaultHash
      });
      console.log('🛡️  Seeded admin user: Admin User');
    } else {
      console.log('🛡️  Admin User already exists');
    }

    // 1c. Create a second farmer for testing broadcasts
    let farmer2 = await User.findOne({ where: { email: 'maria.santos@masbatefarming.ph' } });
    if (!farmer2) {
      farmer2 = await User.create({
        full_name: 'Maria Santos',
        role: 'Agriculturist',
        contact_number: '09198765432',
        email: 'maria.santos@masbatefarming.ph',
        password_hash: defaultHash
      });
      console.log('👤 Seeded farmer user: Maria Santos');
    }

    // 2. Seed Crop Repository (trusted data from DEBESMSCAT agricultural research)
    const cropDefinitions = [
      {
        crop_name: 'Palay (IR64)',
        ideal_temp_min: 22.0,
        ideal_temp_max: 32.0,
        rain_tolerance: 80.0,
        days_to_harvest: 120,
        best_practices: 'Tillering phase. Keep water shallow. High humidity blast watch is active.',
        growth_stages: 'Seedling 25d||Tillering 35d||Flowering 30d||Mature 30d',
        vulnerabilities: 'Leaf folders, Stem blast disease, water flooding > 15cm'
      },
      {
        crop_name: 'Corn (OPV)',
        ideal_temp_min: 20.0,
        ideal_temp_max: 30.0,
        rain_tolerance: 50.0,
        days_to_harvest: 120,
        best_practices: 'V6 stage. High nitrogen need. Prepare soil hydration block ahead of Sun.',
        growth_stages: 'Seedling 20d||Vegetative 35d||Tasseling 25d||Harvest 40d',
        vulnerabilities: 'Saturated soil (drowning), cob worms, wind gust > 30km/h'
      },
      {
        crop_name: 'Kangkong',
        ideal_temp_min: 20.0,
        ideal_temp_max: 35.0,
        rain_tolerance: 120.0,
        days_to_harvest: 30,
        best_practices: 'Fast vegetative leaf growth. Harvest cycle begins in 7 days.',
        growth_stages: 'Seedling 7d||Vegetative 15d||Harvest 8d',
        vulnerabilities: 'Leaf rust, extreme freezing conditions'
      },
      {
        crop_name: 'Eggplant',
        ideal_temp_min: 22.0,
        ideal_temp_max: 32.0,
        rain_tolerance: 40.0,
        days_to_harvest: 110,
        best_practices: 'Healthy growth. Check plant spacing for fungal disease.',
        growth_stages: 'Seedling 20d||Vegetative 30d||Flowering 25d||Harvest 35d',
        vulnerabilities: 'Thrips pest, root dehydration'
      },
      {
        crop_name: 'Tomato',
        ideal_temp_min: 18.0,
        ideal_temp_max: 28.0,
        rain_tolerance: 20.0,
        days_to_harvest: 100,
        best_practices: 'Tomato seedlings need elevated cover to shield from upcoming Thu rainfall.',
        growth_stages: 'Seedling 15d||Vegetative 30d||Fruiting 35d||Harvest 20d',
        vulnerabilities: 'Excessive water logging (root rot), early blight fungus'
      },
      {
        crop_name: 'Ampalaya',
        ideal_temp_min: 24.0,
        ideal_temp_max: 35.0,
        rain_tolerance: 70.0,
        days_to_harvest: 85,
        best_practices: 'Vine spreading stage. Ensure trellises are sturdy.',
        growth_stages: 'Seedling 15d||Trellising 25d||Flowering 20d||Harvest 25d',
        vulnerabilities: 'Downy mildew, fruit flies'
      }
    ];

    for (const c of cropDefinitions) {
      const [cropRecord, created] = await CropRepository.findOrCreate({
        where: { crop_name: c.crop_name },
        defaults: c
      });
      if (created) {
        console.log(`🌱 Seeded crop: ${c.crop_name}`);
      } else if (c.growth_stages || c.vulnerabilities) {
        await cropRecord.update({
          growth_stages: c.growth_stages,
          vulnerabilities: c.vulnerabilities
        });
      }
    }

    // 3. Seed Farm Plots
    const plotDefinitions = [
      { plot_name: 'North Plot A', area_size: 2.4, user_id: user.user_id },
      { plot_name: 'South Plot B', area_size: 1.8, user_id: user.user_id },
      { plot_name: 'East Plot C', area_size: 0.6, user_id: user.user_id },
      { plot_name: 'Plot D', area_size: 1.2, user_id: user.user_id }
    ];

    const seededPlots = {};
    for (const p of plotDefinitions) {
      const [plotRecord, created] = await FarmPlot.findOrCreate({
        where: { plot_name: p.plot_name, user_id: p.user_id },
        defaults: p
      });
      seededPlots[p.plot_name] = plotRecord;
      if (created) {
        console.log(`📐 Seeded plot: ${p.plot_name}`);
      }
    }

    // 4. Seed initial active planting records
    const cropsInDb = await CropRepository.findAll();
    const findCropId = (name) => cropsInDb.find(c => c.crop_name.includes(name) || name.includes(c.crop_name)).crop_id;

    const initialRecords = [
      {
        plot_id: seededPlots['North Plot A'].plot_id,
        crop_id: findCropId('Palay (IR64)'),
        planting_date: '2026-03-22',
        status: 'Growing'
      },
      {
        plot_id: seededPlots['South Plot B'].plot_id,
        crop_id: findCropId('Corn (OPV)'),
        planting_date: '2026-04-25',
        status: 'Growing'
      },
      {
        plot_id: seededPlots['East Plot C'].plot_id,
        crop_id: findCropId('Kangkong'),
        planting_date: '2026-05-09',
        status: 'Growing'
      }
    ];

    for (const r of initialRecords) {
      const [recRecord, created] = await PlantingRecord.findOrCreate({
        where: { plot_id: r.plot_id, status: 'Growing' },
        defaults: r
      });
      if (created) {
        console.log(`🌾 Seeded active planting record for plot ID ${r.plot_id}`);
      }
    }

    // 5. Seed two finished historical records
    const historicalRecords = [
      {
        plot_id: seededPlots['North Plot A'].plot_id,
        crop_id: findCropId('Palay (IR64)'),
        planting_date: '2025-11-12',
        status: 'Harvested'
      },
      {
        plot_id: seededPlots['South Plot B'].plot_id,
        crop_id: findCropId('Eggplant'),
        planting_date: '2025-09-02',
        status: 'Harvested'
      }
    ];

    const histCount = await PlantingRecord.count({ where: { status: 'Harvested' } });
    if (histCount === 0) {
      for (const h of historicalRecords) {
        await PlantingRecord.create(h);
        console.log(`📜 Seeded historical record for plot ID ${h.plot_id}`);
      }
    }

    // 6. Seed sample weather logs for admin monitor
    const weatherLogCount = await WeatherLog.count();
    if (weatherLogCount === 0) {
      const now = new Date();
      const sampleLogs = [];
      for (let i = 0; i < 10; i++) {
        const logDate = new Date(now);
        logDate.setHours(logDate.getHours() - (i * 6)); // Every 6 hours back
        sampleLogs.push({
          timestamp: logDate,
          temperature: 28 + (Math.random() * 6 - 3),
          humidity: 70 + (Math.random() * 20 - 10),
          wind_speed: 5 + (Math.random() * 10),
          rainfall: Math.random() > 0.7 ? (Math.random() * 30) : (Math.random() * 5),
          data_source: i % 3 === 0 ? 'Station' : 'API'
        });
      }
      await WeatherLog.bulkCreate(sampleLogs);
      console.log('🌤️  Seeded 10 sample weather logs');
    }

    // 7. Seed sample trivia entries
    const triviaCount = await Trivia.count();
    if (triviaCount === 0) {
      const sampleTrivia = [
        {
          content: 'Planting legumes like mung beans between rice seasons helps restore nitrogen levels in the soil, reducing the need for synthetic fertilizers.',
          crop_tag: 'General',
          published_by: admin.user_id
        },
        {
          content: 'Rice paddies should maintain 2-3 inches of standing water during the tillering stage. Drain the field gradually 2 weeks before harvest.',
          crop_tag: 'Palay (IR64)',
          published_by: admin.user_id
        },
        {
          content: 'Corn plants are most sensitive to drought stress during the tasseling and silking stages. Ensure adequate irrigation during these critical periods.',
          crop_tag: 'Corn (OPV)',
          published_by: admin.user_id
        },
        {
          content: 'Kangkong grows fastest in warm, wet conditions. It can be harvested multiple times — cut stems 2 inches above the water line for regrowth.',
          crop_tag: 'Kangkong',
          published_by: admin.user_id
        },
        {
          content: 'Mulching around tomato plants helps retain soil moisture and prevents soil-borne diseases from splashing onto lower leaves during heavy rain.',
          crop_tag: 'Tomato',
          published_by: admin.user_id
        }
      ];
      await Trivia.bulkCreate(sampleTrivia);
      console.log('📚 Seeded 5 sample trivia entries');
    }

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
