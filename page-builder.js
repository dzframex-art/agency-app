// ══════════════════════════════════════════════════════════════
// LANDING PAGE BUILDER WITH AI
// ══════════════════════════════════════════════════════════════

let currentPage = null;
let pages = [];

function initPageBuilder() {
  const container = document.getElementById('page-builder-container');
  if (!container) return;

  container.innerHTML = `
    <div style="font-family:'Tajawal',sans-serif;">
      
      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h2 style="font-size:18px;font-weight:900;color:#fff;margin:0;">🎨 منشئ صفحات الهبوط</h2>
        <button onclick="showNewPageDialog()" style="background:linear-gradient(135deg,#fe2c55,#ff6b35);color:#fff;border:none;font-size:13px;font-weight:700;padding:9px 18px;border-radius:10px;cursor:pointer;font-family:'Tajawal',sans-serif;">
          ➕ صفحة جديدة
        </button>
      </div>

      <!-- Pages List -->
      <div id="pages-list" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin-bottom:20px;">
        <div style="text-align:center;padding:40px;color:rgba(255,255,255,0.3);grid-column:1/-1;">
          ⏳ جاري التحميل...
        </div>
      </div>

    </div>
  `;

  loadPages();
}

async function loadPages() {
  try {
    const data = await sbSelect('landing_pages', 'order=created_at.desc');
    pages = data;
    renderPagesList();
  } catch(e) {
    console.error('Failed to load pages:', e);
    document.getElementById('pages-list').innerHTML = `
      <div style="text-align:center;padding:40px;color:rgba(255,80,80,0.6);grid-column:1/-1;">
        ❌ فشل تحميل الصفحات
      </div>`;
  }
}

function renderPagesList() {
  const container = document.getElementById('pages-list');
  
  if (!pages.length) {
    container.innerHTML = `
      <div style="text-align:center;padding:40px;color:rgba(255,255,255,0.3);grid-column:1/-1;">
        📄 لا توجد صفحات بعد — أنشئ أول صفحة!
      </div>`;
    return;
  }

  container.innerHTML = pages.map(page => `
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px;position:relative;overflow:hidden;">
      
      ${page.is_published ? '<div style="position:absolute;top:10px;right:10px;background:rgba(0,255,136,0.15);border:1px solid rgba(0,255,136,0.3);color:#00ff88;font-size:9px;font-weight:700;padding:3px 8px;border-radius:12px;">🟢 منشور</div>' : ''}
      
      <div style="font-size:14px;font-weight:800;color:#fff;margin-bottom:8px;padding-right:${page.is_published ? '70px' : '0'};">
        ${page.title}
      </div>
      
      <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:10px;">
        🔗 /${page.slug}
      </div>

      <div style="display:flex;gap:6px;margin-bottom:10px;">
        <div style="font-size:10px;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.2);color:#00d4ff;padding:4px 8px;border-radius:6px;">
          👁️ ${page.views_count || 0} مشاهدة
        </div>
        <div style="font-size:10px;background:rgba(180,79,255,0.1);border:1px solid rgba(180,79,255,0.2);color:#b44fff;padding:4px 8px;border-radius:6px;">
          📅 ${new Date(page.created_at).toLocaleDateString('ar-DZ')}
        </div>
      </div>

      <div style="display:flex;gap:6px;">
        <button onclick="editPage('${page.id}')" style="flex:1;background:rgba(0,212,255,0.12);border:1px solid rgba(0,212,255,0.25);color:#00d4ff;font-family:'Tajawal',sans-serif;font-size:11px;font-weight:700;padding:7px;border-radius:8px;cursor:pointer;">
          ✏️ تعديل
        </button>
        <button onclick="previewPage('${page.id}')" style="flex:1;background:rgba(180,79,255,0.12);border:1px solid rgba(180,79,255,0.25);color:#b44fff;font-family:'Tajawal',sans-serif;font-size:11px;font-weight:700;padding:7px;border-radius:8px;cursor:pointer;">
          👁️ معاينة
        </button>
        ${page.is_published 
          ? `<button onclick="unpublishPage('${page.id}')" style="flex:1;background:rgba(255,180,0,0.12);border:1px solid rgba(255,180,0,0.25);color:#ffb400;font-family:'Tajawal',sans-serif;font-size:11px;font-weight:700;padding:7px;border-radius:8px;cursor:pointer;">⏸️ إلغاء</button>`
          : `<button onclick="publishPage('${page.id}')" style="flex:1;background:rgba(0,255,136,0.12);border:1px solid rgba(0,255,136,0.25);color:#00ff88;font-family:'Tajawal',sans-serif;font-size:11px;font-weight:700;padding:7px;border-radius:8px;cursor:pointer;">🚀 نشر</button>`
        }
      </div>
    </div>
  `).join('');
}

