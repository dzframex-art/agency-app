// ══════════════════════════════════════════════════════════════
// MULTI-API PROVIDER SYSTEM
// ══════════════════════════════════════════════════════════════

const AI_PROVIDERS = {
  deepseek: {
    name: 'DeepSeek',
    endpoint: 'https://api.deepseek.com/chat/completions',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    defaultModel: 'deepseek-chat',
    icon: '🧠'
  },
  openai: {
    name: 'OpenAI (ChatGPT)',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    models: ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4o',
    icon: '🤖'
  },
  gemini: {
    name: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
    models: ['gemini-2.0-flash-exp', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    defaultModel: 'gemini-2.0-flash-exp',
    useApiKeyParam: true,
    icon: '💎'
  },
  qwen: {
    name: 'Alibaba Qwen',
    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    models: ['qwen-plus', 'qwen-turbo', 'qwen-max'],
    defaultModel: 'qwen-plus',
    icon: '🐘'
  },
  claude: {
    name: 'Anthropic Claude',
    endpoint: 'https://api.anthropic.com/v1/messages',
    models: ['claude-sonnet-4-20250514', 'claude-opus-4-20250514', 'claude-haiku-4-20250301'],
    defaultModel: 'claude-sonnet-4-20250514',
    icon: '⚡'
  },
  mistral: {
    name: 'Mistral AI',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest'],
    defaultModel: 'mistral-large-latest',
    icon: '🌊'
  }
};

// Current active provider config
let activeAI = {
  provider: 'deepseek',
  apiKey: '',
  model: 'deepseek-chat'
};

// Initialize AI provider selector
function initAIProviderUI() {
  const container = document.getElementById('ai-provider-container');
  if (!container) return;

  container.innerHTML = `
    <div style="background:linear-gradient(135deg,rgba(0,212,255,0.06),rgba(180,79,255,0.04));border:1px solid rgba(0,212,255,0.2);border-radius:18px;padding:18px;margin-bottom:14px;">
      
      <div style="font-size:13px;font-weight:800;color:rgba(255,255,255,0.9);margin-bottom:14px;display:flex;align-items:center;gap:8px;">
        🤖 مزود الذكاء الاصطناعي
      </div>

      <div style="margin-bottom:14px;">
        <label style="font-size:11px;color:rgba(255,255,255,0.5);display:block;margin-bottom:6px;">اختر المزود</label>
        <select id="ai-provider-select" onchange="switchAIProvider()" style="width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#fff;font-family:'Tajawal',sans-serif;font-size:13px;padding:10px 12px;border-radius:10px;outline:none;cursor:pointer;">
          ${Object.keys(AI_PROVIDERS).map(key => {
            const p = AI_PROVIDERS[key];
            return `<option value="${key}">${p.icon} ${p.name}</option>`;
          }).join('')}
        </select>
      </div>

      <div style="margin-bottom:14px;">
        <label style="font-size:11px;color:rgba(255,255,255,0.5);display:block;margin-bottom:6px;">مفتاح API</label>
        <input type="password" id="ai-api-key" placeholder="sk-..." onchange="saveAIConfig()" style="width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#fff;font-family:'Tajawal',sans-serif;font-size:13px;padding:10px 12px;border-radius:10px;outline:none;">
      </div>

      <div style="margin-bottom:14px;">
        <label style="font-size:11px;color:rgba(255,255,255,0.5);display:block;margin-bottom:6px;">النموذج</label>
        <select id="ai-model-select" onchange="saveAIConfig()" style="width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#fff;font-family:'Tajawal',sans-serif;font-size:13px;padding:10px 12px;border-radius:10px;outline:none;cursor:pointer;">
        </select>
      </div>

      <button onclick="testAIConnection()" style="width:100%;background:rgba(0,212,255,0.12);border:1px solid rgba(0,212,255,0.25);color:#00d4ff;font-family:'Tajawal',sans-serif;font-size:12px;font-weight:700;padding:10px;border-radius:10px;cursor:pointer;margin-bottom:10px;">
        🔌 اختبار الاتصال
      </button>

      <div id="ai-test-result" style="display:none;font-size:11px;padding:8px 10px;border-radius:8px;"></div>

      <div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06);">
        <div style="font-size:10px;color:rgba(255,255,255,0.3);line-height:1.6;">
          💡 <strong>نصيحة:</strong> DeepSeek موصى به للغة العربية<br>
          احصل على مفاتيح مجانية من مواقع المزودين
        </div>
      </div>
    </div>
  `;

  // Load saved config
  loadAIConfig();
  switchAIProvider();
}

function switchAIProvider() {
  const select = document.getElementById('ai-provider-select');
  const modelSelect = document.getElementById('ai-model-select');
  
  if (!select || !modelSelect) return;

  const provider = select.value;
  const providerInfo = AI_PROVIDERS[provider];

  // Update model dropdown
  modelSelect.innerHTML = '';
  providerInfo.models.forEach(model => {
    const opt = document.createElement('option');
    opt.value = model;
    opt.textContent = model;
    modelSelect.appendChild(opt);
  });
  modelSelect.value = providerInfo.defaultModel;

  activeAI.provider = provider;
  activeAI.model = providerInfo.defaultModel;
  
  saveAIConfig();
}

function saveAIConfig() {
  const providerSelect = document.getElementById('ai-provider-select');
  const keyInput = document.getElementById('ai-api-key');
  const modelSelect = document.getElementById('ai-model-select');

  if (providerSelect) activeAI.provider = providerSelect.value;
  if (keyInput) activeAI.apiKey = keyInput.value.trim();
  if (modelSelect) activeAI.model = modelSelect.value;

  localStorage.setItem('_ai_config', JSON.stringify(activeAI));
}

function loadAIConfig() {
  try {
    const saved = localStorage.getItem('_ai_config');
    if (saved) {
      activeAI = JSON.parse(saved);
      
      const providerSelect = document.getElementById('ai-provider-select');
      const keyInput = document.getElementById('ai-api-key');
      const modelSelect = document.getElementById('ai-model-select');

      if (providerSelect) providerSelect.value = activeAI.provider;
      if (keyInput) keyInput.value = activeAI.apiKey;
      if (modelSelect) modelSelect.value = activeAI.model;
    }
  } catch(e) {
    console.error('Failed to load AI config:', e);
  }
}

async function testAIConnection() {
  const resultDiv = document.getElementById('ai-test-result');
  
  if (!activeAI.apiKey) {
    resultDiv.style.cssText = 'display:block;background:rgba(254,44,85,0.1);border:1px solid rgba(254,44,85,0.3);color:#fe2c55;';
    resultDiv.textContent = '⚠️ أدخل مفتاح API أولاً';
    return;
  }

  resultDiv.style.cssText = 'display:block;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.3);color:#00d4ff;';
  resultDiv.textContent = '⏳ جاري الاختبار...';

  try {
    const response = await callAI('قل مرحباً بالعربية في كلمة واحدة فقط');
    resultDiv.style.cssText = 'display:block;background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);color:#00ff88;';
    resultDiv.textContent = '✅ الاتصال ناجح! الرد: ' + response.slice(0, 50);
  } catch(e) {
    resultDiv.style.cssText = 'display:block;background:rgba(254,44,85,0.1);border:1px solid rgba(254,44,85,0.3);color:#fe2c55;';
    resultDiv.textContent = '❌ فشل: ' + e.message;
  }
}

async function callAI(prompt) {
  if (!activeAI.apiKey) {
    throw new Error('لم يتم تعيين مفتاح API');
  }

  const provider = activeAI.provider;
  const info = AI_PROVIDERS[provider];

  if (provider === 'gemini') {
    const url = info.endpoint.replace('{model}', activeAI.model) + '?key=' + activeAI.apiKey;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Gemini API error');
    return data.candidates[0].content.parts[0].text;
  }

  if (provider === 'claude') {
    const res = await fetch(info.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': activeAI.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: activeAI.model,
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Claude API error');
    return data.content[0].text;
  }

  // OpenAI-compatible (DeepSeek, OpenAI, Qwen, Mistral)
  const res = await fetch(info.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + activeAI.apiKey
    },
    body: JSON.stringify({
      model: activeAI.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2048,
      temperature: 0.7
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'API error: ' + res.status);
  return data.choices[0].message.content;
}

// Replace existing chatWithAI function
if (typeof window !== 'undefined') {
  window.callAI = callAI;
  window.initAIProviderUI = initAIProviderUI;
  window.switchAIProvider = switchAIProvider;
  window.saveAIConfig = saveAIConfig;
  window.testAIConnection = testAIConnection;
}
