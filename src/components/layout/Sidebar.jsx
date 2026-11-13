import { NavLink } from 'react-router-dom';

/** Navigation items — add a new object here to extend the menu. */
const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'speedometer2', end: true },
  { to: '/users', label: 'Users', icon: 'people-fill' },
  { to: '/orders', label: 'Orders', icon: 'bag-fill' },
];

/**
 * Sidebar navigation.
 * Rendered once; on mobile it slides in/out via the `open` class,
 * on desktop (≥992px) it is permanently visible (see app.css).
 */
export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Dimmed backdrop behind the drawer on small screens */}
      {open && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}

      <aside className={`app-sidebar ${open ? 'is-open' : ''}`}>
        <div className="sidebar-header">
          <span className="brand-logo">
            <i className="bi bi-graph-up-arrow" />
          </span>
          <span className="brand-name">Amir Admin</span>
          <button
            className="btn btn-sm btn-light sidebar-close d-lg-none ms-auto"
            onClick={onClose}
            aria-label="Close menu"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-section-title">Main</p>
          <ul className="nav flex-column gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `nav-link sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <i className={`bi bi-${item.icon}`} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <p className="sidebar-section-title mt-4">Account</p>
          <ul className="nav flex-column gap-1">
            <li>
              <NavLink to="/settings-missing" className="nav-link sidebar-link disabled" tabIndex={-1}>
                <i className="bi bi-gear-fill" />
                <span>Settings</span>
                <span className="badge text-bg-secondary ms-auto">Soon</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-upgrade">
            <i className="bi bi-lightning-charge-fill" />
            <div>
              <strong>Pro Plan</strong>
              <small className="d-block text-white-50">Renews on 15 Dey 1404</small>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
