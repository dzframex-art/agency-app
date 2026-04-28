// ══════════════════════════════════════════════════════════════
// PDF EXPORT SYSTEM
// Export data in French or English with custom field selection
// ══════════════════════════════════════════════════════════════

// Translations
const PDF_TRANSLATIONS = {
  en: {
    title: 'Sales Report',
    subtitle: 'Grow Up Agency — TikTok Ads Management',
    generatedOn: 'Generated on',
    totalLeads: 'Total Leads',
    totalRevenue: 'Total Revenue',
    totalProfit: 'Profit',
    conversionRate: 'Conversion Rate',
    leadsList: 'Leads List',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    status: 'Status',
    service: 'Service',
    price: 'Price',
    cost: 'Cost',
    profit: 'Profit',
    date: 'Date',
    statusNew: 'New',
    statusNegotiating: 'Negotiating',
    statusSold: 'Sold',
    statusRejected: 'Rejected',
    footer: 'Confidential Document — Grow Up Agency',
    page: 'Page'
  },
  fr: {
    title: 'Rapport de Ventes',
    subtitle: 'Grow Up Agency — Gestion TikTok Ads',
    generatedOn: 'Généré le',
    totalLeads: 'Total Prospects',
    totalRevenue: 'Chiffre d\'Affaires',
    totalProfit: 'Bénéfice',
    conversionRate: 'Taux de Conversion',
    leadsList: 'Liste des Prospects',
    name: 'Nom',
    phone: 'Téléphone',
    email: 'Email',
    status: 'Statut',
    service: 'Service',
    price: 'Prix',
    cost: 'Coût',
    profit: 'Bénéfice',
    date: 'Date',
    statusNew: 'Nouveau',
    statusNegotiating: 'Négociation',
    statusSold: 'Vendu',
    statusRejected: 'Rejeté',
    footer: 'Document Confidentiel — Grow Up Agency',
    page: 'Page'
  }
};

function showPDFExportDialog() {
  const overlay = document.createElement('div');
  overlay.id = 'pdf-export-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:500;background:rgba(8,11,20,0.95);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(10px);';
  
  overlay.innerHTML = `
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:28px 24px;max-width:420px;width:100%;font-family:'Tajawal',sans-serif;">
      
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h3 style="font-size:18px;font-weight:900;color:#fff;">📄 تصدير PDF</h3>
        <button onclick="closePDFDialog()" style="background:transparent;border:none;color:rgba(255,255,255,0.4);font-size:24px;cursor:pointer;padding:0;width:30px;height:30px;">×</button>
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:12px;color:rgba(255,255,255,0.6);display:block;margin-bottom:7px;">🌍 اللغة</label>
        <select id="pdf-lang" style="width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#fff;font-family:'Tajawal',sans-serif;font-size:13px;padding:10px 12px;border-radius:10px;outline:none;cursor:pointer;">
          <option value="fr">🇫🇷 Français (فرنسية)</option>
          <option value="en">🇬🇧 English (إنجليزية)</option>
        </select>
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:12px;color:rgba(255,255,255,0.6);display:block;margin-bottom:7px;">📊 البيانات المطلوبة</label>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px;max-height:200px;overflow-y:auto;">
          <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;font-size:12px;">
            <input type="checkbox" id="pdf-field-name" checked> الاسم (Name)
          </label>
          <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;font-size:12px;">
            <input type="checkbox" id="pdf-field-phone" checked> الهاتف (Phone)
          </label>
          <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;font-size:12px;">
            <input type="checkbox" id="pdf-field-email" checked> الإيميل (Email)
          </label>
          <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;font-size:12px;">
            <input type="checkbox" id="pdf-field-status" checked> الحالة (Status)
          </label>
          <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;font-size:12px;">
            <input type="checkbox" id="pdf-field-service" checked> الخدمة (Service)
          </label>
          <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;font-size:12px;">
            <input type="checkbox" id="pdf-field-price" checked> السعر (Price)
          </label>
          <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;font-size:12px;">
            <input type="checkbox" id="pdf-field-cost"> التكلفة (Cost)
          </label>
          <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;font-size:12px;">
            <input type="checkbox" id="pdf-field-profit"> الربح (Profit)
          </label>
          <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;font-size:12px;">
            <input type="checkbox" id="pdf-field-date" checked> التاريخ (Date)
          </label>
        </div>
      </div>

      <button onclick="generatePDF()" id="pdf-generate-btn" style="width:100%;background:linear-gradient(135deg,#fe2c55,#ff6b35);color:#fff;border:none;font-size:15px;font-weight:800;padding:13px;border-radius:12px;cursor:pointer;font-family:'Tajawal',sans-serif;margin-top:8px;">
        📥 تحميل PDF
      </button>

      <div style="margin-top:12px;font-size:10px;color:rgba(255,255,255,0.3);text-align:center;">
        سيتم تصدير ${window.leads ? window.leads.length : 0} عميل
      </div>

    </div>
  `;

  document.body.appendChild(overlay);
}