function showNewPageDialog() {
  const overlay = document.createElement('div');
  overlay.id = 'new-page-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:600;background:rgba(8,11,20,0.95);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(10px);';
  
  overlay.innerHTML = `
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:28px 24px;max-width:520px;width:100%;font-family:'Tajawal',sans-serif;">
      
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h3 style="font-size:18px;font-weight:900;color:#fff;margin:0;">🤖 إنشاء صفحة بالذكاء الاصطناعي</h3>
        <button onclick="closeNewPageDialog()" style="background:transparent;border:none;color:rgba(255,255,255,0.4);font-size:24px;cursor:pointer;padding:0;width:30px;height:30px;">×</button>
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:12px;color:rgba(255,255,255,0.6);display:block;margin-bottom:7px;">📝 وصف الصفحة المطلوبة</label>
        <textarea id="page-prompt" placeholder="مثال: صفحة هبوط لخدمات TikTok Ads للشركات الناشئة في الجزائر، تحتوي على عداد تنازلي، فورم تسجيل، وأمثلة نجاح" style="width:100%;height:120px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;font-size:13px;padding:12px;border-radius:10px;outline:none;font-family:'Tajawal',sans-serif;resize:vertical;"></textarea>
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:12px;color:rgba(255,255,255,0.6);display:block;margin-bottom:7px;">🎨 الألوان الرئيسية</label>
        <input type="text" id="page-colors" placeholder="مثال: أزرق وبرتقالي" value="TikTok (وردي وسماوي)" style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;font-size:13px;padding:10px 12px;border-radius:10px;outline:none;font-family:'Tajawal',sans-serif;">
      </div>

      <button onclick="generatePageWithAI()" id="generate-btn" style="width:100%;background:linear-gradient(135deg,#fe2c55,#ff6b35);color:#fff;border:none;font-size:15px;font-weight:800;padding:13px;border-radius:12px;cursor:pointer;font-family:'Tajawal',sans-serif;margin-top:8px;">
        <span id="generate-text">✨ إنشاء بالذكاء الاصطناعي</span>
      </button>

      <div style="margin-top:12px;font-size:10px;color:rgba(255,255,255,0.3);text-align:center;">
        💡 سيستغرق 10-30 ثانية لإنشاء صفحة كاملة
      </div>

    </div>
  `;

  document.body.appendChild(overlay);
}

function closeNewPageDialog() {
  const overlay = document.getElementById('new-page-overlay');
  if (overlay) overlay.remove();
}

async function generatePageWithAI() {
  const prompt = document.getElementById('page-prompt').value.trim();
  const colors = document.getElementById('page-colors').value.trim();
  const btn = document.getElementById('generate-btn');
  const btnText = document.getElementById('generate-text');

  if (!prompt) {
    alert('⚠️ اكتب وصف الصفحة أولاً');
    return;
  }

  // Check AI config
  if (!activeAI || !activeAI.apiKey) {
    alert('⚠️ أضف مفتاح AI أولاً من تاب الإعدادات');
    return;
  }

  btn.disabled = true;
  btnText.textContent = '⏳ جاري الإنشاء... (10-30 ثانية)';

  try {
    const fullPrompt = `أنت خبير في تصميم صفحات الهبوط. أنشئ صفحة هبوط HTML كاملة وجاهزة للنشر.

المتطلبات:
${prompt}

الألوان: ${colors || 'ألوان جذابة'}

المواصفات التقنية:
- HTML5 كامل مع CSS مضمّن في <style>
- تصميم responsive يعمل على الموبايل
- اتجاه RTL للعربية
- خط Tajawal من Google Fonts
- أزرار CTA واضحة
- فورم تسجيل بسيط (اسم، هاتف، إيميل)
- ألوان متناسقة وجذابة
- animations بسيطة
- لا تستخدم صور خارجية - استخدم emojis وألوان فقط

أعطني الكود الكامل مباشرة بدون شرح. ابدأ بـ <!DOCTYPE html>`;

    const response = await callAI(fullPrompt);
    
    // Extract HTML from response
    let html = response;
    if (html.includes('```html')) {
      html = html.split('```html')[1].split('```')[0].trim();
    } else if (html.includes('```')) {
      html = html.split('```')[1].split('```')[0].trim();
    }

    // Clean up
    html = html.trim();
    if (!html.startsWith('<!DOCTYPE') && !html.startsWith('<html')) {
      throw new Error('الـ AI لم يُرجع HTML صالح');
    }

    // Open editor with generated HTML
    closeNewPageDialog();
    openPageEditor(null, html);

  } catch(e) {
    console.error('AI generation error:', e);
    alert('❌ فشل الإنشاء: ' + e.message);
    btn.disabled = false;
    btnText.textContent = '✨ إنشاء بالذكاء الاصطناعي';
  }
}

