import useFetch from './useFetch';
import AlertCard from './ui/AlertCard';
import './App.css';
import { useNavigate } from 'react-router-dom'; // ✅ added

function AlertsPage() {
  const { data: alerts, loading, error } = useFetch('http://localhost:5000/api/alerts');
  const navigate = useNavigate(); // ✅ added

  if (loading) return <div className="loading">Loading alerts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="alerts-page">
      {/* ✅ Flex container with button on the RIGHT */}
      <div className="alerts-header">
        <h1>All Alerts</h1>
        <button className="create-alert-btn" onClick={() => navigate('/create-alert')}>
          + Create New Alert
        </button>
      </div>

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
