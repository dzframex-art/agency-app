// ══════════════════════════════════════════════════════════════
// AUTH GUARD — Add to every protected page
// ══════════════════════════════════════════════════════════════
(function() {
  const SUPABASE_URL = 'https://dwjdvmexwcbqnmdsmfkb.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3amR2bWV4d2NicW5tZHNtZmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5ODAzNzQsImV4cCI6MjA5MjU1NjM3NH0.HeTwUpvviJv7tyhhvEC461HT5gWpK_or2rUxAqToxDQ';
  
  const SB_HEADERS = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY
  };

  window.currentUser = null;
  window.userRole = null;

  window.checkAuth = async function() {
    const token = localStorage.getItem('_auth_token');
    
    if (!token) {
      window.location.href = 'login.html';
      return false;
    }

    try {
      const res = await fetch(SUPABASE_URL + '/rest/v1/sessions?token=eq.' + token + '&select=*,users(*)', {
        headers: SB_HEADERS
      });

      const sessions = await res.json();

      if (!sessions || !sessions.length) {
        localStorage.clear();
        window.location.href = 'login.html';
        return false;
      }

      const session = sessions[0];
      const expiresAt = new Date(session.expires_at);

      if (expiresAt < new Date()) {
        localStorage.clear();
        window.location.href = 'login.html';
        return false;
      }

      window.currentUser = session.users;
      window.userRole = session.users.role;
      
      localStorage.setItem('_user_role', window.userRole);
      localStorage.setItem('_user_name', window.currentUser.full_name);

      return true;

    } catch(e) {
      console.error('Auth check failed:', e);
      localStorage.clear();
      window.location.href = 'login.html';
      return false;
    }
  };

  window.logout = function() {
    if (!confirm('هل تريد تسجيل الخروج؟')) return;
    
    const token = localStorage.getItem('_auth_token');
    if (token) {
      fetch(SUPABASE_URL + '/rest/v1/sessions?token=eq.' + token, {
        method: 'DELETE',
        headers: SB_HEADERS
      }).catch(() => {});
    }
    
    localStorage.clear();
    window.location.href = 'login.html';
  };

  window.applyRoleRestrictions = function() {
    const role = window.userRole;
    
    const restrictions = {
      agent: {
        hideTabs: ['analytics', 'visitors', 'settings', 'retarget'],
        hideSelectors: ['#nav-analytics', '#nav-visitors', '#nav-settings', '#nav-retarget'],
        disableActions: ['delete', 'export-all', 'edit-settings']
      },
      manager: {
        hideTabs: ['settings'],
        hideSelectors: ['#nav-settings'],
        disableActions: ['edit-settings']
      },
      admin: {
        hideTabs: [],
        hideSelectors: [],
        disableActions: []
      }
    };

    const userRestrictions = restrictions[role] || restrictions.agent;

    // Hide elements
    userRestrictions.hideSelectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.style.display = 'none';
    });

    // Add role badge
    const roleNames = { admin: '👑 مدير', manager: '👨‍💼 مشرف', agent: '👤 موظف' };
    const userName = window.currentUser.full_name || 'مستخدم';
    
    const badge = document.createElement('div');
    badge.style.cssText = 'position:fixed;top:14px;left:14px;z-index:150;background:rgba(0,212,255,0.12);border:1px solid rgba(0,212,255,0.3);color:#00d4ff;font-size:11px;font-weight:700;padding:7px 14px;border-radius:20px;font-family:Tajawal,sans-serif;cursor:pointer;';
    badge.innerHTML = roleNames[role] + ' · ' + userName;
    badge.title = 'اضغط لتسجيل الخروج';
    badge.onclick = window.logout;
    document.body.appendChild(badge);

    // Store restrictions globally
    window.userRestrictions = userRestrictions;
  };

  // Auto-check on load
  document.addEventListener('DOMContentLoaded', async function() {
    const isAuth = await window.checkAuth();
    if (isAuth) {
      window.applyRoleRestrictions();
    }
  });

})();
