// ══════════════════════════════════════════════════════════════
// USER LOCATION MAP
// Shows active visitors on interactive map
// ══════════════════════════════════════════════════════════════

let userMap = null;
let mapMarkers = [];

function initUserMap() {
  const container = document.getElementById('user-map-container');
  if (!container) {
    console.warn('Map container not found');
    return;
  }

  container.innerHTML = `
    <div class="ana-card" style="margin-bottom:10px;">
      <div style="font-size:11px;font-weight:800;color:rgba(255,255,255,0.5);letter-spacing:.1em;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;">
        <span>🗺️ خريطة الزوار النشطين</span>
        <button onclick="refreshUserMap()" style="background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.25);color:#00d4ff;font-size:10px;font-weight:700;padding:4px 10px;border-radius:6px;cursor:pointer;font-family:'Tajawal',sans-serif;">
          🔄 تحديث
        </button>
      </div>
      
      <div id="map-canvas" style="width:100%;height:350px;background:rgba(255,255,255,0.03);border-radius:12px;position:relative;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">
        <div id="map-loading" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.3);font-size:12px;">
          ⏳ جاري تحميل الخريطة...
        </div>
        <div id="leaflet-map" style="width:100%;height:100%;z-index:1;"></div>
      </div>

      <div id="map-stats" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px;">
        <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:8px;text-align:center;">
          <div style="font-size:18px;font-weight:900;color:#00d4ff;" id="map-total">0</div>
          <div style="font-size:9px;color:rgba(255,255,255,0.35);margin-top:2px;">إجمالي الزوار</div>
        </div>
        <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:8px;text-align:center;">
          <div style="font-size:18px;font-weight:900;color:#00ff88;" id="map-countries">0</div>
          <div style="font-size:9px;color:rgba(255,255,255,0.35);margin-top:2px;">دول مختلفة</div>
        </div>
        <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:8px;text-align:center;">
          <div style="font-size:18px;font-weight:900;color:#b44fff;" id="map-online">0</div>
          <div style="font-size:9px;color:rgba(255,255,255,0.35);margin-top:2px;">نشط الآن</div>
        </div>
      </div>

      <div id="top-countries" style="margin-top:12px;"></div>
    </div>
  `;

  loadLeafletMap();
}

async function loadLeafletMap() {
  // Load Leaflet CSS
  if (!document.getElementById('leaflet-css')) {
    const css = document.createElement('link');
    css.id = 'leaflet-css';
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);
  }

  // Load Leaflet JS
  if (typeof L === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = initLeafletMap;
    document.body.appendChild(script);
  } else {
    initLeafletMap();
  }
}

function initLeafletMap() {
  const mapEl = document.getElementById('leaflet-map');
  if (!mapEl) return;

  // Init map centered on Algeria
  userMap = L.map('leaflet-map', {
    zoomControl: true,
    attributionControl: false
  }).setView([28.0339, 1.6596], 5);

  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
  }).addTo(userMap);

  // Hide loading
  const loading = document.getElementById('map-loading');
  if (loading) loading.style.display = 'none';

  // Load visitor data
  refreshUserMap();
}

