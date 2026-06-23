/* =============================================
   PRIMEIRO PASSO — perfil.js
   Profile form: save, progress calc, toast.
   ============================================= */

(function () {
  'use strict';

  /* --- Inherit sidebar behavior from dashboard.js (loaded via shared component) --- */
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar       = document.querySelector('.sidebar');
  const overlay       = document.querySelector('.sidebar-overlay');

  function closeSidebar() {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('visible');
    document.body.style.overflow = '';
  }

  sidebarToggle?.addEventListener('click', () => {
    const open = !sidebar?.classList.contains('open');
    sidebar?.classList.toggle('open', open);
    overlay?.classList.toggle('visible', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  overlay?.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });
  window.addEventListener('resize', () => { if (window.innerWidth >= 1024) closeSidebar(); }, { passive: true });

  /* --- Toast --- */
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  /* --- Profile completion progress --- */
  function calcProgress() {
    const fields = document.querySelectorAll('.profile-form input, .profile-form textarea');
    if (!fields.length) return 0;
    let filled = 0;
    fields.forEach(f => { if (f.value.trim()) filled++; });
    return Math.round((filled / fields.length) * 100);
  }

  function updateProgress() {
    const bar   = document.querySelector('.progress-bar-fill');
    const label = document.querySelector('.profile-progress-header span:last-child');
    if (!bar) return;
    const pct = calcProgress();
    bar.style.width = `${pct}%`;
    if (label) label.textContent = `${pct}%`;
  }

  document.querySelectorAll('.profile-form input, .profile-form textarea').forEach(f => {
    f.addEventListener('input', updateProgress);
  });

  updateProgress();

  /* --- Form submit --- */
  const form = document.querySelector('.profile-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-primary');
      const orig = btn.textContent;
      btn.innerHTML = '<span class="spinner"></span>';
      btn.disabled = true;

      await new Promise(r => setTimeout(r, 1000));

      btn.textContent = orig;
      btn.disabled = false;
      showToast('Perfil salvo com sucesso!', 'success');
    });
  }

})();
