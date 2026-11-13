import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext.jsx';

import PageHeader from '../components/ui/PageHeader.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import AppModal from '../components/ui/AppModal.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Spinner from '../components/ui/Spinner.jsx';

const PAGE_SIZE = 6; // rows per page
const ROLES = ['Admin', 'Editor', 'Author', 'Viewer'];
const STATUSES = ['Active', 'Inactive', 'Pending'];

const getInitials = (name) =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

export default function Users() {
  const { users, loading, removeUser } = useData();
  const navigate = useNavigate();

  // ── Filter / search state ──────────────────────────
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);

  // ── Delete confirmation ────────────────────────────
  const [toDelete, setToDelete] = useState(null); // user object
  const [flash, setFlash] = useState(''); // success message after an action

  // Return to page 1 whenever the filters change
  useEffect(() => {
    setPage(1);
  }, [search, role, status]);

  // Auto-hide the success message
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(''), 3000);
    return () => clearTimeout(t);
  }, [flash]);

  /** Filtering + searching happens in memory (would be query params with a real API) */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesRole = role === 'All' || u.role === role;
      const matchesStatus = status === 'All' || u.status === status;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, role, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async () => {
    await removeUser(toDelete.id);
    setFlash(`${toDelete.name} was deleted.`);
    setToDelete(null);
  };

  if (loading) return <Spinner label="Loading users…" />;

  return (
    <>
      <PageHeader
        title="Users"
        subtitle={`${filtered.length} of ${users.length} users`}
        actions={
          <Link to="/users/new" className="btn btn-primary">
            <i className="bi bi-person-plus-fill me-1" /> Add user
          </Link>
        }
      />

      {flash && (
        <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-check-circle-fill" />
          {flash}
          <button type="button" className="btn-close ms-auto" onClick={() => setFlash('')} aria-label="Close" />
        </div>
      )}

      <div className="card border-0 shadow-sm">
        {/* ── Toolbar: search + filters ──────────────── */}
        <div className="card-body border-bottom">
          <div className="row g-2">
            <div className="col-12 col-lg-5">
              <div className="input-group">
                <span className="input-group-text bg-body-secondary">
                  <i className="bi bi-search" />
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search by name or email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search users"
                />
                {search && (
                  <button className="input-group-text" onClick={() => setSearch('')} aria-label="Clear search">
                    <i className="bi bi-x-lg" />
                  </button>
                )}
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                aria-label="Filter by role"
              >
                <option value="All">All roles</option>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="col-6 col-lg-3">
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="All">All statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="col-12 col-lg-1 d-grid">
              <button
                className="btn btn-outline-secondary"
                onClick={() => { setSearch(''); setRole('All'); setStatus('All'); }}
                title="Reset filters"
              >
                <i className="bi bi-arrow-counterclockwise" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Data table ─────────────────────────────── */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-muted">
                <th className="ps-3">Name</th>
                <th className="d-none d-md-table-cell">Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="d-none d-lg-table-cell">Joined</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon="search"
                      title="No users found"
                      message="Try changing your search or filters."
                    />
                  </td>
                </tr>
              ) : (
                pageRows.map((u) => (
                  <tr key={u.id}>
                    <td className="ps-3">
                      <div className="d-flex align-items-center gap-2">
                        <span className="avatar-sm">{getInitials(u.name)}</span>
                        <div className="lh-sm">
                          <div className="fw-semibold">{u.name}</div>
                          <small className="text-muted d-md-none">{u.email}</small>
                        </div>
                      </div>
                    </td>
                    <td className="d-none d-md-table-cell text-muted">{u.email}</td>
                    <td><StatusBadge value={u.role} /></td>
                    <td><StatusBadge value={u.status} /></td>
                    <td className="d-none d-lg-table-cell text-muted">{u.joined}</td>
                    <td className="text-end pe-3">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          title="Edit"
                          onClick={() => navigate(`/users/${u.id}/edit`)}
                        >
                          <i className="bi bi-pencil-fill" />
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          title="Delete"
                          onClick={() => setToDelete(u)}
                        >
                          <i className="bi bi-trash3-fill" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card-footer bg-transparent">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* ── Delete confirmation modal ────────────────── */}
      <AppModal
        show={!!toDelete}
        title="Delete user"
        onClose={() => setToDelete(null)}
        footer={
          <>
            <button className="btn btn-outline-secondary" onClick={() => setToDelete(null)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              <i className="bi bi-trash3 me-1" /> Delete
            </button>
          </>
        }
      >
        <p className="mb-1">Are you sure you want to delete this user?</p>
        <p className="mb-0 fw-semibold">{toDelete?.name} — {toDelete?.email}</p>
        <small className="text-muted">This action cannot be undone.</small>
      </AppModal>
    </>
  );
}
