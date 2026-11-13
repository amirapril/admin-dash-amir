import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

/** Top navbar: menu toggle (mobile), search, dark mode, profile dropdown, logout. */
export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the profile menu when clicking anywhere else
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <nav className="app-topbar">
      {/* Hamburger — visible only on mobile, toggles the sidebar drawer */}
      <button className="btn btn-icon d-lg-none" onClick={onMenuClick} aria-label="Open menu">
        <i className="bi bi-list fs-4" />
      </button>

      <div className="topbar-search d-none d-md-block">
        <i className="bi bi-search" />
        <input type="search" placeholder="Search anything…" aria-label="Search" />
        <kbd>Ctrl K</kbd>
      </div>

      <div className="ms-auto d-flex align-items-center gap-1 gap-md-2">
        {/* Dark mode toggle */}
        <button
          className="btn btn-icon"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          <i className={`bi ${theme === 'light' ? 'bi-moon-stars-fill' : 'bi-brightness-high-fill'} fs-5`} />
        </button>

        {/* Notifications (decorative) */}
        <button className="btn btn-icon position-relative" aria-label="Notifications">
          <i className="bi bi-bell-fill fs-5" />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger">
            3
          </span>
        </button>

        {/* Profile dropdown */}
        <div className="position-relative" ref={menuRef}>
          <button className="profile-button" onClick={() => setMenuOpen((v) => !v)}>
            <span className="avatar">{initials}</span>
            <span className="d-none d-md-flex flex-column align-items-start lh-sm">
              <strong className="profile-name">{user?.name}</strong>
              <small className="text-muted">{user?.role}</small>
            </span>
            <i className="bi bi-chevron-down d-none d-md-inline ms-1 small text-muted" />
          </button>

          {menuOpen && (
            <div className="profile-menu shadow-sm">
              <div className="profile-menu-header">
                <strong>{user?.name}</strong>
                <small className="d-block text-muted">{user?.email}</small>
              </div>
              <button className="dropdown-item" onClick={() => setMenuOpen(false)}>
                <i className="bi bi-person me-2" /> My profile
              </button>
              <button className="dropdown-item" onClick={() => setMenuOpen(false)}>
                <i className="bi bi-sliders me-2" /> Preferences
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
