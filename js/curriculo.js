/* =============================================
   PRIMEIRO PASSO — curriculo.js
   AI resume generator: sidebar toggle,
   form submission, result display.
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

  /* --- Character counters for textareas --- */
  document.querySelectorAll('#curriculoForm textarea').forEach(ta => {
    const wrap    = ta.closest('.input-group');
    const counter = document.createElement('span');
    counter.style.cssText = 'font-size:var(--text-xs);color:var(--color-text-muted);text-align:right;display:block;';
    wrap?.appendChild(counter);

    const update = () => { counter.textContent = `${ta.value.length} caracteres`; };
    ta.addEventListener('input', update);
    update();
  });

  /* --- Curriculo form --- */
  const form        = document.getElementById('curriculoForm');
  const resultado   = document.querySelector('.resultado');
  const resultBody  = document.querySelector('.resultado-content');
  const placeholder = document.querySelector('.resultado-placeholder');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const textareas = form.querySelectorAll('textarea');
    const sobre      = textareas[0]?.value.trim();
    const habilidades = textareas[1]?.value.trim();
    const cursos     = textareas[2]?.value.trim();

    if (!sobre) {
      textareas[0].focus();
      showToast('Preencha ao menos o campo "Sobre você".', 'error');
      return;
    }

    const btn  = form.querySelector('.btn-primary');
    const orig = btn.textContent;
    btn.innerHTML = '<span class="spinner"></span> Gerando...';
    btn.disabled  = true;

    if (placeholder) placeholder.style.display = 'none';
    if (resultBody)  resultBody.textContent = '';

    // Simulate async generation — replace with real AI call when backend is connected
    await new Promise(r => setTimeout(r, 1800));

    const generated = gerarCurriculo(sobre, habilidades, cursos);

    if (resultBody) {
      resultBody.style.display = 'block';
      resultBody.textContent   = generated;

      // Enable copy/download buttons
      const actionsEl = document.querySelector('.resultado-actions');
      if (actionsEl) actionsEl.style.display = 'flex';
    }

    btn.textContent = orig;
    btn.disabled    = false;
    showToast('Currículo gerado com sucesso!', 'success');
  });

  /* --- Simulated generator (placeholder until AI endpoint) --- */
  function gerarCurriculo(sobre, habilidades, cursos) {
    const linhaHabilidades = habilidades
      ? `\nHABILIDADES\n${habilidades.split(/[,\n]+/).map(h => `• ${h.trim()}`).filter(Boolean).join('\n')}`
      : '';
    const linhaCursos = cursos
      ? `\nFORMAÇÃO E CURSOS\n${cursos.split(/[,\n]+/).map(c => `• ${c.trim()}`).filter(Boolean).join('\n')}`
      : '';

    return `CURRÍCULO PROFISSIONAL
${'─'.repeat(40)}

SOBRE MIM
${sobre}
${linhaHabilidades}
${linhaCursos}

OBJETIVO PROFISSIONAL
Profissional em busca de oportunidades para desenvolver habilidades e contribuir com a equipe.

${'─'.repeat(40)}
Gerado pela plataforma Primeiro Passo`;
  }

  /* --- Copy button --- */
  const copyBtn = document.getElementById('copyBtn');
  copyBtn?.addEventListener('click', async () => {
    const text = document.querySelector('.resultado-content')?.textContent;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast('Currículo copiado!', 'success');
    } catch {
      showToast('Não foi possível copiar.', 'error');
    }
  });

})();
