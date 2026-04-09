/* ============================================================
   storage.js — LocalStorage helpers for auth & job data
   ============================================================ */

const Storage = (() => {
  const KEYS = {
    USERS:   'jt_users',
    SESSION: 'jt_session',
    JOBS:    'jt_jobs_',     // prefix + username
    NEXT_ID: 'jt_nextid_',  // prefix + username
    THEME:   'jt_theme',
  };

  /* ── Helpers ── */
  function get(key)        { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
  function set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function remove(key)     { localStorage.removeItem(key); }

  /* ── Users ── */
  function getUsers()         { return get(KEYS.USERS) || {}; }
  function saveUsers(users)   { set(KEYS.USERS, users); }

  function registerUser(name, email, password) {
    const users = getUsers();
    if (users[email]) return { ok: false, error: 'Email already registered.' };
    users[email] = { name, email, password: btoa(password), createdAt: Date.now() };
    saveUsers(users);
    return { ok: true };
  }

  function loginUser(email, password) {
    const users = getUsers();
    const user  = users[email];
    if (!user)                        return { ok: false, error: 'No account found with this email.' };
    if (user.password !== btoa(password)) return { ok: false, error: 'Incorrect password.' };
    return { ok: true, user: { name: user.name, email } };
  }

  function getUserByEmail(email) {
    const users = getUsers();
    return users[email] || null;
  }

  function updatePassword(email, newPassword) {
    const users = getUsers();
    if (!users[email]) return false;
    users[email].password = btoa(newPassword);
    saveUsers(users);
    return true;
  }

  /* ── Session ── */
  function getSession()            { return get(KEYS.SESSION); }
  function setSession(user, remember) {
    set(KEYS.SESSION, { ...user, remember, ts: Date.now() });
  }
  function clearSession()          { remove(KEYS.SESSION); }
  function isLoggedIn()            { return !!getSession(); }

  /* ── Jobs ── */
  function jobKey(email)    { return KEYS.JOBS   + email; }
  function idKey(email)     { return KEYS.NEXT_ID + email; }

  const DEFAULT_JOBS = [
    { id: 1, company: "TechNova Solutions",    title: "Frontend Developer",         location: "Dhaka",     type: "Full-time", salary: "৳80,000 - ৳120,000",    desc: "Develop responsive web interfaces using React and Tailwind CSS.",                   status: "pending", deadline: "" },
    { id: 2, company: "DataSphere Inc",        title: "Data Analyst",              location: "Remote",    type: "Contract",  salary: "$60,000 - $85,000",       desc: "Analyze business data and generate insights using Python and Power BI.",           status: "pending", deadline: "" },
    { id: 3, company: "CloudBridge Ltd",       title: "DevOps Engineer",           location: "Singapore", type: "Full-time", salary: "$95,000 - $130,000",      desc: "Manage CI/CD pipelines and deploy scalable cloud infrastructure.",                 status: "pending", deadline: "" },
    { id: 4, company: "AI Core Labs",          title: "Machine Learning Engineer", location: "Remote",    type: "Full-time", salary: "$110,000 - $150,000",     desc: "Build and optimize deep learning models for NLP applications.",                    status: "pending", deadline: "" },
    { id: 5, company: "FinEdge Technologies",  title: "Backend Developer (.NET)",  location: "London",    type: "Hybrid",    salary: "£70,000 - £95,000",       desc: "Develop secure financial APIs using ASP.NET Core and SQL Server.",                 status: "pending", deadline: "" },
    { id: 6, company: "CyberSecure Pro",       title: "Cybersecurity Analyst",     location: "Dubai",     type: "Full-time", salary: "$75,000 - $100,000",      desc: "Monitor security threats and implement vulnerability assessments.",               status: "pending", deadline: "" },
    { id: 7, company: "PixelCraft Studio",     title: "UI/UX Designer",            location: "Toronto",   type: "Part-time", salary: "$45,000 - $65,000",       desc: "Design modern and intuitive web and mobile interfaces.",                           status: "pending", deadline: "" },
    { id: 8, company: "NextGen Robotics",      title: "Embedded Systems Engineer", location: "Germany",   type: "Full-time", salary: "€85,000 - €110,000",      desc: "Develop firmware for next-generation robotics hardware systems.",                  status: "pending", deadline: "" },
  ];

  function getJobs(email) {
    const saved = get(jobKey(email));
    if (saved) return saved;
    // First login — seed with defaults
    const jobs = JSON.parse(JSON.stringify(DEFAULT_JOBS));
    set(jobKey(email), jobs);
    set(idKey(email), 100);
    return jobs;
  }

  function saveJobs(email, jobs) { set(jobKey(email), jobs); }

  function getNextId(email) {
    const id = get(idKey(email)) || 100;
    set(idKey(email), id + 1);
    return id;
  }

  /* ── Theme ── */
  function getTheme()       { return get(KEYS.THEME) || 'light'; }
  function setTheme(theme)  { set(KEYS.THEME, theme); }

  return {
    registerUser, loginUser, getUserByEmail, updatePassword,
    getSession, setSession, clearSession, isLoggedIn,
    getJobs, saveJobs, getNextId,
    getTheme, setTheme,
  };
})();