function openPageEditor(pageId, initialHtml = '') {
  currentPage = pageId ? pages.find(p => p.id === pageId) : null;
  
  const overlay = document.createElement('div');
  overlay.id = 'page-editor-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:700;background:#0a0f1e;display:flex;flex-direction:column;';
  
  overlay.innerHTML = `
    <div style="background:rgba(255,255,255,0.03);border-bottom:1px solid rgba(255,255,255,0.08);padding:14px 20px;display:flex;justify-content:space-between;align-items:center;font-family:'Tajawal',sans-serif;">
      <div style="display:flex;align-items:center;gap:12px;">
        <button onclick="closePageEditor()" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);font-size:20px;width:36px;height:36px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;">←</button>
        <h3 style="font-size:16px;font-weight:800;color:#fff;margin:0;">${currentPage ? 'تعديل: ' + currentPage.title : 'صفحة جديدة'}</h3>
      </div>
      <div style="display:flex;gap:8px;">
        <button onclick="savePageDraft()" style="background:rgba(0,212,255,0.12);border:1px solid rgba(0,212,255,0.25);color:#00d4ff;font-family:'Tajawal',sans-serif;font-size:12px;font-weight:700;padding:8px 16px;border-radius:8px;cursor:pointer;">💾 حفظ</button>
        <button onclick="savePage(true)" style="background:rgba(0,255,136,0.12);border:1px solid rgba(0,255,136,0.25);color:#00ff88;font-family:'Tajawal',sans-serif;font-size:12px;font-weight:700;padding:8px 16px;border-radius:8px;cursor:pointer;">🚀 حفظ ونشر</button>
      </div>
    </div>

    <div style="display:flex;flex:1;overflow:hidden;">
      
      <!-- Code Editor -->
      <div style="flex:1;display:flex;flex-direction:column;border-right:1px solid rgba(255,255,255,0.08);">
        <div style="padding:12px 16px;background:rgba(255,255,255,0.02);border-bottom:1px solid rgba(255,255,255,0.06);font-family:'Tajawal',sans-serif;">
          <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.5);margin-bottom:8px;">عنوان الصفحة و Slug:</div>
          <input type="text" id="page-title" placeholder="عنوان الصفحة" value="${currentPage ? currentPage.title : ''}" style="width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#fff;font-size:13px;padding:8px 10px;border-radius:6px;outline:none;font-family:'Tajawal',sans-serif;margin-bottom:6px;">
          <input type="text" id="page-slug" placeholder="page-slug" value="${currentPage ? currentPage.slug : ''}" style="width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#fff;font-size:12px;padding:8px 10px;border-radius:6px;outline:none;font-family:monospace;">
        </div>
        <textarea id="html-editor" style="flex:1;background:#1a1f2e;color:#fff;border:none;padding:16px;font-family:monospace;font-size:13px;line-height:1.6;resize:none;outline:none;">${initialHtml || (currentPage ? currentPage.html_content : '<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>صفحة هبوط</title>\n</head>\n<body>\n  <h1>مرحباً!</h1>\n</body>\n</html>')}</textarea>
      </div>

      <!-- Live Preview -->
      <div style="flex:1;display:flex;flex-direction:column;background:#fff;">
        <div style="padding:12px 16px;background:rgba(0,0,0,0.05);border-bottom:1px solid rgba(0,0,0,0.1);font-family:'Tajawal',sans-serif;display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:11px;font-weight:700;color:rgba(0,0,0,0.5);">معاينة مباشرة</div>
          <button onclick="refreshPreview()" style="background:rgba(0,0,0,0.05);border:1px solid rgba(0,0,0,0.1);color:rgba(0,0,0,0.5);font-size:11px;font-weight:700;padding:5px 12px;border-radius:6px;cursor:pointer;font-family:'Tajawal',sans-serif;">🔄 تحديث</button>
        </div>
        <iframe id="preview-frame" style="flex:1;border:none;width:100%;"></iframe>
      </div>

    </div>
  `;

  document.body.appendChild(overlay);

  // Auto-update preview
  const editor = document.getElementById('html-editor');
  let updateTimer;
  editor.addEventListener('input', function() {
    clearTimeout(updateTimer);
    updateTimer = setTimeout(refreshPreview, 1000);
  });

  refreshPreview();
}

