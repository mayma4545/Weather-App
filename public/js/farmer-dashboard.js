// ACTIVE STATE DATABASE (Client-Side State)
var currentLanguage = 'filipino';

var substringKeys = [
  "Good morning",
  "Good morning,",
  "Temperature:",
  "Temperature",
  "Feels like",
  "Humidity:",
  "Humidity",
  "Visibility:",
  "Visibility",
  "Wind Speed",
  "Wind Speed:",
  "Wind:",
  "Wind",
  "Pressure:",
  "Pressure",
  "Clouds:",
  "Clouds",
  "Rain",
  "Rainfall:",
  "Rainfall",
  "Heat",
  "Moisture",
  "Hectares",
  "Success",
  "Plots",
  "Plot",
  "Current conditions:",
  "Atmospheric pressure"
];

var translations = {
  filipino: {
    // Sidebar / Common
    "Main Menu": "Pangunahing Menu",
    "Dashboard": "Dashboard",
    "Crop Management": "Pamamahala ng Pananim",
    "Weather": "Pagsusuri ng Panahon",
    "Library": "Digital na Imbakan",
    "Profile Page": "Pahina ng Profile",
    "Logout": "Mag-log Out",
    "Active Fields": "Aktibong mga Bukid",
    "Masbate Region": "Rehiyon ng Masbate",
    "Station ID:": "ID ng Estasyon:",
    "Status:": "Katayuan:",
    "CONNECTED": "NAKAKONEKTA",
    "Project Weather": "Proyektong Panahon",
    "Detecting Location...": "Inaalam ang Lokasyon...",
    "Active Alerts": "Aktibong Babala",
    "Alerts": "mga Babala",
    "Success": "Tagumpay",
    "Plots": "mga Plot",

    // Profile Page
    "My Profile": "Aking Profile",
    "Manage personal farm settings and notification configurations.": "Pamahalaan ang mga personal na setting ng bukid at mga pagsasaayos ng abiso.",
    "Season Overview": "Pangkalahatang-ideya ng Panahon",
    "Key agricultural stats": "Pangunahing istatistika ng agrikultura",
    "Total Farm Size:": "Kabuuang Sukat ng Bukid:",
    "Active Fields:": "Aktibong mga Plot:",
    "Harvest Rate MTD:": "Antas ng Pag-aani ngayong Buwan:",
    "Farm Settings & Alerts": "Mga Setting ng Bukid at Babala",
    "Customize notification rules and telemetry linkages": "I-customize ang mga panuntunan ng abiso at koneksyon ng telemetry",
    "SMS Alert Notification": "Abiso ng Babala sa SMS",
    "Receive direct sms warnings on unseasonal heatwaves or heavy rains.": "Makatanggap ng direktang mga babala sa SMS tungkol sa hindi inaasahang init o malalakas na ulan.",
    "Automated Irrigation Prompts": "Awtomatikong Paalala sa Pagdidilig",
    "Allow our decision models to automatically suggest irrigation sequences.": "Payagan ang aming mga modelo ng desisyon na awtomatikong magmungkahi ng mga pagkakasunod-sunod ng pagdidilig.",
    "Station Cloud Linkage": "Koneksyon sa Station Cloud",
    "Connect to on-site physical barometers and soil moisture sensors.": "Kumonekta sa mga pisikal na barometro at sensor ng halumigmig ng lupa sa bukid.",
    "Contact & Regional Details": "Mga Detalye ng Pakikipag-ugnayan at Rehiyon",
    "Change account identification": "Baguhin ang pagkakakilanlan ng account",
    "Full Name": "Buong Pangalan",
    "Contact Number": "Numero ng Telepono",
    "Email Address": "Email Address",
    "Save Profile": "I-save ang Profile",
    "Saving...": "Inise-save...",
    "Profile updated successfully!": "Matagumpay na na-update ang profile!",
    "Failed to update profile": "Bigo na ma-update ang profile",
    "Language Selection": "Pagpili ng Wika",
    "Select your preferred language for the system.": "Piliin ang iyong gustong wika para sa system.",
    "System Language": "Wika ng System",
    "Filipino (Default)": "Filipino (Default)",
    "Minasbate": "Minasbate",
    "English": "English",

    // Farmer Dashboard
    "Good morning, Juan.": "Magandang umaga, Juan.",
    "Here's how your farm looks today.": "Narito ang hitsura ng iyong bukid ngayon.",
    "Loading weather data...": "Naglo-load ng data ng panahon...",
    "Heat": "Temperatura",
    "Moisture": "Halumigmig",
    "Wind Speed": "Bilis ng Hangin",
    "Rain": "Ulan",
    "Active Crop Telemetry": "Aktibong Telemetry ng Pananim",
    "Real-time monitoring of crop growth and health metrics": "Real-time na pagsubaybay sa paglaki ng pananim at mga sukatan ng kalusugan",
    "Estimated Yield": "Tantyang Ani",
    "Vulnerability": "Kahinaan",
    "Soil Prep": "Paghahanda ng Lupa",
    "None (Soil Prep)": "Wala (Paghahanda ng Lupa)",
    "Masbate Precision Partner": "Kasosyo sa Katumpakan sa Masbate",
    "Active Alerts:": "Aktibong mga Babala:",
    "Weather Forecast": "Ulat ng Panahon",
    "Fast Planting": "Mabilisang Pagtatanim",
    "Add a new crop easily": "Magrehistro ng bagong batch ng pananim sa ilang segundo",
    "Plot": "Plot",
    "Crop": "Pananim",
    "Plant Now": "Itanim Ngayon",
    "Quick Actions": "Mabilisang Aksyon",
    "+ New Planting": "+ Bagong Pagtatanim",
    "+ Add Plot": "+ Magdagdag ng Plot",
    "To-Do List": "Darating na Iskedyul",
    "Tasks for the next 7 days": "Mga gawain para sa susunod na 7 araw",
    "Rainfall Trend (mm)": "Trend ng Ulan (mm)",
    "Loading forecast...": "Naglo-load ng forecast...",
    "Loading rainfall data...": "Naglo-load ng data ng ulan...",
    "Select plot...": "Pumili ng plot...",
    "Select crop...": "Pumili ng pananim...",
    "Select an active plot to load agronomic models...": "Pumili ng aktibong plot para mag-load ng mga agronomic model...",
    "Farm Advice": "Katalinuhang Agronomiko",
    "Growth stage and daily advice": "FAO-56 at GDD Phenology Models",
    "Smart Tips": "Mga Insights sa Desisyon",
    "Tips for your farm based on today's weather": "Mga rekomendasyon batay sa panuntunan mula sa live na data",
    "Generating insights from weather data...": "Bumubuo ng mga insight mula sa data ng panahon...",
    "Temperature:": "Temperatura:",
    "Feels like": "Pakiramdam ay",
    "Humidity:": "Halumigmig:",
    "Visibility:": "Kakayahang makakita:",
    "Current conditions:": "Kasalukuyang kondisyon:",
    "Wind:": "Hangin:",
    "Pressure:": "Presyon:",
    "Clouds:": "Mga Ulap:",
    "Rainfall:": "Ulan:",
    "Pressure": "Presyon",
    "Clouds": "Mga Ulap",
    "Atmospheric pressure": "Presyon ng atmospera",
    "Wind": "Hangin",

    // Crop Management Page
    "Smart Crop Dashboard": "Matalinong Dashboard ng Pananim",
    "Current status of active agricultural plots": "Kasalukuyang katayuan ng mga aktibong plot ng agrikultura",
    "Search by plot or crop name...": "Maghanap sa pamamagitan ng pangalan ng plot o pananim...",
    "All Status": "Lahat ng Katayuan",
    "Healthy": "Malusog",
    "Satisfactory": "Kasiya-siya",
    "At Risk": "Nasa Panganib",
    "Critical": "Kritikal",
    "Available": "Magagamit",
    "Plot Status Table": "Talahanayan ng Katayuan ng Plot",
    "Calculated rain sensitivity and environmental vulnerability": "Kinalkulang sensitibidad sa ulan at kahinaan sa kapaligiran",
    "Historical Yield Logs": "Mga Tala ng Nakaraang Ani",
    "Review completed harvest cycles": "Suriin ang mga natapos na siklo ng pag-aani",
    "Plant New Crop Batch": "Magtanim ng Bagong Batch ng Pananim",
    "Initialize planting parameters": "Simulan ang mga parameter ng pagtatanim",
    "Select Plot": "Pumili ng Plot",
    "Select Crop to Plant": "Pumili ng Pananim na Itatanim",
    "Planting Date": "Petsa ng Pagtatanim",
    "Confirm & Register Planting": "Kumpirmahin at Irehistro ang Pagtatanim",

    // Weather Analytics Page
    "Weather Analytics & Historical Archive": "Pagsusuri ng Panahon at Nakaraang Archive",
    "Masbate Regional station metrics, 5-day predictive trends, and historical logs.": "Mga sukatan ng rehiyonal na estasyon sa Masbate, 5-araw na hula, at mga nakaraang tala.",
    "5-Day Forecast": "5-Araw na Hula",
    "Predictive rain and temperature models": "Mga modelo ng hula para sa ulan at temperatura",
    "Rainfall Trend & Accumulation": "Trend at Accumulation ng Ulan",
    "5-day projected rain volume in mm": "Hula sa dami ng ulan sa loob ng 5 araw sa mm",
    "Crop Health Risk Forecast": "Hula sa Panganib sa Kalusugan ng Pananim",
    "Vulnerability index based on forecasted conditions": "Index ng kahinaan batong sa inihulang kondisyon",
    "Weather Archive": "Archive ng Panahon",
    "Historical database of registered local logs": "Nakaraang database ng mga nakarehistrong lokal na tala",
    "Rule-based predictive analysis powered by OpenWeather live data.": "Pagsusuri ng hula batay sa panuntunan na pinapagana ng live na data ng OpenWeather.",

    // Digital Repository Page
    "Digital Repository & Agropedia": "Digital na Imbakan at Agropedia",
    "Central agricultural knowledge, crop vulnerabilities, and Masbate region trivia.": "Pangunahing kaalaman sa agrikultura, mga kahinaan ng pananim, at trivia sa rehiyon ng Masbate.",
    "Agropedia Knowledge Base": "Basehan ng Kaalaman sa Agropedia",
    "Official crop parameters and growth details": "Opisyal na parameter ng pananim at mga detalye ng paglaki",
    "Masbate Agricultural Trivia": "Trivia sa Agrikultura ng Masbate",
    "Fun facts and local farming stories": "Kagiliw-giliw na katotohanan at lokal na kwento ng pagsasaka",
    "Crop Guidelines": "Mga Alituntunin sa Pananim",
    "Best practices for local growers": "Pinakamahusay na kasanayan para sa mga lokal na magsasaka",
    "Smart Crop Encyclopedia, agricultural best practices, and trivia": "Matalinong Ensayklopidiya ng Pananim, mga pinakamahusay na kasanayan sa agrikultura, at trivia"
  },
  minasbate: {
    // Sidebar / Common
    "Main Menu": "Pang-una na Menu",
    "Dashboard": "Dashboard",
    "Crop Management": "Pangasi sang Tanom",
    "Weather": "Analisis sang Panahon",
    "Library": "Digital na Burutangan",
    "Profile Page": "Pahina sang Profile",
    "Logout": "Mag-log Out",
    "Active Fields": "Aktibo na mga Talamnan",
    "Masbate Region": "Rehiyon sang Masbate",
    "Station ID:": "Estasyon ID:",
    "Status:": "Estado:",
    "CONNECTED": "NAKASUMPAY",
    "Project Weather": "Proyektong Panahon",
    "Detecting Location...": "Ginalantaw ang Lokasyon...",
    "Active Alerts": "Aktibo na mga Alerto",
    "Alerts": "mga Alerto",
    "Success": "Matam-is na Kauswagan",
    "Plots": "mga Plot",

    // Profile Page
    "My Profile": "Akon Profile",
    "Manage personal farm settings and notification configurations.": "Pangasiwaan an imo personal na setting sa talamnan kag mga abiso.",
    "Season Overview": "Pangkalahatan na Lantaw sang Panahon",
    "Key agricultural stats": "Importante na istatistika sa agrikultura",
    "Total Farm Size:": "Kabilugan na Sukat sang Talamnan:",
    "Active Fields:": "Aktibo na mga Plot:",
    "Harvest Rate MTD:": "Halaga sang Ani sini na Bulan:",
    "Farm Settings & Alerts": "Mga Setting sang Talamnan kag Alerto",
    "Customize notification rules and telemetry linkages": "I-customize an mga patakaran sa abiso kag koneksyon sang telemetry",
    "SMS Alert Notification": "Abiso sang Alerto sa SMS",
    "Receive direct sms warnings on unseasonal heatwaves or heavy rains.": "Makatanggap sang direktang abiso sa SMS manungod sa mainit na panahon o makusog na uran.",
    "Automated Irrigation Prompts": "Awtomatiko na Pagiya sa Pagbisibis",
    "Allow our decision models to automatically suggest irrigation sequences.": "Tugutan an amon mga modelo sa desisyon na awtomatiko na magrekomenda sang pagbisibis.",
    "Station Cloud Linkage": "Koneksyon sa Estasyon Cloud",
    "Connect to on-site physical barometers and soil moisture sensors.": "Sumumpay sa mga pisikal na barometro kag sensor sang basa sang duta sa talamnan.",
    "Contact & Regional Details": "Mga Detalye sang Kontak kag Rehiyon",
    "Change account identification": "Liwatan an impormasyon sang account",
    "Full Name": "Kabilugan na Pangaran",
    "Contact Number": "Numero sang Telepono",
    "Email Address": "Email Address",
    "Save Profile": "I-save an Profile",
    "Saving...": "Ginase-save...",
    "Profile updated successfully!": "Malampuson na na-update an profile!",
    "Failed to update profile": "Napasundayag an pag-update sang profile",
    "Language Selection": "Pagpili sang Wika",
    "Select your preferred language for the system.": "Pili-a an imo luyag na wika para sa system.",
    "System Language": "Wika sang System",
    "Filipino (Default)": "Filipino (Default)",
    "Minasbate": "Minasbate",
    "English": "English",

    // Farmer Dashboard
    "Good morning, Juan.": "Maayo na aga, Juan.",
    "Here's how your farm looks today.": "Kadi an hitsura sang imo talamnan subong na adlaw.",
    "Loading weather data...": "Ginaload an data sang panahon...",
    "Heat": "Temperatura",
    "Moisture": "Halumigmig",
    "Wind Speed": "Kabilisan sang Hangin",
    "Rain": "Uran",
    "Active Crop Telemetry": "Aktibo na Telemetry sang Tanom",
    "Real-time monitoring of crop growth and health metrics": "Real-time na pagsubaybay sa pagtubo sang tanom kag sukatan sang kalusugan",
    "Estimated Yield": "Tantya na Ani",
    "Vulnerability": "Kahinaan",
    "Soil Prep": "Paghahanda sang Duta",
    "None (Soil Prep)": "Wara (Paghahanda sang Duta)",
    "Masbate Precision Partner": "Katimbang sa Precision sa Masbate",
    "Active Alerts:": "Aktibo na mga Alerto:",
    "Weather Forecast": "Uran kag Panahon",
    "Fast Planting": "Dalian na Pagtanom",
    "Add a new crop easily": "Magrehistro sang bag-o na tanom sa pira ka segundo",
    "Plot": "Plot",
    "Crop": "Tanom",
    "Plant Now": "Itanom Subong",
    "Quick Actions": "Dalian na Aksyon",
    "+ New Planting": "+ Bag-o na Pagtanom",
    "+ Add Plot": "+ Magdugang sang Plot",
    "To-Do List": "Kadi na mga Iskedyul",
    "Tasks for the next 7 days": "Mga buluhaton sa masunod na 7 ka adlaw",
    "Rainfall Trend (mm)": "Dagan sang Uran (mm)",
    "Loading forecast...": "Ginaload an forecast...",
    "Loading rainfall data...": "Ginaload an data sang uran...",
    "Select plot...": "Pili-a an plot...",
    "Select crop...": "Pili-a an tanom...",
    "Select an active plot to load agronomic models...": "Pili-a an aktibo na plot para mag-load sang mga model sang uma...",
    "Farm Advice": "Katalinuhan sa Pag-uma",
    "Growth stage and daily advice": "FAO-56 kag GDD Phenology Models",
    "Smart Tips": "Giya sa Padesisyon",
    "Tips for your farm based on today's weather": "Mga rekomendasyon base sa data sang panahon",
    "Generating insights from weather data...": "Ginahimo an mga giya hali sa data sang panahon...",
    "Temperature:": "Temperatura:",
    "Feels like": "Namamatian",
    "Humidity:": "Halumigmig:",
    "Visibility:": "Kakayahan maghiling:",
    "Current conditions:": "Subong na kondisyon:",
    "Wind:": "Hangin:",
    "Pressure:": "Presyon:",
    "Clouds:": "mga Dag-om:",
    "Rainfall:": "Uran:",
    "Pressure": "Presyon",
    "Clouds": "mga Dag-om",
    "Atmospheric pressure": "Presyon sang atmospera",
    "Wind": "Hangin",

    // Crop Management Page
    "Smart Crop Dashboard": "Matalino na Dashboard sang Tanom",
    "Current status of active agricultural plots": "Subong na estado sang mga aktibo na plot sa agrikultura",
    "Search by plot or crop name...": "Maghanap gamit an pangaran sang plot o tanom...",
    "All Status": "Tanan na Estado",
    "Healthy": "Mapag-on",
    "Satisfactory": "Husto Lang",
    "At Risk": "Ara sa Panganib",
    "Critical": "Kritikal",
    "Available": "Puwede Gamiton",
    "Plot Status Table": "Talahanayan sang Estado sang Plot",
    "Calculated rain sensitivity and environmental vulnerability": "Ginkalkula na sensitibidad sa uran kag kahinaan sa kapalibutan",
    "Historical Yield Logs": "Talaan sang mga Nakaagi na Ani",
    "Review completed harvest cycles": "Repasuhon an mga natapos na siklo sang pag-ani",
    "Plant New Crop Batch": "Magtanom sang Bag-o na Batch sang Tanom",
    "Initialize planting parameters": "Punan an mga parameter sa pagtanom",
    "Select Plot": "Pili-a an Plot",
    "Select Crop to Plant": "Pili-a an Tanom na Itatanom",
    "Planting Date": "Petsa sang Pagtanom",
    "Confirm & Register Planting": "Kumpirmahon kag Irehistro an Pagtanom",

    // Weather Analytics Page
    "Weather Analytics & Historical Archive": "Pagsusuri sang Panahon kag Nakaagi na Archive",
    "Masbate Regional station metrics, 5-day predictive trends, and historical logs.": "Mga sukatan sang estasyon sa rehiyon sang Masbate, 5-adlaw na prediksyon, kag mga nakaagi na talaan.",
    "5-Day Forecast": "5-Adlaw na Prediksyon",
    "Predictive rain and temperature models": "Mga modelo sang prediksyon sa uran kag temperatura",
    "Rainfall Trend & Accumulation": "Trend kag Accumulation sang Uran",
    "5-day projected rain volume in mm": "Hula sa kadamo sang uran sa sulod sang 5 ka adlaw sa mm",
    "Crop Health Risk Forecast": "Prediksyon sa Panganib sa Kalusugan sang Tanom",
    "Vulnerability index based on forecasted conditions": "Index sang kahinaan base sa inihula na kondisyon",
    "Weather Archive": "Archive sang Panahon",
    "Historical database of registered local logs": "Nakaagi na database sang mga nakarehistro na lokal na talaan",
    "Rule-based predictive analysis powered by OpenWeather live data.": "Analisis sang prediksyon base sa data sang panahon.",

    // Digital Repository Page
    "Digital Repository & Agropedia": "Digital na Imbakan kag Agropedia",
    "Central agricultural knowledge, crop vulnerabilities, and Masbate region trivia.": "Pang-una na kaalaman sa agrikultura, mga kahinaan sang tanom, kag trivia sa rehiyon sang Masbate.",
    "Agropedia Knowledge Base": "Basehan sang Kaalaman sa Agropedia",
    "Official crop parameters and growth details": "Opisyal na parameter sang tanom kag detalye sang pagtubo",
    "Masbate Agricultural Trivia": "Trivia sa Agrikultura sang Masbate",
    "Fun facts and local farming stories": "Mga makalingaw na katotohanan kag kwento sang pag-uma",
    "Crop Guidelines": "Mga Alituntunin sa Tanom",
    "Best practices for local growers": "Pinakamaayo na kasanayan para sa mga lokal na parauma",
    "Smart Crop Encyclopedia, agricultural best practices, and trivia": "Matalino na Ensayklopidiya sang Tanom, mga pinakamaayo na kasanayan sa pag-uma, kag trivia"
  },
  english: {}
};

