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
  "Rainfall:",
  "Rainfall",
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
    "Weather Analytics": "Pagsusuri ng Panahon",
    "Digital Repository": "Digital na Imbakan",
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
    "Temperature": "Temperatura",
    "Humidity": "Halumigmig",
    "Wind Speed": "Bilis ng Hangin",
    "Rainfall": "Ulan",
    "Active Crop Telemetry": "Aktibong Telemetry ng Pananim",
    "Real-time monitoring of crop growth and health metrics": "Real-time na pagsubaybay sa paglaki ng pananim at mga sukatan ng kalusugan",
    "Estimated Yield": "Tantyang Ani",
    "Vulnerability": "Kahinaan",
    "Soil Prep": "Paghahanda ng Lupa",
    "None (Soil Prep)": "Wala (Paghahanda ng Lupa)",
    "Masbate Precision Partner": "Kasosyo sa Katumpakan sa Masbate",
    "Active Alerts:": "Aktibong mga Babala:",
    "Weather Forecast": "Ulat ng Panahon",
    "Quick Plant": "Mabilisang Pagtatanim",
    "Register a new planting batch in seconds": "Magrehistro ng bagong batch ng pananim sa ilang segundo",
    "Plot": "Plot",
    "Crop": "Pananim",
    "Plant Now": "Itanim Ngayon",
    "Quick Actions": "Mabilisang Aksyon",
    "+ New Planting": "+ Bagong Pagtatanim",
    "+ Add Plot": "+ Magdagdag ng Plot",
    "Upcoming Schedule": "Darating na Iskedyul",
    "Rainfall Trend (mm)": "Trend ng Ulan (mm)",
    "Loading forecast...": "Naglo-load ng forecast...",
    "Loading rainfall data...": "Naglo-load ng data ng ulan...",
    "Select plot...": "Pumili ng plot...",
    "Select crop...": "Pumili ng pananim...",
    "Select an active plot to load agronomic models...": "Pumili ng aktibong plot para mag-load ng mga agronomic model...",
    "Agronomic Intelligence": "Katalinuhang Agronomiko",
    "FAO-56 & GDD Phenology Models": "FAO-56 at GDD Phenology Models",
    "Decision Insights": "Mga Insights sa Desisyon",
    "Rule-based recommendations from live data": "Mga rekomendasyon batay sa panuntunan mula sa live na data",
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
    "Smart Crop Encyclopedia, agricultural best practices, and trivia": "Matalinong Ensayklopidiya ng Pananim, mga pinakamahusay na kasanayan sa agrikultura, at trivia",
    "Daily Farming Advice": "Araw-araw na Payo sa Pagsasaka",
    "Watering & Crop Growth Guide": "Gabay sa Pagtubig at Paglaki ng Pananim",
    "Crop Health & Status": "Kalusugan at Katayuan ng Pananim",
    "Register Planting": "Magrehistro ng Pagtatanim",
    "Weather Station Connected": "Estasyon ng Panahon: Nakakonekta",
    "Today's Farm Outlook": "Kondisyon ng Bukid Ngayong Araw",
    "Optimal for Rice tillering": "Optimal para sa pagsuwi ng Palay",
    "Heat stress risk for crops": "Panganib sa stress sa init para sa mga pananim",
    "Extreme heat — irrigate immediately": "Sobrang init — magdilig agad",
    "Cold stress — protect seedlings": "Cold stress — protektahan ang mga punla",
    "Comfortable growing temperature": "Komportableng temperatura sa paglaki",
    "Within normal range": "Nasa normal na saklaw",
    "Moderate humidity": "Katamtamang halumigmig",
    "Calm conditions": "Kalmadong kondisyon",
    "No significant precipitation": "Walang makabuluhang ulan",
    "Very High — Fungal/blast risk critical": "Napakataas — Kritikal ang panganib ng fungal/blast",
    "High — Fungal risk elevated": "Mataas — Tumaas ang panganib ng fungal",
    "Ideal moisture for growth": "Mainam na kahalumigmigan para sa paglaki",
    "Low — Consider irrigation": "Mababa — Isaalang-alang ang pagdidilig",
    "Safe spray window active": "Ligtas na mag-spray ng gamot o pataba",
    "Moderate — Delay aerial spraying": "Katamtaman — Ipagpaliban ang pag-spray",
    "High winds — Secure structures": "Malakas na hangin — I-secure ang mga istraktura",
    "No precipitation detected": "Walang natukoy na ulan",
    "Light rain — Beneficial for crops": "Mahinang ulan — Kapaki-pakinabang sa pananim",
    "Moderate precipitation": "Katamtamang ulan",
    "Heavy rainfall — Flood risk": "Malakas na ulan — Panganib sa baha",
    "Extreme Weather Alert": "Babala ng Matinding Panahon",
    "Prepare emergency protocols. Secure structures and clear drainage channels.": "Ihanda ang mga emergency protocol. I-secure ang mga istraktura at linisin ang mga kanal.",
    "Heavy Rain Expected": "Inaasahan ang Malakas na Ulan",
    "Check drainage to prevent waterlogging. Avoid spraying fertilizer or pesticides.": "Suriin ang mga kanal para maiwasan ang pagbaha. Iwasan ang pag-spray ng pataba o pestisidyo.",
    "Crops will experience heat stress. Increase watering/irrigation cycles today.": "Makakaranas ng stress sa init ang mga pananim. Dagdagan ang pagdidilig ngayon.",
    "Strong Wind Warning": "Babala ng Malakas na Hangin",
    "Strong winds detected. Postpone foliar spraying of fertilizers or pesticides.": "Natukoy ang malakas na hangin. Ipagpaliban ang pag-spray ng mga pataba o pestisidyo.",
    "All Clear & Favorable": "Ligtas at Maganda ang Panahon",
    "Weather conditions are optimal today. Great day to irrigate, fertilize, or spray!": "Mainam ang kondisyon ng panahon ngayon. Magandang araw para magdilig, magpataba, o mag-spray!",
    "Extreme Temperature": "Matinding Temperatura",
    "Temperature Warning": "Babala sa Temperatura",
    "Critical Humidity": "Kritikal na Katubigan ng Hangin",
    "High Humidity Watch": "Bantay sa Mataas na Katubigan ng Hangin",
    "High Wind Alert": "Babala sa Malakas na Hangin",
    "Wind Advisory": "Advisory sa Hangin",
    "Heavy Rainfall": "Malakas na Ulan",
    "Rain Advisory": "Advisory sa Ulan",
    "All Clear": "Ligtas",
    "No weather alerts at this time. Conditions are favorable for farming.": "Walang mga babala sa panahon sa ngayon. Maganda ang kondisyon para sa pagsasaka.",
    "Analyzing weather conditions...": "Sinusuri ang kondisyon ng panahon...",
    "Generating insights from weather data...": "Bumubuo ng payo mula sa data ng panahon...",
    "Irrigate immediately and protect sensitive crops.": "Magdilig agad at protektahan ang mga sensitibong pananim.",
    "Monitor crop stress levels.": "Subaybayan ang antas ng stress ng pananim.",
    "Apply fungicide to vulnerable crops.": "Maglagay ng pamatay-peste sa mga apektadong pananim.",
    "Check rice plots for root and stem rot.": "Suriin ang mga plot ng palay para sa nabulok na ugat at tangkay.",
    "Drainage check required.": "Kinakailangan ang pagsusuri sa kanal at paagusan.",
    "ALERT": "BABALA",
    "WATCH": "BANTAY",
    "My Plots": "Aking mga Plot",
    "Select Language": "Pumili ng Wika"
  },
  minasbate: {
    // Sidebar / Common
    "Main Menu": "Pang-una na Menu",
    "Dashboard": "Dashboard",
    "Crop Management": "Pangasi sang Tanom",
    "Weather Analytics": "Analisis sang Panahon",
    "Digital Repository": "Digital na Burutangan",
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
    "Temperature": "Temperatura",
    "Humidity": "Halumigmig",
    "Wind Speed": "Kabilisan sang Hangin",
    "Rainfall": "Uran",
    "Active Crop Telemetry": "Aktibo na Telemetry sang Tanom",
    "Real-time monitoring of crop growth and health metrics": "Real-time na pagsubaybay sa pagtubo sang tanom kag sukatan sang kalusugan",
    "Estimated Yield": "Tantya na Ani",
    "Vulnerability": "Kahinaan",
    "Soil Prep": "Paghahanda sang Duta",
    "None (Soil Prep)": "Wara (Paghahanda sang Duta)",
    "Masbate Precision Partner": "Katimbang sa Precision sa Masbate",
    "Active Alerts:": "Aktibo na mga Alerto:",
    "Weather Forecast": "Uran kag Panahon",
    "Quick Plant": "Dalian na Pagtanom",
    "Register a new planting batch in seconds": "Magrehistro sang bag-o na tanom sa pira ka segundo",
    "Plot": "Plot",
    "Crop": "Tanom",
    "Plant Now": "Itanom Subong",
    "Quick Actions": "Dalian na Aksyon",
    "+ New Planting": "+ Bag-o na Pagtanom",
    "+ Add Plot": "+ Magdugang sang Plot",
    "Upcoming Schedule": "Kadi na mga Iskedyul",
    "Rainfall Trend (mm)": "Dagan sang Uran (mm)",
    "Loading forecast...": "Ginaload an forecast...",
    "Loading rainfall data...": "Ginaload an data sang uran...",
    "Select plot...": "Pili-a an plot...",
    "Select crop...": "Pili-a an tanom...",
    "Select an active plot to load agronomic models...": "Pili-a an aktibo na plot para mag-load sang mga model sang uma...",
    "Agronomic Intelligence": "Katalinuhan sa Pag-uma",
    "FAO-56 & GDD Phenology Models": "FAO-56 kag GDD Phenology Models",
    "Decision Insights": "Giya sa Padesisyon",
    "Rule-based recommendations from live data": "Mga rekomendasyon base sa data sang panahon",
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
    "Smart Crop Encyclopedia, agricultural best practices, and trivia": "Matalino na Ensayklopidiya sang Tanom, mga pinakamaayo na kasanayan sa pag-uma, kag trivia",
    "Daily Farming Advice": "Adlaw-adlaw na Giya sa Pag-uma",
    "Watering & Crop Growth Guide": "Giya sa Pagtubo kag Pagbisibis sang Tanom",
    "Crop Health & Status": "Kalusugan kag Estado sang Tanom",
    "Register Planting": "Magrehistro sang Pagtanom",
    "Weather Station Connected": "Estasyon sang Panahon: Nakasumpay",
    "Today's Farm Outlook": "Subong na Estado sang Talamnan",
    "Optimal for Rice tillering": "Optimal para sa pagsuwi sang Paray",
    "Heat stress risk for crops": "Panganib sa stress sa init para sa mga tanom",
    "Extreme heat — irrigate immediately": "Sobrang init — magbisibis tulos",
    "Cold stress — protect seedlings": "Cold stress — protektahan an mga similya",
    "Comfortable growing temperature": "Komportable na temperatura sa pagtubo",
    "Within normal range": "Nasa normal na saklaw",
    "Moderate humidity": "Katamtaman na halumigmig",
    "Calm conditions": "Kalmado na kondisyon",
    "No significant precipitation": "Wara masyado na uran",
    "Very High — Fungal/blast risk critical": "Napakataas — Kritikal an panganib sang fungal/blast",
    "High — Fungal risk elevated": "Mataas — Tumaas an panganib sang fungal",
    "Ideal moisture for growth": "Mainam na basa sang duta sa pagtubo",
    "Low — Consider irrigation": "Mababa — Magbisibis sang talamnan",
    "Safe spray window active": "Ligtas na mag-spray sang pataba o hilo",
    "Moderate — Delay aerial spraying": "Katamtaman — Ipadugay an pag-spray",
    "High winds — Secure structures": "Makusog na hangin — I-secure an mga payag",
    "No precipitation detected": "Wara natukoy na uran",
    "Light rain — Beneficial for crops": "Mahina na uran — Maayo para sa mga tanom",
    "Moderate precipitation": "Katamtaman na uran",
    "Heavy rainfall — Flood risk": "Makusog na uran — Panganib sa baha",
    "Extreme Weather Alert": "Alerto sa Makusog na Panahon",
    "Prepare emergency protocols. Secure structures and clear drainage channels.": "Ihanda an mga emergency protocol. I-secure an mga istraktura kag linisan an mga kanal.",
    "Heavy Rain Expected": "Inaasahan an Makusog na Uran",
    "Check drainage to prevent waterlogging. Avoid spraying fertilizer or pesticides.": "Lantawon an mga kanal para malikayan an baha. Likayi an pagbisibag sang pataba o hilo.",
    "Crops will experience heat stress. Increase watering/irrigation cycles today.": "Mabatyagan sang tanom an stress sa init. Dugangan an pagbisibis subong na adlaw.",
    "Strong Wind Warning": "Babala sa Makusog na Hangin",
    "Strong winds detected. Postpone foliar spraying of fertilizers or pesticides.": "May makusog na hangin. Ipadugay an pag-spray sang pataba o hilo sa tanom.",
    "All Clear & Favorable": "Mapag-on kag Maayo na Panahon",
    "Weather conditions are optimal today. Great day to irrigate, fertilize, or spray!": "Maayo na gayo an panahon subong. Manami magbisibis, magpataba, o mag-spray!",
    "Extreme Temperature": "Sobra na Temperatura",
    "Temperature Warning": "Pahimatngon sa Temperatura",
    "Critical Humidity": "Kritikal na Katubigan sang Hangin",
    "High Humidity Watch": "Bantay sa Mataas na Katubigan sang Hangin",
    "High Wind Alert": "Babala sa Makusog na Hangin",
    "Wind Advisory": "Abiso sa Hangin",
    "Heavy Rainfall": "Makusog na Uran",
    "Rain Advisory": "Abiso sa Uran",
    "All Clear": "Ligtas",
    "No weather alerts at this time. Conditions are favorable for farming.": "Wara sa subong sang abiso sa panahon. Maayo an kondisyon para sa pag-uma.",
    "Analyzing weather conditions...": "Ginalantaw an kondisyon sang panahon...",
    "Generating insights from weather data...": "Ginahimo an mga giya hali sa data sang panahon...",
    "Irrigate immediately and protect sensitive crops.": "Magbisibis tulos kag protektahan an mga tanom.",
    "Monitor crop stress levels.": "Lantawon an antas sang stress sang tanom.",
    "Apply fungicide to vulnerable crops.": "Magbutang sang hilo sa mga apektado na tanom.",
    "Check rice plots for root and stem rot.": "Lantawon an mga parayan kung may nabulok na ugat.",
    "Drainage check required.": "Kinahanglan suriin an mga kanal.",
    "ALERT": "BABALA",
    "WATCH": "BANTAY",
    "My Plots": "Akon mga Plot",
    "Select Language": "Pili-a an Wika"
  },
};

