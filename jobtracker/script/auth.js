/* ============================================================
   auth.js — Login / Register / Forgot Password page logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Redirect to dashboard if already logged in
  if (Storage.isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  // Apply saved theme
  document.documentElement.setAttribute('data-theme', Storage.getTheme());

  // ── Views ──
  const views = {
    login:   document.getElementById('view-login'),
    register:document.getElementById('view-register'),
    forgot:  document.getElementById('view-forgot'),
    otp:     document.getElementById('view-otp'),
    reset:   document.getElementById('view-reset'),
    success: document.getElementById('view-success'),
  };

  let activeView = 'login';
  let pendingResetEmail = '';
  let fakeOtp = '';
  let otpTimer = null;

  function showView(name) {
    Object.values(views).forEach(v => { if (v) v.classList.add('hidden'); });
    if (views[name]) views[name].classList.remove('hidden');
    activeView = name;
  }

  // ── NAV LINKS ──
  const toRegister = document.querySelectorAll('[data-goto="register"]');
  const toLogin    = document.querySelectorAll('[data-goto="login"]');
  const toForgot   = document.querySelectorAll('[data-goto="forgot"]');

  toRegister.forEach(el => el.addEventListener('click', () => showView('register')));
  toLogin.forEach(el    => el.addEventListener('click', () => showView('login')));
  toForgot.forEach(el   => el.addEventListener('click', () => showView('forgot')));

  // ======================================================
  // LOGIN
  // ======================================================
  const loginForm    = document.getElementById('login-form');
  const loginEmail   = document.getElementById('login-email');
  const loginPass    = document.getElementById('login-pass');
  const loginRemember = document.getElementById('login-remember');

  if (loginForm) {
    // Toggle password visibility
    setupToggle('login-pass', 'toggle-login-pass');

    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      clearErrors(['login-email-err', 'login-pass-err']);

      const email = loginEmail.value.trim();
      const pass  = loginPass.value;

      let valid = true;
      if (!email || !isValidEmail(email)) { showError('login-email-err', 'Enter a valid email.'); valid = false; }
      if (!pass)                          { showError('login-pass-err',  'Password is required.'); valid = false; }
      if (!valid) return;

      const result = Storage.loginUser(email, pass);
      if (!result.ok) {
        Toast.show(result.error, 'error');
        if (result.error.includes('password')) showError('login-pass-err', result.error);
        else showError('login-email-err', result.error);
        return;
      }

      Storage.setSession(result.user, loginRemember?.checked);
      Toast.show(`Welcome back, ${result.user.name}! 👋`, 'success', 1500);
      setTimeout(() => window.location.href = 'index.html', 1000);
    });
  }

  // ======================================================
  // REGISTER
  // ======================================================
  const registerForm = document.getElementById('register-form');

  if (registerForm) {
    setupToggle('reg-pass', 'toggle-reg-pass');
    setupToggle('reg-confirm', 'toggle-reg-confirm');

    const passInput = document.getElementById('reg-pass');
    if (passInput) passInput.addEventListener('input', () => updateStrength(passInput.value));

    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      clearErrors(['reg-name-err','reg-email-err','reg-pass-err','reg-confirm-err']);

      const name    = document.getElementById('reg-name').value.trim();
      const email   = document.getElementById('reg-email').value.trim();
      const pass    = document.getElementById('reg-pass').value;
      const confirm = document.getElementById('reg-confirm').value;

      let valid = true;
      if (!name)                    { showError('reg-name-err',    'Name is required.'); valid = false; }
      if (!isValidEmail(email))     { showError('reg-email-err',   'Enter a valid email.'); valid = false; }
      if (pass.length < 6)          { showError('reg-pass-err',    'Minimum 6 characters.'); valid = false; }
      if (pass !== confirm)         { showError('reg-confirm-err', 'Passwords do not match.'); valid = false; }
      if (!valid) return;

      const result = Storage.registerUser(name, email, pass);
      if (!result.ok) { showError('reg-email-err', result.error); Toast.show(result.error, 'error'); return; }

      Toast.show('Account created! Please log in.', 'success');
      showView('login');
    });
  }

  // ======================================================
  // FORGOT PASSWORD — Step 1: Enter Email
  // ======================================================
  const forgotForm = document.getElementById('forgot-form');

  if (forgotForm) {
    forgotForm.addEventListener('submit', e => {
      e.preventDefault();
      clearErrors(['forgot-email-err']);

      const email = document.getElementById('forgot-email').value.trim();
      if (!isValidEmail(email)) { showError('forgot-email-err', 'Enter a valid email.'); return; }

      const user = Storage.getUserByEmail(email);
      if (!user) { showError('forgot-email-err', 'No account found with this email.'); return; }

      pendingResetEmail = email;
      fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // In a real app you'd send an email — here we show OTP in a toast for demo
      Toast.show(`OTP sent! (Demo: ${fakeOtp})`, 'info', 8000);
      showView('otp');
      startOtpTimer();
    });
  }

  // ======================================================
  // OTP — Step 2: Verify Code
  // ======================================================
  const otpInputs = document.querySelectorAll('.otp-input');
  const verifyOtpBtn = document.getElementById('verify-otp-btn');

  // Auto-advance OTP fields
  otpInputs.forEach((input, i) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(0, 1);
      if (input.value && i < otpInputs.length - 1) otpInputs[i + 1].focus();
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !input.value && i > 0) otpInputs[i - 1].focus();
    });
  });

  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', () => {
      const entered = [...otpInputs].map(i => i.value).join('');
      if (entered.length < 6) { Toast.show('Enter all 6 digits.', 'error'); return; }
      if (entered !== fakeOtp) { Toast.show('Incorrect OTP. Try again.', 'error'); return; }
      clearInterval(otpTimer);
      showView('reset');
    });
  }

  // OTP Timer (60 seconds)
  function startOtpTimer() {
    let secs = 60;
    const timerEl  = document.getElementById('otp-timer');
    const resendBtn = document.getElementById('resend-btn');
    if (resendBtn) resendBtn.disabled = true;

    clearInterval(otpTimer);
    otpTimer = setInterval(() => {
      secs--;
      if (timerEl) timerEl.textContent = `Resend in ${secs}s`;
      if (secs <= 0) {
        clearInterval(otpTimer);
        if (timerEl) timerEl.textContent = '';
        if (resendBtn) resendBtn.disabled = false;
      }
    }, 1000);
  }

  const resendBtn = document.getElementById('resend-btn');
  if (resendBtn) {
    resendBtn.addEventListener('click', () => {
      fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();
      Toast.show(`New OTP sent! (Demo: ${fakeOtp})`, 'info', 8000);
      otpInputs.forEach(i => i.value = '');
      otpInputs[0]?.focus();
      startOtpTimer();
    });
  }

  // ======================================================
  // RESET PASSWORD — Step 3
  // ======================================================
  const resetForm = document.getElementById('reset-form');

  if (resetForm) {
    setupToggle('new-pass', 'toggle-new-pass');
    setupToggle('confirm-new-pass', 'toggle-confirm-new-pass');

    resetForm.addEventListener('submit', e => {
      e.preventDefault();
      clearErrors(['new-pass-err','confirm-new-pass-err']);

      const pass    = document.getElementById('new-pass').value;
      const confirm = document.getElementById('confirm-new-pass').value;

      let valid = true;
      if (pass.length < 6)  { showError('new-pass-err',          'Minimum 6 characters.'); valid = false; }
      if (pass !== confirm)  { showError('confirm-new-pass-err',  'Passwords do not match.'); valid = false; }
      if (!valid) return;

      Storage.updatePassword(pendingResetEmail, pass);
      showView('success');
    });
  }

  const backToLoginBtn = document.getElementById('back-to-login');
  if (backToLoginBtn) backToLoginBtn.addEventListener('click', () => showView('login'));

  // ======================================================
  // UTILS
  // ======================================================
  function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
  }

  function clearErrors(ids) { ids.forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('show'); }); }

  function setupToggle(inputId, btnId) {
    const input = document.getElementById(inputId);
    const btn   = document.getElementById(btnId);
    if (!input || !btn) return;
    btn.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.innerHTML = show
        ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
        : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    });
  }

  function updateStrength(pass) {
    const bars  = document.querySelectorAll('.strength-bar');
    const label = document.querySelector('.strength-label');
    if (!bars.length) return;

    let score = 0;
    if (pass.length >= 6)              score++;
    if (pass.length >= 10)             score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass))            score++;
    if (/[^A-Za-z0-9]/.test(pass))    score++;

    const levels = [
      { color: 'var(--red)',   text: 'Weak' },
      { color: 'var(--red)',   text: 'Weak' },
      { color: 'var(--amber)', text: 'Fair' },
      { color: 'var(--amber)', text: 'Good' },
      { color: 'var(--green)', text: 'Strong' },
      { color: 'var(--green)', text: 'Very strong' },
    ];

    const level = levels[Math.min(score, 5)];
    bars.forEach((bar, i) => {
      bar.style.background = i < score ? level.color : 'var(--border)';
    });
    if (label) label.textContent = pass ? level.text : '';
  }

  // Init
  showView('login');
});
