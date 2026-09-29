// script.js — Skilario Development Studio
// Lógica general: hamburger, scroll, animaciones, navbar

document.addEventListener('DOMContentLoaded', function () {

  /* ─── MENÚ HAMBURGUESA (mobile) ───────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('.nav-menu');
  const navbarEl  = document.querySelector('.navbar');

  // Altura real del navbar → la usa el CSS para ubicar el menú y los saltos a secciones
  function setNavHeight() {
    if (navbarEl) document.documentElement.style.setProperty('--nav-h', navbarEl.offsetHeight + 'px');
  }
  setNavHeight();
  window.addEventListener('resize', setNavHeight);

  if (hamburger && navMenu) {
    // Accesible como botón
    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('tabindex', '0');
    hamburger.setAttribute('aria-label', 'Abrir menú');
    hamburger.setAttribute('aria-expanded', 'false');

    // Botón de WhatsApp al final del menú (solo se ve en celu)
    const ctaLi = document.createElement('li');
    ctaLi.className = 'nav-cta-li';
    ctaLi.innerHTML = '<a href="https://wa.me/542374031298?text=Hola%20Skilario!%20Quiero%20hablar%20de%20un%20proyecto" target="_blank" rel="noopener" class="btn-grad nav-cta"><i class="fab fa-whatsapp"></i> Escribinos por WhatsApp</a>';
    navMenu.appendChild(ctaLi);

    const setMenu = (open) => {
      hamburger.classList.toggle('active', open);
      navMenu.classList.toggle('active', open);
      document.body.classList.toggle('menu-open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    };
    const toggle = () => setMenu(!navMenu.classList.contains('active'));

    hamburger.addEventListener('click', toggle);
    hamburger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
    navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 1000) setMenu(false); });
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

  /* ─── COPIAR ALIAS DE PAGO ──────────────────────────────── */
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text  = btn.dataset.copy;
      const label = btn.querySelector('span');
      const done  = () => {
        btn.classList.add('copied');
        if (label) label.textContent = '¡Copiado!';
        setTimeout(() => { btn.classList.remove('copied'); if (label) label.textContent = text; }, 2000);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done).catch(() => fallback());
      } else { fallback(); }
      function fallback() {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        ta.remove();
      }
    });
  });

});
