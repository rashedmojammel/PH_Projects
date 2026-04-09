/* ============================================================
   deadline.js — Deadline utilities & reminder helpers
   ============================================================ */

const Deadline = (() => {

  /**
   * Returns deadline status for a job:
   *  'overdue'  — deadline passed
   *  'due-soon' — within 3 days
   *  'upcoming' — more than 3 days away
   *  null       — no deadline set
   */
  function getStatus(deadlineStr) {
    if (!deadlineStr) return null;
    const now      = new Date();
    const deadline = new Date(deadlineStr);
    // Normalize to midnight
    now.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0)  return 'overdue';
    if (diffDays <= 3) return 'due-soon';
    return 'upcoming';
  }

  /**
   * Returns a human-readable label: "Overdue", "Today", "In 2 days", "Mar 10"
   */
  function getLabel(deadlineStr) {
    if (!deadlineStr) return '';
    const now      = new Date();
    const deadline = new Date(deadlineStr);
    now.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0)  return `Overdue by ${Math.abs(diffDays)}d`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7)  return `Due in ${diffDays} days`;

    return 'Due ' + deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  /**
   * Returns jobs that are overdue or due within `days` days.
   * Used to show the reminder banner on page load.
   */
  function getUrgentJobs(jobs, days = 3) {
    return jobs.filter(j => {
      if (!j.deadline || j.status !== 'pending') return false;
      const s = getStatus(j.deadline);
      return s === 'overdue' || s === 'due-soon';
    });
  }

  /**
   * Builds the reminder banner message for multiple urgent jobs.
   */
  function buildBannerMessage(urgentJobs) {
    if (urgentJobs.length === 0) return '';
    if (urgentJobs.length === 1) {
      const j = urgentJobs[0];
      return `⏰ <strong>${j.company}</strong> — ${getLabel(j.deadline)}`;
    }
    return `⏰ <strong>${urgentJobs.length} jobs</strong> have upcoming or overdue deadlines`;
  }

  /**
   * Returns a CSS class string for the deadline tag on a card.
   */
  function getTagClass(deadlineStr) {
    const s = getStatus(deadlineStr);
    if (!s) return '';
    return `deadline-tag ${s}`;
  }

  return { getStatus, getLabel, getUrgentJobs, buildBannerMessage, getTagClass };
})();
