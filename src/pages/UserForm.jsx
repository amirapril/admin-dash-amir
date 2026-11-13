import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext.jsx';

import PageHeader from '../components/ui/PageHeader.jsx';
import Spinner from '../components/ui/Spinner.jsx';

const ROLES = ['Admin', 'Editor', 'Author', 'Viewer'];
const STATUSES = ['Active', 'Inactive', 'Pending'];

const EMPTY = { name: '', email: '', phone: '', role: '', status: 'Active' };

/**
 * Shared Add / Edit form.
 *  - /users/new      → create mode
 *  - /users/:id/edit → edit mode (prefilled from DataContext)
 */
export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, loading, addUser, editUser } = useData();

  const isEdit = Boolean(id);
  const editingUser = isEdit ? users.find((u) => String(u.id) === String(id)) : null;

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');

  // Prefill when editing (runs when the record is available)
  useEffect(() => {
    if (editingUser) {
      const { name, email, phone, role, status } = editingUser;
      setForm({ name, email, phone: phone || '', role, status });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  /** Validation — runs on submit, then live per field thanks to `errors`. */
  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Full name is required.';
    else if (form.name.trim().length < 3) next.name = 'Name must be at least 3 characters.';

    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = 'Enter a valid email address.';
    else if (
      users.some(
        (u) => u.email.toLowerCase() === form.email.trim().toLowerCase() && String(u.id) !== String(id)
      )
    )
      next.email = 'This email is already in use.';

    if (form.phone && !/^[0-9+\-\s()]{7,20}$/.test(form.phone.trim()))
      next.phone = 'Enter a valid phone number.';

    if (!form.role) next.role = 'Please select a role.';
    if (!form.status) next.status = 'Please select a status.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        joined: editingUser?.joined || new Date().toISOString().slice(0, 10),
      };

      if (isEdit) await editUser(Number(id), payload);
      else await addUser(payload);

      setSuccess(
        isEdit
          ? 'User updated successfully.'
          : 'User created successfully. You will be redirected to the list.'
      );

      if (!isEdit) {
        setTimeout(() => navigate('/users'), 1500);
      }
    } catch (err) {
      // Real API errors would land here
      setServerError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner label="Loading form…" />;

  if (isEdit && !editingUser) {
    return (
      <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
        <i className="bi bi-exclamation-triangle-fill" />
        User not found.
        <Link to="/users" className="ms-auto">Back to users</Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={isEdit ? 'Edit user' : 'Add new user'}
        subtitle={isEdit ? `Updating ${editingUser?.name}` : 'Fill in the details below to create an account.'}
        actions={
          <button className="btn btn-outline-secondary" onClick={() => navigate('/users')}>
            <i className="bi bi-arrow-left me-1" /> Back
          </button>
        }
      />

      {success && (
        <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-check-circle-fill" />
          {success}
          <Link to="/users" className="btn btn-sm btn-success ms-auto">Go to list</Link>
        </div>
      )}

      {serverError && (
        <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />
          {serverError}
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              {/* Full name */}
              <div className="col-12 col-md-6">
                <label htmlFor="name" className="form-label">
                  Full name <span className="text-danger">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="e.g. Sara Ahmadi"
                  value={form.name}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.name}</div>
              </div>

              {/* Email */}
              <div className="col-12 col-md-6">
                <label htmlFor="user-email" className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  id="user-email"
                  name="email"
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="user@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.email}</div>
              </div>

              {/* Phone */}
              <div className="col-12 col-md-6">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="0912 000 0000"
                  value={form.phone}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.phone}</div>
              </div>

              {/* Role */}
              <div className="col-12 col-md-6">
                <label htmlFor="role" className="form-label">
                  Role <span className="text-danger">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="">Select a role…</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <div className="invalid-feedback">{errors.role}</div>
              </div>

              {/* Status (radio pills) */}
              <div className="col-12">
                <label className="form-label">
                  Status <span className="text-danger">*</span>
                </label>
                <div className="d-flex flex-wrap gap-2" role="group" aria-label="Status">
                  {STATUSES.map((s) => (
                    <span key={s}>
                      <input
                        type="radio"
                        className="btn-check"
                        name="status"
                        id={`status-${s}`}
                        value={s}
                        checked={form.status === s}
                        onChange={handleChange}
                      />
                      <label className="btn btn-outline-primary" htmlFor={`status-${s}`}>
                        {s}
                      </label>
                    </span>
                  ))}
                </div>
                <div className="text-danger small mt-1">{errors.status}</div>
              </div>
            </div>

            <hr className="my-4" />

            <div className="d-flex flex-wrap gap-2 justify-content-end">
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/users')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Saving…
                  </>
                ) : isEdit ? (
                  <>Save changes</>
                ) : (
                  <><i className="bi bi-person-plus-fill me-1" /> Create user</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
