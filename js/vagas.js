/* =============================================
   PRIMEIRO PASSO — vagas.js
   Job listing: live search filter, sidebar toggle.
   ============================================= */

(function () {
  'use strict';

  /* --- Sidebar (shared) --- */
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

  /* --- Live search filter --- */
  const searchInput = document.querySelector('.search-bar input');
  const jobCards    = document.querySelectorAll('.job-card');

  if (searchInput && jobCards.length) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      let visible = 0;

      jobCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const match = !query || text.includes(query);
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      // Empty state
      let emptyState = document.querySelector('.vagas-empty');
      if (visible === 0 && !emptyState) {
        emptyState = document.createElement('p');
        emptyState.className = 'vagas-empty';
        emptyState.textContent = 'Nenhuma vaga encontrada para essa busca.';
        emptyState.style.cssText = 'color:var(--color-text-muted);font-size:var(--text-sm);padding:var(--space-8) 0;text-align:center;grid-column:1/-1;';
        document.querySelector('.vagas-grid')?.appendChild(emptyState);
      } else if (visible > 0 && emptyState) {
        emptyState.remove();
      }
    });
  }

  /* --- Ver Vaga buttons --- */
  document.querySelectorAll('.job-card .btn-primary').forEach(btn => {
    btn.addEventListener('click', function () {
      const card  = this.closest('.job-card');
      const title = card.querySelector('h3')?.textContent || 'Vaga';
      // Placeholder — link to detail page when available
      alert(`Detalhes da vaga: ${title}\n\n(Integração com backend em breve)`);
    });
  });

})();
