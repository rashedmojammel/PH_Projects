/* ============================================================
   app.js — Main Job Tracker Dashboard
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Auth Guard ──
  const session = Storage.getSession();
  if (!session) { window.location.href = 'auth.html'; return; }

  // ── Apply Theme ──
  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    Storage.setTheme(t);
    document.getElementById('sun-icon').style.display  = t === 'dark' ? 'none' : '';
    document.getElementById('moon-icon').style.display = t === 'dark' ? ''     : 'none';
  };
  applyTheme(Storage.getTheme());

  // ── State ──
  let jobs          = Storage.getJobs(session.email);
  let currentFilter = 'all';
  let currentView   = 'list';
  let searchQuery   = '';

  // ── User chip ──
  const initials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  document.getElementById('user-avatar').textContent = initials(session.name);
  document.getElementById('user-name').textContent   = session.name.split(' ')[0];

  document.getElementById('user-chip').addEventListener('click', () => {
    Storage.clearSession();
    window.location.href = 'auth.html';
  });

  // ── Dark mode ──
  document.getElementById('dark-toggle').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  });

  // ======================================================
  // REMINDER BANNER
  // ======================================================
  function renderReminderBanner() {
    const banner  = document.getElementById('reminder-banner');
    const msgEl   = document.getElementById('reminder-msg');
    const urgents = Deadline.getUrgentJobs(jobs);
    if (urgents.length === 0) { banner.classList.add('hidden'); return; }
    msgEl.innerHTML = Deadline.buildBannerMessage(urgents);
    banner.classList.remove('hidden');
  }

  document.getElementById('close-reminder').addEventListener('click', () => {
    document.getElementById('reminder-banner').classList.add('hidden');
  });

  // ======================================================
  // STATS & PROGRESS
  // ======================================================
  function updateStats() {
    const total     = jobs.length;
    const interview = jobs.filter(j => j.status === 'interview').length;
    const rejected  = jobs.filter(j => j.status === 'rejected').length;
    const pending   = jobs.filter(j => j.status === 'pending').length;

    document.getElementById('stat-total').textContent     = total;
    document.getElementById('stat-interview').textContent = interview;
    document.getElementById('stat-rejected').textContent  = rejected;
    document.getElementById('stat-pending').textContent   = pending;

    const pct = n => total ? Math.round((n / total) * 100) : 0;
    document.getElementById('bar-interview').style.width = pct(interview) + '%';
    document.getElementById('bar-rejected').style.width  = pct(rejected)  + '%';
    document.getElementById('bar-pending').style.width   = pct(pending)   + '%';

    const rate = total ? Math.round(((interview + rejected) / total) * 100) : 0;
    document.getElementById('progress-label').textContent = rate + '% response rate';
  }

  // ======================================================
  // FILTER & SEARCH
  // ======================================================
  function getFiltered() {
    return jobs.filter(j => {
      const matchFilter = currentFilter === 'all' || j.status === currentFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        j.company.toLowerCase().includes(q) ||
        j.title.toLowerCase().includes(q)   ||
        j.location.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }

  // ======================================================
  // RENDER LIST
  // ======================================================
  function jobInitials(company) {
    return company.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  function renderList() {
    const container = document.getElementById('list-view');
    const emptyEl   = document.getElementById('empty-state');
    const filtered  = getFiltered();

    document.getElementById('job-count-label').textContent =
      filtered.length + ' job' + (filtered.length !== 1 ? 's' : '');

    container.innerHTML = '';

    if (filtered.length === 0) {
      emptyEl.style.display = 'block';
      return;
    }
    emptyEl.style.display = 'none';

    filtered.forEach((job, i) => {
      const card = document.createElement('div');
      const dl   = job.deadline ? Deadline.getStatus(job.deadline) : null;
      card.className = `job-card status-${job.status}${dl === 'overdue' ? ' overdue' : ''}`;
      card.style.animationDelay = (i * 0.04) + 's';
      card.dataset.id = job.id;

      const badgeClass = job.status === 'interview' ? 'badge-interview'
                       : job.status === 'rejected'  ? 'badge-rejected'
                       : 'badge-pending';
      const badgeText = job.status === 'pending' ? 'NOT APPLIED' : job.status.toUpperCase();

      const deadlineHTML = job.deadline
        ? `<div class="${Deadline.getTagClass(job.deadline)}">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              ${Deadline.getLabel(job.deadline)}
           </div>`
        : '';

      card.innerHTML = `
        <div class="job-avatar">${jobInitials(job.company)}</div>
        <div class="job-info">
          <div class="job-company">${job.company}</div>
          <div class="job-title-row">
            <span class="job-title-text">${job.title}</span>
            <span class="badge ${badgeClass}">${badgeText}</span>
          </div>
          <div class="job-meta">${job.location} · ${job.type} · ${job.salary}</div>
          ${deadlineHTML}
          <div class="job-desc-text">${job.desc}</div>
          <div class="card-actions">
            <button class="action-btn interview-btn" data-action="interview" data-id="${job.id}">INTERVIEW</button>
            <button class="action-btn rejected-btn"  data-action="rejected"  data-id="${job.id}">REJECTED</button>
          </div>
        </div>
        <div class="card-top-right">
          <button class="delete-btn" data-action="delete" data-id="${job.id}" title="Delete">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // ======================================================
  // RENDER KANBAN
  // ======================================================
  function renderKanban() {
    const cols = {
      pending:   document.getElementById('k-pending'),
      interview: document.getElementById('k-interview'),
      rejected:  document.getElementById('k-rejected'),
    };
    Object.values(cols).forEach(c => c.innerHTML = '');
    const counts = { pending: 0, interview: 0, rejected: 0 };

    jobs.forEach(job => {
      const col = cols[job.status];
      if (!col) return;
      counts[job.status]++;

      const card = document.createElement('div');
      card.className = 'kanban-card';

      const deadlineHTML = job.deadline
        ? `<div class="kanban-card-deadline">📅 ${Deadline.getLabel(job.deadline)}</div>`
        : '';

      card.innerHTML = `
        <div class="kanban-card-company">${job.company}</div>
        <div class="kanban-card-title">${job.title}</div>
        ${deadlineHTML}
        <div class="kanban-card-actions">
          <button class="kaction interview" data-action="interview" data-id="${job.id}">Interview</button>
          <button class="kaction rejected"  data-action="rejected"  data-id="${job.id}">Rejected</button>
          <button class="kaction remove"    data-action="delete"    data-id="${job.id}">Remove</button>
        </div>
      `;
      col.appendChild(card);
    });

    document.getElementById('k-pending-count').textContent   = counts.pending;
    document.getElementById('k-interview-count').textContent = counts.interview;
    document.getElementById('k-rejected-count').textContent  = counts.rejected;
  }

  // ======================================================
  // RENDER ALL
  // ======================================================
  function render() {
    updateStats();
    renderReminderBanner();
    if (currentView === 'list') renderList();
    else                        renderKanban();
    Storage.saveJobs(session.email, jobs);
  }

  // ======================================================
  // ACTIONS
  // ======================================================
  function handleAction(action, id) {
    const job = jobs.find(j => j.id == id);
    if (!job) return;

    switch (action) {
      case 'interview':
        if (job.status === 'interview') return;
        job.status = 'interview';
        Toast.show(`🎉 ${job.company} → Interview!`, 'success');
        break;
      case 'rejected':
        if (job.status === 'rejected') return;
        job.status = 'rejected';
        Toast.show(`${job.company} marked as rejected`, 'error');
        break;
      case 'delete':
        if (!confirm(`Remove "${job.company}" from your tracker?`)) return;
        jobs = jobs.filter(j => j.id != id);
        Toast.show('Job removed', 'warning');
        break;
    }

    render();
  }

  // ── Event delegation ──
  document.getElementById('list-view').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (btn) handleAction(btn.dataset.action, btn.dataset.id);
  });

  document.getElementById('kanban-view').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (btn) handleAction(btn.dataset.action, btn.dataset.id);
  });

  // ======================================================
  // FILTER TABS
  // ======================================================
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderList();
    });
  });

  // ======================================================
  // SEARCH
  // ======================================================
  document.getElementById('search-input').addEventListener('input', e => {
    searchQuery = e.target.value;
    if (currentView === 'list') renderList();
  });

  // ======================================================
  // VIEW TOGGLE
  // ======================================================
  document.getElementById('list-view-btn').addEventListener('click', () => {
    currentView = 'list';
    document.getElementById('list-view-btn').classList.add('active');
    document.getElementById('kanban-view-btn').classList.remove('active');
    document.getElementById('list-view').style.display   = '';
    document.getElementById('kanban-view').style.display = 'none';
    document.getElementById('empty-state').style.display = '';
    document.querySelector('.filter-tabs').style.display  = '';
    renderList();
  });

  document.getElementById('kanban-view-btn').addEventListener('click', () => {
    currentView = 'kanban';
    document.getElementById('kanban-view-btn').classList.add('active');
    document.getElementById('list-view-btn').classList.remove('active');
    document.getElementById('list-view').style.display   = 'none';
    document.getElementById('kanban-view').style.display = 'grid';
    document.getElementById('empty-state').style.display = 'none';
    document.querySelector('.filter-tabs').style.display  = 'none';
    renderKanban();
  });

  // ======================================================
  // ADD JOB MODAL
  // ======================================================
  const modalOverlay = document.getElementById('modal-overlay');

  function openModal(prefill = null) {
    if (prefill) {
      document.getElementById('f-company').value  = prefill.company || '';
      document.getElementById('f-title').value    = prefill.title   || '';
      document.getElementById('f-location').value = prefill.location || '';
      document.getElementById('f-salary').value   = prefill.salary  || '';
      document.getElementById('f-desc').value     = prefill.desc    || '';
      document.getElementById('f-deadline').value = prefill.deadline || '';
    }
    modalOverlay.classList.add('open');
    document.getElementById('f-company').focus();
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.getElementById('add-job-form').reset();
    clearModalErrors();
  }

  function clearModalErrors() {
    document.querySelectorAll('#add-job-form .form-error').forEach(e => e.classList.remove('show'));
  }

  document.getElementById('add-job-btn').addEventListener('click', () => openModal());
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

  document.getElementById('modal-submit').addEventListener('click', () => {
    clearModalErrors();

    const company  = document.getElementById('f-company').value.trim();
    const title    = document.getElementById('f-title').value.trim();
    const location = document.getElementById('f-location').value.trim();
    const type     = document.getElementById('f-type').value;
    const salary   = document.getElementById('f-salary').value.trim();
    const desc     = document.getElementById('f-desc').value.trim();
    const deadline = document.getElementById('f-deadline').value;

    let valid = true;
    if (!company) { showModalError('f-company-err', 'Company name is required.'); valid = false; }
    if (!title)   { showModalError('f-title-err',   'Job title is required.');    valid = false; }
    if (!valid) return;

    const newJob = {
      id:       Storage.getNextId(session.email),
      company, title,
      location: location || 'N/A',
      type,
      salary:   salary || 'Not specified',
      desc:     desc   || 'No description provided.',
      deadline,
      status: 'pending',
    };

    jobs.unshift(newJob);
    closeModal();
    Toast.show(`${company} added to tracker!`, 'info');
    render();
  });

  function showModalError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
  }

  // ======================================================
  // EXPORT CSV
  // ======================================================
  document.getElementById('export-btn').addEventListener('click', () => {
    const headers = ['Company', 'Title', 'Location', 'Type', 'Salary', 'Deadline', 'Status', 'Description'];
    const rows    = jobs.map(j =>
      [j.company, j.title, j.location, j.type, j.salary, j.deadline || '', j.status, j.desc]
        .map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
    );
    const csv  = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'job-applications.csv'; a.click();
    URL.revokeObjectURL(url);
    Toast.show('CSV exported!', 'success');
  });

  // ── Init ──
  render();
});
