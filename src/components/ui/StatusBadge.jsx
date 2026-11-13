/** Maps a record status to a Bootstrap badge class. */
const STYLES = {
  Active: 'text-bg-success',
  Completed: 'text-bg-success',
  Inactive: 'text-bg-secondary',
  Pending: 'text-bg-warning',
  Cancelled: 'text-bg-danger',
  Admin: 'text-bg-primary',
  Editor: 'text-bg-info',
  Author: 'text-bg-secondary',
  Viewer: 'text-bg-light',
};

export default function StatusBadge({ value }) {
  const cls = STYLES[value] || 'text-bg-secondary';
  // `Viewer` uses light badge → keep text readable in dark mode
  const extra = value === 'Viewer' ? ' text-dark' : '';
  return <span className={`badge ${cls}${extra}`}>{value}</span>;
}
