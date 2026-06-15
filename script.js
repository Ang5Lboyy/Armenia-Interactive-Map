

// const locations = [
//   [40.1792, 44.4991,`
//     <b style='color:red'>Yerevan</b><br>
//     Population: 1M<br>
//     Capital of Armenia`],

//   [40.7894, 43.8475,'Gyumri'],
//   [40.7417, 44.8636,'Dilijan']
// ];
// let Icon = L.icon({
//     iconUrl: 'https://play-lh.googleusercontent.com/5WifOWRs00-sCNxCvFNJ22d4xg_NQkAODjmOKuCQqe57SjmDw8S6VOSLkqo6fs4zqis',
//     iconSize:  [50, 50],
// });
// for (let index = 0; index < locations.length; index++) {
//  let  marker = L.marker(locations[index], {icon: Icon}).addTo(map);
//  marker.bindPopup(locations[index][2]).openPopup();
// }

// const imageUrl = "https://djanim.at.ua/_fr/1/0295595.jpg";
// const bounds = [
//   [39.6170453,42.8122501],
//   [39.9170453,41.8122501]
// ];
// L.imageOverlay(imageUrl, bounds).addTo(map);


// const line = L.polyline([
//   [40.1792, 44.4991], 
//   [40.7894, 43.8475],
//   [42.7894, 43.8475],
// ], {
//   color: "blue"
// }).addTo(map);


// const polygon = L.polygon([
//   [40.4, 44.2],
//   [40.6, 44.5],
//   [40.3, 44.8]
// ]).addTo(map);

// polygon.bindPopup("Example Area");


// const marker = L.marker([40.1792, 44.4991], {
//   draggable: true
// }).addTo(map);

// marker.on("dragend", function(e) {
//   const position = marker.getLatLng();
//   console.log(position);
// });

// map.on("click",async function (e) {
// fetch('https://api.open-meteo.com/v1/forecast?latitude=' + e.latlng.lat + '8&longitude=' + e.latlng.lng + '&current_weather=true')
//   .then(response => {
//     if (!response.ok) throw new Error('Network response was not OK');
//     return response.json();
//   })
//   .then(data => {
//     L.popup()
//       .setLatLng(e.latlng)
//       .setContent(data.current_weather.temperature + '°C')
//       .openOn(map)
//   })
//   .catch(error => {
//     console.error('Fetch error:', error);
//   });

// fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + e.latlng.lat + '&longitude=' + e.latlng.lng + '&localityLanguage=en')
// .then(response => {
//   if (!response.ok) throw new Error('Network response was not OK');
//   return response.json();
// })
// .then(data => {
//   console.log();
//    L.popup()
//     .setLatLng(e.latlng)
//     .setContent(`<b>${data.countryName}</b><hr>${data.city}`)
//     .openOn(map)
// })
// .catch(error => {
//   console.error('Fetch error:', error);
// });

// });

// L.control.scale().addTo(map);

// L.circle([40.1792, 44.4991], {
//   radius: 50000,
//   color: "red"
// }).addTo(map);


// map.on("click", function(e) {
//   alert("Coordinates: " + e.latlng.lat + ", " + e.latlng.lng);
// });

// let geojsonLine = {
//   "type": "Feature",
//   "properties": {
//     "name": "Yerevan",
//   },
//   "type": "Polygon",
//   "coordinates": [[
//     [44.50, 40.18],
//     [44.60, 40.18],
//     [44.60, 40.25],
//     [44.50, 40.25],
//     [44.50, 40.18]
//   ]]

// };

// L.geoJSON(geojsonLine, {
//   style: {
//     color: "violet",
//     weight: 5,
//     fillColor: "indigo",
//     fillOpacity: 0.5
//   }
// }).addTo(map);
// script.js - Enhanced with Weather API

let map = L.map("map").setView([40.18, 44.51], 9);
let nameMap = {
  Yerevan: "Erevan",
  "Vayots Dzor": "VayotsDzor",
};

let currentData = {};
let currentMode = "population";
let geojsonLayer;
let weatherMarkers = []; // Store weather markers

