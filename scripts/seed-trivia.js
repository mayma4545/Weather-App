const { sequelize, User, Trivia } = require('../models');

const triviaData = [
  // Palay (IR64) - Rice
  {
    content: 'IR64 is a semi-dwarf rice variety developed by the International Rice Research Institute (IRRI), known for its high yield potential and resistance to multiple pests. It matures in approximately 120 days under optimal conditions.',
    crop_tag: 'Palay (IR64)'
  },
  {
    content: 'Alternate Wetting and Drying (AWD) irrigation for rice can reduce water usage by up to 30% without significant yield reduction compared to continuous flooding — a critical technique for Masbate\'s dry season farming.',
    crop_tag: 'Palay (IR64)'
  },
  {
    content: 'Rice paddies should maintain 2-3 inches of standing water during the tillering stage. Draining the field 2 weeks before harvest improves grain quality, reduces lodging, and facilitates mechanical harvesting.',
    crop_tag: 'Palay (IR64)'
  },
  {
    content: 'Zinc deficiency is common in Philippine rice paddies. Foliar zinc application at early vegetative stage can increase yields by 10-15% and improve grain nutrient content for consumer health.',
    crop_tag: 'Palay (IR64)'
  },

  // Corn (OPV)
  {
    content: 'Open-pollinated varieties (OPV) of corn allow farmers to save and replant seeds from their own harvest for up to 3 seasons, reducing annual seed costs compared to hybrid varieties.',
    crop_tag: 'Corn (OPV)'
  },
  {
    content: 'Corn is most sensitive to water stress during the tasseling and silking stages — a moisture deficit during this critical window can reduce grain yields by up to 50%.',
    crop_tag: 'Corn (OPV)'
  },
  {
    content: 'Intercropping corn with legumes like mungbean or cowpea improves soil nitrogen content through biological fixation and suppresses weed growth through canopy cover.',
    crop_tag: 'Corn (OPV)'
  },
  {
    content: 'Corn requires 120-140 kg of nitrogen per hectare for optimal yield. Split application — half at planting and half at knee-high stage — maximizes nitrogen use efficiency.',
    crop_tag: 'Corn (OPV)'
  },

  // Kangkong
  {
    content: 'Kangkong grows abundantly in Masbate\'s wet season. It can be harvested multiple times — cut stems 3-4 inches above the water line for rapid regrowth within 14-21 days.',
    crop_tag: 'Kangkong'
  },
  {
    content: 'Kangkong is rich in iron (2.7 mg per 100 g), vitamin A (6,300 IU), and vitamin C (55 mg), making it one of the most nutrient-dense leafy greens available to Filipino farming communities.',
    crop_tag: 'Kangkong'
  },
  {
    content: 'Kangkong can be grown hydroponically or in flooded conditions, making it one of the most flood-tolerant vegetables suitable for rainfed lowland areas in the Bicol region.',
    crop_tag: 'Kangkong'
  },
  {
    content: 'Studies from the Department of Agriculture show that Kangkong planted in vermicompost-enriched soil yields 40% more biomass than soil amended with synthetic fertilizers alone.',
    crop_tag: 'Kangkong'
  },

  // Eggplant
  {
    content: 'Eggplant thrives in well-drained loamy soil with pH 5.5-6.5. Mulching with rice straw retains soil moisture and suppresses weed growth during Masbate\'s rainy season.',
    crop_tag: 'Eggplant'
  },
  {
    content: 'Eggplant is a good source of dietary fiber (3.4 g per 100 g), potassium, and nasunin — an antioxidant found in the purple skin that protects cell membranes from oxidative damage.',
    crop_tag: 'Eggplant'
  },
  {
    content: 'Pruning eggplant to 2-3 main stems improves air circulation and reduces fungal disease incidence by up to 60% during humid months common in Masbate.',
    crop_tag: 'Eggplant'
  },
  {
    content: 'Alternate-row planting of eggplant with marigold or basil naturally repels thrips and fruit borers, reducing the need for chemical insecticides by 40-50%.',
    crop_tag: 'Eggplant'
  },

  // Tomato
  {
    content: 'Tomatoes require consistent moisture throughout the growing season. Uneven watering leads to blossom-end rot — a physiological disorder caused by calcium deficiency during fruit development.',
    crop_tag: 'Tomato'
  },
  {
    content: 'Staking or caging tomato plants keeps fruits off the ground, reducing soil-borne disease incidence by up to 70% and improving fruit quality at harvest.',
    crop_tag: 'Tomato'
  },
  {
    content: 'Tomatoes are rich in lycopene, a powerful antioxidant that is better absorbed by the body when cooked. Lycopene intake is linked to reduced risk of heart disease and certain cancers.',
    crop_tag: 'Tomato'
  },
  {
    content: 'Tomato seedlings benefit from calcium supplementation at transplanting. Crushed eggshells or agricultural lime applied to the planting hole prevent blossom-end rot in acidic Masbate soils.',
    crop_tag: 'Tomato'
  },

  // Ampalaya (Bitter Gourd)
  {
    content: 'Ampalaya contains charantin and momordicin — compounds scientifically documented for their blood sugar-lowering properties, making it a valuable medicinal crop for diabetic-friendly diets.',
    crop_tag: 'Ampalaya'
  },
  {
    content: 'Bitter gourd vines benefit from trellising at 2 meters height, which improves air circulation, reduces fruit rot by 50%, and makes harvesting significantly easier.',
    crop_tag: 'Ampalaya'
  },
  {
    content: 'Ampalaya is rich in vitamin C (84 mg per 100 g), folate (72 mcg), and zinc. Regular consumption supports immune function, particularly during the rainy season when respiratory infections peak.',
    crop_tag: 'Ampalaya'
  },
  {
    content: 'Fruit fly is the most damaging pest of ampalaya in the Philippines. Bagging young fruits with paper or using pheromone traps can reduce fruit fly damage by 60-80% without pesticide use.',
    crop_tag: 'Ampalaya'
  },

  // General farming trivia
  {
    content: 'DEBESMSCAT recommends crop rotation to break pest cycles: plant legumes after cereals to restore soil nitrogen and reduce pest pressure naturally in Masbate farmlands.',
    crop_tag: 'General'
  },
  {
    content: 'Masbate\'s clay-loam soils benefit from organic matter incorporation — adding 5-10 tons of compost per hectare increases water-holding capacity and soil microbial activity significantly.',
    crop_tag: 'General'
  },
  {
    content: 'Integrated Pest Management (IPM) strategies from DEBESMSCAT: introducing predatory insects like lady beetles and lacewings instead of broad-spectrum pesticides preserves beneficial insect populations.',
    crop_tag: 'General'
  },
  {
    content: 'Vermicomposting using African nightcrawlers transforms farm waste into nutrient-rich organic fertilizer within 45-60 days, reducing reliance on synthetic inputs by 30-50%.',
    crop_tag: 'General'
  },
  {
    content: 'The Masbate Provincial Agriculture Office recommends soil testing every 2 years. Knowing your soil pH and nutrient levels prevents over-fertilization and saves up to 25% on fertilizer costs.',
    crop_tag: 'General'
  },
  {
    content: 'Cover cropping with cowpea or mungbean during the fallow period prevents soil erosion, suppresses weeds, and adds 40-60 kg of nitrogen per hectare to the soil.',
    crop_tag: 'General'
  }
];

async function seedTrivia() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database for trivia seeding...');

    const admin = await User.findOne({ where: { role: 'Admin' } });
    if (!admin) {
      console.error('No admin user found. Run seed.js first to create an admin user.');
      process.exit(1);
    }

    let createdCount = 0;
    let skippedCount = 0;

    for (const t of triviaData) {
      const [record, created] = await Trivia.findOrCreate({
        where: { content: t.content },
        defaults: {
          content: t.content,
          crop_tag: t.crop_tag,
          published_by: admin.user_id
        }
      });
      if (created) {
        console.log(`Created trivia [${t.crop_tag}]: ${t.content.substring(0, 60)}...`);
        createdCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(`\nDone. Created ${createdCount} new trivia entries, ${skippedCount} already existed.`);
    process.exit(0);
  } catch (err) {
    console.error('Trivia seeding failed:', err);
    process.exit(1);
  }
}

seedTrivia();
