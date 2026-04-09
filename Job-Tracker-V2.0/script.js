// ===== STATE =====
const DEFAULT_JOBS = [
  { id: 1, company: "TechNova Solutions", title: "Frontend Developer", location: "Dhaka", type: "Full-time", salary: "৳80,000 - ৳120,000", desc: "Develop responsive web interfaces using React and Tailwind CSS.", status: "pending" },
  { id: 2, company: "DataSphere Inc", title: "Data Analyst", location: "Remote", type: "Contract", salary: "$60,000 - $85,000", desc: "Analyze business data and generate insights using Python and Power BI.", status: "pending" },
  { id: 3, company: "CloudBridge Ltd", title: "DevOps Engineer", location: "Singapore", type: "Full-time", salary: "$95,000 - $130,000", desc: "Manage CI/CD pipelines and deploy scalable cloud infrastructure.", status: "pending" },
  { id: 4, company: "AI Core Labs", title: "Machine Learning Engineer", location: "Remote", type: "Full-time", salary: "$110,000 - $150,000", desc: "Build and optimize deep learning models for NLP applications.", status: "pending" },
  { id: 5, company: "FinEdge Technologies", title: "Backend Developer (.NET)", location: "London", type: "Hybrid", salary: "£70,000 - £95,000", desc: "Develop secure financial APIs using ASP.NET Core and SQL Server.", status: "pending" },
  { id: 6, company: "CyberSecure Pro", title: "Cybersecurity Analyst", location: "Dubai", type: "Full-time", salary: "$75,000 - $100,000", desc: "Monitor security threats and implement vulnerability assessments.", status: "pending" },
  { id: 7, company: "PixelCraft Studio", title: "UI/UX Designer", location: "Toronto", type: "Part-time", salary: "$45,000 - $65,000", desc: "Design modern and intuitive web and mobile interfaces.", status: "pending" },
  { id: 8, company: "NextGen Robotics", title: "Embedded Systems Engineer", location: "Germany", type: "Full-time", salary: "€85,000 - €110,000", desc: "Develop firmware for next-generation robotics hardware systems.", status: "pending" },
];

let jobs = [];
let currentFilter = 'all';
let currentView = 'list';
let searchQuery = '';
let nextId = 100;

// ===== LOCAL STORAGE =====
function saveJobs() {
  localStorage.setItem('jobtracker_jobs', JSON.stringify(jobs));
  localStorage.setItem('jobtracker_nextid', String(nextId));
}

function loadJobs() {
  const saved = localStorage.getItem('jobtracker_jobs');
  const savedId = localStorage.getItem('jobtracker_nextid');
  if (saved) {
    jobs = JSON.parse(saved);
    nextId = savedId ? parseInt(savedId) : 100;
  } else {
    jobs = JSON.parse(JSON.stringify(DEFAULT_JOBS));
    saveJobs();
  }
}

// ===== DARK MODE =====
function initDarkMode() {
  const saved = localStorage.getItem('jobtracker_theme');
  if (saved === 'dark') setDark(true);
}

function setDark(on) {
  document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light');
  localStorage.setItem('jobtracker_theme', on ? 'dark' : 'light');
  document.getElementById('sun-icon').style.display = on ? 'none' : '';
  document.getElementById('moon-icon').style.display = on ? '' : 'none';
}

document.getElementById('dark-toggle').addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  setDark(!isDark);
});