async function refreshUserMap() {
  if (!userMap) {
    setTimeout(refreshUserMap, 1000);
    return;
  }

  try {
    // Get all visitors from last 24h
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const query = `created_at=gte.${oneDayAgo.toISOString()}&order=created_at.desc&limit=500`;
    const data = await sbSelect('page_visits', query);

    // Clear old markers
    mapMarkers.forEach(m => userMap.removeLayer(m));
    mapMarkers = [];

    // Process locations
    const locationCounts = {};
    const countrySet = new Set();
    let onlineCount = 0;
    const fiveMinAgo = Date.now() - 5 * 60 * 1000;

    data.forEach(visit => {
      if (!visit.country) return;
      
      countrySet.add(visit.country);
      
      const key = visit.country + '|' + (visit.city || 'Unknown');
      locationCounts[key] = (locationCounts[key] || 0) + 1;

      if (new Date(visit.created_at).getTime() > fiveMinAgo) {
        onlineCount++;
      }
    });

    // Update stats
    document.getElementById('map-total').textContent = data.length;
    document.getElementById('map-countries').textContent = countrySet.size;
    document.getElementById('map-online').textContent = onlineCount;

    // Add markers (use geo API to get coordinates)
    const locations = Object.keys(locationCounts).slice(0, 50); // Limit to 50 markers
    
    for (const loc of locations) {
      const [country, city] = loc.split('|');
      const count = locationCounts[loc];
      
      // Get coordinates
      const coords = await getCoordinates(city, country);
      if (!coords) continue;

      const isOnline = data.some(v => 
        v.country === country && 
        (v.city || 'Unknown') === city && 
        new Date(v.created_at).getTime() > fiveMinAgo
      );

      const marker = L.circleMarker([coords.lat, coords.lon], {
        radius: Math.min(5 + count * 2, 15),
        fillColor: isOnline ? '#00ff88' : '#00d4ff',
        color: '#fff',
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.6
      }).addTo(userMap);

      marker.bindPopup(`
        <div style="font-family:'Tajawal',sans-serif;text-align:right;padding:4px;">
          <div style="font-weight:700;font-size:13px;margin-bottom:4px;">${city}</div>
          <div style="font-size:11px;color:rgba(0,0,0,0.6);">${country}</div>
          <div style="font-size:11px;margin-top:6px;">👥 ${count} زائر</div>
          ${isOnline ? '<div style="font-size:10px;color:#00ff88;margin-top:3px;">🟢 نشط الآن</div>' : ''}
        </div>
      `);

      mapMarkers.push(marker);
    }

    // Show top countries
    showTopCountries(countrySet, locationCounts);

  } catch(e) {
    console.error('Map refresh error:', e);
  }
}

function showTopCountries(countrySet, locationCounts) {
  const countryCounts = {};
  
  Object.keys(locationCounts).forEach(key => {
    const country = key.split('|')[0];
    countryCounts[country] = (countryCounts[country] || 0) + locationCounts[key];
  });

  const sorted = Object.entries(countryCounts)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 5);

  const container = document.getElementById('top-countries');
  if (!container) return;

  const flags = {
    'Algeria':'🇩🇿', 'Morocco':'🇲🇦', 'Tunisia':'🇹🇳', 'France':'🇫🇷',
    'الجزائر':'🇩🇿', 'المغرب':'🇲🇦', 'تونس':'🇹🇳', 'فرنسا':'🇫🇷',
    'Saudi Arabia':'🇸🇦', 'UAE':'🇦🇪', 'Egypt':'🇪🇬'
  };

  container.innerHTML = '<div style="font-size:10px;color:rgba(255,255,255,0.4);margin-bottom:8px;">أكثر 5 دول زيارة:</div>' +
    sorted.map(([country, count]) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:rgba(255,255,255,0.02);border-radius:6px;margin-bottom:4px;">
        <span style="font-size:11px;">${flags[country] || '🌍'} ${country}</span>
        <span style="font-size:11px;color:#00d4ff;font-weight:700;">${count}</span>
      </div>
    `).join('');
}

// Simple geo lookup cache
const geoCache = {};

async function getCoordinates(city, country) {
  const key = city + ',' + country;
  
  if (geoCache[key]) return geoCache[key];

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&format=json&limit=1`);
    const data = await res.json();
    
    if (data && data.length > 0) {
      const coords = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      geoCache[key] = coords;
      return coords;
    }
  } catch(e) {
    console.warn('Geo lookup failed:', city, country);
  }

  return null;
}

// Export functions
if (typeof window !== 'undefined') {
  window.initUserMap = initUserMap;
  window.refreshUserMap = refreshUserMap;
}
