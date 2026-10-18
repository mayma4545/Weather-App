/**
 * Safe to Plant Predictor Engine
 * Evaluates live weather forecasts against crop-specific agronomic thresholds
 * to generate a Planting Safety Index (%), risk level, factor breakdown, and actionable advice.
 */

const CROP_PROFILES = {
  'Rice': {
    id: 'Rice',
    name: 'Rice (Palay IR64)',
    category: 'Cereal',
    icon: 'rice',
    tempMin: 20,
    tempOptimalMin: 24,
    tempOptimalMax: 32,
    tempMax: 37,
    dailyRainMax: 80,
    totalRainMax: 200,
    humidityOptimalMin: 65,
    humidityOptimalMax: 88,
    windSpeedMax: 40,
    soilMoisturePreference: 'High',
    description: 'Requires ample water during transplanting. High heat above 35°C during early stage causes seedling stress.'
  },
  'Corn': {
    id: 'Corn',
    name: 'Corn (OPV / Hybrid)',
    category: 'Cereal',
    icon: 'corn',
    tempMin: 18,
    tempOptimalMin: 22,
    tempOptimalMax: 30,
    tempMax: 35,
    dailyRainMax: 50,
    totalRainMax: 140,
    humidityOptimalMin: 55,
    humidityOptimalMax: 80,
    windSpeedMax: 35,
    soilMoisturePreference: 'Moderate',
    description: 'Sensitive to waterlogging during germination. Requires warm, well-drained soil.'
  },
  'Tomato': {
    id: 'Tomato',
    name: 'Tomato (Kamatis)',
    category: 'Vegetable',
    icon: 'tomato',
    tempMin: 18,
    tempOptimalMin: 21,
    tempOptimalMax: 29,
    tempMax: 34,
    dailyRainMax: 25,
    totalRainMax: 75,
    humidityOptimalMin: 50,
    humidityOptimalMax: 75,
    windSpeedMax: 30,
    soilMoisturePreference: 'Moderate-Low',
    description: 'High humidity and rainfall promote fungal leaf blight and blossom rot. Prefers moderate warmth.'
  },
  'Eggplant': {
    id: 'Eggplant',
    name: 'Eggplant (Talong)',
    category: 'Vegetable',
    icon: 'eggplant',
    tempMin: 20,
    tempOptimalMin: 24,
    tempOptimalMax: 32,
    tempMax: 38,
    dailyRainMax: 40,
    totalRainMax: 110,
    humidityOptimalMin: 55,
    humidityOptimalMax: 82,
    windSpeedMax: 35,
    soilMoisturePreference: 'Moderate',
    description: 'Warm-season crop with good heat tolerance. Excessive flooding damages seed bed roots.'
  },
  'Ampalaya': {
    id: 'Ampalaya',
    name: 'Ampalaya (Bitter Gourd)',
    category: 'Vegetable',
    icon: 'ampalaya',
    tempMin: 20,
    tempOptimalMin: 24,
    tempOptimalMax: 34,
    tempMax: 38,
    dailyRainMax: 60,
    totalRainMax: 160,
    humidityOptimalMin: 60,
    humidityOptimalMax: 85,
    windSpeedMax: 35,
    soilMoisturePreference: 'Moderate',
    description: 'Thrives in warm humid conditions. Strong trellis protection recommended if winds exceed 30 km/h.'
  },
  'Kangkong': {
    id: 'Kangkong',
    name: 'Kangkong (Water Spinach)',
    category: 'Leafy Green',
    icon: 'kangkong',
    tempMin: 18,
    tempOptimalMin: 24,
    tempOptimalMax: 35,
    tempMax: 40,
    dailyRainMax: 120,
    totalRainMax: 300,
    humidityOptimalMin: 60,
    humidityOptimalMax: 95,
    windSpeedMax: 45,
    soilMoisturePreference: 'Very High',
    description: 'Extremely resilient to high rainfall and moist conditions. Excellent choice for wet season.'
  },
  'Onion': {
    id: 'Onion',
    name: 'Onion (Sibuyas)',
    category: 'Bulb',
    icon: 'onion',
    tempMin: 13,
    tempOptimalMin: 18,
    tempOptimalMax: 26,
    tempMax: 32,
    dailyRainMax: 20,
    totalRainMax: 50,
    humidityOptimalMin: 45,
    humidityOptimalMax: 70,
    windSpeedMax: 28,
    soilMoisturePreference: 'Low',
    description: 'Highly sensitive to excessive water. Waterlogged soil causes bulb rot and seedling decay.'
  },
  'Squash': {
    id: 'Squash',
    name: 'Squash (Kalabasa)',
    category: 'Vegetable',
    icon: 'squash',
    tempMin: 18,
    tempOptimalMin: 22,
    tempOptimalMax: 31,
    tempMax: 36,
    dailyRainMax: 45,
    totalRainMax: 130,
    humidityOptimalMin: 55,
    humidityOptimalMax: 80,
    windSpeedMax: 35,
    soilMoisturePreference: 'Moderate',
    description: 'Needs warm soil for seed germination. Susceptible to powdery mildew in high humidity.'
  },
  'Sweet Potato': {
    id: 'Sweet Potato',
    name: 'Sweet Potato (Kamote)',
    category: 'Tuber',
    icon: 'sweet_potato',
    tempMin: 18,
    tempOptimalMin: 22,
    tempOptimalMax: 30,
    tempMax: 37,
    dailyRainMax: 55,
    totalRainMax: 150,
    humidityOptimalMin: 55,
    humidityOptimalMax: 85,
    windSpeedMax: 40,
    soilMoisturePreference: 'Moderate',
    description: 'Resilient root crop. Avoid waterlogged fields during initial vine planting stage.'
  },
  'Pepper': {
    id: 'Pepper',
    name: 'Pepper (Siling Labuyo)',
    category: 'Vegetable',
    icon: 'pepper',
    tempMin: 18,
    tempOptimalMin: 22,
    tempOptimalMax: 30,
    tempMax: 36,
    dailyRainMax: 30,
    totalRainMax: 90,
    humidityOptimalMin: 50,
    humidityOptimalMax: 75,
    windSpeedMax: 30,
    soilMoisturePreference: 'Moderate',
    description: 'Sensitive to flower drop under extreme heat (>35°C) or heavy downpours.'
  }
};

/**
 * Crop-specific recommendation knowledge base.
 * Each crop has unique advice for GREEN (optimal), YELLOW (caution), and RED (delay) scenarios
 * with sub-variants triggered by specific weather parameters.
 */
