# Plot Health Status — Dynamic Scoring System

## Overview

Replaces the old hardcoded sensitivity-based badge (`farmer-dashboard.js:641-645`) with a **weighted composite health score** computed from live OpenWeather API data vs crop-specific tolerances.

## Scoring Factors

| Factor | Weight | Source | Logic |
|---|---|---|---|
| **Rainfall stress** | 35% | `forecastedRain` vs `crop.rain_tolerance` | Exceeds limit → 10pts, >50% of limit → 50pts, >80% → 80pts |
| **Temperature stress** | 30% | Forecast `temp_max`/`temp_min` vs `crop.ideal_temp_min/max` | Out of range by >5°C → 10pts, out of range → 40pts, near limit → 80pts |
| **Humidity / disease risk** | 15% | Forecast max humidity | ≥90% → 20pts, ≥85% → 50pts, ≥80% → 80pts |
| **Growth stage vulnerability** | 10% | `getGrowthStage()` output | Seedling/Flowering/Tasseling are more vulnerable → 70pts |
| **Cumulative forecast stress** | 10% | Count of adverse days in 5-day forecast | ≥80% days adverse → 10pts, ≥50% → 40pts, ≥30% → 70pts |

## Badge Mapping

| Score Range | Badge Class | Label |
|---|---|---|
| ≥ 80 | `badge-green` | **Healthy** |
| 50–79 | `badge-blue` | **Satisfactory** |
| 25–49 | `badge-amber` | **At Risk** |
| < 25 | `badge-red` | **Critical** |
| Plot not planted | `badge-gray` | **Available** |

## Data Flow

```
OpenWeather API
    ↓
/api/weather/current  →  liveWeather
/api/weather/forecast →  liveForecast, forecastedRain
    ↓
loadWeatherData() → fetches both endpoints → calls renderAllViews()
    ↓
renderCropManagementView() → calls computePlotHealth(plot) per plot
    ↓
computePlotHealth() reads liveForecast + cropDataRepo[crop]
    ↓
Returns { score, label, badgeClass } → applied to .plot-card-badge
```

## Data Sources (all pre-existing)

| Data | Stored In | Accessed Via |
|---|---|---|
| Crop rain tolerance | `crop_repository.rain_tolerance` | `cropDataRepo[crop].limit` |
| Crop ideal temp range | `crop_repository.ideal_temp_min/max` | `cropDataRepo[crop].tempMin/Max` |
| Days to harvest | `crop_repository.days_to_harvest` | `cropDataRepo[crop].growthDays` |
| Current weather | OpenWeather API | `liveWeather` |
| 5-day forecast | OpenWeather API | `liveForecast` |
| Forecast max rain | computed from forecast | `forecastedRain` |
| Planted date | `planting_records.planting_date` | `plot.planted` |

## Auto-Refresh

- Weather data refreshes every 10 minutes (`setInterval`, line 396)
- `renderAllViews()` is called after each weather refresh, so badges update automatically
- Badges also update after plant/harvest/edit/delete operations (they call `loadFarmerData()` → `renderAllViews()`)

## Files Changed

| File | Change |
|---|---|
| `public/js/farmer-dashboard.js` | Added `tempMin`/`tempMax` to `cropDataRepo`, added `computePlotHealth()`, replaced badge logic, added `renderAllViews()` call after weather load |
| `public/css/crop-management.css` | Added `.badge-red` class |

## No Database Migration Needed

All changes are frontend-only. Data already exists in `crop_repository` and OpenWeather API responses. The new `tempMin`/`tempMax` fields in `cropDataRepo` parse the existing `ideal_temp_min`/`ideal_temp_max` decimals from the database.
