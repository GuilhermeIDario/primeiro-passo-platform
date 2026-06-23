/* =============================================
   PRIMEIRO PASSO — dashboard.js
   Sidebar mobile toggle, overlay, keyboard nav,
   active state management.
   ============================================= */

(function () {
  'use strict';

  /* --- Sidebar toggle (mobile) --- */
  const sidebar        = document.querySelector('.sidebar');
  const overlay        = document.querySelector('.sidebar-overlay');
  const sidebarToggle  = document.querySelector('.sidebar-toggle');

  function openSidebar() {
    sidebar?.classList.add('open');
    overlay?.classList.add('visible');
    document.body.style.overflow = 'hidden';
    sidebarToggle?.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('visible');
    document.body.style.overflow = '';
    sidebarToggle?.setAttribute('aria-expanded', 'false');
  }

  function toggleSidebar() {
    sidebar?.classList.contains('open') ? closeSidebar() : openSidebar();
  }

  sidebarToggle?.addEventListener('click', toggleSidebar);
  overlay?.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSidebar();
  });

  // Close on nav click (mobile)
  sidebar?.querySelectorAll('nav li').forEach(li => {
    li.addEventListener('click', () => {
      if (window.innerWidth < 1024) closeSidebar();
    });
  });

  // Auto-close sidebar when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) closeSidebar();
  }, { passive: true });

  /* --- Toast utility (shared) --- */
  window.showToast = function (message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  };

  /* --- Completar perfil button --- */
  const completarBtn = document.querySelector('.topbar-right .btn-primary');
  if (completarBtn && completarBtn.textContent.includes('Completar')) {
    completarBtn.addEventListener('click', () => {
      window.location.href = 'perfil.html';
    });
  }

})();
