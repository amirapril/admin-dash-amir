import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-5">
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <h4 className="mb-2">Page not found</h4>
      <p className="text-muted">The page you are looking for doesn't exist or was moved.</p>
      <Link to="/" className="btn btn-primary">
        <i className="bi bi-house-door me-2" />
        Back to dashboard
      </Link>
    </div>
  );
}