function applyTranslations(lang) {
    if (!lang) lang = 'filipino';
    currentLanguage = lang;
    const translationMap = translations[lang] || {};
    
    // 1. Translate text nodes
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    const replacements = [];
    while (node = walker.nextNode()) {
        const parentTagName = node.parentNode ? node.parentNode.tagName.toUpperCase() : '';
        if (parentTagName === 'SCRIPT' || parentTagName === 'STYLE') continue;

        if (node.originalValue === undefined) {
            node.originalValue = node.nodeValue;
        }
        
        const originalText = node.originalValue;
        if (originalText && originalText.trim()) {
            if (lang === 'english') {
                node.nodeValue = node.originalValue;
            } else {
                let text = originalText.trim();
                if (translationMap[text]) {
                    node.nodeValue = node.originalValue.replace(text, translationMap[text]);
                } else {
                    let newVal = originalText;
                    let changed = false;
                    for (const [engKey, langVal] of Object.entries(translationMap)) {
                        if (substringKeys.includes(engKey) && newVal.includes(engKey)) {
                            newVal = newVal.replaceAll(engKey, langVal);
                            changed = true;
                        }
                    }
                    if (changed) {
                        node.nodeValue = newVal;
                    }
                }
            }
        }
    }

    // 2. Translate placeholders
    document.querySelectorAll('[placeholder]').forEach(el => {
        if (el.originalPlaceholder === undefined) {
            el.originalPlaceholder = el.getAttribute('placeholder') || '';
        }
        const originalPlaceholder = el.originalPlaceholder.trim();
        if (originalPlaceholder) {
            if (lang === 'english') {
                el.setAttribute('placeholder', el.originalPlaceholder);
            } else if (translationMap[originalPlaceholder]) {
                el.setAttribute('placeholder', translationMap[originalPlaceholder]);
            }
        }
    });
}

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
                    // Re-run predictor and re-render plot health with live data
                    updatePredictor();
                    renderAllViews();
                    loadTyphoonAdvisor();
                    loadTodoList();
                }

            } catch (err) {
                console.error('Failed to load weather data:', err);
                renderWeatherError();
            }
        }

        //
        // SMART TO-DO LIST
        //

        async function loadTodoList() {
            try {
                var res = await fetch('/api/todo');
                if (res.ok) {
                    var data = await res.json();
                    renderTodoList(data);
                }
            } catch (err) {
                console.warn('Todo list unavailable:', err);
            }
        }

        function renderTodoList(data) {
            var container = document.getElementById('todo-list-container');
            if (!container) return;

            if (!data.all || data.all.length === 0) {
                container.innerHTML = '<div style="text-align:center; color:#6A9A6A; padding:18px; font-size:13px; font-weight:600;">' +
                    (data.message || 'No tasks for today. Add a planting to receive smart task suggestions.') + '</div>';
                return;
            }

            var html = '';
            var todayDate = new Date().toISOString().split('T')[0];
            var count = 0;

            for (var i = 0; i < data.all.length && count < 8; i++) {
                var task = data.all[i];
                if (task.date < todayDate) continue;
                count++;

                var typeColors = {
                    'IRR': { bg: '#E3F0FF', color: '#1A5A9A', label: 'IRR' },
                    'FERT': { bg: '#FFF3E0', color: '#8A5A00', label: 'FERT' },
                    'PEST': { bg: '#FEE9E7', color: '#B03A20', label: 'PEST' },
                    'HARVEST': { bg: '#FFF8E1', color: '#8A7A20', label: 'HARV' },
                    'DRAIN': { bg: '#E8F5E9', color: '#2E7D32', label: 'DRAIN' },
                    'GENERAL': { bg: '#F3E5F5', color: '#6A1B9A', label: 'CARE' }
                };
                var tc = typeColors[task.type] || { bg: '#F5F5F5', color: '#555', label: task.type };

                var priorityDot = task.priority === 'high'
                    ? '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#D32F2F;margin-right:6px;" title="High priority"></span>'
                    : task.priority === 'medium'
                    ? '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#F9A825;margin-right:6px;" title="Medium priority"></span>'
                    : '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#7CB342;margin-right:6px;" title="Low priority"></span>';

                var fieldInfo = '';
                if (task.crop && task.crop !== '—' && task.stage && task.stage !== '—') {
                    fieldInfo = '<div class="sched-field">' + escapeHtml(task.crop) + ' &middot; ' + escapeHtml(task.stage) + '</div>';
                }

                html += '<div class="schedule-item" title="' + escapeAttr(task.reason || '') + '">' +
                    '<div class="sched-date">' +
                        '<div class="sched-day">' + task.dayName + '</div>' +
                        '<div class="sched-num">' + task.dayNum + '</div>' +
                    '</div>' +
                    '<div class="sched-body">' +
                        '<div class="sched-task">' + priorityDot + escapeHtml(task.task) + '</div>' +
                        fieldInfo +
                    '</div>' +
                    '<div class="sched-type" style="background:' + tc.bg + ';color:' + tc.color + ';">' + tc.label + '</div>' +
                '</div>';
            }

            if (count === 0) {
                container.innerHTML = '<div style="text-align:center; color:#6A9A6A; padding:18px; font-size:13px; font-weight:600;">All tasks complete for today. Great work!</div>';
                return;
            }

            container.innerHTML = html;
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
                    '<td data-label="Date">' + dateStr + '</td>' +
                    '<td data-label="Avg Temp">' + day.temp_max + '\u00B0C</td>' +
                    '<td data-label="Humidity">' + day.humidity + '%</td>' +
                    '<td data-label="Wind Speed">' + day.wind_speed + ' km/h</td>' +
                    '<td data-label="Daily Rain">' + day.rainfall + ' mm</td>' +
                    '<td data-label="Status">' + day.weather_main + ' ' + emoji + '</td></tr>';
            });
            tbody.innerHTML = html;
        }

        async function loadTyphoonAdvisor() {
            var container = document.getElementById('typhoon-banner-container');
            var titleEl = document.getElementById('typhoon-banner-title');
            var subEl = document.getElementById('typhoon-banner-sub');
            var bodyEl = document.getElementById('typhoon-banner-body');
            var checklistEl = document.getElementById('typhoon-banner-checklist');
            if (!container || !titleEl || !subEl || !bodyEl || !checklistEl) return;

            try {
                var res = await fetch('/api/advisor/typhoon');
                if (!res.ok) {
                    container.style.display = 'none';
                    return;
                }

                var data = await res.json();
                var risk = (data.overallRisk || 'NONE').toUpperCase();
                if (risk === 'NONE') {
                    container.style.display = 'none';
                    return;
                }

                var riskTitle = 'Typhoon / Extreme Weather Watch';
                if (risk === 'WARNING') riskTitle = 'Typhoon / Extreme Weather Warning';
                if (risk === 'EMERGENCY') riskTitle = 'Typhoon / Extreme Weather Emergency';

                titleEl.textContent = riskTitle;
                subEl.textContent = 'PAGASA-style Forecast Advisory';

                var signal = (data.signals && data.signals.length > 0) ? data.signals[0] : null;
                if (signal) {
                    bodyEl.textContent = signal.description;
                } else {
                    bodyEl.textContent = 'Elevated weather risk detected for the next forecast period. Activate farm preparedness protocols.';
                }

                var checklist = (data.emergencyChecklist && data.emergencyChecklist.length > 0)
                    ? data.emergencyChecklist
                    : (data.farmPreparation || []);

                checklistEl.innerHTML = '';
                checklist.forEach(function(item) {
                    var li = document.createElement('li');
                    li.textContent = item;
                    checklistEl.appendChild(li);
                });

                container.style.display = 'block';
            } catch (err) {
                console.warn('Typhoon advisor unavailable:', err);
                container.style.display = 'none';
            }
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

        // Pagination state for Crop Management
        var cropPage = 1;
        var cropPerPage = 10;

        // Helper: calculate days since planting date
        function calculateDaysGrown(dateStr) {
            if (!dateStr) return 0;
            var plantDate = new Date(dateStr);
            var today = new Date();
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

        // Compute plot health score dynamically from live weather & crop tolerances
        function computePlotHealth(plot) {
            if (!plot.planted) {
                return { score: null, label: "Available", badgeClass: "badge-gray" };
            }

            var cropInfo = cropDataRepo[plot.crop];
            if (!cropInfo) {
                return { score: 50, label: "Satisfactory", badgeClass: "badge-blue" };
            }

            var days = calculateDaysGrown(plot.planted);
            var stage = getGrowthStage(plot.crop, days);
            var score = 100;

            // 1. Rainfall stress (35%)
            var rainScore = 100;
            if (forecastedRain > cropInfo.limit) {
                rainScore = 10;
            } else if (forecastedRain * 2 > cropInfo.limit) {
                rainScore = 50;
            } else if (forecastedRain * 1.2 > cropInfo.limit) {
                rainScore = 80;
            }
            score += (rainScore - 100) * 0.35;

            // 2. Temperature stress (30%)
            var tempScore = 100;
            if (liveForecast && liveForecast.days && liveForecast.days.length > 0) {
                var maxTemp = Math.max.apply(null, liveForecast.days.map(function(d) { return d.temp_max; }));
                var minTemp = Math.min.apply(null, liveForecast.days.map(function(d) { return d.temp_min; }));
                if (maxTemp > cropInfo.tempMax + 5 || minTemp < cropInfo.tempMin - 5) {
                    tempScore = 10;
                } else if (maxTemp > cropInfo.tempMax || minTemp < cropInfo.tempMin) {
                    tempScore = 40;
                } else if (maxTemp > cropInfo.tempMax - 3 || minTemp < cropInfo.tempMin + 3) {
                    tempScore = 80;
                }
            }
            score += (tempScore - 100) * 0.30;

            // 3. Humidity / disease risk (15%)
            var humidityScore = 100;
            if (liveForecast && liveForecast.days) {
                var maxHumidity = Math.max.apply(null, liveForecast.days.map(function(d) { return d.humidity; }));
                if (maxHumidity >= 90) {
                    humidityScore = 20;
                } else if (maxHumidity >= 85) {
                    humidityScore = 50;
                } else if (maxHumidity >= 80) {
                    humidityScore = 80;
                }
            }
            score += (humidityScore - 100) * 0.15;

            // 4. Growth stage vulnerability (10%)
            var stageScore = 100;
            if (stage.indexOf("Seedling") !== -1 || stage.indexOf("Flowering") !== -1 || stage.indexOf("Tasseling") !== -1) {
                stageScore = 70;
            }
            score += (stageScore - 100) * 0.10;

            // 5. Cumulative forecast stress (10%)
            var cumulativeScore = 100;
            if (liveForecast && liveForecast.days) {
                var adverseDays = 0;
                liveForecast.days.forEach(function(d) {
                    if (d.rainfall > cropInfo.limit * 0.5 || d.temp_max > cropInfo.tempMax || d.temp_min < cropInfo.tempMin) {
                        adverseDays++;
                    }
                });
                var adverseRatio = adverseDays / liveForecast.days.length;
                if (adverseRatio >= 0.8) cumulativeScore = 10;
                else if (adverseRatio >= 0.5) cumulativeScore = 40;
                else if (adverseRatio >= 0.3) cumulativeScore = 70;
            }
            score += (cumulativeScore - 100) * 0.10;

            score = Math.max(0, Math.min(100, Math.round(score)));

            var label, badgeClass;
            if (score >= 80)      { label = "Healthy"; badgeClass = "badge-green"; }
            else if (score >= 50) { label = "Satisfactory"; badgeClass = "badge-blue"; }
            else if (score >= 25) { label = "At Risk"; badgeClass = "badge-amber"; }
            else                  { label = "Critical"; badgeClass = "badge-red"; }

            return { score: score, label: label, badgeClass: badgeClass };
        }

        // Fetch all user, plot, crop, and planting records from the backend API
        async function loadFarmerData() {
            try {
                const response = await fetch('/api/farmer/data');
                if (!response.ok) throw new Error('Failed to fetch farmer data');
                const data = await response.json();
                
                if (data.user && data.user.full_name) {
                    var names = data.user.full_name.split(' ');
                    var initials = names.map(function(n) { return n[0]; }).join('').substring(0, 2).toUpperCase();
                    document.querySelectorAll('.topbar-right div').forEach(function(el) {
                        if (el.textContent.trim() === 'JR' || el.id === 'user-avatar-initials') {
                            el.textContent = initials;
                            el.id = 'user-avatar-initials';
                            el.title = data.user.full_name + ' (' + data.user.role + ')';
                        }
                    });

                    // Dynamic Farmer Profile Page Rendering
                    var elAvatarLarge = document.getElementById('profile-avatar-large');
                    var elDisplayName = document.getElementById('profile-display-name');
                    var elDisplayRole = document.getElementById('profile-display-role');
                    var elFullname = document.getElementById('profile-fullname');
                    var elContact = document.getElementById('profile-contact');
                    var elEmail = document.getElementById('profile-email');
                    var toggleSms = document.getElementById('toggle-sms');

                    if (elAvatarLarge) elAvatarLarge.textContent = initials;
                    if (elDisplayName) elDisplayName.textContent = data.user.full_name;
                    if (elDisplayRole) elDisplayRole.textContent = data.user.role || 'Agriculturist';
                    
                    if (elFullname && document.activeElement !== elFullname) elFullname.value = data.user.full_name;
                    if (elContact && document.activeElement !== elContact) elContact.value = data.user.contact_number || '';
                    if (elEmail) elEmail.value = data.user.email || '';
                    if (toggleSms) toggleSms.checked = !!data.user.sms_opt_in;

                    // Set user preference language
                    currentLanguage = data.user.language_pref || 'filipino';
                    var selectLang = document.getElementById('language-select');
                    if (selectLang) {
                        selectLang.value = currentLanguage;
                    }
                }
                
                dbPlots = data.plots;
                dbCrops = data.crops;

                // Build the cropDataRepo dynamically from the database!
                dbCrops.forEach(function (c) {
                    cropDataRepo[c.crop_name] = {
                        limit: parseFloat(c.rain_tolerance),
                        idealTemp: c.ideal_temp_min + "\u00B0C - " + c.ideal_temp_max + "\u00B0C",
                        growthDays: parseInt(c.days_to_harvest),
                        advice: c.best_practices || "No advice recorded.",
                        tempMin: parseFloat(c.ideal_temp_min),
                        tempMax: parseFloat(c.ideal_temp_max)
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

                // Dynamic Season Overview stats calculation
                var plots = data.plots || [];
                var plantingRecords = data.plantingRecords || [];
                
                var totalFarmSizeVal = plots.reduce(function(sum, plot) {
                    return sum + parseFloat(plot.area_size || 0);
                }, 0).toFixed(1);
                
                var activePlotsVal = activeCrops.filter(function(c) {
                    return c.planted !== null;
                }).length;
                
                var harvestedCount = plantingRecords.filter(function(r) { return r.status === 'Harvested'; }).length;
                var totalRecordsCount = plantingRecords.length;
                var harvestRateVal = totalRecordsCount > 0 
                    ? ((harvestedCount / totalRecordsCount) * 100).toFixed(1) + '%' 
                    : '100.0%';

                var elFarmSize = document.getElementById('profile-farm-size');
                var elActivePlots = document.getElementById('profile-active-plots');
                var elHarvestRate = document.getElementById('profile-harvest-rate');

                if (elFarmSize) elFarmSize.textContent = totalFarmSizeVal + ' Hectares';
                if (elActivePlots) elActivePlots.textContent = activePlotsVal + ' Plot' + (activePlotsVal !== 1 ? 's' : '');
                if (elHarvestRate) elHarvestRate.textContent = harvestRateVal + ' Success';

                // Redraw all elements
                renderAllViews();
                applyTranslations(currentLanguage);

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
                        opt.text = plot.plot_name + " (Available \u00B7 Soil prep completed)";
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

        function renderHistoricalTable(records) {
            var tbody = document.getElementById('historical-table-tbody')
                || document.getElementById('historical-tbody')
                || document.getElementById('planting-history-tbody');

            // Historical section is optional on some dashboard variants.
            if (!tbody) return;

            var list = Array.isArray(records) ? records : [];
            if (list.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#9A9790;">No harvested records yet.</td></tr>';
                return;
            }

            var html = '';
            list.forEach(function(r) {
                var plotName = (r.plot && r.plot.plot_name) ? r.plot.plot_name : 'Unknown Plot';
                var cropName = (r.crop && r.crop.crop_name) ? r.crop.crop_name : 'Unknown Crop';
                var planted = r.planting_date ? new Date(r.planting_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';
                var harvested = (r.updatedAt || r.updated_at) ? new Date(r.updatedAt || r.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';
                var status = r.status || 'Harvested';

                html += '<tr>' +
                    '<td>' + plotName + '</td>' +
                    '<td>' + cropName + '</td>' +
                    '<td>' + planted + '</td>' +
                    '<td>' + harvested + '</td>' +
                    '<td>' + status + '</td>' +
                    '<td>' + (r.record_id || '-') + '</td>' +
                '</tr>';
            });

            tbody.innerHTML = html;
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
                if (c.planted) {
                    var days = calculateDaysGrown(c.planted);
                    var stage = getGrowthStage(c.crop, days);
                    var health = computePlotHealth(c);
                    html += '<div class="field-card">' +
                        '  <div class="field-card-name">' + c.plot + '</div>' +
                        '  <div class="field-card-crop">' + c.crop + '</div>' +
                        '  <div class="field-card-meta">' + stage + ' \u00B7 Day ' + days + '</div>' +
                        '  <div class="field-card-health ' + health.badgeClass + '">' + health.label + '</div>' +
                        '</div>';
                } else {
                    html += '<div class="field-card">' +
                        '  <div class="field-card-name">' + c.plot + '</div>' +
                        '  <div class="field-card-meta">Available \u00B7 ' + c.size + '</div>' +
                        '</div>';
                }
            });
            container.innerHTML = html;
        }

        // 2. Render Quick Plant dropdowns
        function renderQuickActions() {
            var plotSelect = document.getElementById("qp-plot");
            var cropSelect = document.getElementById("qp-crop");
            if (!plotSelect || !cropSelect) return;

            plotSelect.innerHTML = '<option value="">Select plot...</option>';
            dbPlots.forEach(function (plot) {
                var opt = document.createElement("option");
                opt.value = plot.plot_id;
                opt.text = plot.plot_name;
                plotSelect.appendChild(opt);
            });

            cropSelect.innerHTML = '<option value="">Select crop...</option>';
            dbCrops.forEach(function (crop) {
                var opt = document.createElement("option");
                opt.value = crop.crop_id;
                opt.text = crop.crop_name;
                cropSelect.appendChild(opt);
            });
        }

        // Get health label for a crop (needed for filtering)
        function getCropHealthLabel(c) {
            return computePlotHealth(c).label.toLowerCase();
        }

        // 3. Render Crop Management dashboard
        function renderCropManagementView() {
            var grid = document.getElementById("active-plots-dashboard-grid");
            var statusContainer = document.getElementById("plot-status-container");
            var paginationEl = document.getElementById("crop-pagination");
            var resultCountEl = document.getElementById("filter-result-count");
            if (!grid || !statusContainer) return;

            // Gather filter values
            var searchInput = document.getElementById("plot-search");
            var query = searchInput ? searchInput.value.toLowerCase().trim() : "";
            var statusFilter = document.getElementById("crop-filter-status");
            var filterVal = statusFilter ? statusFilter.value : "all";

            // Apply search + status filter
            var displayCrops = activeCrops.filter(function (c) {
                if (query && c.plot.toLowerCase().indexOf(query) === -1 && c.crop.toLowerCase().indexOf(query) === -1) {
                    return false;
                }
                if (filterVal !== "all") {
                    var label = getCropHealthLabel(c);
                    if (filterVal === "available" && c.planted) return false;
                    if (filterVal !== "available" && !c.planted) return false;
                    if (filterVal !== "available" && filterVal !== label) return false;
                }
                return true;
            });

            // Update result count
            if (resultCountEl) resultCountEl.textContent = displayCrops.length + " result" + (displayCrops.length !== 1 ? "s" : "");

            // Pagination logic
            var totalPages = Math.max(1, Math.ceil(displayCrops.length / cropPerPage));
            if (cropPage > totalPages) cropPage = totalPages;
            var startIdx = (cropPage - 1) * cropPerPage;
            var pageItems = displayCrops.slice(startIdx, startIdx + cropPerPage);

            var gridHtml = "";
            var statusHtml = '<table class="data-table"><thead><tr><th>Plot</th><th>Crop</th><th>Stage</th><th>Sens.</th><th>Damage</th><th>Actions</th></tr></thead><tbody>';
            pageItems.forEach(function (c) {
                var days = calculateDaysGrown(c.planted);
                var stage = getGrowthStage(c.crop, days);
                var advice = cropDataRepo[c.crop] ? cropDataRepo[c.crop].advice : "Cleared field. Safe to plant.";
                var health = computePlotHealth(c);
                var badgeClass = health.badgeClass;
                var healthText = health.label;
                if (c.progressPct > 90) { stage = "Harvest Ready"; }

                if (!c.planted) { stage = "Soil Prep"; }
                statusHtml += '<tr>' +
                    '<td>' + c.plot + '</td>' +
                    '<td>' + c.crop + '</td>' +
                    '<td>' + stage + '</td>' +
                    '<td><span class="badge ' + badgeClass + '">' + healthText + '</span></td>' +
                    '<td>' + c.damage + '</td>' +
                    '<td>' +
                        (c.record_id ? '<button class="btn btn-sm btn-outline edit-btn" data-record-id="' + c.record_id + '">Edit</button>' : '') +
                    '</td></tr>';

                var metaParts = [c.crop, c.size];
                if (c.planted && days > 0) metaParts.push('Day ' + days);
                var cardBadge = c.planted ? 'plot-card-badge ' + badgeClass : 'plot-card-badge badge-gray';
                gridHtml += '<div class="plot-card">' +
                    '<div class="plot-card-header">' +
                        '<div>' +
                            '<div class="plot-card-name">' + c.plot + '</div>' +
                            '<div class="plot-card-meta">' + metaParts.join(' \u00B7 ') + '</div>' +
                        '</div>' +
                        '<span class="' + cardBadge + '">' + healthText + '</span>' +
                    '</div>' +
                    '<div class="plot-card-body">' +
                        '<div class="plot-card-advice">' + advice + '</div>' +
                    '</div>' +
                    (c.record_id ? '<div class="plot-card-actions"><button class="btn btn-sm btn-outline edit-btn" data-record-id="' + c.record_id + '">Edit</button></div>' : '') +
                '</div>';
            });
            statusContainer.innerHTML = statusHtml + '</tbody></table>';
            grid.innerHTML = gridHtml;
            if (paginationEl) {
                paginationEl.textContent = 'Page ' + cropPage + ' of ' + totalPages;
            }
        }

        function renderAllViews() {
            renderSidebarFields();
            renderQuickActions();
            renderCropManagementView();
            updatePredictor();
            applyTranslations(currentLanguage);
        }

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
        cropPage = 1;
        renderCropManagementView();
    });
}

// Status filter dropdown
var filterSelect = document.getElementById("crop-filter-status");
if (filterSelect) {
    filterSelect.addEventListener("change", function () {
        cropPage = 1;
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
// DIGITAL REPOSITORY ENCYCLOPEDIA — DYNAMIC (data from /api/crops)
// 
var encyCropData = [];
var triviaByCrop = {};
var ENCY_ITEMS_PER_PAGE = 6;
var encyCurrentPage = 1;
var encySearchQuery = "";

function getCropTipsCount(cropName) {
    var count = 0;
    if (triviaByCrop["General"]) count += triviaByCrop["General"].length;
    if (triviaByCrop[cropName]) count += triviaByCrop[cropName].length;
    return count;
}

function buildEncyclopediaCard(crop) {
    var name = crop.crop_name || "";
    var dataName = name.toLowerCase().replace(/[^a-z0-9\s]/g, "");

    var tempMin = parseFloat(crop.ideal_temp_min);
    var tempMax = parseFloat(crop.ideal_temp_max);
    var rainTol = parseFloat(crop.rain_tolerance);
    var desc = crop.best_practices || "";

    // Build growth stages
    var stagesHtml = "";
    var stages = crop.growth_stages ? crop.growth_stages.split("||") : [];
    for (var si = 0; si < stages.length; si++) {
        if (si > 0) {
            stagesHtml += '<span class="ency-timeline-arrow"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="vertical-align:middle;"><polyline points="9 18 15 12 9 6"/></svg></span>';
        }
        stagesHtml += '<span class="ency-timeline-step">' + stages[si].trim() + "</span>";
    }

    var vuln = crop.vulnerabilities || "No data recorded";
    var tipsCount = getCropTipsCount(name);

    // Map crop names to emojis and banner classes
    var emoji = "🌱";
    var bannerClass = "crop-default";
    var cropLower = name.toLowerCase();
    
    if (cropLower.indexOf("rice") !== -1 || cropLower.indexOf("palay") !== -1) {
        emoji = "🌾";
        bannerClass = "crop-rice";
    } else if (cropLower.indexOf("corn") !== -1 || cropLower.indexOf("mais") !== -1) {
        emoji = "🌽";
        bannerClass = "crop-corn";
    } else if (cropLower.indexOf("cabbage") !== -1 || cropLower.indexOf("repolyo") !== -1) {
        emoji = "🥬";
        bannerClass = "crop-cabbage";
    } else if (cropLower.indexOf("tomato") !== -1 || cropLower.indexOf("kamatis") !== -1) {
        emoji = "🍅";
        bannerClass = "crop-tomato";
    } else if (cropLower.indexOf("eggplant") !== -1 || cropLower.indexOf("talong") !== -1) {
        emoji = "🍆";
        bannerClass = "crop-eggplant";
    } else if (cropLower.indexOf("ampalaya") !== -1 || cropLower.indexOf("gourd") !== -1) {
        emoji = "🥒";
        bannerClass = "crop-ampalaya";
    } else if (cropLower.indexOf("kangkong") !== -1 || cropLower.indexOf("spinach") !== -1) {
        emoji = "🌿";
        bannerClass = "crop-kangkong";
    }

    return (
        '<div class="ency-card" data-name="' + dataName + '">' +
            '<div class="ency-card-banner ' + bannerClass + '">' +
                '<div class="ency-card-pattern"></div>' +
                '<div class="ency-card-icon-wrap">' + emoji + '</div>' +
            '</div>' +
            '<div class="ency-card-body">' +
                '<div class="ency-card-header">' +
                    '<div class="ency-card-name">' + escapeHtml(name) + "</div>" +
                "</div>" +
                '<div class="ency-card-sub">' + escapeHtml(desc) + "</div>" +
                '<div class="ency-specs">' +
                    '<div class="ency-spec">' +
                        '<div class="ency-spec-label">🌡️ Temperature</div>' +
                        '<div class="ency-spec-value">' + tempMin + "&deg;C &ndash; " + tempMax + "&deg;C</div>" +
                    "</div>" +
                    '<div class="ency-spec">' +
                        '<div class="ency-spec-label">💧 Rain Tolerance</div>' +
                        '<div class="ency-spec-value">' + rainTol + "mm/day</div>" +
                    "</div>" +
                "</div>" +
                '<div class="ency-timeline">' +
                    '<div class="ency-timeline-label">Growth Timeline</div>' +
                    '<div class="ency-timeline-steps">' + stagesHtml + "</div>" +
                "</div>" +
                '<div class="ency-vuln">' +
                    '<div class="ency-vuln-label">⚠️ Vulnerabilities</div>' +
                    '<div class="ency-vuln-text">' + escapeHtml(vuln) + "</div>" +
                "</div>" +
                (tipsCount > 0
                    ? '<div class="ency-tips-section"><button class="ency-tips-btn" data-crop="' + escapeAttr(name) + '">💡 Tips &amp; Trivia <span class="ency-tips-count">' + tipsCount + '</span></button></div>'
                    : "") +
            "</div>" +
        "</div>"
    );
}

function escapeAttr(str) {
    if (!str) return "";
    return String(str).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function getFilteredEncyclopediaCards() {
    if (!encySearchQuery) return encyCropData;
    return encyCropData.filter(function (crop) {
        var name = (crop.crop_name || "").toLowerCase();
        return name.indexOf(encySearchQuery) !== -1;
    });
}

function renderEncyclopedia() {
    var grid = document.getElementById("encyclopedia-grid");
    var pagination = document.getElementById("encyclopedia-pagination");
    if (!grid) return;

    var filtered = getFilteredEncyclopediaCards();
    var totalPages = Math.max(1, Math.ceil(filtered.length / ENCY_ITEMS_PER_PAGE));

    if (encyCurrentPage > totalPages) encyCurrentPage = totalPages;

    grid.innerHTML = "";

    if (filtered.length === 0) {
        var msg = document.createElement("div");
        msg.className = "ency-no-results";
        msg.textContent = "No crops match your search.";
        grid.appendChild(msg);
        if (pagination) pagination.classList.add("hidden");
        return;
    }

    var start = (encyCurrentPage - 1) * ENCY_ITEMS_PER_PAGE;
    var end = Math.min(start + ENCY_ITEMS_PER_PAGE, filtered.length);
    for (var i = start; i < end; i++) {
        grid.insertAdjacentHTML("beforeend", buildEncyclopediaCard(filtered[i]));
    }

    updatePaginationControls(totalPages, filtered.length);
}

function updatePaginationControls(totalPages, totalItems) {
    var pagination = document.getElementById("encyclopedia-pagination");
    var pagesContainer = document.getElementById("ency-pg-pages");
    var prevBtn = document.getElementById("ency-pg-prev");
    var nextBtn = document.getElementById("ency-pg-next");

    if (!pagination || !pagesContainer) return;

    if (totalPages <= 1) {
        pagination.classList.add("hidden");
        return;
    }
    pagination.classList.remove("hidden");

    prevBtn.disabled = encyCurrentPage === 1;
    nextBtn.disabled = encyCurrentPage === totalPages;

    var html = "";
    var maxVisible = 5;
    var startPage = Math.max(1, encyCurrentPage - Math.floor(maxVisible / 2));
    var endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
        html += '<button class="ency-pg-page" data-page="1">1</button>';
        if (startPage > 2) {
            html += '<span style="color:#D6D3CB;font-size:11px;padding:0 2px;">...</span>';
        }
    }

    for (var p = startPage; p <= endPage; p++) {
        var activeClass = p === encyCurrentPage ? " active" : "";
        html += '<button class="ency-pg-page' + activeClass + '" data-page="' + p + '">' + p + "</button>";
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += '<span style="color:#D6D3CB;font-size:11px;padding:0 2px;">...</span>';
        }
        html += '<button class="ency-pg-page" data-page="' + totalPages + '">' + totalPages + "</button>";
    }

    pagesContainer.innerHTML = html;

    pagesContainer.querySelectorAll(".ency-pg-page").forEach(function (btn) {
        btn.addEventListener("click", function () {
            encyCurrentPage = parseInt(this.getAttribute("data-page"));
            renderEncyclopedia();
        });
    });
}

async function loadEncyclopediaData() {
    try {
        var [cropsRes, triviaRes] = await Promise.all([
            fetch("/api/crops"),
            fetch("/api/trivia")
        ]);
        if (!cropsRes.ok) throw new Error("Failed to fetch crops");
        encyCropData = await cropsRes.json();

        triviaByCrop = {};
        if (triviaRes.ok) {
            var allTrivia = await triviaRes.json();
            for (var ti = 0; ti < allTrivia.length; ti++) {
                var t = allTrivia[ti];
                var tag = t.crop_tag || "General";
                if (!triviaByCrop[tag]) triviaByCrop[tag] = [];
                triviaByCrop[tag].push(t);
            }
        }
    } catch (err) {
        console.error("Failed to load encyclopedia data:", err);
        encyCropData = [];
    }
    encyCurrentPage = 1;
    encySearchQuery = "";
    renderEncyclopedia();
}

function openTipsModal(cropName) {
    var overlay = document.getElementById("tips-modal-overlay");
    var titleEl = document.getElementById("tips-modal-title");
    var bodyEl = document.getElementById("tips-modal-body");
    if (!overlay || !titleEl || !bodyEl) return;

    titleEl.textContent = "Agricultural Tips \u2014 " + cropName;

    var html = "";
    function renderTip(t) {
        var badge = t.crop_tag && t.crop_tag !== "General"
            ? '<span class="tips-item-tag">' + escapeHtml(t.crop_tag) + "</span>"
            : "";
        return '<div class="tips-item">'
            + '<div class="tips-item-content">' + escapeHtml(t.content) + "</div>"
            + (badge ? '<div class="tips-item-meta">' + badge + "</div>" : "")
            + "</div>";
    }

    var generalTips = triviaByCrop["General"] || [];
    var cropTips = triviaByCrop[cropName] || [];

    if (generalTips.length > 0) {
        html += '<div class="tips-group-label">General Tips</div>';
        for (var gi = 0; gi < generalTips.length; gi++) {
            html += renderTip(generalTips[gi]);
        }
    }

    if (cropTips.length > 0) {
        html += '<div class="tips-group-label">' + escapeHtml(cropName) + " Tips</div>";
        for (var ci = 0; ci < cropTips.length; ci++) {
            html += renderTip(cropTips[ci]);
        }
    }

    if (!html) {
        html = '<div class="tips-empty">No tips available for this crop yet.</div>';
    }

    bodyEl.innerHTML = html;
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeTipsModal() {
    var overlay = document.getElementById("tips-modal-overlay");
    if (overlay) {
        overlay.style.display = "none";
        document.body.style.overflow = "";
    }
}

// Search
var searchEncy = document.getElementById("encyclopedia-search");
if (searchEncy) {
    searchEncy.addEventListener("input", function () {
        encySearchQuery = this.value.toLowerCase().trim();
        encyCurrentPage = 1;
        renderEncyclopedia();
    });
}

// Prev / Next
var prevBtn = document.getElementById("ency-pg-prev");
var nextBtn = document.getElementById("ency-pg-next");
if (prevBtn) {
    prevBtn.addEventListener("click", function () {
        if (encyCurrentPage > 1) {
            encyCurrentPage--;
            renderEncyclopedia();
        }
    });
}
if (nextBtn) {
    nextBtn.addEventListener("click", function () {
        var filtered = getFilteredEncyclopediaCards();
        var totalPages = Math.max(1, Math.ceil(filtered.length / ENCY_ITEMS_PER_PAGE));
        if (encyCurrentPage < totalPages) {
            encyCurrentPage++;
            renderEncyclopedia();
        }
    });
}

// Tips button delegation (click on any .ency-tips-btn inside the grid)
var encyGrid = document.getElementById("encyclopedia-grid");
if (encyGrid) {
    encyGrid.addEventListener("click", function (e) {
        var btn = e.target.closest(".ency-tips-btn");
        if (btn) {
            var cropName = btn.getAttribute("data-crop");
            if (cropName) openTipsModal(cropName);
        }
    });
}

// Modal close handlers
var tipsClose = document.getElementById("tips-modal-close");
var tipsOverlay = document.getElementById("tips-modal-overlay");
if (tipsClose) tipsClose.addEventListener("click", closeTipsModal);
if (tipsOverlay) {
    tipsOverlay.addEventListener("click", function (e) {
        if (e.target === this) closeTipsModal();
    });
}
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeTipsModal();
});

// Delegated click for Edit buttons (no inline JS)
document.addEventListener('click', function (e) {
    var btn = e.target.closest('.edit-btn');
    if (btn) {
        var recordId = btn.getAttribute('data-record-id');
        if (recordId) openEditModal(recordId);
    }
});

// Initial load from API
loadEncyclopediaData();

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
                alertBox.className = "planting-alert success show";
                alertBox.innerHTML = "<strong>Success!</strong> Planting batch successfully registered. Initial growth stage estimated as Seedling.";

                setTimeout(function () {
                    alertBox.classList.remove("show");
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

// 
// QUICK PLANT FORM SUBMISSION
// 
var qpBtn = document.getElementById("qp-plant-btn");
if (qpBtn) {
    qpBtn.addEventListener("click", async function () {
        var plotId = document.getElementById("qp-plot").value;
        var cropId = document.getElementById("qp-crop").value;
        var plantDate = document.getElementById("qp-date").value;
        var resultEl = document.getElementById("qp-result");

        if (!plotId || !cropId || !plantDate) {
            if (resultEl) {
                resultEl.className = "qp-result qp-result-error";
                resultEl.textContent = "Please fill in all fields.";
            }
            return;
        }

        try {
            const response = await fetch('/api/planting-records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plot_id: plotId, crop_id: cropId, planting_date: plantDate })
            });

            if (!response.ok) throw new Error('Failed to plant crop');

            if (resultEl) {
                resultEl.className = "qp-result qp-result-success";
                resultEl.textContent = "Batch registered! Initial stage: Seedling.";
                setTimeout(function () { resultEl.className = "qp-result"; resultEl.textContent = ""; }, 4000);
            }

            document.getElementById("qp-plot").value = "";
            document.getElementById("qp-crop").value = "";
            document.getElementById("qp-date").value = getTodayStr();

            await loadFarmerData();

        } catch (err) {
            console.error(err);
            if (resultEl) {
                resultEl.className = "qp-result qp-result-error";
                resultEl.textContent = "Failed to register planting batch.";
            }
        }
    });
}

function getTodayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
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

// Set today as default in quick plant date field
var qpDateInput = document.getElementById("qp-date");
if (qpDateInput) qpDateInput.value = getTodayStr();

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

function openEditModal(recordId) {
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
function closeEditModal() {
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

var btnOpenAddCropModal = document.getElementById('btn-open-add-crop-modal');
if (btnOpenAddCropModal) btnOpenAddCropModal.addEventListener('click', openAddCropModal);

var btnCloseEditModal = document.getElementById('btn-close-edit-modal');
if (btnCloseEditModal) btnCloseEditModal.addEventListener('click', closeEditModal);

var btnCloseAddPlotModal = document.getElementById('btn-close-add-plot-modal');
if (btnCloseAddPlotModal) btnCloseAddPlotModal.addEventListener('click', closeAddPlotModal);

var btnCloseAddCropModal = document.getElementById('btn-close-add-crop-modal');
if (btnCloseAddCropModal) btnCloseAddCropModal.addEventListener('click', closeAddCropModal);

var qaFullPlanting = document.getElementById('qa-full-planting');
if (qaFullPlanting) qaFullPlanting.addEventListener('click', openPlantingModal);

var qaAddPlot = document.getElementById('qa-add-plot');
if (qaAddPlot) qaAddPlot.addEventListener('click', openAddPlotModal);

// Close drawer when sidebar nav is clicked in mobile view
document.querySelectorAll('.sidebar .nav-item').forEach(function (item) {
    item.addEventListener('click', function () {
        if (window.innerWidth <= 768) closeSidebar();
    });
});

// Premium Toast Notification Helper
function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    
    const icon = type === 'success' ? '✅' : '❌';
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-text">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after 3.5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3500);
}

// Profile details form submission listener
var profileForm = document.getElementById('profile-details-form');
if (profileForm) {
    profileForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        var fullNameInput = document.getElementById('profile-fullname');
        var contactInput = document.getElementById('profile-contact');
        
        if (!fullNameInput) return;
        
        var fullName = fullNameInput.value.trim();
        var contact = contactInput ? contactInput.value.trim() : '';
        
        if (!fullName) {
            showToast('Full name is required', 'error');
            return;
        }
        
        var saveButton = document.getElementById('btn-save-profile');
        if (saveButton) {
            saveButton.disabled = true;
            saveButton.textContent = 'Saving...';
        }
        
        try {
            const response = await fetch('/api/farmer/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    full_name: fullName,
                    contact_number: contact
                })
            });
            
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to update profile');
            }
            
            showToast('Profile updated successfully!', 'success');
            await loadFarmerData();
        } catch (err) {
            console.error('Error saving profile:', err);
            showToast(err.message || 'Failed to save profile details', 'error');
        } finally {
            if (saveButton) {
                saveButton.disabled = false;
                saveButton.textContent = 'Save Profile';
            }
        }
    });
}

// SMS alerts toggle switch listener
var toggleSms = document.getElementById('toggle-sms');
if (toggleSms) {
    toggleSms.addEventListener('change', async function() {
        var optIn = toggleSms.checked;
        try {
            const response = await fetch('/api/farmer/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sms_opt_in: optIn
                })
            });
            
            if (!response.ok) throw new Error('Failed to update SMS preference');
            
            showToast(optIn ? 'SMS Alerts enabled!' : 'SMS Alerts disabled.', 'success');
            await loadFarmerData();
        } catch (err) {
            console.error(err);
            showToast('Failed to update SMS settings.', 'error');
            toggleSms.checked = !optIn;
        }
    });
}

