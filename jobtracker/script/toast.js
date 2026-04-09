/* ============================================================
   toast.js — Toast notification helper
   ============================================================ */

const Toast = (() => {
  function show(msg, type = 'info', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<div class="toast-dot"></div><span>${msg}</span>`;
    container.appendChild(el);

    el.addEventListener('click', () => dismiss(el));
    setTimeout(() => dismiss(el), duration);
  }

  function dismiss(el) {
    el.classList.add('hide');
    setTimeout(() => el.remove(), 320);
  }

  return { show };
})();