// ===== TOAST =====
function toast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<div class="toast-dot"></div><span>${msg}</span>`;
  container.appendChild(el);
  el.addEventListener('click', () => dismiss(el));
  setTimeout(() => dismiss(el), 3500);
}

function dismiss(el) {
  el.classList.add('hide');
  setTimeout(() => el.remove(), 300);
}

// ===== HELPERS =====
function initials(company) {
  return company.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function getFiltered() {
  return jobs.filter(j => {
    const matchFilter = currentFilter === 'all' || j.status === currentFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || j.company.toLowerCase().includes(q) || j.title.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });
}

// ===== STATS & PROGRESS =====
function updateStats() {
  const total = jobs.length;
  const interview = jobs.filter(j => j.status === 'interview').length;
  const rejected = jobs.filter(j => j.status === 'rejected').length;
  const pending = jobs.filter(j => j.status === 'pending').length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-interview').textContent = interview;
  document.getElementById('stat-rejected').textContent = rejected;
  document.getElementById('stat-pending').textContent = pending;

  const pct = n => total ? Math.round((n / total) * 100) : 0;
  document.getElementById('bar-interview').style.width = pct(interview) + '%';
  document.getElementById('bar-rejected').style.width = pct(rejected) + '%';
  document.getElementById('bar-pending').style.width = pct(pending) + '%';

  const responseRate = total ? Math.round(((interview + rejected) / total) * 100) : 0;
  document.getElementById('progress-label').textContent = responseRate + '% response rate';
}

// ===== RENDER LIST =====
function renderList() {
  const container = document.getElementById('list-view');
  const empty = document.getElementById('empty-state');
  const filtered = getFiltered();

  document.getElementById('job-count-label').textContent = filtered.length + ' job' + (filtered.length !== 1 ? 's' : '');
  container.innerHTML = '';

  if (filtered.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  filtered.forEach((job, i) => {
    const card = document.createElement('div');
    card.className = `job-card status-${job.status}`;
    card.style.animationDelay = (i * 0.04) + 's';
    card.dataset.id = job.id;

    const badgeClass = job.status === 'interview' ? 'badge-interview' : job.status === 'rejected' ? 'badge-rejected' : 'badge-pending';
    const badgeText = job.status === 'pending' ? 'NOT APPLIED' : job.status.toUpperCase();

    card.innerHTML = `
      <div class="job-avatar">${initials(job.company)}</div>
      <div class="job-info">
        <div class="job-company">${job.company}</div>
        <div class="job-title-text">${job.title}</div>
        <div class="job-meta">${job.location} • ${job.type} • ${job.salary}</div>
        <div class="job-motive-text">${job.desc}</div>
        <div class="card-actions">
          <button class="action-btn interview-btn" data-action="interview" data-id="${job.id}">INTERVIEW</button>
          <button class="action-btn rejected-btn" data-action="rejected" data-id="${job.id}">REJECTED</button>
          <span class="badge ${badgeClass}">${badgeText}</span>
        </div>
      </div>
      <div class="card-top-right">
        <button class="delete-btn" data-action="delete" data-id="${job.id}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// ===== RENDER KANBAN =====
function renderKanban() {
  const kPending = document.getElementById('k-pending');
  const kInterview = document.getElementById('k-interview');
  const kRejected = document.getElementById('k-rejected');

  kPending.innerHTML = '';
  kInterview.innerHTML = '';
  kRejected.innerHTML = '';

  const makeCard = (job) => {
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.innerHTML = `
      <div class="kanban-card-company">${job.company}</div>
      <div class="kanban-card-title">${job.title}</div>
      <div class="kanban-card-salary">${job.location} • ${job.salary}</div>
      <div class="kanban-card-actions">
        <button class="kaction interview" data-action="interview" data-id="${job.id}">Interview</button>
        <button class="kaction rejected" data-action="rejected" data-id="${job.id}">Rejected</button>
        <button class="kaction remove" data-action="delete" data-id="${job.id}">Remove</button>
      </div>
    `;
    return card;
  };

  let pc = 0, ic = 0, rc = 0;
  jobs.forEach(job => {
    if (job.status === 'pending') { kPending.appendChild(makeCard(job)); pc++; }
    else if (job.status === 'interview') { kInterview.appendChild(makeCard(job)); ic++; }
    else if (job.status === 'rejected') { kRejected.appendChild(makeCard(job)); rc++; }
  });

  document.getElementById('k-pending-count').textContent = pc;
  document.getElementById('k-interview-count').textContent = ic;
  document.getElementById('k-rejected-count').textContent = rc;
}