const CROP_RECOMMENDATIONS = {
  'Rice': {
    green(m, crop) {
      const recs = [];
      recs.push(`Flood paddy fields to 3–5 cm standing water depth before transplanting ${crop.name} seedlings. Current ${m.maxTemp}°C supports rapid tillering.`);
      if (m.avgHumidity > 80) {
        recs.push(`Humidity at ${m.avgHumidity}% is ideal for rice canopy — apply 60–80 kg/ha 14-14-14 complete fertilizer as basal during land preparation.`);
      } else {
        recs.push(`Apply basal fertilizer (60–80 kg/ha complete 14-14-14) during last harrowing; humidity at ${m.avgHumidity}% means schedule afternoon irrigation to maintain 3 cm water level.`);
      }
      recs.push(`Scout for golden apple snails (kuhol) in paddy corners — hand-pick or place bamboo traps before transplanting. Water depth above 5 cm encourages snail movement.`);
      if (m.maxWindSpeed > 20) {
        recs.push(`Wind at ${m.maxWindSpeed.toFixed(1)} km/h may lodge young tillers — transplant seedlings at 20×20 cm spacing for mutual wind support.`);
      }
      recs.push(`Prepare seed trays with pre-germinated seeds 14 days before target transplant date; maintain nursery bed at saturated-but-not-submerged moisture.`);
      return recs.slice(0, 5);
    },
    yellow(m, crop, tempSt, rainSt) {
      const recs = [];
      if (tempSt === 'Caution' && m.maxTemp > crop.tempOptimalMax) {
        recs.push(`Temperature at ${m.maxTemp}°C is above optimal for rice. Increase paddy water depth to 5–7 cm to buffer root zone heat — transplant in late afternoon (after 3 PM).`);
      }
      if (rainSt === 'Caution') {
        recs.push(`Rain forecast ${m.maxDailyRain.toFixed(1)} mm/day approaching paddy tolerance — open field drainage outlets to prevent water rising above 10 cm which drowns young tillers.`);
      }
      recs.push(`Delay urea top-dressing if heavy rain is expected within 48 hours — nitrogen wash-off wastes 30-50% of applied fertilizer.`);
      recs.push(`Install rat guards (plastic cone barriers) on paddy bunds — wet conditions drive rodents toward drier levee areas near seedlings.`);
      recs.push(`Monitor leaf color chart (LCC) before applying nitrogen; target LCC shade 3-4 for tillering stage rice.`);
      return recs.slice(0, 5);
    },
    red(m, crop, tempSt, rainSt) {
      const recs = [];
      recs.push(`Delay rice transplanting — current conditions (Safety Index below 50%) risk seedling mortality. Keep nursery trays in sheltered area.`);
      if (rainSt === 'Danger') {
        recs.push(`Expected ${m.maxDailyRain.toFixed(1)} mm/day rainfall will flood paddies above 15 cm — submerged seedlings die within 3 days. Drain excess water from existing fields.`);
      } else {
        recs.push(`Heat stress at ${m.maxTemp}°C causes pollen sterility in rice — avoid transplanting until temperature drops below ${crop.tempMax}°C.`);
      }
      recs.push(`Reinforce paddy bunds and clear main canal blockages to prevent overflow damage to adjacent fields.`);
      recs.push(`If seedlings are already in nursery trays past 21 days, they lose transplant vigor — consider re-seeding when weather stabilizes.`);
      return recs.slice(0, 5);
    }
  },
  'Corn': {
    green(m, crop) {
      const recs = [];
      recs.push(`Plant corn seeds 5–7 cm deep in well-drained furrows at 75×25 cm spacing. Soil temperature at ${m.maxTemp}°C ensures germination within 4–6 days.`);
      recs.push(`Apply 4–5 bags/ha (200–250 kg) complete fertilizer (14-14-14) in furrows 5 cm away from seed placement during planting.`);
      if (m.avgHumidity > 70) {
        recs.push(`Humidity ${m.avgHumidity}% — monitor for downy mildew (Peronosclerospora) on emerging leaves; apply metalaxyl seed treatment if not yet done.`);
      } else {
        recs.push(`Low humidity (${m.avgHumidity}%) means faster soil drying — irrigate furrows to field capacity 1 day before sowing for uniform germination.`);
      }
      if (m.maxWindSpeed > 15) {
        recs.push(`Wind ${m.maxWindSpeed.toFixed(1)} km/h — plant in blocks (not single rows) to reduce wind lodging risk; corn stalks support each other in block formations.`);
      }
      recs.push(`Control weeds with pre-emergent atrazine (1–1.5 kg a.i./ha) within 3 days after planting while soil is still moist.`);
      return recs.slice(0, 5);
    },
    yellow(m, crop, tempSt, rainSt) {
      const recs = [];
      if (rainSt === 'Caution') {
        recs.push(`Rain at ${m.maxDailyRain.toFixed(1)} mm/day risks waterlogging corn roots — dig 30 cm deep drainage ditches between rows before planting.`);
      }
      if (tempSt === 'Caution') {
        recs.push(`Temperature ${m.maxTemp}°C above corn optimal — sow in the early morning (5–7 AM) and mulch with rice straw (5 cm thick) to reduce soil surface heat by 3–5°C.`);
      }
      recs.push(`Apply 2 bags/ha urea (46-0-0) as side-dress at 25–30 days after emergence, 10 cm from plant base — skip if heavy rain expected within 24 hours.`);
      recs.push(`Scout for fall armyworm (Spodoptera frugiperda) egg masses on leaf undersides — crush or spray Bt (Bacillus thuringiensis) on small larvae.`);
      recs.push(`Check soil moisture at 10 cm depth: if dry to touch, irrigate 30–40 mm before sowing; corn needs consistent moisture during first 10 days.`);
      return recs.slice(0, 5);
    },
    red(m, crop, tempSt, rainSt) {
      const recs = [];
      recs.push(`Postpone corn planting — current ${m.safetyIndex || 'low'}% safety index means high germination failure risk. Store seeds in cool, dry area.`);
      if (rainSt === 'Danger') {
        recs.push(`Forecast rain ${m.maxDailyRain.toFixed(1)} mm/day will waterlog corn root zone — seeds rot within 48 hours in saturated soil. Wait for 3 consecutive dry days.`);
      } else {
        recs.push(`Extreme heat ${m.maxTemp}°C scorches corn seedlings — emergence failure rate exceeds 40% above ${crop.tempMax}°C soil temperature.`);
      }
      recs.push(`Use delay period to improve field drainage: plow across slope, create 40 cm deep main drain at lowest field point.`);
      recs.push(`Prepare organic matter (compost or chicken manure at 2–3 tons/ha) to incorporate during next land preparation for better water retention.`);
      return recs.slice(0, 5);
    }
  },
  'Tomato': {
    green(m, crop) {
      const recs = [];
      recs.push(`Transplant ${crop.name} seedlings (21–25 days old) at 50×40 cm spacing on raised beds 15–20 cm high. Current ${m.maxTemp}°C is ideal for root establishment.`);
      recs.push(`Apply 5 g/plant complete fertilizer (14-14-14) in planting hole, covered with 2 cm soil before setting transplant — avoid root-fertilizer contact burns.`);
      if (m.avgHumidity > 70) {
        recs.push(`Humidity ${m.avgHumidity}% is moderate-high for tomato — space plants wider (60 cm) and remove lower leaves at 3 weeks to improve air circulation and prevent early blight.`);
      } else {
        recs.push(`Low humidity ${m.avgHumidity}% favors tomato — install drip irrigation or furrow-irrigate every 3 days (20 mm per session) to maintain even soil moisture for fruit set.`);
      }
      recs.push(`Install bamboo stakes (1.5 m tall) at planting — tie main stem loosely with soft twine every 20 cm as plant grows. Staking reduces fruit rot by 60%.`);
      recs.push(`Mulch beds with rice straw or plastic mulch to suppress weeds and prevent soil-borne Fusarium spores from splashing onto lower leaves during watering.`);
      return recs.slice(0, 5);
    },
    yellow(m, crop, tempSt, rainSt) {
      const recs = [];
      if (rainSt === 'Caution') {
        recs.push(`Rain ${m.maxDailyRain.toFixed(1)} mm threatens tomato — raise bed height to 25 cm and cover transplants with clear plastic tunnel (open ends for ventilation) to prevent blossom-end rot.`);
      }
      if (tempSt === 'Caution') {
        recs.push(`Heat ${m.maxTemp}°C above tomato optimal — install 30–40% shade net over seedbed and transplant in late afternoon to reduce transplant shock mortality.`);
      }
      recs.push(`Spray preventive copper fungicide (Bordeaux mixture 1:1:100) on leaves before expected rain — tomato is highly susceptible to late blight (Phytophthora) at high humidity.`);
      recs.push(`Prune suckers (side shoots) below the first fruit cluster to concentrate plant energy on fruit development and improve air circulation.`);
      recs.push(`Apply calcium foliar spray (calcium chloride 0.5%) weekly if blossom-end rot symptoms appear — caused by irregular watering patterns during caution weather.`);
      return recs.slice(0, 5);
    },
    red(m, crop, tempSt, rainSt) {
      const recs = [];
      recs.push(`Do NOT transplant tomato in current conditions — seedlings will suffer 60–80% mortality. Keep seedlings in nursery with shade net protection.`);
      if (rainSt === 'Danger') {
        recs.push(`Heavy rain ${m.maxDailyRain.toFixed(1)} mm/day triggers bacterial wilt and Phytophthora — tomato seedbed soil stays saturated for days causing root rot.`);
      } else {
        recs.push(`Extreme heat ${m.maxTemp}°C causes flower abortion and pollen sterility in tomato — no fruit set possible above ${crop.tempMax}°C.`);
      }
      recs.push(`If nursery seedlings are past 30 days old, pot them individually in containers to prevent root binding until transplanting window opens.`);
      recs.push(`Prepare raised beds 20–25 cm high with carbonized rice hull mixed into topsoil (30%) for improved drainage when conditions improve.`);
      return recs.slice(0, 5);
    }
  },
  'Eggplant': {
    green(m, crop) {
      const recs = [];
      recs.push(`Transplant ${crop.name} seedlings (25–30 days old) at 60×50 cm spacing. Current ${m.maxTemp}°C and ${m.avgHumidity}% humidity are within eggplant's heat-tolerant sweet spot.`);
      recs.push(`Apply 10 g/plant complete fertilizer in ring around transplant at 10 cm distance. Side-dress with 5 g urea per plant at 30 days after transplanting.`);
      if (m.avgHumidity > 75) {
        recs.push(`Monitor for fruit and shoot borer (FSB) — humidity ${m.avgHumidity}% encourages moth activity. Install pheromone traps (1 per 500 m²) and remove infested shoots weekly.`);
      } else {
        recs.push(`Humidity ${m.avgHumidity}% is moderate — irrigate deeply (30 mm) every 4–5 days; eggplant develops deeper taproots than most vegetables, so surface sprinkling is insufficient.`);
      }
      recs.push(`Stake plants at 30 days and prune to 3–4 main branches for larger fruit size; eggplant responds well to structural pruning unlike many tropical vegetables.`);
      recs.push(`Incorporate 2 kg/m² decomposed chicken manure into beds 1 week before transplanting — eggplant is a heavy potassium feeder for fruit development.`);
      return recs.slice(0, 5);
    },
    yellow(m, crop, tempSt, rainSt) {
      const recs = [];
      if (rainSt === 'Caution') {
        recs.push(`Rain ${m.maxDailyRain.toFixed(1)} mm moderate risk — eggplant tolerates brief waterlogging but apply Trichoderma root drench (20 g/L) to prevent Pythium damping-off in wet soil.`);
      }
      if (tempSt === 'Caution' && m.maxTemp > crop.tempOptimalMax) {
        recs.push(`Temperature ${m.maxTemp}°C high but eggplant is heat-tolerant — mulch root zone with 7 cm rice hull to keep soil below ${crop.tempOptimalMax}°C. Water deeply in early morning only.`);
      }
      recs.push(`Scout for bacterial wilt (Ralstonia) — wilting despite moist soil means infected plants. Remove and burn immediately; do not compost diseased material.`);
      recs.push(`Spray neem oil extract (5 ml/L) every 7 days as preventive for FSB and aphids — eggplant is the #1 FSB target crop in the Philippines.`);
      recs.push(`Apply foliar potassium (muriate of potash 0.5%) at flowering stage to improve fruit firmness and shelf life during unpredictable weather.`);
      return recs.slice(0, 5);
    },
    red(m, crop, tempSt, rainSt) {
      const recs = [];
      recs.push(`Delay eggplant transplanting — seedlings are vulnerable to flooding and extreme stress despite the crop's general hardiness.`);
      if (rainSt === 'Danger') {
        recs.push(`Forecast ${m.maxDailyRain.toFixed(1)} mm/day will waterlog eggplant root zone within hours — Pythium and Fusarium root rot kills transplants within 5 days in saturated soil.`);
      } else {
        recs.push(`Extreme heat ${m.maxTemp}°C causes severe wilting and flower drop even in heat-tolerant eggplant — transplant survival drops below 50%.`);
      }
      recs.push(`Keep seedlings in nursery trays under 50% shade net — eggplant seedlings remain viable in nursery up to 35 days if fed weekly with dilute liquid fertilizer.`);
      recs.push(`Use delay to solarize planting beds (cover moist soil with clear plastic for 2 weeks) to kill soil pathogens before transplanting.`);
      return recs.slice(0, 5);
    }
  },
  'Ampalaya': {
    green(m, crop) {
      const recs = [];
      recs.push(`Direct-sow ${crop.name} seeds 2–3 cm deep at 50 cm spacing along trellis rows. Soak seeds in warm water (40°C) for 12 hours before planting to crack hard seed coat — improves germination from 60% to 90%.`);
      recs.push(`Install trellis system (2 m tall bamboo poles with nylon net) BEFORE sowing — ampalaya vines climb aggressively within 14 days and need immediate support.`);
      if (m.avgHumidity > 75) {
        recs.push(`High humidity ${m.avgHumidity}% favors powdery mildew on ampalaya leaves — apply sulfur-based fungicide preventively at first true-leaf stage (7–10 days).`);
      } else {
        recs.push(`Humidity ${m.avgHumidity}% is moderate — apply drip irrigation at vine base (avoid wetting leaves); ampalaya needs 25 mm/week during vine elongation.`);
      }
      recs.push(`Apply 3 bags/ha complete fertilizer (14-14-14) at planting, then side-dress with 1.5 bags/ha urea at 25 days when vine starts branching.`);
      if (m.maxWindSpeed > 25) {
        recs.push(`Wind at ${m.maxWindSpeed.toFixed(1)} km/h — secure trellis with guy wires at 3 m intervals; wind-whipped vines lose flowers and abort young fruit.`);
      } else {
        recs.push(`Pollinate by hand (transfer pollen from male to female flowers using soft brush at 6–8 AM) if bee activity is low during cloudy periods.`);
      }
      return recs.slice(0, 5);
    },
    yellow(m, crop, tempSt, rainSt) {
      const recs = [];
      if (tempSt === 'Caution') {
        recs.push(`Temperature ${m.maxTemp}°C above optimal — ampalaya tolerates heat well but apply 40% shade net over young seedlings for first 2 weeks to prevent wilting.`);
      }
      if (rainSt === 'Caution') {
        recs.push(`Expected rain ${m.maxDailyRain.toFixed(1)} mm — clear drainage along trellis rows; ampalaya roots rot quickly in puddles even though vines look tough.`);
      }
      recs.push(`Train main vine to single leader by pruning lateral branches below 50 cm height — concentrates fruiting energy on upper canopy with better air flow.`);
      recs.push(`Spray Bt (Bacillus thuringiensis) for fruit fly larvae control; ampalaya is a primary fruit fly host crop — fruit fly damage causes 30–40% harvest loss.`);
      recs.push(`Harvest fruit at 12–15 cm length (light green, firm) — overripe fruit turns orange and stops vine from producing new flowers.`);
      return recs.slice(0, 5);
    },
    red(m, crop, tempSt, rainSt) {
      const recs = [];
      recs.push(`Do NOT sow ampalaya seeds now — germination failure exceeds 50% in current conditions. Pre-germinate seeds in damp cloth indoors instead.`);
      if (rainSt === 'Danger') {
        recs.push(`Heavy rain ${m.maxDailyRain.toFixed(1)} mm will flood trellis bases — seeds will rot in 2–3 days and established vines suffer root asphyxiation.`);
      } else {
        recs.push(`Extreme heat ${m.maxTemp}°C causes rapid seed desiccation before radicle emerges — soil surface temperature may exceed ${m.maxTemp + 5}°C without shade.`);
      }
      recs.push(`Pre-germinate seeds indoors on damp paper towel at room temperature — transplant sprouted seeds with 1 cm radicle once weather stabilizes.`);
      recs.push(`Repair and reinforce trellis structures during downtime — storm damage to trellis mid-season causes total crop loss.`);
      return recs.slice(0, 5);
    }
  },
  'Kangkong': {
    green(m, crop) {
      const recs = [];
      recs.push(`Broadcast ${crop.name} seeds at 20–25 kg/ha on saturated muddy soil, or direct-sow stem cuttings (30 cm) at 15×15 cm spacing in flooded beds. Temperature ${m.maxTemp}°C ensures sprouting within 3–5 days.`);
      recs.push(`Kangkong thrives in waterlogged conditions — maintain 2–5 cm standing water in wetland-type cultivation or irrigate upland beds every 2 days (20 mm/session).`);
      if (m.totalForecastRain > 50) {
        recs.push(`Forecast rain ${m.totalForecastRain.toFixed(1)} mm total is excellent for kangkong — this is one of the few crops that benefits from heavy rain. No drainage needed for wetland plots.`);
      } else {
        recs.push(`Light rain forecast (${m.totalForecastRain.toFixed(1)} mm) — supplement with irrigation to keep soil continuously moist; kangkong wilts rapidly in dry soil.`);
      }
      recs.push(`Apply 1.5 bags/ha urea (46-0-0) at 10 days after emergence — kangkong is a nitrogen-hungry leafy green; pale yellow leaves indicate nitrogen deficiency.`);
      recs.push(`First harvest at 25–30 days by cutting stems 5 cm above ground — kangkong regrows 3–4 ratoon harvests from the same root base when cut properly.`);
      return recs.slice(0, 5);
    },
    yellow(m, crop, tempSt, rainSt) {
      const recs = [];
      recs.push(`Kangkong is extremely weather-resilient — proceed with planting even in caution conditions, but use stem cuttings instead of seeds for faster establishment.`);
      if (tempSt === 'Caution') {
        recs.push(`High temperature ${m.maxTemp}°C accelerates kangkong bolting (flowering) — harvest earlier at 20–22 days to maintain tender leaf quality before stems harden.`);
      }
      recs.push(`Apply light foliar fertilizer (urea 1 tablespoon/L water) every 7 days — kangkong responds to frequent light feeding better than heavy single application.`);
      recs.push(`Check for leaf-eating caterpillars and white rust — kangkong's only significant pests. Hand-pick or spray neem oil (3 ml/L) in early morning.`);
      recs.push(`If upland type, mound soil 5 cm around stem base at 15 days — encourages adventitious root formation for sturdier multi-harvest plants.`);
      return recs.slice(0, 5);
    },
    red(m, crop, tempSt, rainSt) {
      const recs = [];
      recs.push(`Even kangkong may struggle in extreme conditions — but among all crops, this is your safest bet. Try planting stem cuttings in a protected area.`);
      if (rainSt === 'Danger' && m.maxDailyRain > 150) {
        recs.push(`Extreme flooding over ${m.maxDailyRain.toFixed(1)} mm/day can wash away newly broadcast seeds — switch to stem cutting method and anchor cuttings in mud.`);
      } else if (tempSt === 'Danger') {
        recs.push(`Extreme heat ${m.maxTemp}°C causes rapid moisture loss — cover seed beds with banana leaf mulch and irrigate twice daily (morning and 4 PM).`);
      } else {
        recs.push(`Current alert conditions warrant caution — plant kangkong in containers or raised beds near water source for quick drainage control.`);
      }
      recs.push(`Kangkong can be grown in containers or buckets with 10 cm standing water — an option during severe weather when field access is difficult.`);
      recs.push(`Start stem cuttings in shaded area (under tree or roof overhang) — transplant to open field once weather alerts are lifted.`);
      return recs.slice(0, 5);
    }
  },
  'Onion': {
    green(m, crop) {
      const recs = [];
      recs.push(`Transplant ${crop.name} seedlings (45–50 days old) at 15×10 cm spacing on raised beds 20 cm high. Current ${m.maxTemp}°C and ${m.avgHumidity}% humidity favor bulb initiation.`);
      recs.push(`Apply 3 bags/ha complete fertilizer (14-14-14) at transplanting, worked into bed surface 5 cm from seedling base — onion has shallow roots (top 15 cm).`);
      if (m.avgHumidity > 65) {
        recs.push(`Humidity ${m.avgHumidity}% is on the high end for onion — increase plant spacing to 20×12 cm and avoid overhead watering to prevent purple blotch fungus.`);
      } else {
        recs.push(`Low humidity ${m.avgHumidity}% is ideal for onion — irrigate by furrow method (NOT sprinkler) every 5–7 days with 15 mm per session.`);
      }
      recs.push(`Onion is extremely sensitive to weeds — hand-weed at 15 and 30 days after transplanting. Onion cannot compete with weeds due to its thin, upright leaves.`);
      recs.push(`Stop all irrigation 2 weeks before expected harvest (when 50% of tops fall over naturally) — wet soil during bulb maturation causes storage rot.`);
      return recs.slice(0, 5);
    },
    yellow(m, crop, tempSt, rainSt) {
      const recs = [];
      if (rainSt === 'Caution') {
        recs.push(`Rain ${m.maxDailyRain.toFixed(1)} mm is CRITICAL for onion — this is the most water-sensitive crop. Raise beds to 25–30 cm and install plastic mulch to shed excess water.`);
      }
      if (tempSt === 'Caution') {
        recs.push(`Temperature ${m.maxTemp}°C above onion's comfort zone — mulch beds with rice straw (8 cm thick) to cool root zone and reduce soil temperature by 4–6°C.`);
      }
      recs.push(`Spray mancozeb fungicide (2 g/L) preventively every 7 days — onion purple blotch and Stemphylium leaf blight thrive at humidity above ${crop.humidityOptimalMax}%.`);
      recs.push(`Apply 1 bag/ha muriate of potash (0-0-60) at 45 days after transplanting — potassium improves bulb firmness and storage life from 2 weeks to 2 months.`);
      recs.push(`If weather deteriorates further, consider harvesting immature onions as "spring onions" (green onions) — still marketable at 60 days vs. 90 days for bulb onion.`);
      return recs.slice(0, 5);
    },
    red(m, crop, tempSt, rainSt) {
      const recs = [];
      recs.push(`ABSOLUTELY delay onion transplanting — onion is the most weather-sensitive crop in the rotation. Even 1 day of waterlogging kills 70% of transplants.`);
      if (rainSt === 'Danger') {
        recs.push(`Expected ${m.maxDailyRain.toFixed(1)} mm/day is catastrophic for onion — bulb rot, seedling decay, and bacterial soft rot will destroy the crop within days.`);
      } else {
        recs.push(`Extreme heat ${m.maxTemp}°C prevents bulb formation — onion requires moderate temperatures (${crop.tempOptimalMin}–${crop.tempOptimalMax}°C) for proper bulb initiation.`);
      }
      recs.push(`Keep seedlings in nursery beds with shade net — onion seedlings remain transplantable up to 60 days if given dilute liquid fertilizer weekly.`);
      recs.push(`Consider switching to a more resilient crop (kangkong, sweet potato) if unfavorable conditions persist beyond 2 weeks.`);
      return recs.slice(0, 5);
    }
  },
  'Squash': {
    green(m, crop) {
      const recs = [];
      recs.push(`Direct-sow ${crop.name} seeds 3–4 cm deep at 1×1 m spacing (2 seeds/hill, thin to 1). Soil temperature at ${m.maxTemp}°C triggers germination in 5–7 days.`);
      recs.push(`Prepare planting hills: dig 30×30×30 cm holes, fill with 3 kg decomposed manure mixed with topsoil — squash is a heavy feeder that needs rich organic matter.`);
      if (m.avgHumidity > 75) {
        recs.push(`Humidity ${m.avgHumidity}% promotes powdery mildew on squash — plan preventive sulfur spray at 3-week intervals starting at first true-leaf stage.`);
      } else {
        recs.push(`Moderate humidity ${m.avgHumidity}% is ideal — irrigate at vine base only (25 mm every 4 days); avoid wetting leaves as squash is mildew-prone.`);
      }
      recs.push(`Pinch vine tip after 5th leaf node to encourage lateral branching and more female flowers — squash typically produces male flowers first for 2 weeks.`);
      recs.push(`Hand-pollinate female flowers (swollen base) with male pollen using small brush at 6–8 AM — squash relies heavily on bee pollination which may be low in rainy season.`);
      return recs.slice(0, 5);
    },
    yellow(m, crop, tempSt, rainSt) {
      const recs = [];
      if (rainSt === 'Caution') {
        recs.push(`Rain ${m.maxDailyRain.toFixed(1)} mm moderate risk for squash — elevate planting hills 15 cm above field level and clear drainage to prevent vine crown rot.`);
      }
      if (tempSt === 'Caution') {
        recs.push(`Temperature ${m.maxTemp}°C above optimal — squash vines wilt easily in afternoon heat. Mulch root zone with 10 cm rice straw and irrigate early morning.`);
      }
      recs.push(`Apply foliar fertilizer (20-20-20 at 5 g/L) every 2 weeks during fruiting — squash fruit expands rapidly and depletes soil nutrients faster than root uptake.`);
      recs.push(`Scout for squash vine borer and fruit fly — set yellow sticky traps around field perimeter and spray kaolin clay on developing fruit as physical barrier.`);
      recs.push(`Place straw or cardboard under developing fruit to prevent soil contact rot — squash fruit touching wet soil develops bacterial soft rot within days.`);
      return recs.slice(0, 5);
    },
    red(m, crop, tempSt, rainSt) {
      const recs = [];
      recs.push(`Delay squash planting — seeds will rot before germination in current conditions. Squash seeds have no dormancy protection against extreme weather.`);
      if (rainSt === 'Danger') {
        recs.push(`Heavy rain ${m.maxDailyRain.toFixed(1)} mm/day causes squash crown rot and vine collapse — the wide leaf canopy traps water at stem base creating a rot environment.`);
      } else {
        recs.push(`Heat ${m.maxTemp}°C severely stresses squash — pollen viability drops to near-zero above ${crop.tempMax}°C, meaning no fruit even if vines survive.`);
      }
      recs.push(`Start seeds in seedling trays (2 seeds/cell) in sheltered area — squash transplants well if handled carefully within 10–14 days of emergence.`);
      recs.push(`Prepare planting hills with compost during the delay — decomposition time improves nutrient availability for when planting resumes.`);
      return recs.slice(0, 5);
    }
  },
  'Sweet Potato': {
    green(m, crop) {
      const recs = [];
      recs.push(`Plant ${crop.name} vine cuttings (30 cm, 3–4 nodes) at 30×75 cm spacing on raised mounds 25 cm high. Current ${m.maxTemp}°C accelerates root initiation within 7–10 days.`);
      recs.push(`Use tip cuttings (top 30 cm of healthy vine) for highest tuber yield — basal stem cuttings produce more vines but fewer tubers.`);
      if (m.totalForecastRain > 80) {
        recs.push(`Forecast rain ${m.totalForecastRain.toFixed(1)} mm is beneficial for vine establishment — sweet potato needs consistent moisture for first 30 days. Reduce irrigation after mound formation.`);
      } else {
        recs.push(`Light rain period — irrigate 20 mm every 5 days for first month; sweet potato vines wilt and fail to root in dry soil during establishment.`);
      }
      recs.push(`Apply 2 bags/ha complete fertilizer (14-14-14) at planting in mound base — avoid nitrogen excess after 60 days as it promotes vine growth over tuber enlargement.`);
      recs.push(`Earth up mounds at 45 and 75 days — exposed tubers turn green (solanine) and crack from sun exposure. Proper hilling increases yield by 20–30%.`);
      return recs.slice(0, 5);
    },
    yellow(m, crop, tempSt, rainSt) {
      const recs = [];
      if (rainSt === 'Caution') {
        recs.push(`Rain ${m.maxDailyRain.toFixed(1)} mm moderate — sweet potato tolerates wetness better than most root crops, but raise mound height to 30 cm to keep tuber zone above waterline.`);
      }
      if (tempSt === 'Caution') {
        recs.push(`Temperature ${m.maxTemp}°C high — plant vine cuttings deeper (bury 3 nodes instead of 2) so root initiation zone is in cooler soil.`);
      }
      recs.push(`Scout for sweet potato weevil (Cylas formicarius) — the #1 pest. Cracked soil around mounds lets weevils access tubers. Re-earth mounds to seal cracks.`);
      recs.push(`Flip or lift trailing vines at 60 days — vines that root at nodes divert energy from main tuber, reducing harvest weight by 15–25%.`);
      recs.push(`Apply 1 bag/ha muriate of potash (0-0-60) at 60 days — potassium is the key nutrient for tuber size and starch content in sweet potato.`);
      return recs.slice(0, 5);
    },
    red(m, crop, tempSt, rainSt) {
      const recs = [];
      recs.push(`Delay sweet potato planting — vine cuttings will not root properly in extreme conditions. Keep source vines healthy in nursery for cutting material.`);
      if (rainSt === 'Danger') {
        recs.push(`Flooding at ${m.maxDailyRain.toFixed(1)} mm/day will rot sweet potato vine cuttings before roots form — waterlogged mounds collapse and expose cuttings to pathogens.`);
      } else {
        recs.push(`Extreme heat ${m.maxTemp}°C dries out vine cuttings faster than roots can establish — survival rate drops below 30% without shade and mist irrigation.`);
      }
      recs.push(`Maintain mother vine nursery in shaded, irrigated area — sweet potato cuttings can be taken continuously from healthy mother plants once conditions improve.`);
      recs.push(`Use delay period to prepare mounds with compost (5 kg/mound) — sweet potato benefits most from pre-decomposed organic matter in the root zone.`);
      return recs.slice(0, 5);
    }
  },
  'Pepper': {
    green(m, crop) {
      const recs = [];
      recs.push(`Transplant ${crop.name} seedlings (30–35 days old) at 40×30 cm spacing on raised beds. Current ${m.maxTemp}°C and moderate humidity (${m.avgHumidity}%) favor rapid establishment.`);
      recs.push(`Apply 5 g/plant complete fertilizer (14-14-14) at transplanting; side-dress with 3 g/plant urea at flowering (35–40 days) — pepper is a moderate nitrogen feeder.`);
      if (m.avgHumidity > 70) {
        recs.push(`Humidity ${m.avgHumidity}% raises anthracnose risk on pepper fruit — apply copper hydroxide spray preventively every 10 days starting at first flowering.`);
      } else {
        recs.push(`Low humidity ${m.avgHumidity}% is ideal for pepper — irrigate 15 mm every 3–4 days via furrow; consistent moisture prevents blossom-end rot and flower drop.`);
      }
      recs.push(`Install small bamboo stakes per plant — pepper branches are brittle and snap under fruit weight or light wind. Tie at Y-junction of main branches.`);
      if (m.maxWindSpeed > 20) {
        recs.push(`Wind ${m.maxWindSpeed.toFixed(1)} km/h may cause flower drop (pepper's #1 yield loss factor) — install windbreak using corn or sugarcane strips on windward side.`);
      } else {
        recs.push(`Mulch beds with rice hull or coconut coir to maintain even soil moisture — pepper roots are shallow (top 20 cm) and highly sensitive to moisture fluctuation.`);
      }
      return recs.slice(0, 5);
    },
    yellow(m, crop, tempSt, rainSt) {
      const recs = [];
      if (tempSt === 'Caution') {
        recs.push(`Temperature ${m.maxTemp}°C exceeds pepper comfort — flower drop accelerates above ${crop.tempOptimalMax}°C. Install 40% shade net and mist-irrigate at midday to cool canopy.`);
      }
      if (rainSt === 'Caution') {
        recs.push(`Rain ${m.maxDailyRain.toFixed(1)} mm threatens pepper — waterlogging for even 12 hours causes root asphyxiation. Raise beds to 25 cm and ensure outlet drainage.`);
      }
      recs.push(`Spray Trichoderma bio-fungicide (10 g/L) as soil drench every 14 days — pepper is extremely susceptible to Phytophthora root rot in wet conditions.`);
      recs.push(`Prune lower branches below first fork — improves air circulation and prevents soil-splash diseases; pepper anthracnose starts from lower fruit and spreads upward.`);
      recs.push(`If flowers are dropping despite moderate weather, check for thrips infestation — tiny thrips damage flower buds causing abort. Apply spinosad-based spray.`);
      return recs.slice(0, 5);
    },
    red(m, crop, tempSt, rainSt) {
      const recs = [];
      recs.push(`Do NOT transplant pepper — this is one of the most sensitive crops to weather extremes. Seedling survival will be very low.`);
      if (rainSt === 'Danger') {
        recs.push(`Heavy rain ${m.maxDailyRain.toFixed(1)} mm/day causes 90% flower drop and bacterial wilt explosion in pepper — wet soil spreads Ralstonia bacteria rapidly between plants.`);
      } else {
        recs.push(`Extreme heat ${m.maxTemp}°C causes complete flower abortion in pepper — zero fruit set possible. Even hardened seedlings wilt and defoliate.`);
      }
      recs.push(`Keep seedlings in nursery under 50% shade net — pepper seedlings remain transplantable up to 40 days if given liquid fertilizer (urea 1 tbsp/L) weekly.`);
      recs.push(`Prepare beds with Trichoderma-inoculated compost during delay — building biological disease suppression in soil is critical before planting pepper.`);
      return recs.slice(0, 5);
    }
  }
};

