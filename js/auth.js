/* =============================================
   PRIMEIRO PASSO — auth.js
   Login and Cadastro: validation, feedback,
   password toggle, strength meter.
   ============================================= */

(function () {
  'use strict';

  /* --- Toast utility --- */
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  /* --- Field validation helper --- */
  function setFieldError(input, message) {
    input.classList.add('error');
    let msg = input.parentElement.querySelector('.input-error-msg');
    if (!msg) {
      msg = document.createElement('span');
      msg.className = 'input-error-msg';
      msg.setAttribute('aria-live', 'polite');
      input.parentElement.appendChild(msg);
    }
    msg.textContent = message;
    msg.classList.add('visible');
  }

  function clearFieldError(input) {
    input.classList.remove('error');
    const msg = input.parentElement.querySelector('.input-error-msg');
    if (msg) msg.classList.remove('visible');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  /* --- Password toggle --- */
  function initPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', function () {
        const wrap  = this.closest('.input-password-wrap');
        const input = wrap.querySelector('input');
        const isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        this.setAttribute('aria-label', isText ? 'Mostrar senha' : 'Ocultar senha');
        this.innerHTML = isText ? eyeOffIcon() : eyeIcon();
      });
    });
  }

  function eyeIcon() {
    return `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>`;
  }

  function eyeOffIcon() {
    return `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>`;
  }

  /* --- Password strength meter --- */
  function initStrengthMeter() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
      const wrap = input.closest('.input-password-wrap') || input.closest('.input-group');
      if (!wrap) return;

      // Only on first password field (not confirm)
      const isFirst = [...document.querySelectorAll('input[type="password"]')].indexOf(input) === 0
        && document.getElementById('cadastroForm');

      if (!isFirst) return;

      const bar = document.createElement('div');
      bar.className = 'password-strength';
      bar.innerHTML = '<div class="password-strength-bar"></div>';
      wrap.appendChild(bar);

      const fill = bar.querySelector('.password-strength-bar');

      input.addEventListener('input', () => {
        const val = input.value;
        let score = 0;
        if (val.length >= 8)  score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        const pct   = (score / 4) * 100;
        const color = score <= 1 ? '#EF4444' : score === 2 ? '#F59E0B' : score === 3 ? '#22C55E' : '#4F46E5';
        fill.style.width    = `${pct}%`;
        fill.style.background = color;
      });
    });
  }

  /* --- Button loading state --- */
  function setLoading(btn, isLoading) {
    if (isLoading) {
      btn.dataset.originalText = btn.textContent;
      btn.innerHTML = '<span class="spinner"></span>';
      btn.disabled = true;
    } else {
      btn.textContent = btn.dataset.originalText || btn.textContent;
      btn.disabled = false;
    }
  }

  /* =====================
     LOGIN FORM
     ==================== */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const emailInput = loginForm.querySelector('input[type="email"]');
    const passInput  = loginForm.querySelector('input[type="password"]');
    const submitBtn  = loginForm.querySelector('button[type="submit"]');

    // Real-time validation
    emailInput.addEventListener('blur', () => {
      if (emailInput.value && !validateEmail(emailInput.value)) {
        setFieldError(emailInput, 'Digite um e-mail válido.');
      } else {
        clearFieldError(emailInput);
      }
    });

    emailInput.addEventListener('input', () => clearFieldError(emailInput));
    passInput.addEventListener('input',  () => clearFieldError(passInput));

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;

      if (!emailInput.value.trim()) {
        setFieldError(emailInput, 'O e-mail é obrigatório.');
        valid = false;
      } else if (!validateEmail(emailInput.value)) {
        setFieldError(emailInput, 'Digite um e-mail válido.');
        valid = false;
      }

      if (!passInput.value) {
        setFieldError(passInput, 'A senha é obrigatória.');
        valid = false;
      }

      if (!valid) return;

      setLoading(submitBtn, true);

      // Simulated auth — replace with real API call
      await new Promise(r => setTimeout(r, 1200));

      setLoading(submitBtn, false);
      showToast('Login realizado com sucesso!', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
    });
  }

  /* =====================
     CADASTRO FORM
     ==================== */
  const cadastroForm = document.getElementById('cadastroForm');
  if (cadastroForm) {
    const nomeInput      = cadastroForm.querySelector('input[type="text"]');
    const emailInput     = cadastroForm.querySelector('input[type="email"]');
    const passInputs     = cadastroForm.querySelectorAll('input[type="password"]');
    const passInput      = passInputs[0];
    const confirmInput   = passInputs[1];
    const submitBtn      = cadastroForm.querySelector('button[type="submit"]');

    // Real-time
    nomeInput.addEventListener('blur', () => {
      if (nomeInput.value.trim().length < 3) {
        setFieldError(nomeInput, 'Nome deve ter pelo menos 3 caracteres.');
      } else {
        clearFieldError(nomeInput);
      }
    });

    emailInput.addEventListener('blur', () => {
      if (!validateEmail(emailInput.value)) {
        setFieldError(emailInput, 'Digite um e-mail válido.');
      } else {
        clearFieldError(emailInput);
      }
    });

    confirmInput.addEventListener('input', () => {
      if (confirmInput.value && confirmInput.value !== passInput.value) {
        setFieldError(confirmInput, 'As senhas não coincidem.');
      } else {
        clearFieldError(confirmInput);
      }
    });

    [nomeInput, emailInput, passInput].forEach(inp => {
      inp.addEventListener('input', () => clearFieldError(inp));
    });

    cadastroForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;

      if (nomeInput.value.trim().length < 3) {
        setFieldError(nomeInput, 'Nome deve ter pelo menos 3 caracteres.');
        valid = false;
      }

      if (!validateEmail(emailInput.value)) {
        setFieldError(emailInput, 'Digite um e-mail válido.');
        valid = false;
      }

      if (passInput.value.length < 6) {
        setFieldError(passInput, 'A senha deve ter pelo menos 6 caracteres.');
        valid = false;
      }

      if (passInput.value !== confirmInput.value) {
        setFieldError(confirmInput, 'As senhas não coincidem.');
        valid = false;
      }

      if (!valid) return;

      setLoading(submitBtn, true);
      await new Promise(r => setTimeout(r, 1400));
      setLoading(submitBtn, false);
      showToast('Conta criada com sucesso!', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
    });
  }

  /* --- Init --- */
  initPasswordToggles();
  initStrengthMeter();

})();