function t(str) {
    if (!str) return '';
    var trimmed = str.trim();
    if (currentLanguage === 'english') return trimmed;
    var map = translations[currentLanguage] || {};
    return map[trimmed] || trimmed;
}

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
                    renderFarmOutlook(liveWeather, liveForecast);
                    // Re-run predictor and re-render plot health with live data
                    updatePredictor();
                    renderAllViews();
                    loadTyphoonAdvisor();
                }

            } catch (err) {
                console.error('Failed to load weather data:', err);
                renderWeatherError();
            }
        }

        // 
        // WEATHER RENDERING FUNCTIONS
        // 

        function renderFarmOutlook(weatherData, forecastData) {
            var banner = document.getElementById('farm-outlook-banner');
            var iconEl = document.getElementById('farm-outlook-icon');
            var titleEl = document.getElementById('farm-outlook-title');
            var descEl = document.getElementById('farm-outlook-desc');
            if (!banner || !iconEl || !titleEl || !descEl) return;

            var icon = '✅';
            var title = 'All Clear & Favorable';
            var desc = 'Weather conditions are optimal today. Great day to irrigate, fertilize, or spray!';

            // Check conditions
            var hasRainWarning = (weatherData.rainfall >= 10) || (forecastData && forecastData.days && forecastData.days.some(function(d) { return d.rainfall >= 15; }));
            var isExtremelyHot = weatherData.temperature >= 34;
            var isExtremelyWindy = weatherData.wind_speed >= 20;

            if (hasRainWarning) {
                icon = '🌧️';
                title = 'Heavy Rain Expected';
                desc = 'Check drainage to prevent waterlogging. Avoid spraying fertilizer or pesticides.';
            } else if (isExtremelyHot) {
                icon = '🔥';
                title = 'High Temperature Alert';
                desc = 'Crops will experience heat stress. Increase watering/irrigation cycles today.';
            } else if (isExtremelyWindy) {
                icon = '💨';
                title = 'Strong Wind Warning';
                desc = 'Strong winds detected. Postpone foliar spraying of fertilizers or pesticides.';
            }

            iconEl.textContent = icon;
            titleEl.textContent = t(title);
            descEl.textContent = t(desc);
            banner.style.display = 'flex';
        }

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
            if (tempVal) tempVal.innerHTML = data.temperature + '<span class="metric-unit">&#8451;</span>';
            if (tempDelta) {
                var ti = data.insights.temperature;
                tempDelta.className = 'metric-delta' + (ti.status === 'danger' ? ' down' : '');
                var arrow = ti.status === 'danger'
                    ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>'
                    : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';
                tempDelta.innerHTML = arrow + ' ' + t(ti.message);
            }

            // Humidity
            var humVal = document.getElementById('metric-humidity-value');
            var humDelta = document.getElementById('metric-humidity-delta');
            if (humVal) humVal.innerHTML = data.humidity + '<span class="metric-unit">%</span>';
            if (humDelta) {
                var hi = data.insights.humidity;
                humDelta.className = 'metric-delta' + (hi.status === 'danger' ? ' down' : '');
                var arrow2 = hi.status === 'danger'
                    ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>'
                    : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';
                humDelta.innerHTML = arrow2 + ' ' + t(hi.message);
            }

            // Wind Speed
            var windVal = document.getElementById('metric-wind-value');
            var windDelta = document.getElementById('metric-wind-delta');
            if (windVal) windVal.innerHTML = data.wind_speed + '<span class="metric-unit">km/h</span>';
            if (windDelta) {
                var wi = data.insights.wind;
                windDelta.className = 'metric-delta' + (wi.status === 'danger' ? ' down' : '');
                var arrow3 = wi.status === 'danger'
                    ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>'
                    : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';
                windDelta.innerHTML = arrow3 + ' ' + t(wi.message);
            }

            // Rainfall
            var rainVal = document.getElementById('metric-rain-value');
            var rainDelta = document.getElementById('metric-rain-delta');
            if (rainVal) rainVal.innerHTML = data.rainfall + '<span class="metric-unit">mm</span>';
            if (rainDelta) {
                var ri = data.insights.rainfall;
                rainDelta.className = 'metric-delta' + (ri.status === 'danger' ? ' down' : '');
                var arrow4 = ri.status === 'danger'
                    ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>'
                    : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';
                rainDelta.innerHTML = arrow4 + ' ' + t(ri.message);
            }

            // Update topbar alert count
            var alertCount = 0;
            if (data.insights.temperature.status === 'danger' || data.insights.temperature.status === 'warning') alertCount++;
            if (data.insights.humidity.status === 'danger' || data.insights.humidity.status === 'warning') alertCount++;
            if (data.insights.wind.status === 'danger' || data.insights.wind.status === 'warning') alertCount++;
            if (data.insights.rainfall.status === 'danger' || data.insights.rainfall.status === 'warning') alertCount++;
            var alertCountEl = document.getElementById('topbar-alert-count');
            if (alertCountEl) alertCountEl.textContent = alertCount + ' ' + (alertCount === 1 ? t('ALERT') : t('Alerts'));
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
                alerts.push({ type: 'danger', title: t('Extreme Temperature') + ': ' + data.temperature + '\u00B0C', desc: t(ins.temperature.message) + '. ' + t('Irrigate immediately and protect sensitive crops.'), badge: t('ALERT') });
            } else if (ins.temperature.status === 'warning') {
                alerts.push({ type: 'warn', title: t('Temperature Warning') + ': ' + data.temperature + '\u00B0C', desc: t(ins.temperature.message) + '. ' + t('Monitor crop stress levels.'), badge: t('WATCH') });
            }
            if (ins.humidity.status === 'danger') {
                alerts.push({ type: 'danger', title: t('Critical Humidity') + ': ' + data.humidity + '%', desc: t(ins.humidity.message) + '. ' + t('Apply fungicide to vulnerable crops.'), badge: t('ALERT') });
            } else if (ins.humidity.status === 'warning') {
                alerts.push({ type: 'warn', title: t('High Humidity Watch') + ': ' + data.humidity + '%', desc: t(ins.humidity.message) + '. ' + t('Check rice plots for root and stem rot.'), badge: t('WATCH') });
            }
            if (ins.wind.status === 'danger') {
                alerts.push({ type: 'danger', title: t('High Wind Alert') + ': ' + data.wind_speed + ' km/h', desc: t(ins.wind.message), badge: t('ALERT') });
            } else if (ins.wind.status === 'warning') {
                alerts.push({ type: 'warn', title: t('Wind Advisory') + ': ' + data.wind_speed + ' km/h', desc: t(ins.wind.message), badge: t('WATCH') });
            }
            if (ins.rainfall.status === 'danger') {
                alerts.push({ type: 'danger', title: t('Heavy Rainfall') + ': ' + data.rainfall + 'mm', desc: t(ins.rainfall.message) + '. ' + t('Drainage check required.'), badge: t('ALERT') });
            } else if (ins.rainfall.status === 'warning') {
                alerts.push({ type: 'warn', title: t('Rain Advisory') + ': ' + data.rainfall + 'mm', desc: t(ins.rainfall.message), badge: t('WATCH') });
            }

            if (alerts.length === 0) {
                container.innerHTML = '<div style="padding:16px; background:#F0FDF4; border-radius:8px; border:1px solid #DCFCE7; text-align:center;">' +
                    '<div style="font-size:14px; font-weight:600; color:#166534;">' + t('All Clear') + '</div>' +
                    '<div style="font-size:13px; color:#475569; margin-top:4px;">' + t('No weather alerts at this time. Conditions are favorable for farming.') + '</div>' +
                '</div>';
                return;
            }

            var html = '';
            alerts.forEach(function(a) {
                var iconSvg = a.type === 'danger'
                    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>'
                    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>';
                html += '<div class="alert-item alert-' + (a.type === 'danger' ? 'danger' : 'warn') + '">' +
                    '<div class="alert-icon-wrap aw-' + (a.type === 'danger' ? 'danger' : 'warn') + '">' + iconSvg + '</div>' +
                    '<div class="alert-body"><div class="alert-title">' + a.title + '</div><div class="alert-desc">' + a.desc + '</div></div>' +
                    '<div class="alert-badge ab-' + (a.type === 'danger' ? 'danger' : 'warn') + '">' + a.badge + '</div></div>';
            });
            container.innerHTML = html;
        }

        function renderDecisionInsights(data) {
            var container = document.getElementById('decision-insights-list');
            if (!container) return;

            var ins = data.insights;
            var html = '';

            // Temperature insight
            var tempBg = ins.temperature.status === 'good' ? '#F0FDF4' : (ins.temperature.status === 'warning' ? '#FFFBEB' : '#FEF2F2');
            var tempColor = ins.temperature.status === 'good' ? '#166534' : (ins.temperature.status === 'warning' ? '#D97706' : '#991B1B');
            var tempBorder = ins.temperature.status === 'good' ? '#DCFCE7' : (ins.temperature.status === 'warning' ? '#FDE68A' : '#FEE2E2');
            var tempIcon = ins.temperature.status === 'good'
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
                : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
            html += '<div style="padding:12px;background:' + tempBg + ';border:1px solid ' + tempBorder + ';border-radius:8px;">' +
                '<div style="font-size:13px;font-weight:600;color:' + tempColor + ';margin-bottom:4px;display:flex;align-items:center;gap:6px;">' + tempIcon + ' ' + t('Temperature') + ': ' + data.temperature + '\u00B0C (' + t('Feels like') + ' ' + data.feels_like + '\u00B0C)</div>' +
                '<div style="font-size:13px;color:' + tempColor + ';line-height:1.5;">' + t(ins.temperature.message) + '. ' + t('Current conditions') + ': ' + t(data.weather_description) + '.</div></div>';

            // Humidity insight
            var humBg = ins.humidity.status === 'good' ? '#F0FDF4' : (ins.humidity.status === 'warning' ? '#FFFBEB' : '#FEF2F2');
            var humColor = ins.humidity.status === 'good' ? '#166534' : (ins.humidity.status === 'warning' ? '#D97706' : '#991B1B');
            var humBorder = ins.humidity.status === 'good' ? '#DCFCE7' : (ins.humidity.status === 'warning' ? '#FDE68A' : '#FEE2E2');
            var humIcon = ins.humidity.status === 'good'
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
                : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
            html += '<div style="padding:12px;background:' + humBg + ';border:1px solid ' + humBorder + ';border-radius:8px;">' +
                '<div style="font-size:13px;font-weight:600;color:' + humColor + ';margin-bottom:4px;display:flex;align-items:center;gap:6px;">' + humIcon + ' ' + t('Humidity') + ': ' + data.humidity + '%</div>' +
                '<div style="font-size:13px;color:' + humColor + ';line-height:1.5;">' + t(ins.humidity.message) + '. ' + t('Visibility') + ': ' + data.visibility + ' km.</div></div>';

            container.innerHTML = html;
        }

        function renderCurrentConditions(data) {
            var container = document.getElementById('current-conditions-summary');
            if (!container) return;

            var items = [
                { label: t('Temperature'), value: data.temperature + '\u00B0C', sub: t('Feels like') + ' ' + data.feels_like + '\u00B0C' },
                { label: t('Humidity'), value: data.humidity + '%', sub: t(data.insights.humidity.message) },
                { label: t('Wind'), value: data.wind_speed + ' km/h', sub: t(data.insights.wind.message) },
                { label: t('Rainfall'), value: data.rainfall + ' mm', sub: t(data.insights.rainfall.message) },
                { label: t('Pressure'), value: data.pressure + ' hPa', sub: t('Atmospheric pressure') },
                { label: t('Clouds'), value: data.clouds + '%', sub: t(data.weather_description) }
            ];

            var html = '';
            items.forEach(function(item) {
                html += '<div style="padding:12px; background:#F8FAFC; border: 1px solid #E2E8F0; border-radius:8px;">' +
                    '<div style="font-size:11px; text-transform:uppercase; color:#64748B; font-weight:600; letter-spacing:0.5px;">' + item.label + '</div>' +
                    '<div style="font-size:18px; font-weight:700; color:#0F172A; margin:2px 0;">' + item.value + '</div>' +
                    '<div style="font-size:12px; color:#475569;">' + item.sub + '</div></div>';
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
                    var selectLangTopbar = document.getElementById('topbar-language-select');
                    if (selectLangTopbar) {
                        selectLangTopbar.value = currentLanguage;
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

async function changeLanguage(selectedLang) {
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
        
        showToast(selectedLang === 'filipino' ? 'Wika ay na-update!' : (selectedLang === 'minasbate' ? 'Wika na-update!' : 'Language preference updated!'), 'success');
        currentLanguage = selectedLang;
        
        var selectLang = document.getElementById('language-select');
        if (selectLang) selectLang.value = selectedLang;
        
        var selectLangTopbar = document.getElementById('topbar-language-select');
        if (selectLangTopbar) selectLangTopbar.value = selectedLang;
        
        applyTranslations(selectedLang);
    } catch (err) {
        console.error(err);
        showToast('Failed to update language settings.', 'error');
        
        var selectLang = document.getElementById('language-select');
        if (selectLang) selectLang.value = currentLanguage;
        
        var selectLangTopbar = document.getElementById('topbar-language-select');
        if (selectLangTopbar) selectLangTopbar.value = currentLanguage;
    }
}

// Language Preference change listener
var langSelect = document.getElementById('language-select');
if (langSelect) {
    langSelect.addEventListener('change', function() {
        changeLanguage(langSelect.value);
    });
}

var langSelectTopbar = document.getElementById('topbar-language-select');
if (langSelectTopbar) {
    langSelectTopbar.addEventListener('change', function() {
        changeLanguage(langSelectTopbar.value);
    });
}