/**
 * Generate crop-specific, weather-parameter-aware recommendations.
 * @param {string} cropKey - e.g. 'Rice', 'Tomato'
 * @param {Object} crop - crop profile object
 * @param {string} trafficLight - 'GREEN', 'YELLOW', 'RED'
 * @param {Object} metrics - { maxTemp, minTemp, maxDailyRain, totalForecastRain, maxWindSpeed, avgHumidity }
 * @param {string} tempStatus - 'Ideal', 'Caution', 'Danger'
 * @param {string} rainStatus - 'Ideal', 'Caution', 'Danger'
 * @returns {string[]} 3-5 unique recommendation bullets
 */
function generateCropRecommendations(cropKey, crop, trafficLight, metrics, tempStatus, rainStatus) {
  const cropRecs = CROP_RECOMMENDATIONS[cropKey];
  if (!cropRecs) {
    // Fallback for any unknown crop (should not happen with allowlist)
    return [
      `Check specific agronomic guidelines for ${crop.name} before planting in current conditions.`,
      `Monitor temperature (${metrics.maxTemp}°C) and rainfall (${metrics.maxDailyRain.toFixed(1)} mm/day) against crop tolerance thresholds.`,
      `Consult local agricultural extension officer for ${crop.name}-specific field management advice.`
    ];
  }

  if (trafficLight === 'GREEN') {
    return cropRecs.green(metrics, crop);
  } else if (trafficLight === 'YELLOW') {
    return cropRecs.yellow(metrics, crop, tempStatus, rainStatus);
  } else {
    return cropRecs.red(metrics, crop, tempStatus, rainStatus);
  }
}