// Automated Irrigation Prompts toggle switch listener
var toggleIrr = document.getElementById('toggle-irr');
if (toggleIrr) {
    var irrSaved = localStorage.getItem('toggle_irr');
    if (irrSaved !== null) {
        toggleIrr.checked = irrSaved === 'true';
    }
    toggleIrr.addEventListener('change', function() {
        localStorage.setItem('toggle_irr', toggleIrr.checked);
        showToast(toggleIrr.checked ? 'Irrigation prompts enabled!' : 'Irrigation prompts disabled.', 'success');
    });
}

// Station Cloud Linkage toggle switch listener
var toggleCloud = document.getElementById('toggle-cloud');
if (toggleCloud) {
    var cloudSaved = localStorage.getItem('toggle_cloud');
    if (cloudSaved !== null) {
        toggleCloud.checked = cloudSaved === 'true';
    }
    toggleCloud.addEventListener('change', function() {
        localStorage.setItem('toggle_cloud', toggleCloud.checked);
        showToast(toggleCloud.checked ? 'Cloud sensor link active!' : 'Cloud sensor link deactivated.', 'success');
    });
}

// Language Preference change listener
var langSelect = document.getElementById('language-select');
if (langSelect) {
    langSelect.addEventListener('change', async function() {
        var selectedLang = langSelect.value;
        try {
            const response = await fetch('/api/farmer/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    language_pref: selectedLang
                })
            });
            
            if (!response.ok) throw new Error('Failed to update language preference');
            
            showToast('Language preference updated!', 'success');
            currentLanguage = selectedLang;
            applyTranslations(selectedLang);
        } catch (err) {
            console.error(err);
            showToast('Failed to update language settings.', 'error');
            langSelect.value = currentLanguage;
        }
    });
}

