/** Centered loading spinner used while dummy API calls resolve. */
export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{label}</span>
      </div>
      <p className="text-muted small mt-2 mb-0">{label}</p>
    </div>
  );
}
