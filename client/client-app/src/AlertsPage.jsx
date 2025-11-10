import useFetch from './useFetch';
import AlertCard from './ui/AlertCard';
import './App.css';

function AlertsPage() {
  const { data: alerts, loading, error } = useFetch('http://localhost:5000/api/alerts');

  if (loading) return <div className="loading">Loading alerts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="alerts-page">
      <h1>All Alerts</h1>
      <div className="card-container">
        {alerts && alerts.length > 0 ? (
          alerts.map((alert) => (
            <AlertCard key={alert._id} alert={alert} />
          ))
        ) : (
          <p>No alerts available.</p>
        )}
      </div>
    </div>
  );
}

export default AlertsPage;