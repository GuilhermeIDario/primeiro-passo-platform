/* =============================================
   PRIMEIRO PASSO — sidebar.js
   Injects full sidebar nav + topbar structure,
   sets active state based on current page,
   handles mobile toggle.
   ============================================= */

(function () {
  'use strict';

  const PAGES = [
    { href: 'dashboard.html', label: 'Dashboard',     icon: '🏠' },
    { href: 'perfil.html',    label: 'Meu Perfil',    icon: '👤' },
    { href: 'vagas.html',     label: 'Vagas',          icon: '💼' },
    { href: 'curriculo.html', label: 'Currículo IA',  icon: '📄' },
    { href: 'entrevista.html',label: 'Entrevistas',   icon: '🎤' },
    { href: 'cursos.html',    label: 'Cursos',         icon: '📚' },
  ];

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  /* --- Build sidebar --- */
  function buildSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    const logoHTML = `
      <div class="logo">
        <!-- LOGO -->
        <img src="img/logo.png" alt="Primeiro Passo">
      </div>
    `;

    const userHTML = `
      <div class="sidebar-user">
        <div class="sidebar-user-avatar" aria-hidden="true">G</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">Guilherme</div>
          <div class="sidebar-user-role">Candidato</div>
        </div>
      </div>
    `;

    const navItems = PAGES.map(p => {
      const active = currentPage === p.href ? ' class="active"' : '';
      const onclick = currentPage !== p.href ? ` onclick="location.href='${p.href}'"` : '';
      const aria = currentPage === p.href ? ' aria-current="page"' : '';
      return `<li${active}${onclick}${aria} tabindex="0" role="menuitem">
        <span class="nav-icon" aria-hidden="true">${p.icon}</span>
        ${p.label}
      </li>`;
    }).join('');

    const navHTML = `<nav aria-label="Menu principal"><ul role="menu">${navItems}</ul></nav>`;

    const footerHTML = `
      <div class="sidebar-footer">
        <ul>
          <li onclick="location.href='index.html'" tabindex="0" role="menuitem">
            <span class="nav-icon" aria-hidden="true">🚪</span>
            Sair
          </li>
        </ul>
      </div>
    `;

    sidebar.innerHTML = logoHTML + userHTML + navHTML + footerHTML;

    // Keyboard navigation for nav items
    sidebar.querySelectorAll('li[tabindex]').forEach(li => {
      li.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          li.click();
        }
      });
    });
  }

  /* --- Build topbar --- */
  function buildTopbar() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;

    const pageInfo = PAGES.find(p => p.href === currentPage);
    const title    = pageInfo ? pageInfo.label : 'Dashboard';

    topbar.innerHTML = `
      <div class="topbar-left">
        <button
          class="sidebar-toggle"
          aria-label="Abrir menu lateral"
          aria-expanded="false"
          aria-controls="sidebar"
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div>
          <h1>${currentPage === 'dashboard.html' ? 'Olá, Guilherme 👋' : title}</h1>
          ${currentPage === 'dashboard.html' ? '<p>Bem-vindo de volta.</p>' : ''}
        </div>
      </div>
      <div class="topbar-right">
        ${currentPage === 'dashboard.html'
          ? '<button class="btn-primary" onclick="location.href=\'perfil.html\'">Completar Perfil</button>'
          : ''}
      </div>
    `;
  }

  /* --- Sidebar overlay toggle --- */
  function initToggle() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // Create overlay if not present
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);
    }

    function openSidebar() {
      sidebar.classList.add('open');
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
      const btn = document.querySelector('.sidebar-toggle');
      btn?.setAttribute('aria-expanded', 'true');
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
      document.body.style.overflow = '';
      const btn = document.querySelector('.sidebar-toggle');
      btn?.setAttribute('aria-expanded', 'false');
    }

    // Delegate: toggle button may not exist yet
    document.addEventListener('click', e => {
      const toggle = e.target.closest('.sidebar-toggle');
      if (toggle) {
        sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
      }
    });

    overlay.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });
    window.addEventListener('resize', () => { if (window.innerWidth >= 1024) closeSidebar(); }, { passive: true });

    // Close on nav item click on mobile
    sidebar.addEventListener('click', e => {
      if (e.target.closest('li') && window.innerWidth < 1024) closeSidebar();
    });
  }

  /* --- Init --- */
  buildSidebar();
  buildTopbar();
  initToggle();

})();