// ==========================================
// SATELLITE VEGETATION MONITORING (Agromonitoring)
// ==========================================

var satelliteDataCache = null;

async function loadSatelliteImagery() {
    var loadingEl = document.getElementById('satellite-loading');
    var errorEl = document.getElementById('satellite-error');
    var contentEl = document.getElementById('satellite-content');
    var refreshBtn = document.getElementById('btn-refresh-satellite');

    if (!loadingEl || !contentEl) return;

    loadingEl.style.display = 'flex';
    errorEl.style.display = 'none';
    contentEl.style.display = 'none';
    if (refreshBtn) refreshBtn.disabled = true;

    try {
        var res = await fetch('/api/satellite/imagery');
        if (!res.ok) {
            var errData = await res.json().catch(function() { return {}; });
            throw new Error(errData.message || errData.error || 'Satellite API error (' + res.status + ')');
        }

        var data = await res.json();
        satelliteDataCache = data;

        if (!data.available || !data.images || data.images.length === 0) {
            loadingEl.style.display = 'none';
            errorEl.style.display = 'block';
            errorEl.innerHTML = '<strong>Satellite Data Pending</strong><br>' +
                (data.message || 'No recent satellite passes over Mandaon, Masbate. Sentinel-2 revisits every 3-5 days. Check back soon.');
            if (refreshBtn) refreshBtn.disabled = false;
            return;
        }

        renderSatelliteContent(data);
    } catch (err) {
        console.error('Satellite imagery error:', err);
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.innerHTML = '<strong>Unable to Load Satellite Data</strong><br>' + escapeHtml(err.message);
    } finally {
        if (refreshBtn) refreshBtn.disabled = false;
    }
}

