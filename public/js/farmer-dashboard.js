// 
        // ACTIVE STATE DATABASE (Client-Side State)
        // 
        var activeCrops = [];
        var cropDataRepo = {};
        var dbCrops = [];
        var dbPlots = [];

        // Live weather data from OpenWeather API (replaces hardcoded mock)
        var liveWeather = null;
        var liveForecast = null;
        var forecastedRain = 0; // Will be updated from API

        // 
        // OPENWEATHER API DATA LOADING
        // 

        async function loadWeatherData() {
            try {
                // Fetch current weather and forecast using Masbate City defaults from server
                var [currentRes, forecastRes] = await Promise.all([
                    fetch('/api/weather/current'),
                    fetch('/api/weather/forecast')
                ]);

                if (currentRes.ok) {
                    liveWeather = await currentRes.json();
                    forecastedRain = liveWeather.rainfall || 0;
                    
                    // Dynamically update location strings everywhere on the page
                    var locationString = liveWeather.location + ', ' + liveWeather.country;
                    document.querySelectorAll('.dynamic-location').forEach(function(el) {
                        el.textContent = locationString;
                    });
                    document.querySelectorAll('.dynamic-location-city').forEach(function(el) {
                        el.textContent = liveWeather.location;
                    });

                    renderWeatherMetrics(liveWeather);
                    renderActiveAlerts(liveWeather);
                    renderDecisionInsights(liveWeather);
                    renderCurrentConditions(liveWeather);
                    updateLastUpdated(liveWeather.fetched_at);
                } else {
                    renderWeatherError();
                }

                if (forecastRes.ok) {
                    liveForecast = await forecastRes.json();
                    // Update forecastedRain to max forecasted daily rain
                    if (liveForecast.days && liveForecast.days.length > 0) {
                        forecastedRain = Math.max(...liveForecast.days.map(function(d) { return d.rainfall; }));
                    }
                    renderForecastRow(liveForecast);
                    renderRainfallTrend(liveForecast);
                    renderRiskForecast(liveForecast);
                    renderForecastSummary(liveForecast);
                    renderWeatherArchive(liveForecast);
                    // Re-run predictor with live data
                    updatePredictor();
                }

            } catch (err) {
                console.error('Failed to load weather data:', err);
                renderWeatherError();
            }
        }

        // 
        // WEATHER RENDERING FUNCTIONS
        // 

        function updateLastUpdated(timestamp) {
            var el = document.getElementById('weather-last-updated');
            var el2 = document.getElementById('analytics-last-updated');
            var now = new Date(timestamp);
            var timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            var dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            var text = 'OpenWeather Live \u00B7 Updated ' + dateStr + ' ' + timeStr;
            if (el) el.textContent = text;
            if (el2) el2.textContent = text;
        }

        function renderWeatherMetrics(data) {
            // Temperature
            var tempVal = document.getElementById('metric-temp-value');
            var tempDelta = document.getElementById('metric-temp-delta');
            if (tempVal) tempVal.innerHTML = data.temperature + '<span class="metric-unit">\u00B0C</span>';
            if (tempDelta) {
                var ti = data.insights.temperature;
                tempDelta.className = 'metric-delta' + (ti.direction === 'down' ? ' down' : '');
                var arrow = ti.direction === 'down'
                    ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>'
                    : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';
                tempDelta.innerHTML = arrow + ' ' + ti.message;
            }

            // Humidity
            var humVal = document.getElementById('metric-humidity-value');
            var humDelta = document.getElementById('metric-humidity-delta');
            if (humVal) humVal.innerHTML = data.humidity + '<span class="metric-unit">%</span>';
            if (humDelta) {
                var hi = data.insights.humidity;
                humDelta.className = 'metric-delta' + (hi.direction === 'down' ? ' down' : '');
                var arrow2 = hi.direction === 'down'
                    ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>'
                    : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';
                humDelta.innerHTML = arrow2 + ' ' + hi.message;
            }

            // Wind Speed
            var windVal = document.getElementById('metric-wind-value');
            var windDelta = document.getElementById('metric-wind-delta');
            if (windVal) windVal.innerHTML = data.wind_speed + '<span class="metric-unit">km/h</span>';
            if (windDelta) {
                var wi = data.insights.wind;
                windDelta.className = 'metric-delta' + (wi.direction === 'down' ? ' down' : '');
                var arrow3 = wi.direction === 'down'
                    ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>'
                    : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';
                windDelta.innerHTML = arrow3 + ' ' + wi.message;
            }

            // Rainfall
            var rainVal = document.getElementById('metric-rain-value');
            var rainDelta = document.getElementById('metric-rain-delta');
            if (rainVal) rainVal.innerHTML = data.rainfall + '<span class="metric-unit">mm</span>';
            if (rainDelta) {
                var ri = data.insights.rainfall;
                rainDelta.className = 'metric-delta' + (ri.direction === 'down' ? ' down' : '');
                var arrow4 = ri.direction === 'down'
                    ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>'
                    : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';
                rainDelta.innerHTML = arrow4 + ' ' + ri.message;
            }

            // Update topbar alert count
            var alertCount = 0;
            if (data.insights.temperature.status === 'danger' || data.insights.temperature.status === 'warning') alertCount++;
            if (data.insights.humidity.status === 'danger' || data.insights.humidity.status === 'warning') alertCount++;
            if (data.insights.wind.status === 'danger' || data.insights.wind.status === 'warning') alertCount++;
            if (data.insights.rainfall.status === 'danger' || data.insights.rainfall.status === 'warning') alertCount++;
            var alertCountEl = document.getElementById('topbar-alert-count');
            if (alertCountEl) alertCountEl.textContent = alertCount + ' Alert' + (alertCount !== 1 ? 's' : '');
        }

        function renderForecastRow(forecast) {
            var container = document.getElementById('forecast-row-container');
            if (!container || !forecast.days) return;

            var html = '';
            forecast.days.forEach(function(day, idx) {
                var isToday = idx === 0;
                html += '<div class="forecast-day' + (isToday ? ' today' : '') + '">' +
                    '<div class="fc-day">' + (isToday ? 'Today' : day.day_name) + '</div>' +
                    '<div class="fc-icon"><img src="' + day.weather_icon_url + '" alt="' + day.weather_main + '" width="32" height="32" style="display:block;margin:0 auto;"></div>' +
                    '<div class="fc-temp">' + day.temp_max + '\u00B0</div>' +
                    '<div class="fc-low">' + day.temp_min + '\u00B0</div>' +
                '</div>';
            });
            container.innerHTML = html;
        }

        function renderRainfallTrend(forecast) {
            var container = document.getElementById('rainfall-trend-container');
            if (!container || !forecast.days) return;

            var maxRain = Math.max(...forecast.days.map(function(d) { return d.rainfall; }), 1);
            var html = '';
            forecast.days.forEach(function(day) {
                var pct = Math.round((day.rainfall / maxRain) * 100);
                var barColor = day.rainfall >= 20 ? '#C0531A' : (day.rainfall >= 10 ? '#D4870A' : '#5A8A42');
                html += '<div class="rain-bar-row">' +
                    '<div class="rain-bar-label">' + day.day_name + '</div>' +
                    '<div class="rain-bar-track"><div class="rain-bar-fill" style="width:' + pct + '%; background:' + barColor + ';"></div></div>' +
                    '<div class="rain-bar-val">' + day.rainfall + '</div>' +
                '</div>';
            });
            container.innerHTML = html;
        }

        function renderActiveAlerts(data) {
            var container = document.getElementById('alerts-list');
            if (!container) return;

            var alerts = [];
            var ins = data.insights;

            if (ins.temperature.status === 'danger') {
                alerts.push({ type: 'danger', title: 'Extreme Temperature: ' + data.temperature + '\u00B0C', desc: ins.temperature.message + '. Irrigate immediately and protect sensitive crops.', badge: 'ALERT' });
            } else if (ins.temperature.status === 'warning') {
                alerts.push({ type: 'warn', title: 'Temperature Warning: ' + data.temperature + '\u00B0C', desc: ins.temperature.message + '. Monitor crop stress levels.', badge: 'WATCH' });
            }
            if (ins.humidity.status === 'danger') {
                alerts.push({ type: 'danger', title: 'Critical Humidity: ' + data.humidity + '%', desc: ins.humidity.message + '. Apply fungicide to vulnerable crops.', badge: 'ALERT' });
            } else if (ins.humidity.status === 'warning') {
                alerts.push({ type: 'warn', title: 'High Humidity Watch: ' + data.humidity + '%', desc: ins.humidity.message + '. Check rice plots for root and stem rot.', badge: 'WATCH' });
            }
            if (ins.wind.status === 'danger') {
                alerts.push({ type: 'danger', title: 'High Wind Alert: ' + data.wind_speed + ' km/h', desc: ins.wind.message, badge: 'ALERT' });
            } else if (ins.wind.status === 'warning') {
                alerts.push({ type: 'warn', title: 'Wind Advisory: ' + data.wind_speed + ' km/h', desc: ins.wind.message, badge: 'WATCH' });
            }
            if (ins.rainfall.status === 'danger') {
                alerts.push({ type: 'danger', title: 'Heavy Rainfall: ' + data.rainfall + 'mm', desc: ins.rainfall.message + '. Drainage check required.', badge: 'ALERT' });
            } else if (ins.rainfall.status === 'warning') {
                alerts.push({ type: 'warn', title: 'Rain Advisory: ' + data.rainfall + 'mm', desc: ins.rainfall.message, badge: 'WATCH' });
            }

            if (alerts.length === 0) {
                container.innerHTML = '<div style="padding:16px; background:#F2F7ED; border-radius:10px; text-align:center;">' +
                    '<div style="font-size:13px; font-weight:600; color:#3A6824;"> All Clear</div>' +
                    '<div style="font-size:12px; color:#5A7A40; margin-top:4px;">No weather alerts at this time. Conditions are favorable for farming.</div>' +
                '</div>';
                return;
            }

            var html = '';
            alerts.forEach(function(a) {
                var iconSvg = a.type === 'danger'
                    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C0531A" stroke-width="2"><path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25"/></svg>'
                    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4870A" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>';
                html += '<div class="alert-item alert-' + a.type + '">' +
                    '<div class="alert-icon-wrap aw-' + a.type + '">' + iconSvg + '</div>' +
                    '<div class="alert-body"><div class="alert-title">' + a.title + '</div><div class="alert-desc">' + a.desc + '</div></div>' +
                    '<div class="alert-badge ab-' + a.type + '">' + a.badge + '</div></div>';
            });
            container.innerHTML = html;
        }

        function renderDecisionInsights(data) {
            var container = document.getElementById('decision-insights-list');
            if (!container) return;

            var ins = data.insights;
            var html = '';

            // Temperature insight
            var tempBg = ins.temperature.status === 'good' ? '#F2F7ED' : (ins.temperature.status === 'warning' ? '#FEF8EC' : '#FEF0EC');
            var tempColor = ins.temperature.status === 'good' ? '#3A6824' : (ins.temperature.status === 'warning' ? '#7A4D00' : '#8A2A00');
            var tempTextColor = ins.temperature.status === 'good' ? '#5A7A40' : (ins.temperature.status === 'warning' ? '#9A6020' : '#9A3A20');
            var tempIcon = ins.temperature.status === 'good'
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3A6824" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
                : (ins.temperature.status === 'warning'
                    ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A4D00" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
                    : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A2A00" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>');
            html += '<div style="padding:12px;background:' + tempBg + ';border-radius:10px;">' +
                '<div style="font-size:12px;font-weight:600;color:' + tempColor + ';margin-bottom:4px;display:flex;align-items:center;gap:6px;">' + tempIcon + ' Temperature: ' + data.temperature + '\u00B0C (Feels like ' + data.feels_like + '\u00B0C)</div>' +
                '<div style="font-size:12px;color:' + tempTextColor + ';line-height:1.5;">' + ins.temperature.message + '. Current conditions: ' + data.weather_description + '.</div></div>';

            // Humidity insight
            var humBg = ins.humidity.status === 'good' ? '#F2F7ED' : (ins.humidity.status === 'warning' ? '#FEF8EC' : '#FEF0EC');
            var humColor = ins.humidity.status === 'good' ? '#3A6824' : (ins.humidity.status === 'warning' ? '#7A4D00' : '#8A2A00');
            var humTextColor = ins.humidity.status === 'good' ? '#5A7A40' : (ins.humidity.status === 'warning' ? '#9A6020' : '#9A3A20');
            var humIcon = ins.humidity.status === 'good'
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3A6824" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
                : (ins.humidity.status === 'warning'
                    ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A4D00" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
                    : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A2A00" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>');
            html += '<div style="padding:12px;background:' + humBg + ';border-radius:10px;">' +
                '<div style="font-size:12px;font-weight:600;color:' + humColor + ';margin-bottom:4px;display:flex;align-items:center;gap:6px;">' + humIcon + ' Humidity: ' + data.humidity + '%</div>' +
                '<div style="font-size:12px;color:' + humTextColor + ';line-height:1.5;">' + ins.humidity.message + '. Visibility: ' + data.visibility + ' km.</div></div>';

            container.innerHTML = html;
        }

        function renderCurrentConditions(data) {
            var container = document.getElementById('current-conditions-summary');
            if (!container) return;

            var items = [
                { label: 'Temperature', value: data.temperature + '\u00B0C', sub: 'Feels like ' + data.feels_like + '\u00B0C' },
                { label: 'Humidity', value: data.humidity + '%', sub: data.insights.humidity.message },
                { label: 'Wind', value: data.wind_speed + ' km/h', sub: data.insights.wind.message },
                { label: 'Rainfall', value: data.rainfall + ' mm', sub: data.insights.rainfall.message },
                { label: 'Pressure', value: data.pressure + ' hPa', sub: 'Atmospheric pressure' },
                { label: 'Clouds', value: data.clouds + '%', sub: data.weather_description }
            ];

            var html = '';
            items.forEach(function(item) {
                html += '<div style="padding:10px 12px; background:#F7F5F0; border-radius:8px;">' +
                    '<div style="font-size:10px; text-transform:uppercase; color:#9A9790; font-weight:600; letter-spacing:0.5px;">' + item.label + '</div>' +
                    '<div style="font-size:18px; font-weight:700; color:#1C1C1A; margin:2px 0;">' + item.value + '</div>' +
                    '<div style="font-size:11px; color:#7A7773;">' + item.sub + '</div></div>';
            });
            container.innerHTML = html;
        }

        function renderRiskForecast(forecast) {
            var container = document.getElementById('risk-forecast-container');
            if (!container || !forecast.days) return;

            var risks = [];
            forecast.days.forEach(function(day) {
                if (day.rainfall >= 20) {
                    risks.push({ type: 'danger', bg: '#FEF0EC', border: '#FAD9D0', color: '#C0531A', textColor: '#9A3A20',
                        title: '[Rain] ' + day.day_name + ': Heavy Rain Hazard',
                        desc: 'Forecast: ' + day.rainfall + 'mm rainfall. Check drainage channels and protect sensitive crops.' });
                } else if (day.rainfall >= 10) {
                    risks.push({ type: 'warning', bg: '#FEF8EC', border: '#FAECD0', color: '#D4870A', textColor: '#9A6020',
                        title: '[Rain] ' + day.day_name + ': Moderate Rain Expected',
                        desc: 'Forecast: ' + day.rainfall + 'mm rainfall. Monitor soil saturation levels.' });
                }
                if (day.temp_max >= 35) {
                    risks.push({ type: 'danger', bg: '#FEF0EC', border: '#FAD9D0', color: '#C0531A', textColor: '#9A3A20',
                        title: '[Heat] ' + day.day_name + ': Extreme Heat Warning',
                        desc: 'Forecast: ' + day.temp_max + '\u00B0C. Crops will experience severe moisture stress. Schedule extra irrigation.' });
                } else if (day.temp_max >= 33) {
                    risks.push({ type: 'warning', bg: '#FEF8EC', border: '#FAECD0', color: '#D4870A', textColor: '#9A6020',
                        title: '[Heat] ' + day.day_name + ': High Temperature Alert',
                        desc: 'Forecast: ' + day.temp_max + '\u00B0C. Consider pre-watering irrigation cycles for sensitive crops.' });
                }
                if (day.humidity >= 85) {
                    risks.push({ type: 'warning', bg: '#FEF8EC', border: '#FAECD0', color: '#D4870A', textColor: '#9A6020',
                        title: '[Alert] ' + day.day_name + ': Disease Risk from Humidity',
                        desc: 'Average humidity: ' + day.humidity + '%. Monitor rice plots for blast, rot, and fungal infections.' });
                }
            });

            if (risks.length === 0) {
                container.innerHTML = '<div style="padding:16px; background:#F2F7ED; border-radius:10px; text-align:center;">' +
                    '<div style="font-size:13px; font-weight:600; color:#3A6824;"> Low Risk Period</div>' +
                    '<div style="font-size:12px; color:#5A7A40; margin-top:4px;">No significant weather risks detected in the forecast. Good conditions for farming activities.</div></div>';
                return;
            }

            var html = '';
            risks.forEach(function(r) {
                html += '<div style="padding:12px; background:' + r.bg + '; border-radius:10px; border:1px solid ' + r.border + ';">' +
                    '<div style="font-size:12.5px; font-weight:600; color:' + r.color + '; margin-bottom:4px;">' + r.title + '</div>' +
                    '<div style="font-size:12px; color:' + r.textColor + '; line-height:1.5;">' + r.desc + '</div></div>';
            });
            container.innerHTML = html;
        }

        function renderForecastSummary(forecast) {
            var container = document.getElementById('forecast-summary-card');
            if (!container || !forecast.days) return;

            var totalRain = forecast.total_forecast_rain || 0;
            var maxTemp = Math.max(...forecast.days.map(function(d) { return d.temp_max; }));
            var minTemp = Math.min(...forecast.days.map(function(d) { return d.temp_min; }));
            var avgHumidity = Math.round(forecast.days.reduce(function(s, d) { return s + d.humidity; }, 0) / forecast.days.length);

            container.innerHTML = '<div style="font-weight:600; margin-bottom:6px; color:#1B4A80;">5-Day Forecast Summary</div>' +
                'Temperature range: <strong>' + minTemp + '\u00B0C \u2014 ' + maxTemp + '\u00B0C</strong><br>' +
                'Total expected rainfall: <strong>' + totalRain + ' mm</strong><br>' +
                'Average humidity: <strong>' + avgHumidity + '%</strong><br>' +
                '<span style="font-size:11px; color:#5A7A90; margin-top:4px; display:inline-block;">Data from OpenWeather API \u00B7 Masbate City, Masbate</span>';
        }

        function renderWeatherArchive(forecast) {
            var tbody = document.getElementById('weather-archive-tbody');
            if (!tbody || !forecast.days) return;

            var html = '';
            forecast.days.forEach(function(day) {
                var dateObj = new Date(day.date + 'T12:00:00');
                var dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                var emoji = getWeatherEmoji(day.weather_main);
                html += '<tr>' +
                    '<td>' + dateStr + '</td>' +
                    '<td>' + day.temp_max + '\u00B0C</td>' +
                    '<td>' + day.humidity + '%</td>' +
                    '<td>' + day.wind_speed + ' km/h</td>' +
                    '<td>' + day.rainfall + ' mm</td>' +
                    '<td>' + day.weather_main + ' ' + emoji + '</td></tr>';
            });
            tbody.innerHTML = html;
        }

        function getWeatherEmoji(main) {
            // Returns SVG icon string for weather type
            var sunSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
            var cloudSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>';
            var rainSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="12" y1="15" x2="12" y2="23"/><path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25"/></svg>';
            var stormSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 16.9A5 5 0 0018 7h-1.26a8 8 0 10-11.62 9"/><polyline points="13 11 9 17 15 17 11 23"/></svg>';
            var fogSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/><line x1="3" y1="20" x2="9" y2="20"/><line x1="13" y1="20" x2="21" y2="20"/><line x1="3" y1="23" x2="7" y2="23"/><line x1="11" y1="23" x2="21" y2="23"/></svg>';
            var map = {
                'Clear': sunSvg, 'Clouds': cloudSvg, 'Rain': rainSvg, 'Drizzle': rainSvg,
                'Thunderstorm': stormSvg, 'Snow': cloudSvg, 'Mist': fogSvg, 'Fog': fogSvg,
                'Haze': fogSvg, 'Smoke': fogSvg
            };
            return map[main] || cloudSvg;
        }

        function renderWeatherError() {
            var tempVal = document.getElementById('metric-temp-value');
            if (tempVal) tempVal.innerHTML = '--<span class="metric-unit">\u00B0C</span>';
            var el = document.getElementById('weather-last-updated');
            if (el) el.textContent = 'Weather data unavailable \u2014 check API key';
        }

        // Auto-refresh weather data every 10 minutes
        setInterval(loadWeatherData, 10 * 60 * 1000);

        // Helper: calculate days since planting date
        function calculateDaysGrown(dateStr) {
            if (!dateStr) return 0;
            var plantDate = new Date(dateStr);
            var today = new Date("2026-05-23"); // Freeze model date as requested in user metadata context
            var diffTime = Math.abs(today - plantDate);
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        }

        // Helper: calculate crop growth stage based on variety and days grown
        function getGrowthStage(cropName, daysGrown) {
            if (cropName.indexOf("None") !== -1 || !daysGrown) return "Soil Prep";
            if (cropName.indexOf("Kangkong") !== -1) {
                if (daysGrown <= 7) return "Seedling";
                if (daysGrown <= 22) return "Vegetative";
                return "Harvest Ready";
            }
            // General Rice / Corn stages
            if (daysGrown <= 25) return "Seedling";
            if (daysGrown <= 60) return "Tillering / Vegetative";
            if (daysGrown <= 90) return "Flowering / Tasseling";
            return "Harvest Ready";
        }

        // Fetch all user, plot, crop, and planting records from the backend API
        async function loadFarmerData() {
            try {
                const response = await fetch('/api/farmer/data');
                if (!response.ok) throw new Error('Failed to fetch farmer data');
                const data = await response.json();
                
                dbPlots = data.plots;
                dbCrops = data.crops;

                // Build the cropDataRepo dynamically from the database!
                dbCrops.forEach(function (c) {
                    cropDataRepo[c.crop_name] = {
                        limit: parseFloat(c.rain_tolerance),
                        idealTemp: c.ideal_temp_min + "\u00B0C - " + c.ideal_temp_max + "\u00B0C",
                        growthDays: parseInt(c.days_to_harvest),
                        advice: c.best_practices || "No advice recorded."
                    };
                });
                // Ensure "None (Soil Prep)" exists in the repo
                cropDataRepo["None (Soil Prep)"] = {
                    limit: 999,
                    idealTemp: "20\u00B0C - 35\u00B0C",
                    growthDays: 0,
                    advice: "Plot cleared. Favorable planting conditions projected for next week."
                };

                // Map database records to frontend activeCrops array structure
                activeCrops = dbPlots.map(function (plot) {
                    // Find active growing record for this plot
                    var activeRecord = data.plantingRecords.find(function (r) {
                        return r.plot_id === plot.plot_id && r.status === 'Growing';
                    });

                    if (activeRecord) {
                        var cropName = activeRecord.crop.crop_name;
                        var days = calculateDaysGrown(activeRecord.planting_date);
                        var totalDays = cropDataRepo[cropName] ? cropDataRepo[cropName].growthDays : 120;
                        var progressPct = Math.min(100, Math.round((days / totalDays) * 100));

                        // Resolve sensitivity
                        var sensitivity = "Medium";
                        if (cropName.indexOf("Rice") !== -1 || cropName.indexOf("Palay") !== -1) sensitivity = "High";
                        if (cropName.indexOf("Kangkong") !== -1) sensitivity = "Low";

                        // Resolve estimated damage based on Masbate weather triggers
                        var estDamage = "0%";
                        var tolerance = cropDataRepo[cropName] ? cropDataRepo[cropName].limit : 50;
                        if (forecastedRain > tolerance) {
                            estDamage = "45% (High Risk)";
                        } else if (forecastedRain * 2 > tolerance) {
                            estDamage = "15% (Mild Risk)";
                        }

                        return {
                            record_id: activeRecord.record_id,
                            plot_id: plot.plot_id,
                            crop_id: activeRecord.crop_id,
                            plot: plot.plot_name,
                            crop: cropName,
                            planted: activeRecord.planting_date,
                            size: parseFloat(plot.area_size).toFixed(1) + " ha",
                            sensitivity: sensitivity,
                            damage: estDamage,
                            statusColor: sensitivity === "High" ? "status-amber" : (sensitivity === "Medium" ? "status-blue" : "status-green"),
                            progressColor: sensitivity === "High" ? "pf-amber" : (sensitivity === "Medium" ? "pf-blue" : "pf-green"),
                            progressPct: progressPct
                        };
                    } else {
                        return {
                            record_id: null,
                            plot_id: plot.plot_id,
                            crop_id: null,
                            plot: plot.plot_name,
                            crop: "None (Soil Prep)",
                            planted: null,
                            size: parseFloat(plot.area_size).toFixed(1) + " ha",
                            sensitivity: "Low",
                            damage: "0%",
                            statusColor: "status-prep",
                            progressColor: "pf-prep",
                            progressPct: 0
                        };
                    }
                });

                // Populate planting form options dynamically
                populatePlantingFormDropdowns();

                // Populate historical table dynamically
                renderHistoricalTable(data.plantingRecords.filter(function (r) { return r.status === 'Harvested'; }));

                // Redraw all elements
                renderAllViews();

            } catch (err) {
                console.error("Error loading farmer data:", err);
            }
        }

        // Populate planting form options dynamically
        function populatePlantingFormDropdowns() {
            // Populate plots dropdown
            var plotSelect = document.getElementById("plant-plot");
            if (plotSelect) {
                plotSelect.innerHTML = "";
                dbPlots.forEach(function (plot) {
                    var activeRecord = activeCrops.find(function (c) { return c.plot_id === plot.plot_id && c.planted !== null; });
                    var opt = document.createElement("option");
                    opt.value = plot.plot_id;
                    if (activeRecord) {
                        opt.text = plot.plot_name + " (Overwrite active " + activeRecord.crop + ")";
                    } else {
                        opt.text = plot.plot_name + " (Available \\u00B7 Soil prep completed)";
                    }
                    plotSelect.appendChild(opt);
                });
            }

            // Populate crops dropdown
            var cropSelect = document.getElementById("plant-crop");
            if (cropSelect) {
                cropSelect.innerHTML = "";
                dbCrops.forEach(function (crop) {
                    var opt = document.createElement("option");
                    opt.value = crop.crop_id;
                    opt.text = crop.crop_name;
                    cropSelect.appendChild(opt);
                });
            }
        }

        // 
        // VIEW RENDERING LOOPS
        // 

        // 1. Render Sidebar Active Fields Widget
        function renderSidebarFields() {
            var container = document.getElementById("sidebar-fields-container");
            if (!container) return;
            var html = "";
            activeCrops.forEach(function (c) {
                var dotClass = c.statusColor;
                var desc = c.planted ? c.crop + " \\u00B7 " + c.size + " \\u00B7 Day " + calculateDaysGrown(c.planted) : c.size + " \\u00B7 Soil prep";
                html += '<div class="field-card">' +
                    '  <div class="field-card-name"><span class="field-status ' + dotClass + '"></span>' + c.plot + '</div>' +
                    '  <div class="field-card-meta">' + desc + '</div>' +
                    '</div>';
            });
            container.innerHTML = html;
        }

        // 2. Render Dashboard Active Crops Cards
        function renderDashboardActiveCrops() {
            var container = document.getElementById("dash-active-crops-list");
            if (!container) return;
            var html = "";
            activeCrops.forEach(function (c) {
                if (!c.planted) {
                    html += '<div class="crop-row">' +
                        '  <div class="crop-dot" style="background:#B0ADA5;"></div>' +
                        '  <div class="crop-info">' +
                        '    <div class="crop-name">' + c.plot + ' \u2014 No crop assigned</div>' +
                        '    <div class="crop-meta">' + c.size + ' \\u00B7 Ready for planting</div>' +
                        '    <div class="progress-bar"><div class="progress-fill" style="width:0%; background:#B0ADA5;"></div></div>' +
                        '  </div>' +
                        '  <span class="crop-stage cs-prep">Prep</span>' +
                        '</div>';
                    return;
                }
                var days = calculateDaysGrown(c.planted);
                var stage = getGrowthStage(c.crop, days);
                var stageClass = "cs-veg";
                if (stage.indexOf("Flowering") !== -1 || stage.indexOf("Tasseling") !== -1) stageClass = "cs-flow";
                if (stage.indexOf("Harvest") !== -1) stageClass = "cs-har";
                if (stage.indexOf("Seedling") !== -1) stageClass = "cs-prep";

                var dotColor = "#5A8A42";
                if (c.statusColor.indexOf("amber") !== -1) dotColor = "#D4870A";
                if (c.statusColor.indexOf("blue") !== -1) dotColor = "#3F7EC4";

                html += '<div class="crop-row">' +
                    '  <div class="crop-dot" style="background:' + dotColor + ';"></div>' +
                    '  <div class="crop-info">' +
                    '    <div class="crop-name">' + c.crop + ' \u2014 ' + c.plot + '</div>' +
                    '    <div class="crop-meta">Planted ' + new Date(c.planted).toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ' \\u00B7 ' + c.size + ' \\u00B7 Day ' + days + '</div>' +
                    '    <div class="progress-bar"><div class="progress-fill ' + c.progressColor + '" style="width:' + c.progressPct + '%;"></div></div>' +
                    '  </div>' +
                    '  <span class="crop-stage ' + stageClass + '">' + stage + '</span>' +
                    '</div>';
            });
            container.innerHTML = html;
        }

        // 3. Render Crop Management dashboard
        function renderCropManagementView() {
            var grid = document.getElementById("active-plots-dashboard-grid");
            var statusContainer = document.getElementById("plot-status-container");
            if (!grid || !statusContainer) return;

            // Filter activeCrops based on plot-search query if available
            var searchInput = document.getElementById("plot-search");
            var query = searchInput ? searchInput.value.toLowerCase().trim() : "";
            var displayCrops = activeCrops;
            if (query) {
                displayCrops = activeCrops.filter(function (c) {
                    return c.plot.toLowerCase().indexOf(query) !== -1 || c.crop.toLowerCase().indexOf(query) !== -1;
                });
            }

            // Render visual dashboard cards
            var gridHtml = "";
            
            // Start Table
            var statusHtml = '<table><thead><tr><th>Plot</th><th>Crop</th><th>Stage</th><th>Sens.</th><th>Damage %</th><th>Actions</th></tr></thead><tbody>';
            var statusCardsHtml = '';

            displayCrops.forEach(function (c) {
                var days = calculateDaysGrown(c.planted);
                var stage = getGrowthStage(c.crop, days);
                var advice = cropDataRepo[c.crop] ? cropDataRepo[c.crop].advice : "Cleared field. Safe to plant.";
                var healthText = "Healthy";
                var healthBadgeColor = "#5A8A42";

                if (c.statusColor.indexOf("amber") !== -1) { healthText = "At Risk"; healthBadgeColor = "#D4870A"; }
                if (c.statusColor.indexOf("blue") !== -1) { healthText = "Satisfactory"; healthBadgeColor = "#3F7EC4"; }
                if (c.progressPct > 90) { stage = "Harvest Ready"; }

                if (!c.planted) {
                    gridHtml += '<div class="form-card" style="display:flex; justify-content:space-between; align-items:center;">' +
                        '  <div>' +
                        '    <div style="font-weight:600; font-size:14px;">' + c.plot + ' \u2014 Available</div>' +
                        '    <div style="font-size:12px; color:#7A7773; margin-top:2px;">Size: ' + c.size + ' \\u00B7 Ready for planting batch</div>' +
                        '  </div>' +
                        '  <span class="crop-stage cs-prep">Available</span>' +
                        '</div>';

                    statusHtml += '<tr><td>' + c.plot + '</td><td>None</td><td>Soil Prep</td><td>Low</td><td>0%</td><td><span style="color:#9A9790; font-size:11px;">No Active Batch</span></td></tr>';
                    statusCardsHtml += '<div class="data-table-card">' +
                        '  <div class="data-table-card-item"><strong>Plot:</strong> ' + c.plot + '</div>' +
                        '  <div class="data-table-card-item"><strong>Crop:</strong> None</div>' +
                        '  <div class="data-table-card-item"><strong>Stage:</strong> Soil Prep</div>' +
                        '</div>';
                    return;
                }

                var harvestBtnHtml = '';
                var editDeleteBtnHtml = '';

                if (c.record_id) {
                    harvestBtnHtml = '  <button class="btn-submit btn-harvest-action" data-record-id="' + c.record_id + '" style="background:#5A8A42; padding:6px 12px; font-size:11px; width:auto; display:inline-block;"><span>Mark as Harvested</span> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></button>';
                    editDeleteBtnHtml = '  <button class="btn-submit btn-edit-action" data-record-id="' + c.record_id + '" style="background:#7A7773; padding:6px 12px; font-size:11px; width:auto; display:inline-block;"><span>Edit Details</span> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>' +
                                        '  <button class="btn-submit btn-delete-action" data-record-id="' + c.record_id + '" style="background:#C0531A; padding:6px 12px; font-size:11px; width:auto; display:inline-block;"><span>Delete Batch</span> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg></button>';
                }

                gridHtml += '<div class="form-card">' +
                    '  <div style="display:flex; justify-content:space-between; align-items:flex-start;">' +
                    '    <div>' +
                    '      <div style="font-weight:600; font-size:14.5px; color:#1C1C1A;">' + c.plot + ' : ' + c.crop + '</div>' +
                    '      <div style="font-size:12px; color:#7A7773; margin-top:2px;">Days Grown: ' + days + ' \\u00B7 Growth stage: <strong>' + stage + '</strong></div>' +
                    '    </div>' +
                    '    <span class="crop-stage" style="background:' + healthBadgeColor + '22; color:' + healthBadgeColor + '; font-weight:600;">' + healthText + '</span>' +
                    '  </div>' +
                    '  <div style="font-size:12.5px; color:#5A5854; background:#F7F5F0; padding:10px; border-radius:6px; margin-top:10px;">' +
                    '    <strong>Advice:</strong> ' + advice +
                    '  </div>' +
                    '  <div class="card-actions-mobile" style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">' +
                    '    ' + harvestBtnHtml + editDeleteBtnHtml +
                    '  </div>' +
                    '</div>';

                var sensColor = (c.sensitivity === "High" ? "#C0531A" : (c.sensitivity === "Medium" ? "#D4870A" : "#5A8A42"));

                statusHtml += '<tr><td>' + c.plot + '</td><td>' + c.crop + '</td><td>' + stage + '</td><td style="color:' + sensColor + '">' + c.sensitivity + '</td><td><strong>' + c.damage + '</strong></td><td>' +
                    '<div style="display:flex; gap:6px;">' +
                    '<button class="btn-submit btn-edit-action" data-record-id="' + c.record_id + '" style="background:#7A7773; padding:4px 8px; font-size:11px; width:auto; margin:0; display:inline-flex; align-items:center; gap:4px;"><span>Edit</span> <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>' +
                    '<button class="btn-submit btn-delete-action" data-record-id="' + c.record_id + '" style="background:#C0531A; padding:4px 8px; font-size:11px; width:auto; margin:0; display:inline-flex; align-items:center; gap:4px;"><span>Delete</span> <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg></button>' +
                    '</div></td></tr>';

                statusCardsHtml += '<div class="data-table-card">' +
                    '  <div class="data-table-card-item"><strong>Plot:</strong> ' + c.plot + '</div>' +
                    '  <div class="data-table-card-item"><strong>Crop:</strong> ' + c.crop + '</div>' +
                    '  <div class="data-table-card-item"><strong>Stage:</strong> ' + stage + '</div>' +
                    '  <div class="data-table-card-item"><strong>Sens.:</strong> <span style="color:' + sensColor + ';">' + c.sensitivity + '</span></div>' +
                    '  <div class="data-table-card-item"><strong>Damage:</strong> ' + c.damage + '</div>' +
                    '  <div class="data-table-card-item card-actions-mobile" style="margin-top: 8px; justify-content: flex-end; display: flex; gap: 8px;">' +
                    '    <button class="btn-submit btn-edit-action" data-record-id="' + c.record_id + '" style="background:#7A7773; padding:6px 12px; font-size:11px; width:auto; margin:0; display:inline-flex; align-items:center; gap:4px;"><span>Edit</span> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>' +
                    '    <button class="btn-submit btn-delete-action" data-record-id="' + c.record_id + '" style="background:#C0531A; padding:6px 12px; font-size:11px; width:auto; margin:0; display:inline-flex; align-items:center; gap:4px;"><span>Delete</span> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg></button>' +
                    '  </div>' +
                    '</div>';
            });

            statusHtml += '</tbody></table>';
            grid.innerHTML = gridHtml;
            statusContainer.innerHTML = statusHtml + statusCardsHtml;

            // Register event listeners... (same as before)
            document.querySelectorAll(".btn-harvest-action").forEach(function (btn) {
                btn.addEventListener("click", function () {
                    var recordId = this.getAttribute("data-record-id");
                    archivePlot(recordId);
                });
            });
            document.querySelectorAll(".btn-edit-action").forEach(function (btn) {
                btn.addEventListener("click", function () {
                    var recordId = this.getAttribute("data-record-id");
                    openEditModal(recordId);
                });
            });
            document.querySelectorAll(".btn-delete-action").forEach(function (btn) {
                btn.addEventListener("click", function () {
                    var recordId = this.getAttribute("data-record-id");
                    deletePlot(recordId);
                });
            });
        }

        // 4. Render historical yield log tables dynamically
        function renderHistoricalTable(historicalRecords) {
            var container = document.getElementById("historical-yield-container");
            if (!container) return;
            container.innerHTML = "";
            if (historicalRecords.length === 0) {
                container.innerHTML = '<div style="text-align:center; color:#9A9790; padding:20px; font-size:13px;">No historical yields recorded yet.</div>';
                return;
            }
            var html = '<table><thead><tr><th>Batch</th><th>Plot</th><th>Crop</th><th>Duration</th></tr></thead><tbody>';
            var cardsHtml = '';
            historicalRecords.forEach(function (r) {
                var batchId = "BCH-" + String(r.record_id).padStart(3, '0');
                var plotName = r.plot ? r.plot.plot_name : "Unknown Plot";
                var cropName = r.crop ? r.crop.crop_name : "Unknown Crop";
                var pDate = new Date(r.planting_date);
                var hDate = new Date(r.updated_at);
                var durationDays = Math.max(1, Math.round((hDate - pDate) / (1000 * 60 * 60 * 24)));

                html += '<tr><td>' + batchId + '</td><td>' + plotName + '</td><td>' + cropName + '</td><td>' + durationDays + ' days</td></tr>';
                cardsHtml += '<div class="data-table-card">' +
                    '  <div class="data-table-card-item"><strong>Batch:</strong> ' + batchId + '</div>' +
                    '  <div class="data-table-card-item"><strong>Plot:</strong> ' + plotName + '</div>' +
                    '  <div class="data-table-card-item"><strong>Crop:</strong> ' + cropName + '</div>' +
                    '  <div class="data-table-card-item"><strong>Duration:</strong> ' + durationDays + ' days</div>' +
                    '</div>';
            });
            html += '</tbody></table>';
            container.innerHTML = html + cardsHtml;
        }

        // Comprehensive rendering
        function renderAllViews() {
            renderSidebarFields();
            renderDashboardActiveCrops();
            renderCropManagementView();
        }

        // 
        // WEATHER ANALYTICS DYNAMIC SIMULATOR
        // 
        // Crop tolerance limits (rain in mm) for predictor logic
        var cropLimits = {
            'Rice': { rainLimit: 80, tempMin: 22, tempMax: 35, name: 'Palay IR64' },
            'Corn': { rainLimit: 50, tempMin: 18, tempMax: 30, name: 'Corn (OPV)' },
            'Tomato': { rainLimit: 20, tempMin: 20, tempMax: 30, name: 'Tomato' },
            'Eggplant': { rainLimit: 40, tempMin: 20, tempMax: 35, name: 'Eggplant' },
            'Ampalaya': { rainLimit: 70, tempMin: 22, tempMax: 35, name: 'Ampalaya' },
            'Kangkong': { rainLimit: 120, tempMin: 18, tempMax: 38, name: 'Kangkong' }
        };

        var selectPredictor = document.getElementById("predict-crop-select");
        function updatePredictor() {
            if (!selectPredictor) return;
            var val = selectPredictor.value;
            var crop = cropLimits[val];
            if (!crop) return;

            var red = document.getElementById("light-red");
            var yellow = document.getElementById("light-yellow");
            var green = document.getElementById("light-green");
            var vTitle = document.getElementById("predictor-verdict-title");
            var vDesc = document.getElementById("predictor-verdict-desc");
            var vFormula = document.getElementById("predictor-formula");

            if (!red || !yellow || !green || !vTitle || !vDesc || !vFormula) return;

            // Clear active lights
            red.className = "light-indicator";
            yellow.className = "light-indicator";
            green.className = "light-indicator";

            // Get live forecast data (or use defaults if not loaded yet)
            var maxForecastRain = forecastedRain;
            var maxForecastTemp = 31;
            var totalForecastRain = 0;

            if (liveForecast && liveForecast.days) {
                maxForecastRain = Math.max(...liveForecast.days.map(function(d) { return d.rainfall; }));
                maxForecastTemp = Math.max(...liveForecast.days.map(function(d) { return d.temp_max; }));
                totalForecastRain = liveForecast.total_forecast_rain || 0;
            }

            // Decision logic using LIVE data
            var rainDanger = maxForecastRain > crop.rainLimit;
            var rainCaution = totalForecastRain > crop.rainLimit * 0.7;
            var tempDanger = maxForecastTemp > crop.tempMax + 3;
            var tempCaution = maxForecastTemp > crop.tempMax;

            if (rainDanger || tempDanger) {
                // RED: Delay planting
                red.classList.add("red-active");
                var reason = rainDanger
                    ? 'Forecast rain (' + maxForecastRain + 'mm) exceeds ' + crop.name + ' tolerance limit (' + crop.rainLimit + 'mm).'
                    : 'Forecast temp (' + maxForecastTemp + '\u00B0C) far exceeds ' + crop.name + ' ideal max (' + crop.tempMax + '\u00B0C).';
                vTitle.innerText = "RED: DELAY PLANTING BATCH";
                vDesc.innerText = "Warning! " + reason + " Seeds risk damage.";
                vFormula.innerText = rainDanger
                    ? 'Rain: ' + maxForecastRain + 'mm > Limit: ' + crop.rainLimit + 'mm  Danger'
                    : 'Temp: ' + maxForecastTemp + '\u00B0C > Max: ' + crop.tempMax + '\u00B0C  Danger';
            } else if (rainCaution || tempCaution) {
                // YELLOW: Plant with caution
                yellow.classList.add("yellow-active");
                var reason2 = tempCaution
                    ? 'Temperatures (' + maxForecastTemp + '\u00B0C) above ideal for ' + crop.name + ' (' + crop.tempMax + '\u00B0C). Pre-water before planting.'
                    : 'Total forecast rain (' + totalForecastRain + 'mm) approaching ' + crop.name + ' limits (' + crop.rainLimit + 'mm).';
                vTitle.innerText = "YELLOW: PLANT WITH CAUTION";
                vDesc.innerText = reason2;
                vFormula.innerText = tempCaution
                    ? 'Temp: ' + maxForecastTemp + '\u00B0C > Ideal: ' + crop.tempMax + '\u00B0C  Caution'
                    : 'Rain: ' + totalForecastRain + 'mm ~= Limit: ' + crop.rainLimit + 'mm  Caution';
            } else {
                // GREEN: Safe to plant
                green.classList.add("green-active");
                vTitle.innerText = "GREEN: SAFE TO PLANT";
                vDesc.innerText = "Live forecast shows favorable conditions for " + crop.name + ". Rain (" + maxForecastRain + "mm) well within tolerance (" + crop.rainLimit + "mm). Temp (" + maxForecastTemp + "\u00B0C) within ideal range.";
                vFormula.innerText = 'Rain: ' + maxForecastRain + 'mm < Limit: ' + crop.rainLimit + 'mm  Safe';
            }
        }
        if (selectPredictor) selectPredictor.addEventListener("change", updatePredictor);

        // Active Plot Realtime Search
        var searchPlots = document.getElementById("plot-search");
        if (searchPlots) {
            searchPlots.addEventListener("input", function () {
                renderCropManagementView();
            });
        }

        // Weather Archive Realtime Search
        var searchWeather = document.getElementById("weather-archive-search");
        if (searchWeather) {
            searchWeather.addEventListener("input", function () {
                var q = this.value.toLowerCase();
                document.querySelectorAll("#weather-archive-table tbody tr").forEach(function (row) {
                    var text = row.innerText.toLowerCase();
                    if (text.indexOf(q) !== -1) {
                        row.style.display = "";
                    } else {
                        row.style.display = "none";
                    }
                });
            });
        }

        // 
        // DIGITAL REPOSITORY ENCYCLOPEDIA FILTER
        // 
        var searchEncy = document.getElementById("encyclopedia-search");
        if (searchEncy) {
            searchEncy.addEventListener("input", function () {
                var q = this.value.toLowerCase();
                document.querySelectorAll("#encyclopedia-grid .ency-card").forEach(function (card) {
                    var name = card.getAttribute("data-name") || "";
                    if (name.indexOf(q) !== -1) {
                        card.style.display = "";
                    } else {
                        card.style.display = "none";
                    }
                });
            });
        }

        // Toggle expanding encyclopedia details
        document.querySelectorAll("#encyclopedia-grid .ency-card").forEach(function (card) {
            card.addEventListener("click", function () {
                this.classList.toggle("expanded");
            });
        });

        // 
        // CLIENT SIDE SINGLE PAGE ROUTER
        // 
        

        // Fetch user database values & execute render
        loadFarmerData();

        // Fetch live weather data from OpenWeather API
        loadWeatherData();

        // 
        // NEW PLANTING REGISTRY FORM SUBMISSION
        // 
        var plantingForm = document.getElementById("planting-form");
        if (plantingForm) {
            plantingForm.addEventListener("submit", async function (e) {
                e.preventDefault();
                var plotId = document.getElementById("plant-plot").value;
                var cropId = document.getElementById("plant-crop").value;
                var plantDate = document.getElementById("plant-date").value;

                if (!plotId || !cropId || !plantDate) return;

                try {
                    const response = await fetch('/api/planting-records', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            plot_id: plotId,
                            crop_id: cropId,
                            planting_date: plantDate
                        })
                    });

                    if (!response.ok) throw new Error('Failed to plant crop');

                    var alertBox = document.getElementById("planting-alert");
                    if (alertBox) {
                        alertBox.style.display = "block";
                        alertBox.style.background = "#E6F0DC";
                        alertBox.style.color = "#3A6824";
                        alertBox.innerHTML = "<strong>Success!</strong> Planting batch successfully registered. Initial growth stage estimated as Seedling.";

                        setTimeout(function () {
                            alertBox.style.display = "none";
                        }, 4000);
                    }

                    plantingForm.reset();
                    
                    // Reset default date to today
                    var dateInput = document.getElementById("plant-date");
                    if (dateInput) {
                        var today = new Date();
                        var yyyy = today.getFullYear();
                        var mm = String(today.getMonth() + 1).padStart(2, '0');
                        var dd = String(today.getDate()).padStart(2, '0');
                        dateInput.value = yyyy + '-' + mm + '-' + dd;
                    }

                    await loadFarmerData();

                } catch (err) {
                    console.error(err);
                    alert("Failed to register planting batch.");
                }
            });
        }

        // 
        // EDIT PLANTING DETAILS FORM SUBMISSION
        // 
        var editForm = document.getElementById("edit-planting-form");
        if (editForm) {
            editForm.addEventListener("submit", async function (e) {
                e.preventDefault();
                var recordId = document.getElementById("edit-record-id").value;
                var cropId = document.getElementById("edit-plant-crop").value;
                var plantDate = document.getElementById("edit-plant-date").value;

                if (!recordId || !cropId || !plantDate) return;

                try {
                    const response = await fetch('/api/planting-records/' + recordId, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            crop_id: cropId,
                            planting_date: plantDate
                        })
                    });

                    if (!response.ok) throw new Error('Failed to update crop');

                    closeEditModal();
                    alert("Planting details successfully updated!");
                    await loadFarmerData();
                } catch (err) {
                    console.error(err);
                    alert("Failed to update planting details.");
                }
            });
        }

        // 
        // ADD NEW PLOT FORM SUBMISSION
        // 
        var addPlotForm = document.getElementById("add-plot-form");
        if (addPlotForm) {
            addPlotForm.addEventListener("submit", async function (e) {
                e.preventDefault();
                var name = document.getElementById("new-plot-name").value;
                var size = document.getElementById("new-plot-size").value;
                if (!name || !size) return;
                try {
                    const response = await fetch('/api/plots', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ plot_name: name, area_size: size })
                    });
                    if (!response.ok) throw new Error('Failed to create plot');
                    closeAddPlotModal();
                    alert("Plot successfully created!");
                    addPlotForm.reset();
                    await loadFarmerData();
                } catch (err) {
                    console.error(err);
                    alert("Failed to create plot.");
                }
            });
        }

        // 
        // ADD NEW CROP FORM SUBMISSION
        // 
        var addCropForm = document.getElementById("add-crop-form");
        if (addCropForm) {
            addCropForm.addEventListener("submit", async function (e) {
                e.preventDefault();
                var name = document.getElementById("new-crop-name").value;
                var minTemp = document.getElementById("new-crop-temp-min").value;
                var maxTemp = document.getElementById("new-crop-temp-max").value;
                var rainTol = document.getElementById("new-crop-rain-tol").value;
                var days = document.getElementById("new-crop-days").value;
                var advice = document.getElementById("new-crop-advice").value;
                if (!name || !minTemp || !maxTemp || !rainTol || !days) return;
                try {
                    const response = await fetch('/api/crops', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            crop_name: name,
                            ideal_temp_min: minTemp,
                            ideal_temp_max: maxTemp,
                            rain_tolerance: rainTol,
                            days_to_harvest: days,
                            best_practices: advice
                        })
                    });
                    if (!response.ok) throw new Error('Failed to create crop');
                    closeAddCropModal();
                    alert("Crop successfully created!");
                    addCropForm.reset();
                    await loadFarmerData();
                } catch (err) {
                    console.error(err);
                    alert("Failed to create crop.");
                }
            });
        }

        // Set today as default in planting form date field
        var dateInput = document.getElementById("plant-date");
        if (dateInput) {
            var today = new Date();
            var yyyy = today.getFullYear();
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var dd = String(today.getDate()).padStart(2, '0');
            dateInput.value = yyyy + '-' + mm + '-' + dd;
        }

        window.openAddPlotModal = function() {
            var modal = document.getElementById("add-plot-modal");
            if (modal) modal.classList.add("active-modal");
        }
        window.closeAddPlotModal = function() {
            var modal = document.getElementById("add-plot-modal");
            if (modal) modal.classList.remove("active-modal");
        }
        
        window.openPlantingModal = function() {
            var container = document.querySelector(".main-right-col");
            if (container) container.classList.add("show-modal");
        }
        window.closePlantingModal = function() {
            var container = document.querySelector(".main-right-col");
            if (container) container.classList.remove("show-modal");
        }

        window.openEditModal = function(recordId) {
            var modal = document.getElementById("crop-edit-modal");
            if (modal) {
                var recordInput = document.getElementById("edit-record-id");
                if (recordInput) recordInput.value = recordId;
                
                // Pre-fill crop details based on activeCrops
                var activeCrop = activeCrops.find(c => String(c.record_id) === String(recordId));
                if (activeCrop) {
                    var plotSelect = document.getElementById("edit-plant-plot");
                    if (plotSelect) {
                        plotSelect.innerHTML = '<option value="' + activeCrop.plot_id + '">' + activeCrop.plot + '</option>';
                    }
                    var cropSelect = document.getElementById("edit-plant-crop");
                    if (cropSelect) {
                        cropSelect.innerHTML = '';
                        dbCrops.forEach(function (crop) {
                            var opt = document.createElement("option");
                            opt.value = crop.crop_id;
                            opt.text = crop.crop_name;
                            if (String(crop.crop_id) === String(activeCrop.crop_id)) opt.selected = true;
                            cropSelect.appendChild(opt);
                        });
                    }
                    var dateInput = document.getElementById("edit-plant-date");
                    if (dateInput && activeCrop.planted) {
                        dateInput.value = new Date(activeCrop.planted).toISOString().split('T')[0];
                    }
                }
                modal.classList.add("active-modal");
            }
        }
        window.closeEditModal = function() {
            var modal = document.getElementById("crop-edit-modal");
            if (modal) modal.classList.remove("active-modal");
        }

        window.openAddCropModal = function() {
            var modal = document.getElementById("add-crop-modal");
            if (modal) modal.classList.add("active-modal");
        }
        window.closeAddCropModal = function() {
            var modal = document.getElementById("add-crop-modal");
            if (modal) modal.classList.remove("active-modal");
        }

        window.archivePlot = async function(recordId) {
            if (!confirm("Are you sure you want to mark this crop batch as harvested?")) return;
            try {
                const response = await fetch('/api/planting-records/' + recordId + '/harvest', { method: 'POST' });
                if (!response.ok) throw new Error('Failed to harvest');
                await loadFarmerData();
            } catch (err) {
                console.error(err);
                alert("Failed to archive plot.");
            }
        }

        window.deletePlot = async function(recordId) {
            if (!confirm("Are you sure you want to delete this active planting batch?")) return;
            try {
                const response = await fetch('/api/planting-records/' + recordId, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete');
                await loadFarmerData();
            } catch (err) {
                console.error(err);
                alert("Failed to delete batch.");
            }
        }
        
        var hamburgerBtn = document.getElementById('hamburgerBtn');
        var sidebar = document.getElementById('sidebar');
        var overlay = document.getElementById('sidebarOverlay');

        function openSidebar() {
            if (sidebar && overlay) {
                sidebar.classList.add('open');
                overlay.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeSidebar() {
            if (sidebar && overlay) {
                sidebar.classList.remove('open');
                overlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        }

        if (hamburgerBtn) hamburgerBtn.addEventListener('click', openSidebar);
        if (overlay) overlay.addEventListener('click', closeSidebar);

        // CSP: Attach event listeners instead of inline onclick handlers
        var btnFabOpenPlanting = document.getElementById('fab-open-planting');
        if (btnFabOpenPlanting) btnFabOpenPlanting.addEventListener('click', openPlantingModal);

        var btnClosePlantingModal = document.getElementById('btn-close-planting-modal');
        if (btnClosePlantingModal) btnClosePlantingModal.addEventListener('click', closePlantingModal);

        var btnOpenAddPlotModal = document.getElementById('btn-open-add-plot-modal');
        if (btnOpenAddPlotModal) btnOpenAddPlotModal.addEventListener('click', openAddPlotModal);

        var btnCloseEditModal = document.getElementById('btn-close-edit-modal');
        if (btnCloseEditModal) btnCloseEditModal.addEventListener('click', closeEditModal);

        var btnCloseAddPlotModal = document.getElementById('btn-close-add-plot-modal');
        if (btnCloseAddPlotModal) btnCloseAddPlotModal.addEventListener('click', closeAddPlotModal);

        var btnCloseAddCropModal = document.getElementById('btn-close-add-crop-modal');
        if (btnCloseAddCropModal) btnCloseAddCropModal.addEventListener('click', closeAddCropModal);

        // Close drawer when sidebar nav is clicked in mobile view
        document.querySelectorAll('.sidebar .nav-item').forEach(function (item) {
            item.addEventListener('click', function () {
                if (window.innerWidth <= 768) closeSidebar();
            });
        });
