/* =============================================
   PRIMEIRO PASSO — main.js
   Landing page interactions.
   ============================================= */

(function () {
  'use strict';

  /* --- Navbar scroll effect --- */
  const header = document.querySelector('header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Hamburger / mobile nav --- */
  const hamburger  = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    const toggleNav = (forceClose = false) => {
      const open = !forceClose && !hamburger.classList.contains('open');
      hamburger.classList.toggle('open', open);
      mobileNav.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => toggleNav());

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => toggleNav(true));
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') toggleNav(true);
    });
  }

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --- Intersection Observer: fade-in on scroll --- */
  const observerOpts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, observerOpts);

  document.querySelectorAll('.stat-card, .step, .feature-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`;
    el.classList.add('animate-on-scroll');
    io.observe(el);
  });

  document.addEventListener('animationReady', () => {
    document.querySelectorAll('.animate-on-scroll.visible').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });

  // Re-trigger when class added
  const styleObserver = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.type === 'attributes' && m.attributeName === 'class') {
        const el = m.target;
        if (el.classList.contains('visible')) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      }
    });
  });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    styleObserver.observe(el, { attributes: true });
  });

})();