function renderSatelliteContent(data) {
    var loadingEl = document.getElementById('satellite-loading');
    var contentEl = document.getElementById('satellite-content');
    if (!loadingEl || !contentEl) return;

    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';

    var latest = data.images[0];

    renderSatelliteMeta(latest, data);
    loadSatelliteImages();
    renderSatelliteAnalysis(latest);
    renderSatelliteHistory(data.images);
}

function renderSatelliteMeta(latest, data) {
    var metaBar = document.getElementById('satellite-meta-bar');
    if (!metaBar) return;

    var cloudColor = latest.clouds <= 10 ? '#1BE035' : (latest.clouds <= 30 ? '#F5A623' : '#D44A1A');
    var covColor = latest.coverage >= 90 ? '#1BE035' : (latest.coverage >= 70 ? '#F5A623' : '#D44A1A');

    metaBar.innerHTML =
        '<div class="satellite-meta-item">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>' +
            '<span>' + escapeHtml(latest.dateFormatted) + '</span>' +
        '</div>' +
        '<div class="satellite-meta-item">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/></svg>' +
            '<span>' + escapeHtml(latest.satellite) + '</span>' +
        '</div>' +
        '<div class="satellite-meta-item">' +
            '<span class="satellite-meta-dot" style="background:' + cloudColor + ';"></span>' +
            '<span>Clouds: ' + latest.clouds.toFixed(1) + '%</span>' +
        '</div>' +
        '<div class="satellite-meta-item">' +
            '<span class="satellite-meta-dot" style="background:' + covColor + ';"></span>' +
            '<span>Coverage: ' + latest.coverage + '%</span>' +
        '</div>' +
        '<div class="satellite-meta-item">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
            '<span>Mandaon, Masbate</span>' +
        '</div>';
}