// ===== RENDER ALL =====
function render() {
  updateStats();
  if (currentView === 'list') renderList();
  else renderKanban();
}

// ===== ACTIONS =====
function handleAction(action, id) {
  const job = jobs.find(j => j.id == id);
  if (!job) return;

  if (action === 'interview') {
    if (job.status === 'interview') return;
    job.status = 'interview';
    toast(`🎉 ${job.company} → Interview!`, 'success');
  } else if (action === 'rejected') {
    if (job.status === 'rejected') return;
    job.status = 'rejected';
    toast(`${job.company} marked as rejected`, 'error');
  } else if (action === 'delete') {
    jobs = jobs.filter(j => j.id != id);
    toast('Job removed', 'warning');
  }

  saveJobs();
  render();
}

// ===== EVENT DELEGATION =====
document.getElementById('list-view').addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (btn) handleAction(btn.dataset.action, btn.dataset.id);
});

document.getElementById('kanban-view').addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (btn) handleAction(btn.dataset.action, btn.dataset.id);
});

// ===== FILTER TABS =====
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    render();
  });
});

// ===== SEARCH =====
document.getElementById('search-input').addEventListener('input', e => {
  searchQuery = e.target.value;
  render();
});

// ===== VIEW TOGGLE =====
document.getElementById('list-view-btn').addEventListener('click', () => {
  currentView = 'list';
  document.getElementById('list-view-btn').classList.add('active');
  document.getElementById('kanban-view-btn').classList.remove('active');
  document.getElementById('list-view').style.display = '';
  document.getElementById('kanban-view').style.display = 'none';
  document.getElementById('empty-state').style.display = '';
  document.querySelector('.filter-tabs').style.display = '';
  render();
});

document.getElementById('kanban-view-btn').addEventListener('click', () => {
  currentView = 'kanban';
  document.getElementById('kanban-view-btn').classList.add('active');
  document.getElementById('list-view-btn').classList.remove('active');
  document.getElementById('list-view').style.display = 'none';
  document.getElementById('empty-state').style.display = 'none';
  document.getElementById('kanban-view').style.display = 'grid';
  document.querySelector('.filter-tabs').style.display = 'none';
  render();
});

// ===== MODAL =====
function openModal() {
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('f-company').focus();
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  ['f-company','f-title','f-location','f-salary','f-desc'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('f-type').selectedIndex = 0;
}

document.getElementById('add-job-btn').addEventListener('click', openModal);
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-cancel').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

document.getElementById('modal-submit').addEventListener('click', () => {
  const company = document.getElementById('f-company').value.trim();
  const title = document.getElementById('f-title').value.trim();
  if (!company || !title) {
    toast('Company and title are required', 'error');
    return;
  }
  const newJob = {
    id: nextId++,
    company,
    title,
    location: document.getElementById('f-location').value.trim() || 'N/A',
    type: document.getElementById('f-type').value,
    salary: document.getElementById('f-salary').value.trim() || 'Not specified',
    desc: document.getElementById('f-desc').value.trim() || 'No description provided.',
    status: 'pending'
  };
  jobs.unshift(newJob);
  saveJobs();
  closeModal();
  toast(`${company} added!`, 'info');
  render();
});

// ===== EXPORT CSV =====
document.getElementById('export-btn').addEventListener('click', () => {
  const headers = ['Company', 'Title', 'Location', 'Type', 'Salary', 'Status', 'Description'];
  const rows = jobs.map(j => [j.company, j.title, j.location, j.type, j.salary, j.status, j.desc]
    .map(v => `"${String(v).replace(/"/g,'""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'job-applications.csv';
  a.click();
  URL.revokeObjectURL(url);
  toast('CSV exported!', 'success');
});

// ===== INIT =====
initDarkMode();
loadJobs();
render();