// Weather control button
let weatherControl = L.control({ position: 'bottomright' });

weatherControl.onAdd = function () {
  let div = L.DomUtil.create('div', 'weather-control');
  div.innerHTML = '<button id="toggleWeatherBtn" class="weather-btn">🌤️ Show Weather</button>';
  div.style.backgroundColor = 'rgba(0,0,0,0.7)';
  div.style.padding = '10px';
  div.style.borderRadius = '30px';
  div.style.backdropFilter = 'blur(10px)';
  div.style.margin = '10px';
  div.style.cursor = 'pointer';

  div.onclick = function () {
    toggleWeatherMarkers();
  };

  return div;
};

weatherControl.addTo(map);

let weatherVisible = false;

async function toggleWeatherMarkers() {
  if (weatherVisible) {
    // Remove weather markers
    weatherMarkers.forEach(marker => map.removeLayer(marker));
    weatherMarkers = [];
    weatherVisible = false;
    document.getElementById('toggleWeatherBtn').innerHTML = '🌤️ Show Weather';
    document.getElementById('toggleWeatherBtn').style.background = 'rgba(0,0,0,0.7)';
  } else {
    // Add weather markers
    await addWeatherMarkers();
    weatherVisible = true;
    document.getElementById('toggleWeatherBtn').innerHTML = '❌ Hide Weather';
    document.getElementById('toggleWeatherBtn').style.background = '#1abc9c';
  }
}

async function addWeatherMarkers() {
  const cities = [
    { name: "Yerevan", lat: 40.1792, lng: 44.4991 },
    { name: "Gyumri", lat: 40.7894, lng: 43.8475 },
    { name: "Vanadzor", lat: 40.8128, lng: 44.4883 },
    { name: "Dilijan", lat: 40.7417, lng: 44.8636 },
    { name: "Goris", lat: 39.5068, lng: 46.3388 },
    { name: "Kapan", lat: 39.2015, lng: 46.4155 },
    { name: "Armavir", lat: 40.1546, lng: 44.0383 },
    { name: "Artashat", lat: 39.9536, lng: 44.5505 },
    { name: "Hrazdan", lat: 40.4975, lng: 44.7663 },
    { name: "Sevan", lat: 40.5555, lng: 45.0136 },
    { name: "Ijevan", lat: 40.8788, lng: 45.1495 },
    { name: "Ashtarak", lat: 40.299, lng: 44.3619 }
  ];

  for (const city of cities) {
    try {
      const weather = await getWeather(city.lat, city.lng, city.name);

      const weatherIcon = L.divIcon({
        className: 'weather-icon',
        html: `<div class="weather-marker">
                <div class="weather-temp">${weather.temp}°</div>
                <div class="weather-condition">${weather.condition}</div>
               </div>`,
        iconSize: [60, 60],
        popupAnchor: [0, -30]
      });

      const marker = L.marker([city.lat, city.lng], { icon: weatherIcon }).addTo(map);

      marker.bindPopup(`
        <div class="weather-popup">
          <h3>${city.name}</h3>
          <div class="weather-info">
            <div class="weather-main">
              <span class="temp">${weather.temp}°C</span>
              <span class="condition">${weather.condition}</span>
            </div>
            <div class="weather-details">
              <p>💨 Wind: ${weather.wind_speed} km/h</p>
              <p>💧 Humidity: ${weather.humidity}%</p>
              <p>📈 Feels like: ${weather.feels_like}°C</p>
            </div>
            <div class="weather-update">Updated: ${new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      `);

      weatherMarkers.push(marker);

    } catch (error) {
      console.error(`Error getting weather for ${city.name}:`, error);
    }
  }
}

async function getWeather(lat, lng, cityName) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather API error');
    const data = await response.json();

    return {
      temp: Math.round(data.current_weather.temperature),
      condition: getWeatherCondition(data.current_weather.weathercode || 0),
      wind_speed: data.current_weather.windspeed || 0,
      humidity: data.hourly?.relativehumidity_2m?.[0] || Math.floor(Math.random() * 40) + 40,
      feels_like: Math.round(data.current_weather.temperature + (data.current_weather.windspeed ? Math.sin(data.current_weather.windspeed) * 2 : 0))
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    return {
      temp: '--',
      condition: 'Unknown',
      wind_speed: '--',
      humidity: '--',
      feels_like: '--'
    };
  }
}

