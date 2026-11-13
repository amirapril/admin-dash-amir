/**
 * Shared pagination control.
 * @param {number} page      — current page (1-based)
 * @param {number} totalPages
 * @param {function} onPageChange
 */
export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Show a compact window of page numbers around the current page
  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }

  return (
    <nav className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
      <small className="text-muted">Page {page} of {totalPages}</small>

      <ul className="pagination pagination-sm mb-0">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page - 1)} aria-label="Previous">
            <i className="bi bi-chevron-left" />
          </button>
        </li>

        {pages.map((p, i) =>
          p === '…' ? (
            <li key={`gap-${i}`} className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          ) : (
            <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(p)}>
                {p}
              </button>
            </li>
          )
        )}

        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page + 1)} aria-label="Next">
            <i className="bi bi-chevron-right" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
