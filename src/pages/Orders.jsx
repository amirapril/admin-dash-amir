import { useState, useEffect, useMemo } from 'react';
import { useData } from '../context/DataContext.jsx';

import PageHeader from '../components/ui/PageHeader.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import AppModal from '../components/ui/AppModal.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Spinner from '../components/ui/Spinner.jsx';

const PAGE_SIZE = 8;
const STATUSES = ['Pending', 'Completed', 'Cancelled'];

const formatMoney = (n) => `${n.toLocaleString('en-US')} Toman`;

export default function Orders() {
  const { orders, loading, changeOrderStatus } = useData();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null); // order opened in the detail modal
  const [savingId, setSavingId] = useState(null);

  useEffect(() => setPage(1), [search, status]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q);
      const matchesStatus = status === 'All' || o.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /** Inline status change (PATCH /orders/:id/status with a real API) */
  const handleStatusChange = async (order, nextStatus) => {
    setSavingId(order.id);
    await changeOrderStatus(order.id, nextStatus);
    setSavingId(null);
    // Keep the open modal in sync with the fresh record
    setSelected((prev) => (prev?.id === order.id ? { ...prev, status: nextStatus } : prev));
  };

  if (loading) return <Spinner label="Loading orders…" />;

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle={`${filtered.length} of ${orders.length} orders`}
        actions={
          <button className="btn btn-outline-secondary" onClick={() => { setSearch(''); setStatus('All'); }}>
            <i className="bi bi-arrow-counterclockwise me-1" /> Reset
          </button>
        }
      />

      <div className="card border-0 shadow-sm">
        {/* ── Search + status filter ─────────────────── */}
        <div className="card-body border-bottom">
          <div className="row g-2">
            <div className="col-12 col-lg-7">
              <div className="input-group">
                <span className="input-group-text bg-body-secondary">
                  <i className="bi bi-search" />
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search by order ID, customer or product…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search orders"
                />
              </div>
            </div>
            <div className="col-12 col-lg-5">
              <div className="d-flex gap-2 flex-wrap">
                <div className="btn-group flex-grow-1" role="group" aria-label="Filter by status">
                  {['All', ...STATUSES].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setStatus(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Table ──────────────────────────────────── */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-muted">
                <th className="ps-3">Order</th>
                <th>Customer</th>
                <th className="d-none d-md-table-cell">Product</th>
                <th className="d-none d-lg-table-cell">Date</th>
                <th className="text-end">Amount</th>
                <th>Status</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon="bag-x" title="No orders found" message="Try a different search." />
                  </td>
                </tr>
              ) : (
                pageRows.map((o) => (
                  <tr key={o.id}>
                    <td className="ps-3 fw-semibold">{o.id}</td>
                    <td>{o.customer}</td>
                    <td className="d-none d-md-table-cell text-muted">{o.product}</td>
                    <td className="d-none d-lg-table-cell text-muted">{o.date}</td>
                    <td className="text-end">{formatMoney(o.amount)}</td>
                    <td>
                      {/* Change status directly from the table */}
                      <select
                        className={`form-select form-select-sm status-select ${savingId === o.id ? 'opacity-50' : ''}`}
                        value={o.status}
                        onChange={(e) => handleStatusChange(o, e.target.value)}
                        aria-label={`Status for ${o.id}`}
                        disabled={savingId === o.id}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="text-end pe-3">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setSelected(o)}
                      >
                        <i className="bi bi-eye-fill me-1" /> Details
                      </button>
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

      {/* ── Order detail modal ─────────────────────── */}
      <AppModal show={!!selected} title={`Order ${selected?.id || ''}`} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small">Placed on</span>
              <span className="fw-semibold">{selected.date}</span>
            </div>
            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item d-flex justify-content-between px-0">
                <span className="text-muted">Customer</span>
                <span className="fw-semibold">{selected.customer}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between px-0">
                <span className="text-muted">Product</span>
                <span className="fw-semibold">{selected.product}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between px-0">
                <span className="text-muted">Amount</span>
                <span className="fw-semibold">{formatMoney(selected.amount)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between px-0">
                <span className="text-muted">Status</span>
                <StatusBadge value={selected.status} />
              </li>
            </ul>
          </>
        )}
      </AppModal>
    </>
  );
}
