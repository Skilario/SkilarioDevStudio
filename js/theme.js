// js/theme.js — Skilario Dev Studio
// Persistencia de Modo Noche con localStorage + prefers-color-scheme

(function () {
  'use strict';

  /* ─── 1. LEER PREFERENCIA AL CARGAR ──────────────────────── */
  function getPreferred() {
    const saved = localStorage.getItem('skilario-theme');
    if (saved === 'dark')  return true;
    if (saved === 'light') return false;
    // Sin valor guardado → respetar la preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /* ─── 2. APLICAR TEMA ────────────────────────────────────── */
  function applyTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);

    const darkIcon  = document.getElementById('darkIcon');
    const darkLabel = document.getElementById('darkLabel');

    if (darkIcon) {
      darkIcon.classList.toggle('fa-moon', !isDark);
      darkIcon.classList.toggle('fa-sun',   isDark);
    }
    if (darkLabel) {
      darkLabel.textContent = isDark ? 'Modo claro' : 'Modo noche';
    }

    // Color de la barra del navegador en el celu
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = isDark ? '#0d0f1a' : '#ffffff';
  }

  /* ─── 3. PERSISTIR ───────────────────────────────────────── */
  function saveTheme(isDark) {
    localStorage.setItem('skilario-theme', isDark ? 'dark' : 'light');
  }

  /* ─── 4. INICIALIZACIÓN (antes del DOMContentLoaded) ─────── */
  // Se aplica inmediatamente para evitar el "flash" de tema incorrecto
  const prefersDark = getPreferred();
  if (prefersDark) {
    document.documentElement.classList.add('dark-mode-preload');
  }

  /* ─── 5. BIND AL DOM ─────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    // Aplicar tema definitivo y sacar la clase temporal anti-flash
    applyTheme(getPreferred());
    document.documentElement.classList.remove('dark-mode-preload');

    const darkToggle = document.getElementById('darkToggle');
    if (!darkToggle) return;

    darkToggle.addEventListener('click', function () {
      const isDark = !document.body.classList.contains('dark-mode');
      applyTheme(isDark);
      saveTheme(isDark);
    });

    // Sincronizar si el sistema cambia de tema mientras la pestaña está abierta
    // y el usuario NO había guardado una preferencia manual
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem('skilario-theme')) {
        applyTheme(e.matches);
      }
    });
  });

})();