/**
 * Evaluates safe-to-plant conditions for a given crop and forecast data.
 * @param {string} cropKey - Key matching crop profile (e.g. 'Rice', 'Tomato')
 * @param {Object} forecastData - Current/Forecast weather payload
 * @param {Array} alertList - Active severe weather alerts
 * @returns {Object} Comprehensive evaluation result
 */
function evaluatePlantingSafety(cropKey, forecastData = {}, alertList = []) {
  const crop = CROP_PROFILES[cropKey] || CROP_PROFILES['Rice'];

  // Extract weather metrics safely
  const days = Array.isArray(forecastData.days) ? forecastData.days : [];
  const currentTemp = parseFloat(forecastData.currentTemp || forecastData.temp || 28);
  const currentHum = parseFloat(forecastData.currentHumidity || forecastData.humidity || 75);
  const currentWind = parseFloat(forecastData.currentWindSpeed || forecastData.windSpeed || 10);

  let maxTemp = currentTemp;
  let minTemp = currentTemp - 3;
  let maxDailyRain = parseFloat(forecastData.currentRain || 0);
  let totalForecastRain = maxDailyRain;
  let maxWindSpeed = currentWind;
  let avgHumidity = currentHum;

  if (days.length > 0) {
    let humSum = 0;
    let tempMaxes = [];
    let tempMins = [];
    let rainVals = [];
    let windVals = [];

    days.forEach(d => {
      if (d.temp_max != null) tempMaxes.push(parseFloat(d.temp_max));
      if (d.temp_min != null) tempMins.push(parseFloat(d.temp_min));
      if (d.rainfall != null) rainVals.push(parseFloat(d.rainfall));
      if (d.wind_speed != null) windVals.push(parseFloat(d.wind_speed));
      if (d.humidity != null) humSum += parseFloat(d.humidity);
    });

    if (tempMaxes.length) maxTemp = Math.max(...tempMaxes);
    if (tempMins.length) minTemp = Math.min(...tempMins);
    if (rainVals.length) {
      maxDailyRain = Math.max(...rainVals);
      totalForecastRain = rainVals.reduce((a, b) => a + b, 0);
    }
    if (windVals.length) maxWindSpeed = Math.max(...windVals);
    if (humSum > 0) avgHumidity = Math.round(humSum / days.length);
  }

  // Factor 1: Temperature Score (0-100)
  let tempScore = 100;
  let tempStatus = 'Ideal';
  let tempMessage = `Forecast temp (${maxTemp}°C) is within ideal range (${crop.tempOptimalMin}°C - ${crop.tempOptimalMax}°C).`;

  if (maxTemp > crop.tempMax) {
    tempScore = Math.max(10, 100 - (maxTemp - crop.tempMax) * 20);
    tempStatus = 'Danger';
    tempMessage = `Excessive heat (${maxTemp}°C) exceeds ${crop.name} tolerance threshold (${crop.tempMax}°C). Risk of seed drying and heat stress.`;
  } else if (maxTemp > crop.tempOptimalMax) {
    tempScore = Math.max(50, 100 - (maxTemp - crop.tempOptimalMax) * 10);
    tempStatus = 'Caution';
    tempMessage = `Temperature (${maxTemp}°C) is above optimal (${crop.tempOptimalMax}°C). Provide shade mulching or pre-irrigate.`;
  } else if (minTemp < crop.tempMin) {
    tempScore = Math.max(20, 100 - (crop.tempMin - minTemp) * 15);
    tempStatus = 'Caution';
    tempMessage = `Night temp drop (${minTemp}°C) below minimum threshold (${crop.tempMin}°C) will slow germination.`;
  }

  // Factor 2: Rainfall & Moisture Score (0-100)
  let rainScore = 100;
  let rainStatus = 'Ideal';
  let rainMessage = `Rainfall forecast (${maxDailyRain.toFixed(1)}mm peak day, ${totalForecastRain.toFixed(1)}mm 5-day total) is safe.`;

  if (maxDailyRain > crop.dailyRainMax) {
    rainScore = Math.max(0, 100 - (maxDailyRain - crop.dailyRainMax) * 3);
    rainStatus = 'Danger';
    rainMessage = `Downpour forecast (${maxDailyRain.toFixed(1)}mm/day) exceeds ${crop.name} rain limit (${crop.dailyRainMax}mm/day). High risk of seed wash-off and waterlogging.`;
  } else if (totalForecastRain > crop.totalRainMax) {
    rainScore = Math.max(30, 100 - (totalForecastRain - crop.totalRainMax) * 1.5);
    rainStatus = 'Danger';
    rainMessage = `Cumulative 5-day rain (${totalForecastRain.toFixed(1)}mm) exceeds crop limit (${crop.totalRainMax}mm). Risk of root suffocation.`;
  } else if (maxDailyRain > crop.dailyRainMax * 0.7 || totalForecastRain > crop.totalRainMax * 0.7) {
    rainScore = 65;
    rainStatus = 'Caution';
    rainMessage = `Moderate rainfall (${maxDailyRain.toFixed(1)}mm/day) expected. Ensure field drainage channels are clear before planting.`;
  }

  // Factor 3: Wind & Environmental Stress Score (0-100)
  let envScore = 100;
  let envStatus = 'Ideal';
  let envMessage = `Wind speeds (${maxWindSpeed.toFixed(1)} km/h) and humidity (${avgHumidity}%) present low mechanical stress.`;

  if (maxWindSpeed > crop.windSpeedMax) {
    envScore = Math.max(20, 100 - (maxWindSpeed - crop.windSpeedMax) * 4);
    envStatus = 'Caution';
    envMessage = `Strong winds (${maxWindSpeed.toFixed(1)} km/h) exceed crop wind tolerance (${crop.windSpeedMax} km/h). Stake young seedlings.`;
  }

  // Severe Alert Penalties
  let alertPenalty = 0;
  let activeAlertDetails = [];
  if (Array.isArray(alertList) && alertList.length > 0) {
    alertList.forEach(alert => {
      const title = (alert.title || alert.type || '').toLowerCase();
      if (title.includes('typhoon') || title.includes('storm') || title.includes('flood') || title.includes('heavy rain')) {
        alertPenalty += 40;
        activeAlertDetails.push(`Severe Warning: ${alert.title || alert.type || 'Storm Warning'}`);
      } else if (title.includes('heat') || title.includes('drought')) {
        alertPenalty += 25;
        activeAlertDetails.push(`Severe Warning: ${alert.title || alert.type || 'Heat Warning'}`);
      }
    });
  }

  // Overall Planting Safety Index (%)
  let safetyIndex = Math.round(
    (tempScore * 0.40) + (rainScore * 0.40) + (envScore * 0.20) - alertPenalty
  );
  safetyIndex = Math.max(0, Math.min(100, safetyIndex));

  // Risk Classification
  let riskLevel = 'OPTIMAL'; // OPTIMAL, CAUTION, HIGH_RISK
  let trafficLight = 'GREEN';
  let verdictTitle = '';
  let verdictDesc = '';

  if (safetyIndex >= 75) {
    riskLevel = 'OPTIMAL';
    trafficLight = 'GREEN';
    verdictTitle = `GREEN: OPTIMAL PLANTING WINDOW (${safetyIndex}% SAFETY INDEX)`;
    verdictDesc = `Weather outlook for ${crop.name} is highly favorable over the next 5 days. Low risk of weather damage.`;
  } else if (safetyIndex >= 50) {
    riskLevel = 'CAUTION';
    trafficLight = 'YELLOW';
    verdictTitle = `YELLOW: PLANT WITH PRECAUTION (${safetyIndex}% SAFETY INDEX)`;
    verdictDesc = `Moderate risk factors detected for ${crop.name}. Planting is feasible with precautionary field management.`;
  } else {
    riskLevel = 'HIGH_RISK';
    trafficLight = 'RED';
    verdictTitle = `RED: DELAY PLANTING BATCH (${safetyIndex}% SAFETY INDEX)`;
    verdictDesc = `Unfavorable weather conditions for ${crop.name}. Sowing now risks seed rot, wash-out, or severe germination failure.`;
  }

  // Generate crop-specific, weather-parameter-aware recommendations
  const metrics = {
    maxTemp,
    minTemp,
    maxDailyRain,
    totalForecastRain,
    maxWindSpeed,
    avgHumidity
  };
  const recommendations = generateCropRecommendations(cropKey, crop, trafficLight, metrics, tempStatus, rainStatus);

  return {
    cropKey,
    crop: {
      name: crop.name,
      category: crop.category,
      icon: crop.icon,
      description: crop.description,
      soilMoisturePreference: crop.soilMoisturePreference
    },
    safetyIndex,
    riskLevel,
    trafficLight,
    verdictTitle,
    verdictDesc,
    metrics,
    factors: {
      temperature: { score: Math.round(tempScore), status: tempStatus, message: tempMessage },
      rainfall: { score: Math.round(rainScore), status: rainStatus, message: rainMessage },
      environment: { score: Math.round(envScore), status: envStatus, message: envMessage }
    },
    activeAlerts: activeAlertDetails,
    recommendations
  };
}

/**
 * Returns list of available crop profiles for UI dropdowns/cards.
 */
function getCropProfiles() {
  return Object.keys(CROP_PROFILES).map(key => ({
    key,
    ...CROP_PROFILES[key]
  }));
}

module.exports = {
  CROP_PROFILES,
  evaluatePlantingSafety,
  getCropProfiles
};
