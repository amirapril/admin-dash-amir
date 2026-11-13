/** Shown when a filtered list has no results. */
export default function EmptyState({ icon = 'inbox', title = 'Nothing here yet', message }) {
  return (
    <div className="text-center py-5">
      <i className={`bi bi-${icon} display-5 text-muted`} />
      <h6 className="mt-3 mb-1">{title}</h6>
      {message && <p className="text-muted small mb-0">{message}</p>}
    </div>
  );
}