function closePDFDialog() {
  const overlay = document.getElementById('pdf-export-overlay');
  if (overlay) overlay.remove();
}

async function generatePDF() {
  const btn = document.getElementById('pdf-generate-btn');
  btn.disabled = true;
  btn.textContent = '⏳ جاري الإنشاء...';

  try {
    // Load jsPDF
    if (typeof jspdf === 'undefined') {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    }

    const lang = document.getElementById('pdf-lang').value;
    const t = PDF_TRANSLATIONS[lang];

    // Get selected fields
    const fields = {
      name: document.getElementById('pdf-field-name').checked,
      phone: document.getElementById('pdf-field-phone').checked,
      email: document.getElementById('pdf-field-email').checked,
      status: document.getElementById('pdf-field-status').checked,
      service: document.getElementById('pdf-field-service').checked,
      price: document.getElementById('pdf-field-price').checked,
      cost: document.getElementById('pdf-field-cost').checked,
      profit: document.getElementById('pdf-field-profit').checked,
      date: document.getElementById('pdf-field-date').checked
    };

    // Create PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(t.title, 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(t.subtitle, 105, 28, { align: 'center' });

    // Date
    doc.setFontSize(9);
    doc.text(t.generatedOn + ': ' + new Date().toLocaleDateString(), 105, 35, { align: 'center' });

    // Summary stats
    const totalLeads = window.leads.length;
    const totalRevenue = window.leads.reduce((sum, l) => sum + (l.price || 0), 0);
    const totalCost = window.leads.reduce((sum, l) => sum + (l.cost || 0), 0);
    const totalProfit = totalRevenue - totalCost;
    const soldCount = window.leads.filter(l => l.status === 'sold').length;
    const convRate = totalLeads > 0 ? ((soldCount / totalLeads) * 100).toFixed(1) : 0;

    let y = 45;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    
    const stats = [
      `${t.totalLeads}: ${totalLeads}`,
      `${t.totalRevenue}: ${totalRevenue.toLocaleString()} DZD`,
      `${t.totalProfit}: ${totalProfit.toLocaleString()} DZD`,
      `${t.conversionRate}: ${convRate}%`
    ];

    stats.forEach((stat, i) => {
      doc.text(stat, 20 + (i % 2) * 90, y + Math.floor(i / 2) * 8);
    });

    y += 25;

    // Table header
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(t.leadsList, 20, y);
    y += 8;

    // Table
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');

    let x = 15;
    const colWidths = {};
    const cols = [];

    if (fields.name) { cols.push('name'); colWidths.name = 30; }
    if (fields.phone) { cols.push('phone'); colWidths.phone = 25; }
    if (fields.email) { cols.push('email'); colWidths.email = 35; }
    if (fields.status) { cols.push('status'); colWidths.status = 20; }
    if (fields.service) { cols.push('service'); colWidths.service = 25; }
    if (fields.price) { cols.push('price'); colWidths.price = 18; }
    if (fields.cost) { cols.push('cost'); colWidths.cost = 18; }
    if (fields.profit) { cols.push('profit'); colWidths.profit = 18; }
    if (fields.date) { cols.push('date'); colWidths.date = 22; }

    // Draw headers
    cols.forEach(col => {
      doc.text(t[col], x, y);
      x += colWidths[col];
    });

    y += 6;
    doc.setFont(undefined, 'normal');

    // Draw rows
    window.leads.forEach((lead, idx) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      x = 15;

      cols.forEach(col => {
        let val = '';
        
        if (col === 'name') val = lead.name || '-';
        else if (col === 'phone') val = lead.phone || '-';
        else if (col === 'email') val = lead.email || '-';
        else if (col === 'status') val = t['status' + lead.status.charAt(0).toUpperCase() + lead.status.slice(1)] || lead.status;
        else if (col === 'service') val = (lead.services && lead.services[0]) || '-';
        else if (col === 'price') val = (lead.price || 0) + ' DZD';
        else if (col === 'cost') val = (lead.cost || 0) + ' DZD';
        else if (col === 'profit') val = ((lead.price || 0) - (lead.cost || 0)) + ' DZD';
        else if (col === 'date') val = new Date(lead.createdAt).toLocaleDateString();

        // Truncate if too long
        if (val.length > colWidths[col] / 2) {
          val = val.slice(0, Math.floor(colWidths[col] / 2)) + '...';
        }

        doc.text(val, x, y);
        x += colWidths[col];
      });

      y += 6;
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(t.footer, 105, 285, { align: 'center' });
      doc.text(t.page + ' ' + i + '/' + pageCount, 105, 290, { align: 'center' });
    }

    // Save
    const filename = `Grow_Up_Agency_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);

    closePDFDialog();

  } catch(e) {
    console.error('PDF generation error:', e);
    alert('خطأ في إنشاء PDF: ' + e.message);
    btn.disabled = false;
    btn.textContent = '📥 تحميل PDF';
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

// Export
if (typeof window !== 'undefined') {
  window.showPDFExportDialog = showPDFExportDialog;
  window.closePDFDialog = closePDFDialog;
  window.generatePDF = generatePDF;
}
