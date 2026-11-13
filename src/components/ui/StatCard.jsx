/**
 * KPI summary card used at the top of the dashboard.
 * `trend` is a percentage: positive → green up arrow, negative → red down arrow.
 */
export default function StatCard({ title, value, icon, iconColor = 'primary', trend, subtitle }) {
  const isUp = trend >= 0;

  return (
    <div className="card stat-card h-100 border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="stat-title mb-1">{title}</p>
            <h3 className="stat-value mb-1">{value}</h3>
            <small className="text-muted">{subtitle}</small>
          </div>
          <span className={`stat-icon text-bg-${iconColor}`}>
            <i className={`bi bi-${icon}`} />
          </span>
        </div>

        {trend !== undefined && (
          <div className="stat-trend mt-3">
            <span className={`badge ${isUp ? 'text-bg-success' : 'text-bg-danger'}`}>
              <i className={`bi bi-arrow-${isUp ? 'up' : 'down'}-short me-1`} />
              {Math.abs(trend)}%
            </span>
            <small className="text-muted ms-2">vs last month</small>
          </div>
        )}
      </div>
    </div>
  );
}
