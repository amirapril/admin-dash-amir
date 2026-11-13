/** Consistent page heading with optional action button on the right. */
export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
      <div>
        <h1 className="page-title mb-1">{title}</h1>
        {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
      </div>
      {actions && <div className="d-flex gap-2">{actions}</div>}
    </div>
  );
}