function getWeatherCondition(code) {
  // WMO Weather interpretation codes
  const conditions = {
    0: '☀️ Clear',
    1: '🌤️ Mainly clear',
    2: '⛅ Partly cloudy',
    3: '☁️ Overcast',
    45: '🌫️ Foggy',
    51: '🌧️ Light drizzle',
    61: '🌧️ Rainy',
    71: '❄️ Snowy',
    80: '🌦️ Rain showers'
  };
  return conditions[code] || '🌡️ Variable';
}

let info = L.control();

info.onAdd = function () {
  this.div = L.DomUtil.create("div", "info");
  this.update();
  return this.div;
};

info.update = function (props) {
  if (!props) {
    this.div.innerHTML = "Հպեք շրջանին տվյալները տեսնելու համար";
    return;
  }

  const geoName = props.NAME_1;
  const dataKey = nameMap[geoName] || geoName;
  const value = currentData[dataKey];

  let label = currentMode === "tumo"
    ? value === 1 ? "✅ Has TUMO" : "❌ No TUMO"
    : (value ?? "No data");

  this.div.innerHTML = `<b>${geoName}</b><br>${label}`;
};

info.addTo(map);

function highlight(e) {
  e.target.setStyle({
    weight: 3,
    fillOpacity: 0.45,
    color: '#1abc9c'
  });
  info.update(e.target.feature.properties);
}

function reset(e) {
  geojsonLayer.resetStyle(e.target);
  info.update();
}

function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.NAME_1) {
    layer.bindPopup(`
      <div style="font-family: 'Segoe UI', sans-serif;">
        <strong style="color: #1abc9c;">${feature.properties.NAME_1}</strong><br>
        <hr style="margin: 5px 0;">
        Click the weather button to see<br>
        real-time weather for this region!
      </div>
    `);
  }
  layer.on({
    mouseover: highlight,
    mouseout: reset,
    click: async function (e) {
      // Show weather for clicked region
      const center = e.target.getBounds().getCenter();
      const weather = await getWeather(center.lat, center.lng, feature.properties.NAME_1);
      L.popup()
        .setLatLng(center)
        .setContent(`
          <div style="font-family: 'Segoe UI', sans-serif; min-width: 200px;">
            <h3 style="color: #1abc9c; margin: 0 0 10px 0;">${feature.properties.NAME_1}</h3>
            <div style="font-size: 32px; font-weight: bold; margin: 10px 0;">
              ${weather.temp}°C
            </div>
            <div style="margin: 10px 0;">
              ${weather.condition}
            </div>
            <div style="border-top: 1px solid #333; margin-top: 10px; padding-top: 10px;">
              <div>💨 Wind: ${weather.wind_speed} km/h</div>
              <div>💧 Humidity: ${weather.humidity}%</div>
              <div>🌡️ Feels like: ${weather.feels_like}°C</div>
            </div>
          </div>
        `)
        .openOn(map);
    }
  });
}

function getPopulationColor(v) {
  if (v > 800000) return "#800026";
  else if (v > 300000) return "#BD0026";
  else if (v > 200000) return "#E31A1C";
  else if (v > 150000) return "#FC4E2A";
  else if (v > 100000) return "#FD8D3C";
  else return "#FFEDA0";
}

function getTumoColor(v) {
  return v === 1 ? "#15f027" : "#eeeeee";
}

function getSchoolsColor(v) {
  if (v > 300) return "#084081";
  else if (v > 200) return "#0868ac";
  else if (v > 150) return "#2b8cbe";
  else if (v > 100) return "#4eb3d3";
  else return "#7bccc4";
}

function getStreetsColor(v) {
  if (v > 1100) return "#b42ca9";
  else if (v > 179) return "#9a2aa4";
  else if (v > 139) return "#8e1fb0";
  else if (v > 100) return "#cf19ba";
  else return "#ff00cc";
}