function loadSatelliteImages() {
    var types = ['truecolor', 'ndvi', 'falsecolor'];
    types.forEach(function(type) {
        var imgEl = document.getElementById('satellite-' + type);
        var overlayEl = document.getElementById('satellite-' + type + '-overlay');
        if (!imgEl) return;

        imgEl.onload = function() {
            if (overlayEl) overlayEl.classList.add('loaded');
        };
        imgEl.onerror = function() {
            if (overlayEl) {
                overlayEl.innerHTML = '<div style="text-align:center;color:#6a8aaa;font-size:12px;font-weight:600;padding:12px;">Image unavailable</div>';
            }
        };
        imgEl.src = '/api/satellite/image/' + type;
    });
}

function renderSatelliteAnalysis(latest) {
    var container = document.getElementById('satellite-analysis');
    if (!container) return;

    if (!latest.health || !latest.ndviStats) {
        container.innerHTML =
            '<div class="satellite-health-card health-no_data">' +
                '<div class="health-icon icon-no_data">' +
                    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
                '</div>' +
                '<div class="health-body">' +
                    '<div class="health-label label-no_data">NDVI Analysis Unavailable</div>' +
                    '<div class="health-desc">Satellite imagery is available but NDVI statistics could not be retrieved. Try refreshing.</div>' +
                '</div>' +
            '</div>';
        return;
    }

    var stats = latest.ndviStats;
    var health = latest.health;
    var statusLower = health.status.toLowerCase();

    var iconSvg = '';
    if (statusLower === 'healthy') {
        iconSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    } else if (statusLower === 'moderate') {
        iconSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    } else {
        iconSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    }

    container.innerHTML =
        '<div class="satellite-health-card health-' + statusLower + '">' +
            '<div class="health-icon icon-' + statusLower + '">' + iconSvg + '</div>' +
            '<div class="health-body">' +
                '<div class="health-label label-' + statusLower + '">' + escapeHtml(health.label) + '</div>' +
                '<div class="health-desc">' + escapeHtml(health.description) + '</div>' +
                '<div class="health-stats">' +
                    '<div class="health-stat"><div class="health-stat-value">' + stats.mean.toFixed(3) + '</div><div class="health-stat-label">Mean NDVI</div></div>' +
                    '<div class="health-stat"><div class="health-stat-value">' + stats.median.toFixed(3) + '</div><div class="health-stat-label">Median NDVI</div></div>' +
                    '<div class="health-stat"><div class="health-stat-value">' + stats.max.toFixed(3) + '</div><div class="health-stat-label">Max NDVI</div></div>' +
                    '<div class="health-stat"><div class="health-stat-value">' + stats.min.toFixed(3) + '</div><div class="health-stat-label">Min NDVI</div></div>' +
                    '<div class="health-stat"><div class="health-stat-value">' + stats.std.toFixed(3) + '</div><div class="health-stat-label">Std Dev</div></div>' +
                    '<div class="health-stat"><div class="health-stat-value">' + (stats.num || 0).toLocaleString() + '</div><div class="health-stat-label">Pixels</div></div>' +
                '</div>' +
            '</div>' +
        '</div>';
}

