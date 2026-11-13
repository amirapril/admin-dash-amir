import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { monthlySales, recentActivity } from '../data/dummyData.js';

import PageHeader from '../components/ui/PageHeader.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import Spinner from '../components/ui/Spinner.jsx';

// Register only the Chart.js elements we use (tree-shaking friendly)
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Filler
);

// Chart colours adapt automatically to the current theme
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const formatMoney = (n) => `${n.toLocaleString('en-US')} Toman`;

/** Compact money for KPI cards so long numbers never wrap */
const formatMoneyShort = (n) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(2)}M Toman` : formatMoney(n);

export default function Dashboard() {
  const { user } = useAuth();
  const { users, orders, loading } = useData();
  const { theme } = useTheme(); // charts must re-read colours after a theme switch
  const [metric, setMetric] = useState('sales'); // 'sales' | 'users'

  /** KPI values derived from the loaded data */
  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.amount, 0);
    return {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === 'Active').length,
      totalOrders: orders.length,
      revenue,
      pending: orders.filter((o) => o.status === 'Pending').length,
    };
  }, [users, orders]);

  const lineData = useMemo(() => {
    const isSales = metric === 'sales';
    const values = monthlySales.map((m) => (isSales ? m.sales : m.users));
    const primary = cssVar('--bs-primary') || '#4f6bf5';

    return {
      labels: monthlySales.map((m) => m.month),
      datasets: [
        {
          label: isSales ? 'Sales (M Toman)' : 'New users',
          data: values,
          borderColor: primary,
          backgroundColor: (ctx) => {
            const { chart } = ctx;
            const area = chart.ctx.createLinearGradient(0, 0, 0, chart.height);
            area.addColorStop(0, 'rgba(79, 107, 245, 0.35)');
            area.addColorStop(1, 'rgba(79, 107, 245, 0.02)');
            return area;
          },
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: primary,
          borderWidth: 2.5,
        },
      ],
    };
  }, [metric, theme]);

  const lineOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: cssVar('--bs-body-color'),
          titleColor: cssVar('--bs-body-bg'),
          bodyColor: cssVar('--bs-body-bg'),
          padding: 10,
          cornerRadius: 8,
          displayColors: false,
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: cssVar('--bs-secondary-color') } },
        y: {
          beginAtZero: true,
          grid: { color: cssVar('--bs-border-color') },
          ticks: { color: cssVar('--bs-secondary-color') },
        },
      },
    }),
    [metric, theme]
  );

  const doughnutData = useMemo(() => {
    const byStatus = (s) => orders.filter((o) => o.status === s).length;
    return {
      labels: ['Completed', 'Pending', 'Cancelled'],
      datasets: [
        {
          data: [byStatus('Completed'), byStatus('Pending'), byStatus('Cancelled')],
          backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    };
  }, [orders, theme]);

  const latestOrders = orders.slice(0, 5);

  if (loading) return <Spinner label="Loading dashboard…" />;

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Here's what's happening with your project today."
        actions={
          <Link to="/users/new" className="btn btn-primary">
            <i className="bi bi-plus-lg me-1" /> New user
          </Link>
        }
      />

      {/* ── Summary cards ─────────────────────────────── */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Total Users" value={stats.totalUsers} icon="people-fill"
            iconColor="primary" trend={12} subtitle={`${stats.activeUsers} active`} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Total Orders" value={stats.totalOrders} icon="bag-fill"
            iconColor="success" trend={8} subtitle="Lifetime orders" />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Revenue" value={formatMoneyShort(stats.revenue)} icon="currency-exchange"
            iconColor="info" trend={-3} subtitle="Excluding cancelled" />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Pending Orders" value={stats.pending} icon="hourglass-split"
            iconColor="warning" trend={5} subtitle="Needs your attention" />
        </div>
      </div>

      {/* ── Charts row ────────────────────────────────── */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent d-flex justify-content-between align-items-center pt-3">
              <div>
                <h5 className="mb-0">Performance overview</h5>
                <small className="text-muted">Last 12 months</small>
              </div>
              <div className="btn-group btn-group-sm" role="group" aria-label="Chart metric">
                <button
                  type="button"
                  className={`btn ${metric === 'sales' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setMetric('sales')}
                >
                  Sales
                </button>
                <button
                  type="button"
                  className={`btn ${metric === 'users' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setMetric('users')}
                >
                  Users
                </button>
              </div>
            </div>
            <div className="card-body">
              {/* Fixed height container keeps Chart.js responsive */}
              <div style={{ height: 300 }}>
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent pt-3">
              <h5 className="mb-0">Orders by status</h5>
              <small className="text-muted">Current period</small>
            </div>
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <div style={{ height: 210, width: 210 }}>
                <Doughnut
                  data={doughnutData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          usePointStyle: true,
                          boxWidth: 8,
                          color: cssVar('--bs-body-color'),
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Activity + latest orders ──────────────────── */}
      <div className="row g-3 g-md-4">
        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent">
              <h5 className="mb-0">Recent activity</h5>
            </div>
            <ul className="list-group list-group-flush">
              {recentActivity.map((a) => (
                <li key={a.id} className="list-group-item d-flex gap-3 bg-transparent">
                  <span className={`activity-icon text-bg-${a.color}`}>
                    <i className={`bi bi-${a.icon}`} />
                  </span>
                  <div className="flex-grow-1">
                    <p className="mb-0 small fw-semibold">{a.text}</p>
                    <small className="text-muted">{a.detail}</small>
                  </div>
                  <small className="text-nowrap text-muted">{a.time}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Latest orders</h5>
              <Link to="/orders" className="btn btn-sm btn-outline-primary">
                View all <i className="bi bi-arrow-right" />
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="small text-muted">
                    <th className="ps-3">Order</th>
                    <th>Customer</th>
                    <th className="d-none d-md-table-cell">Date</th>
                    <th className="text-end">Amount</th>
                    <th className="pe-3 text-end">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {latestOrders.map((o) => (
                    <tr key={o.id}>
                      <td className="ps-3 fw-semibold">{o.id}</td>
                      <td>{o.customer}</td>
                      <td className="d-none d-md-table-cell text-muted">{o.date}</td>
                      <td className="text-end">{formatMoney(o.amount)}</td>
                      <td className="pe-3 text-end">
                        <StatusBadge value={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
