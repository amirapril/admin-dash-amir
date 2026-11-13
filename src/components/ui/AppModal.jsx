import { useEffect } from 'react';

/**
 * Lightweight accessible modal (no Bootstrap JS required).
 * Closes on Escape and on backdrop click.
 */
export default function AppModal({ show, title, onClose, children, footer }) {
  useEffect(() => {
    if (!show) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content shadow">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