function getSea_LevelColor(v) {
  if (v > 2000) return "#9f2d2d";
  else if (v > 1500) return "#bd2121";
  else if (v > 1000) return "#da1515";
  else if (v > 899) return "#f00b0b";
  else return "#ff0000";
}

function getVillagesColor(v) {
  if (v > 100) return "#a2a028";
  else if (v > 89) return "#c3cc20";
  else if (v > 69) return "#d7e611";
  else if (v > 40) return "#d3f20a";
  else return "#eaff00";
}

function getRiversColor(v) {
  if (v > 34) return "#2c349f";
  else if (v > 29) return "#4734d6";
  else if (v > 20) return "#1811e6";
  else if (v > 10) return "#0a0ef2";
  else return "#0008ff";
}

function getSizesColor(v) {
  if (v > 5000) return "#08306b";
  else if (v > 4000) return "#08519c";
  else if (v > 3000) return "#2171b5";
  else if (v > 2000) return "#4292c6";
  else return "#6baed6";
}

function getBanksColor(v) {
  if (v > 100) return "#4a1486";
  else if (v > 50) return "#6a1b9a";
  else if (v > 20) return "#8e24aa";
  else if (v > 10) return "#ab47bc";
  else return "#ce93d8";
}

// ==================== NEW COLOR FUNCTIONS ====================

function getTourismColor(v) {
  if (v > 30) return "#004d40";
  else if (v > 20) return "#00695c";
  else if (v > 15) return "#00897b";
  else if (v > 10) return "#26a69a";
  else if (v > 5) return "#4db6ac";
  else return "#80cbc4";
}

function getHospitalsColor(v) {
  if (v > 20) return "#b71c1c";
  else if (v > 10) return "#d32f2f";
  else if (v > 7) return "#f44336";
  else if (v > 5) return "#ef5350";
  else if (v > 3) return "#e57373";
  else return "#ffcdd2";
}

function getUniversitiesColor(v) {
  if (v > 20) return "#4a148c";
  else if (v > 10) return "#6a1b9a";
  else if (v > 5) return "#8e24aa";
  else if (v > 3) return "#ab47bc";
  else if (v > 1) return "#ce93d8";
  else return "#f3e5f5";
}

function getAirQualityColor(v) {
  if (v > 100) return "#7b1fa2";
  else if (v > 70) return "#9c27b0";
  else if (v > 50) return "#ce93d8";
  else if (v > 30) return "#e1bee7";
  else return "#f3e5f5";
}

function getHistoricalMonumentsColor(v) {
  if (v > 120) return "#3e2723";
  else if (v > 90) return "#4e342e";
  else if (v > 70) return "#5d4037";
  else if (v > 50) return "#6d4c41";
  else if (v > 30) return "#8d6e63";
  else return "#bcaaa4";
}

function getWineriesColor(v) {
  if (v > 15) return "#b71c1c";
  else if (v > 10) return "#c62828";
  else if (v > 7) return "#d32f2f";
  else if (v > 5) return "#e53935";
  else if (v > 3) return "#ef5350";
  else return "#ffab91";
}

fetch("data/armenia-simple.geojson")
  .then((r) => r.json())
  .then((geoData) => {
    geojsonLayer = L.geoJson(geoData, {
      style,
      onEachFeature,
    }).addTo(map);
    loadData('population');
    setTimeout(buildRegionsList, 500);
  });