function refreshPreview() {
  const html = document.getElementById('html-editor').value;
  const iframe = document.getElementById('preview-frame');
  iframe.srcdoc = html;
}

function closePageEditor() {
  const overlay = document.getElementById('page-editor-overlay');
  if (overlay) {
    if (confirm('هل تريد إغلاق المحرر؟ التغييرات غير المحفوظة ستُفقد.')) {
      overlay.remove();
      currentPage = null;
    }
  }
}

async function savePageDraft() {
  await savePage(false);
}

async function savePage(publish = false) {
  const title = document.getElementById('page-title').value.trim();
  const slug = document.getElementById('page-slug').value.trim();
  const html = document.getElementById('html-editor').value.trim();

  if (!title || !slug || !html) {
    alert('⚠️ املأ العنوان والـ slug والكود');
    return;
  }

  try {
    const pageData = {
      title: title,
      slug: slug,
      html_content: html,
      is_published: publish,
      published_at: publish ? new Date().toISOString() : null
    };

    if (currentPage) {
      // Update
      await fetch(SUPABASE_URL + '/rest/v1/landing_pages?id=eq.' + currentPage.id, {
        method: 'PATCH',
        headers: SB_HEADERS,
        body: JSON.stringify(pageData)
      });
      alert('✅ تم الحفظ بنجاح!');
    } else {
      // Create
      await fetch(SUPABASE_URL + '/rest/v1/landing_pages', {
        method: 'POST',
        headers: SB_HEADERS,
        body: JSON.stringify(pageData)
      });
      alert('✅ تم الإنشاء بنجاح!');
    }

    closePageEditor();
    loadPages();

  } catch(e) {
    console.error('Save error:', e);
    alert('❌ فشل الحفظ: ' + e.message);
  }
}

async function publishPage(id) {
  if (!confirm('هل تريد نشر هذه الصفحة؟')) return;
  
  try {
    await fetch(SUPABASE_URL + '/rest/v1/landing_pages?id=eq.' + id, {
      method: 'PATCH',
      headers: SB_HEADERS,
      body: JSON.stringify({ is_published: true, published_at: new Date().toISOString() })
    });
    loadPages();
    alert('✅ تم النشر!');
  } catch(e) {
    alert('❌ فشل النشر');
  }
}

async function unpublishPage(id) {
  if (!confirm('هل تريد إلغاء نشر هذه الصفحة؟')) return;
  
  try {
    await fetch(SUPABASE_URL + '/rest/v1/landing_pages?id=eq.' + id, {
      method: 'PATCH',
      headers: SB_HEADERS,
      body: JSON.stringify({ is_published: false })
    });
    loadPages();
    alert('✅ تم إلغاء النشر');
  } catch(e) {
    alert('❌ فشل الإلغاء');
  }
}

function editPage(id) {
  openPageEditor(id);
}

function previewPage(id) {
  const page = pages.find(p => p.id === id);
  if (!page) return;
  
  const url = window.location.origin + window.location.pathname.replace('index.html', '') + 'page.html?slug=' + page.slug;
  window.open(url, '_blank');
}

// Export
if (typeof window !== 'undefined') {
  window.initPageBuilder = initPageBuilder;
  window.showNewPageDialog = showNewPageDialog;
  window.closeNewPageDialog = closeNewPageDialog;
  window.generatePageWithAI = generatePageWithAI;
  window.openPageEditor = openPageEditor;
  window.closePageEditor = closePageEditor;
  window.savePageDraft = savePageDraft;
  window.savePage = savePage;
  window.refreshPreview = refreshPreview;
  window.publishPage = publishPage;
  window.unpublishPage = unpublishPage;
  window.editPage = editPage;
  window.previewPage = previewPage;
}
