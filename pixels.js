// ══════════════════════════════════════════════════════════════
// TRACKING PIXELS INTEGRATION
// TikTok Pixel + Facebook Pixel
// ══════════════════════════════════════════════════════════════

let pixelConfig = {
  tiktok: { id: '', enabled: false },
  facebook: { id: '', enabled: false }
};

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
  // TikTok Pixel
  if (pixelConfig.tiktok.enabled && pixelConfig.tiktok.id) {
    initTikTokPixel(pixelConfig.tiktok.id);
  }

  // Facebook Pixel
  if (pixelConfig.facebook.enabled && pixelConfig.facebook.id) {
    initFacebookPixel(pixelConfig.facebook.id);
  }
}

function initTikTokPixel(pixelId) {
  if (window.ttq) return; // Already loaded

  !function (w, d, t) {
    w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
    ttq.load(pixelId);
    ttq.page();
  }(window, document, 'ttq');

  console.log('✅ TikTok Pixel initialized:', pixelId);
}

function initFacebookPixel(pixelId) {
  if (window.fbq) return; // Already loaded

  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  
  fbq('init', pixelId);
  fbq('track', 'PageView');

  console.log('✅ Facebook Pixel initialized:', pixelId);
}

function trackLeadConversion(leadData) {
  // TikTok
  if (pixelConfig.tiktok.enabled && window.ttq) {
    ttq.track('SubmitForm', {
      content_name: leadData.name || 'Lead',
      value: leadData.price || 0,
      currency: 'DZD'
    });
    console.log('📊 TikTok Lead event sent');
  }

  // Facebook
  if (pixelConfig.facebook.enabled && window.fbq) {
    fbq('track', 'Lead', {
      content_name: leadData.name || 'Lead',
      value: leadData.price || 0,
      currency: 'DZD'
    });
    console.log('📊 Facebook Lead event sent');
  }
}

function trackPurchase(leadData) {
  // TikTok
  if (pixelConfig.tiktok.enabled && window.ttq) {
    ttq.track('CompletePayment', {
      content_name: leadData.services ? leadData.services[0] : 'Service',
      value: leadData.price || 0,
      currency: 'DZD'
    });
  }

  // Facebook
  if (pixelConfig.facebook.enabled && window.fbq) {
    fbq('track', 'Purchase', {
      content_name: leadData.services ? leadData.services[0] : 'Service',
      value: leadData.price || 0,
      currency: 'DZD'
    });
  }
}

function testTikTokPixel() {
  if (!pixelConfig.tiktok.enabled || !pixelConfig.tiktok.id) {
    alert('⚠️ فعّل TikTok Pixel وأدخل Pixel ID أولاً');
    return;
  }

  if (window.ttq) {
    ttq.track('ViewContent');
    alert('✅ تم إرسال حدث اختبار لـ TikTok!\nافتح TikTok Events Manager لرؤية الحدث.');
  } else {
    alert('❌ TikTok Pixel غير محمّل بعد. حاول إعادة تحميل الصفحة.');
  }
}

function testFacebookPixel() {
  if (!pixelConfig.facebook.enabled || !pixelConfig.facebook.id) {
    alert('⚠️ فعّل Facebook Pixel وأدخل Pixel ID أولاً');
    return;
  }

  if (window.fbq) {
    fbq('track', 'ViewContent');
    alert('✅ تم إرسال حدث اختبار لـ Facebook!\nافتح Facebook Events Manager لرؤية الحدث.');
  } else {
    alert('❌ Facebook Pixel غير محمّل بعد. حاول إعادة تحميل الصفحة.');
  }
}

// Export
if (typeof window !== 'undefined') {
  window.initPixelsUI = initPixelsUI;
  window.savePixelConfig = savePixelConfig;
  window.testTikTokPixel = testTikTokPixel;
  window.testFacebookPixel = testFacebookPixel;
  window.trackLeadConversion = trackLeadConversion;
  window.trackPurchase = trackPurchase;
}
