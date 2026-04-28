// ══════════════════════════════════════════════════════════════
// PIXELS UI (CRM Settings Only)
// UI for configuring pixels - actual tracking handled by pixels-config.js
// ══════════════════════════════════════════════════════════════

let pixelConfig = {
  tiktok: { id: '', enabled: false },
  facebook: { id: '', enabled: false }
};

// Note: pixels-config.js handles the actual pixel loading and tracking
// This file only provides the UI for configuration

function initPixelsUI() {
  const container = document.getElementById('pixels-container');
  if (!container) return;

  container.innerHTML = `
    <div style="background:linear-gradient(135deg,rgba(254,44,85,0.06),rgba(255,107,53,0.04));border:1px solid rgba(254,44,85,0.2);border-radius:18px;padding:18px;margin-bottom:14px;">
      
      <div style="font-size:13px;font-weight:800;color:rgba(255,255,255,0.9);margin-bottom:14px;display:flex;align-items:center;gap:8px;">
        📊 Tracking Pixels
      </div>

      <!-- TikTok Pixel -->
      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:14px;margin-bottom:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.8);">🎵 TikTok Pixel</div>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
            <input type="checkbox" id="tiktok-pixel-enabled" onchange="savePixelConfig()">
            <span style="font-size:11px;color:rgba(255,255,255,0.5);">تفعيل</span>
          </label>
        </div>
        
        <div style="margin-bottom:10px;">
          <label style="font-size:10px;color:rgba(255,255,255,0.4);display:block;margin-bottom:4px;">Pixel ID</label>
          <input type="text" id="tiktok-pixel-id" placeholder="CXXXXXXXXXX" onchange="savePixelConfig()" style="width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#fff;font-family:monospace;font-size:12px;padding:8px 10px;border-radius:8px;outline:none;">
        </div>

        <button onclick="testTikTokPixel()" style="width:100%;background:rgba(254,44,85,0.12);border:1px solid rgba(254,44,85,0.25);color:#fe2c55;font-family:'Tajawal',sans-serif;font-size:11px;font-weight:700;padding:7px;border-radius:8px;cursor:pointer;">
          🔬 اختبار TikTok Pixel
        </button>
      </div>

      <!-- Facebook Pixel -->
      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:14px;margin-bottom:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.8);">📘 Facebook Pixel</div>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
            <input type="checkbox" id="facebook-pixel-enabled" onchange="savePixelConfig()">
            <span style="font-size:11px;color:rgba(255,255,255,0.5);">تفعيل</span>
          </label>
        </div>
        
        <div style="margin-bottom:10px;">
          <label style="font-size:10px;color:rgba(255,255,255,0.4);display:block;margin-bottom:4px;">Pixel ID</label>
          <input type="text" id="facebook-pixel-id" placeholder="123456789012345" onchange="savePixelConfig()" style="width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#fff;font-family:monospace;font-size:12px;padding:8px 10px;border-radius:8px;outline:none;">
        </div>

        <button onclick="testFacebookPixel()" style="width:100%;background:rgba(24,119,242,0.12);border:1px solid rgba(24,119,242,0.3);color:#1877f2;font-family:'Tajawal',sans-serif;font-size:11px;font-weight:700;padding:7px;border-radius:8px;cursor:pointer;">
          🔬 اختبار Facebook Pixel
        </button>
      </div>

      <div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06);">
        <div style="font-size:10px;color:rgba(255,255,255,0.3);line-height:1.6;">
          💡 <strong>معلومة:</strong> سيتم إطلاق أحداث PageView و Lead تلقائياً عند تفعيل Pixels<br>
          احصل على Pixel IDs من TikTok Ads Manager و Facebook Events Manager
        </div>
      </div>

    </div>
  `;

  loadPixelConfig();
}

function savePixelConfig() {
  pixelConfig.tiktok.id = document.getElementById('tiktok-pixel-id').value.trim();
  pixelConfig.tiktok.enabled = document.getElementById('tiktok-pixel-enabled').checked;
  
  pixelConfig.facebook.id = document.getElementById('facebook-pixel-id').value.trim();
  pixelConfig.facebook.enabled = document.getElementById('facebook-pixel-enabled').checked;

  localStorage.setItem('_pixel_config', JSON.stringify(pixelConfig));

  // Reinitialize pixels
  initPixels();
}

function loadPixelConfig() {
  try {
    const saved = localStorage.getItem('_pixel_config');
    if (saved) {
      pixelConfig = JSON.parse(saved);
      
      document.getElementById('tiktok-pixel-id').value = pixelConfig.tiktok.id || '';
      document.getElementById('tiktok-pixel-enabled').checked = pixelConfig.tiktok.enabled || false;
      
      document.getElementById('facebook-pixel-id').value = pixelConfig.facebook.id || '';
      document.getElementById('facebook-pixel-enabled').checked = pixelConfig.facebook.enabled || false;
    }
  } catch(e) {
    console.error('Failed to load pixel config:', e);
  }

  initPixels();
}

function initPixels() {
  // Actual pixel loading is handled by pixels-config.js
  // This just triggers a reload if needed
  if (typeof window.trackPixelEvent === 'function') {
    console.log('✅ Pixels configured successfully');
  }
}

function testTikTokPixel() {
  if (!pixelConfig.tiktok.enabled || !pixelConfig.tiktok.id) {
    alert('⚠️ فعّل TikTok Pixel وأدخل Pixel ID أولاً');
    return;
  }

  // Reload page to init pixel
  location.reload();
}

function testFacebookPixel() {
  if (!pixelConfig.facebook.enabled || !pixelConfig.facebook.id) {
    alert('⚠️ فعّل Facebook Pixel وأدخل Pixel ID أولاً');
    return;
  }

  // Reload page to init pixel
  location.reload();
}

// Export UI functions only
if (typeof window !== 'undefined') {
  window.initPixelsUI = initPixelsUI;
  window.savePixelConfig = savePixelConfig;
  window.testTikTokPixel = testTikTokPixel;
  window.testFacebookPixel = testFacebookPixel;
  // Tracking functions are in pixels-config.js
}
