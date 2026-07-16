const BASE_URL = 'http://api.agromonitoring.com/agro/1.0';

const MANDAON_POLYGON = {
  name: 'Mandaon Agricultural Zone - Masbate',
  geo_json: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [123.225, 12.215],
          [123.240, 12.215],
          [123.245, 12.225],
          [123.243, 12.235],
          [123.238, 12.242],
          [123.228, 12.242],
          [123.223, 12.235],
          [123.222, 12.225],
          [123.225, 12.215]
        ]
      ]
    }
  }
};

let cachedPolygonId = null;

async function getOrCreatePolygon() {
  if (cachedPolygonId) {
    return cachedPolygonId;
  }

  const appId = process.env.AGROMONITORING_API_KEY;
  if (!appId) {
    throw new Error('AGROMONITORING_API_KEY not configured');
  }

  try {
    const listRes = await fetch(`${BASE_URL}/polygons?appid=${appId}`);
    if (listRes.ok) {
      const polygons = await listRes.json();
      const existing = polygons.find(p => p.name === MANDAON_POLYGON.name);
      if (existing) {
        cachedPolygonId = existing.id;
        return cachedPolygonId;
      }
    }
  } catch (e) {
    console.warn('Satellite: Could not list polygons:', e.message);
  }

  const createRes = await fetch(`${BASE_URL}/polygons?appid=${appId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(MANDAON_POLYGON)
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    const idMatch = errText.match(/polygon '([a-f0-9]+)'/);
    if (idMatch) {
      cachedPolygonId = idMatch[1];
      return cachedPolygonId;
    }
    throw new Error(`Failed to create polygon: ${createRes.status} - ${errText}`);
  }

  const polygon = await createRes.json();
  cachedPolygonId = polygon.id;
  return cachedPolygonId;
}

async function searchImages(startDate, endDate) {
  const appId = process.env.AGROMONITORING_API_KEY;
  const polygonId = await getOrCreatePolygon();

  const start = Math.floor(startDate.getTime() / 1000);
  const end = Math.floor(endDate.getTime() / 1000);

  const url = `${BASE_URL}/image/search?start=${start}&end=${end}&polyid=${polygonId}&appid=${appId}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Image search failed: ${res.status}`);
  }

  return res.json();
}

async function fetchImageBuffer(imageUrl) {
  const res = await fetch(imageUrl);
  if (!res.ok) {
    throw new Error(`Image fetch failed: ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function fetchStats(statsUrl) {
  const res = await fetch(statsUrl);
  if (!res.ok) {
    throw new Error(`Stats fetch failed: ${res.status}`);
  }
  return res.json();
}

function assessVegetationHealth(stats) {
  if (!stats || stats.mean === undefined) {
    return { status: 'NO_DATA', label: 'No Data Available', description: 'Insufficient satellite data for assessment.' };
  }

  const mean = stats.mean;
  const median = stats.median;

  if (mean >= 0.6) {
    return {
      status: 'HEALTHY',
      label: 'Dense Healthy Vegetation',
      description: 'Strong crop canopy detected. Vegetation is lush and actively photosynthesizing.'
    };
  } else if (mean >= 0.4) {
    return {
      status: 'MODERATE',
      label: 'Moderate Vegetation',
      description: 'Crop canopy present but showing some stress. Monitor for pest, disease, or water deficiency.'
    };
  } else if (mean >= 0.2) {
    return {
      status: 'STRESSED',
      label: 'Stressed / Sparse Vegetation',
      description: 'Weak vegetation signal. Crop canopy may be damaged, thin, or under significant stress. Field inspection recommended.'
    };
  } else if (mean >= 0.0) {
    return {
      status: 'DAMAGED',
      label: 'Canopy Damage Detected',
      description: 'Very low vegetation index. Crop canopy may be destroyed, washed away, or severely degraded. Immediate field assessment needed.'
    };
  } else {
    return {
      status: 'NO_VEGETATION',
      label: 'No Vegetation / Bare Soil',
      description: 'Negative NDVI indicates water, bare soil, or non-vegetated surface. Crop canopy has been completely removed or washed away.'
    };
  }
}

module.exports = {
  getOrCreatePolygon,
  searchImages,
  fetchImageBuffer,
  fetchStats,
  assessVegetationHealth,
  MANDAON_POLYGON
};