function renderSatelliteHistory(images) {
    var container = document.getElementById('satellite-history');
    if (!container || images.length <= 1) {
        if (container) container.style.display = 'none';
        return;
    }

    var html = '<div class="satellite-history-title">Recent Satellite Passes</div>';
    html += '<div class="satellite-history-list">';

    images.forEach(function(img, idx) {
        var ndviHtml = '';
        if (img.ndviStats) {
            var meanVal = img.ndviStats.mean;
            var ndviColor = meanVal >= 0.6 ? '#0D5E1A' : (meanVal >= 0.4 ? '#7A4D00' : (meanVal >= 0.2 ? '#8A4A00' : '#B91C1C'));
            ndviHtml = '<div class="satellite-history-ndvi" style="color:' + ndviColor + ';">NDVI: ' + meanVal.toFixed(2) + '</div>';
        }

        html += '<div class="satellite-history-item' + (idx === 0 ? ' active' : '') + '">' +
            '<img class="satellite-history-thumb" src="/api/satellite/image/ndvi" alt="NDVI ' + escapeAttr(img.dateFormatted) + '" loading="lazy">' +
            '<div class="satellite-history-info">' +
                '<div class="satellite-history-date">' + escapeHtml(img.dateFormatted) + '</div>' +
                '<div class="satellite-history-sat">' + escapeHtml(img.satellite) + ' \u00B7 ' + img.clouds.toFixed(0) + '% clouds</div>' +
                ndviHtml +
            '</div>' +
        '</div>';
    });

    html += '</div>';
    container.innerHTML = html;
}

var btnRefreshSatellite = document.getElementById('btn-refresh-satellite');
if (btnRefreshSatellite) {
    btnRefreshSatellite.addEventListener('click', function() {
        loadSatelliteImagery();
    });
}

if (document.getElementById('satellite-loading')) {
    loadSatelliteImagery();
}
