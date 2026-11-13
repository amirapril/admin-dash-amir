import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

/**
 * Login page — split-screen layout.
 * Features: validation, show/hide password, remember me, error alerts.
 */
export default function Login() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill email if "remember me" was used on a previous visit
  useEffect(() => {
    const saved = localStorage.getItem('dashboard_remembered_email');
    if (saved) setForm((f) => ({ ...f, email: saved }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    // Clear the field's error as soon as the user types
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  /** Client-side validation (email format + password length). */
  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = 'Please enter a valid email address.';

    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    const res = await login({ ...form, email: form.email.trim() });
    setSubmitting(false);

    if (!res.ok) {
      setServerError(res.message);
      return;
    }

    // Remember the email for the next visit
    if (form.remember) localStorage.setItem('dashboard_remembered_email', form.email.trim());
    else localStorage.removeItem('dashboard_remembered_email');

    // Redirect to the page the user originally tried to open
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  return (
    <div className="login-page">
      {/* Left brand panel (hidden on small screens) */}
      <div className="login-brand d-none d-lg-flex">
        <div className="login-brand-content">
          <span className="login-logo">
            <i className="bi bi-graph-up-arrow" />
          </span>
          <h2 className="text-white mt-4 mb-3">Novin Admin</h2>
          <p className="text-white-50 mb-4">
            A clean, responsive admin panel built with React Hooks, Context API,
            Bootstrap and Chart.js.
          </p>
          <ul className="list-unstyled login-features">
            <li><i className="bi bi-check-circle-fill me-2" /> Data tables with search &amp; filters</li>
            <li><i className="bi bi-check-circle-fill me-2" /> Charts and KPI summary cards</li>
            <li><i className="bi bi-check-circle-fill me-2" /> Dark mode &amp; fully responsive</li>
          </ul>
        </div>
        <div className="login-brand-shapes" aria-hidden="true" />
      </div>

      {/* Right form panel */}
      <div className="login-form-panel">
        <div className="login-form-wrap">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="mb-1">Welcome back</h3>
              <p className="text-muted mb-0">Sign in to continue to your dashboard.</p>
            </div>
            <button
              type="button"
              className="btn btn-icon"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              <i className={`bi ${theme === 'light' ? 'bi-moon-stars-fill' : 'bi-brightness-high-fill'} fs-5`} />
            </button>
          </div>

          {/* Demo credentials hint */}
          <div className="alert alert-info small py-2 d-flex align-items-center gap-2" role="alert">
            <i className="bi bi-info-circle-fill" />
            <span>
              Demo: <strong>admin@novin.dev</strong> / <strong>admin123</strong>
            </span>
          </div>

          {serverError && (
            <div className="alert alert-danger d-flex align-items-start gap-2" role="alert">
              <i className="bi bi-exclamation-triangle-fill mt-1" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-envelope" /></span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>

            {/* Password + show/hide toggle */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <label htmlFor="password" className="form-label">Password</label>
                <a href="#!" className="small text-decoration-none" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              </div>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock" /></span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-group-text"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
            </div>

            {/* Remember me */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="form-check-input"
                  checked={form.remember}
                  onChange={handleChange}
                />
                <label htmlFor="remember" className="form-check-label small">Remember me</label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Signing in…
                </>
              ) : (
                <>Sign in <i className="bi bi-arrow-right ms-1" /></>
              )}
            </button>
          </form>

          <p className="text-center text-muted small mt-4 mb-0">
            © {new Date().getFullYear()} Novin Admin · Portfolio project
          </p>
        </div>
      </div>
    </div>
  );
}
