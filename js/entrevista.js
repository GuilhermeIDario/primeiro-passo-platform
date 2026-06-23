/* =============================================
   PRIMEIRO PASSO — entrevista.js
   AI interview simulator: chat, typing indicator,
   question rotation, keyboard submit.
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
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSidebar();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) closeSidebar();
  }, { passive: true });

  /* --- Chat elements --- */
  const chatMessages = document.querySelector('.chat-messages');
  const userInput    = document.getElementById('userInput');
  const sendBtn      = document.getElementById('sendBtn');

  if (!chatMessages || !userInput || !sendBtn) return;

  /* --- Question bank --- */
  const questions = [
    'Fale um pouco sobre você.',
    'Quais são seus principais pontos fortes?',
    'Como você lida com situações de pressão e prazos apertados?',
    'Por que você quer trabalhar nessa área?',
    'Você tem experiência com trabalho em equipe? Dê um exemplo.',
    'Onde você se vê daqui a 3 anos?',
    'Como você lida com críticas ou feedbacks negativos?',
    'O que te motiva no trabalho?',
    'Conte sobre um desafio que você enfrentou e como o superou.',
    'Quais habilidades você quer desenvolver?',
  ];

  let questionIndex = 0;

  /* --- Scroll to bottom --- */
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /* --- Append message --- */
  function appendMessage(text, type) {
    const el = document.createElement('div');
    el.className = type === 'bot' ? 'bot-message' : 'user-message';
    el.textContent = text;
    chatMessages.appendChild(el);
    scrollToBottom();
  }

  /* --- Typing indicator --- */
  function showTyping() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(indicator);
    scrollToBottom();
  }

  function hideTyping() {
    document.getElementById('typingIndicator')?.remove();
  }

  /* --- Send message --- */
  async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';
    userInput.focus();

    sendBtn.disabled = true;
    showTyping();

    // Simulated AI response delay — replace with real API call
    const delay = 900 + Math.random() * 600;
    await new Promise(r => setTimeout(r, delay));

    hideTyping();
    sendBtn.disabled = false;

    // Next question or wrap-up
    questionIndex++;
    if (questionIndex < questions.length) {
      appendMessage(questions[questionIndex], 'bot');
    } else {
      appendMessage('Parabéns! Você completou a simulação de entrevista. Continue praticando para se preparar ainda melhor! 🎉', 'bot');
      sendBtn.disabled  = true;
      userInput.disabled = true;
      userInput.placeholder = 'Simulação concluída.';
    }
  }

  /* --- Event listeners --- */
  sendBtn.addEventListener('click', sendMessage);

  userInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  /* --- Character counter for input --- */
  const MAX_CHARS = 500;
  userInput.addEventListener('input', () => {
    if (userInput.value.length > MAX_CHARS) {
      userInput.value = userInput.value.slice(0, MAX_CHARS);
    }
  });

})();