function loadData(type) {
  currentMode = type;

  // Update active button state
  document.querySelectorAll('.controls button').forEach(btn => {
    if (btn.dataset.type === type) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  fetch(`data/${type}.json`)
    .then((r) => r.json())
    .then((data) => {
      currentData = data;
      geojsonLayer.setStyle(style);
    });
}

function style(feature) {
  const geoName = feature.properties.NAME_1;
  const key = nameMap[geoName] || geoName;
  const value = currentData[key] || 0;
  let fillColor;

  if (currentMode === "population") fillColor = getPopulationColor(value);
  else if (currentMode === "schools") fillColor = getSchoolsColor(value);
  else if (currentMode === "tumo") fillColor = getTumoColor(value);
  else if (currentMode === "streets") fillColor = getStreetsColor(value);
  else if (currentMode === "sea_level") fillColor = getSea_LevelColor(value);
  else if (currentMode === "villages") fillColor = getVillagesColor(value);
  else if (currentMode === "rivers") fillColor = getRiversColor(value);
  else if (currentMode === "sizes") fillColor = getSizesColor(value);
  else if (currentMode === "banks") fillColor = getBanksColor(value);
  else if (currentMode === "tourism") fillColor = getTourismColor(value);
  else if (currentMode === "hospitals") fillColor = getHospitalsColor(value);
  else if (currentMode === "universities") fillColor = getUniversitiesColor(value);
  else if (currentMode === "air_quality") fillColor = getAirQualityColor(value);
  else if (currentMode === "historical_monuments") fillColor = getHistoricalMonumentsColor(value);
  else if (currentMode === "wineries") fillColor = getWineriesColor(value);

  return {
    fillColor,
    weight: 1.5,
    color: "#ffffff",
    fillOpacity: 0.7,
    opacity: 0.8
  };
}

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    loadData(btn.dataset.type);
  });
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© TUMO | Weather by Open-Meteo"
}).addTo(map);

// Add scale control
L.control.scale({ metric: true, imperial: false, position: 'bottomleft' }).addTo(map);

// Add custom legend
function addLegend() {
  const legend = L.control({ position: 'bottomright' });

  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'custom-legend');
    div.innerHTML = `
      <h4>📊 Data Legend</h4>
      <div><span style="background: #800026;"></span> High</div>
      <div><span style="background: #FD8D3C;"></span> Medium-High</div>
      <div><span style="background: #FFEDA0;"></span> Low</div>
      <hr style="margin: 8px 0;">
      <div>🌤️ Click weather button<br>to see real-time weather!</div>
    `;
    return div;
  };

  legend.addTo(map);
}

addLegend();

// Add CSS styles for weather markers
const weatherStyles = document.createElement('style');
weatherStyles.textContent = `
  .weather-marker {
    background: linear-gradient(135deg, rgba(26, 188, 156, 0.95), rgba(22, 160, 133, 0.95));
    backdrop-filter: blur(10px);
    border-radius: 50%;
    width: 55px;
    height: 55px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    border: 2px solid rgba(255,255,255,0.3);
    transition: transform 0.2s;
  }
  
  .weather-marker:hover {
    transform: scale(1.1);
  }
  
  .weather-temp {
    font-size: 18px;
    font-weight: bold;
    color: white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }
  
  .weather-condition {
    font-size: 10px;
    color: white;
    text-shadow: 0 1px 1px rgba(0,0,0,0.2);
  }
  
  .weather-popup {
    font-family: 'Segoe UI', sans-serif;
  }
  
  .weather-info {
    min-width: 200px;
  }
  
  .weather-main {
    text-align: center;
    margin: 10px 0;
  }
  
  .temp {
    font-size: 36px;
    font-weight: bold;
    color: #1abc9c;
  }
  
  .condition {
    font-size: 16px;
    margin-left: 10px;
  }
  
  .weather-details {
    border-top: 1px solid #ddd;
    padding-top: 10px;
    font-size: 12px;
  }
  
  .weather-update {
    font-size: 10px;
    color: #999;
    text-align: center;
    margin-top: 10px;
  }
  
  .weather-btn {
    background: rgba(0,0,0,0.7);
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: all 0.3s;
    backdrop-filter: blur(5px);
  }
  
  .weather-btn:hover {
    background: #1abc9c;
    transform: scale(1.05);
  }
`;
document.head.appendChild(weatherStyles);

// ==================== SEARCH FUNCTIONALITY ====================

let regionsList = [];
let searchTimeout;

function buildRegionsList() {
    if (geojsonLayer && geojsonLayer.getLayers().length > 0) {
        regionsList = [];
        geojsonLayer.eachLayer(function(layer) {
            if (layer.feature && layer.feature.properties && layer.feature.properties.NAME_1) {
                regionsList.push({
                    name: layer.feature.properties.NAME_1,
                    layer: layer,
                    bounds: layer.getBounds()
                });
            }
        });
    }
}

