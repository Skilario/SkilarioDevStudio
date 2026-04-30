// script.js — Skilario Development Studio
// Lógica general: hamburger, scroll, animaciones, navbar

document.addEventListener('DOMContentLoaded', function () {

  /* ─── MENÚ HAMBURGUESA ──────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  /* ─── NAVBAR AL HACER SCROLL ────────────────────────────── */
  const navbar = document.querySelector('.navbar');

  function updateNavbar() {
    if (!navbar) return;
    const isDark = document.body.classList.contains('dark-mode');
    if (window.scrollY > 50) {
      navbar.style.background = isDark ? 'rgba(13,13,13,0.97)' : 'rgba(255,255,255,0.97)';
      navbar.style.boxShadow  = '0 2px 20px rgba(0,0,0,0.12)';
    } else {
      navbar.style.background = isDark ? 'rgba(13,13,13,0.88)' : 'rgba(255,255,255,0.85)';
      navbar.style.boxShadow  = '0 2px 10px rgba(0,0,0,0.05)';
    }
  }

  window.addEventListener('scroll', updateNavbar);
  updateNavbar();

  // Re-evaluar cuando cambia la clase dark-mode en body
  new MutationObserver(updateNavbar).observe(document.body, {
    attributes: true, attributeFilter: ['class']
  });

  /* ─── ANIMACIONES AL HACER SCROLL (Fade-in Up con stagger) ── */
  const animatedEls = document.querySelectorAll('.animate-on-scroll');
  if (animatedEls.length) {
    // Aplicar transition-delay desde la clase .delay-N
    animatedEls.forEach(el => {
      const delayClass = [...el.classList].find(c => c.startsWith('delay-'));
      if (delayClass) {
        const n = parseInt(delayClass.replace('delay-', ''), 10);
        el.style.transitionDelay = (n * 0.1) + 's';
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Dejar de observar una vez animado (performance)
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    animatedEls.forEach(el => observer.observe(el));
  }

  /* ─── SMOOTH SCROLL para botones de Volver / Ver Servicios ─ */
  document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.scrollTo);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ─── FORMULARIO DE CONTACTO ────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('¡Gracias por contactar a SKILARIO! Te responderemos a la brevedad.');
      contactForm.reset();
    });
  }

});
