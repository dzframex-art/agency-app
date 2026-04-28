// ══════════════════════════════════════════════════════════════
// SHARED PIXELS CONFIG
// يُستخدم في CRM وصفحة الهبوط معاً
// ══════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // Get pixels config from localStorage (set by CRM)
  let pixelConfig = { tiktok: { id: '', enabled: false }, facebook: { id: '', enabled: false } };
  
  try {
    const saved = localStorage.getItem('_pixel_config');
    if (saved) {
      pixelConfig = JSON.parse(saved);
    }
  } catch(e) {
    console.warn('Failed to load pixel config:', e);
  }

  // ══════════════════════════════════════════════════════════════
  // TIKTOK PIXEL
  // ══════════════════════════════════════════════════════════════
  function initTikTokPixel(pixelId) {
    if (window.ttq) return; // Already loaded

    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
      ttq.load(pixelId);
      ttq.page();
    }(window, document, 'ttq');

    console.log('✅ TikTok Pixel loaded:', pixelId);
  }

  // ══════════════════════════════════════════════════════════════
  // FACEBOOK PIXEL
  // ══════════════════════════════════════════════════════════════
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

    console.log('✅ Facebook Pixel loaded:', pixelId);
  }

  // ══════════════════════════════════════════════════════════════
  // AUTO-INIT ON PAGE LOAD
  // ══════════════════════════════════════════════════════════════
  function initPixels() {
    // TikTok
    if (pixelConfig.tiktok && pixelConfig.tiktok.enabled && pixelConfig.tiktok.id) {
      initTikTokPixel(pixelConfig.tiktok.id);
    }

    // Facebook
    if (pixelConfig.facebook && pixelConfig.facebook.enabled && pixelConfig.facebook.id) {
      initFacebookPixel(pixelConfig.facebook.id);
    }
  }

  // ══════════════════════════════════════════════════════════════
  // TRACK EVENTS (Global functions)
  // ══════════════════════════════════════════════════════════════
  window.trackPixelEvent = function(eventName, data) {
    data = data || {};

    // TikTok
    if (pixelConfig.tiktok && pixelConfig.tiktok.enabled && window.ttq) {
      ttq.track(eventName, data);
      console.log('📊 TikTok event:', eventName, data);
    }

    // Facebook
    if (pixelConfig.facebook && pixelConfig.facebook.enabled && window.fbq) {
      fbq('track', eventName, data);
      console.log('📊 Facebook event:', eventName, data);
    }
  };

  // Specific event helpers
  window.trackFormSubmit = function(formData) {
    window.trackPixelEvent('SubmitForm', {
      content_name: formData.name || 'Lead Form',
      value: formData.price || 0,
      currency: 'DZD'
    });
  };

  window.trackLead = function(leadData) {
    window.trackPixelEvent('Lead', {
      content_name: leadData.name || 'Lead',
      value: leadData.price || 0,
      currency: 'DZD'
    });
  };

  window.trackPurchase = function(purchaseData) {
    window.trackPixelEvent('Purchase', {
      content_name: purchaseData.service || 'Service',
      value: purchaseData.price || 0,
      currency: 'DZD'
    });
  };

  // Auto-init on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPixels);
  } else {
    initPixels();
  }

})();
