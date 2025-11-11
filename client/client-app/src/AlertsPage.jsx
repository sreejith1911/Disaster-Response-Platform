import useFetch from './useFetch';
import AlertCard from './ui/AlertCard';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function AlertsPage() {
  const { data: alerts, loading, error } = useFetch('http://localhost:5000/api/alerts');
  const navigate = useNavigate();

  if (loading) return <div className="loading">Loading alerts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '12px',
  };

  const center = { lat: 22.9734, lng: 78.6569 }; // Centered on India

  return (
    <div className="alerts-page">
      {/* Header with Button */}
      <div className="alerts-header">
        <h1>All Alerts</h1>
        <button className="create-alert-btn" onClick={() => navigate('/create-alert')}>
          + Create New Alert
        </button>
      </div>

      {/* ✅ Google Map Section */}
      <div className="map-container">
        <h2>Affected Areas Map</h2>
        <LoadScript googleMapsApiKey="AIzaSyB1ioD8kpDXyC8x32_hCc42tuv398m3t50">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={5}
          >
            {alerts &&
              alerts.map((alert) => (
                <Marker
                  key={alert._id}
                  position={{ lat: alert.lat, lng: alert.lng }}
                  title={`${alert.alertTitle || 'Alert'} - ${alert.location}`}
                />
              ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Alert cards */}
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