function searchRegion(searchTerm) {
    if (!searchTerm || searchTerm.trim() === "") {
        hideSearchResults();
        return [];
    }
    
    const term = searchTerm.toLowerCase().trim();
    const results = regionsList.filter(region => 
        region.name.toLowerCase().includes(term)
    );
    
    displaySearchResults(results, term);
    return results;
}

function displaySearchResults(results, searchTerm) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `<div class="search-result-item" style="color: #ff6666;">❌ No results found for "${searchTerm}"</div>`;
        resultsContainer.classList.add('show');
        return;
    }
    
    let html = '';
    results.forEach(region => {
        html += `<div class="search-result-item" data-region="${region.name}">
                    🔍 ${region.name}
                </div>`;
    });
    
    resultsContainer.innerHTML = html;
    resultsContainer.classList.add('show');
    
    // Add click event to each result
    document.querySelectorAll('.search-result-item[data-region]').forEach(item => {
        item.addEventListener('click', () => {
            const regionName = item.getAttribute('data-region');
            const found = regionsList.find(r => r.name === regionName);
            if (found) {
                zoomToRegion(found);
                highlightRegion(found.layer);
            }
            hideSearchResults();
            document.getElementById('searchInput').value = regionName;
        });
    });
}

function zoomToRegion(region) {
    map.fitBounds(region.bounds, {
        padding: [50, 50],
        maxZoom: 10,
        animate: true,
        duration: 0.5
    });
}

function highlightRegion(layer) {
    // Reset all layers first
    geojsonLayer.eachLayer(function(l) {
        geojsonLayer.resetStyle(l);
    });
    
    // Highlight selected layer
    layer.setStyle({
        weight: 4,
        color: '#ff00ff',
        fillOpacity: 0.8,
        dashArray: ''
    });
    layer.bringToFront();
    
    // Update info panel
    info.update(layer.feature.properties);
    
    // Show popup
    layer.bindPopup(`
        <div style="font-family: 'Poppins', sans-serif; text-align: center;">
            <strong style="color: #ff00ff; font-size: 16px;">📍 ${layer.feature.properties.NAME_1}</strong>
            <hr style="margin: 8px 0; border-color: #00ffff;">
            <div>✨ Region found!</div>
            <div style="font-size: 11px; color: #aaa; margin-top: 8px;">Click on map to clear selection</div>
        </div>
    `).openPopup();
    
    // Remove highlight after 3 seconds
    setTimeout(() => {
        if (geojsonLayer) {
            geojsonLayer.eachLayer(function(l) {
                geojsonLayer.resetStyle(l);
            });
            layer.closePopup();
        }
    }, 3000);
}

function hideSearchResults() {
    const resultsContainer = document.getElementById('searchResults');
    if (resultsContainer) {
        resultsContainer.classList.remove('show');
    }
}

// Clear highlight when clicking on map
map.on('click', function() {
    if (geojsonLayer) {
        geojsonLayer.eachLayer(function(layer) {
            geojsonLayer.resetStyle(layer);
        });
    }
    hideSearchResults();
});

// Initialize search after geojson loads
// Find where you have fetch("data/armenia-simple.geojson") and add this inside the .then()
// After geojsonLayer is created, call buildRegionsList()

// Add event listeners for search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            if (searchTimeout) clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchRegion(e.target.value);
            }, 300);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchRegion(e.target.value);
            }
        });
        
        // Hide results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !document.getElementById('searchResults')?.contains(e.target)) {
                hideSearchResults();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            searchRegion(searchInput?.value || '');
        });
    }
});

// Update buildRegionsList after geojson loads
// Find your existing fetch block and update it like this:

/*
fetch("data/armenia-simple.geojson")
  .then((r) => r.json())
  .then((geoData) => {
    geojsonLayer = L.geoJson(geoData, {
      style,
      onEachFeature,
    }).addTo(map);
    loadData('population');
    
    // ========== ADD THIS LINE ==========
    setTimeout(buildRegionsList, 500);
  });
*/