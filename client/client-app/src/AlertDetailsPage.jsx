import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {
  ArrowLeft,
  MapPin,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import useFetch from './useFetch';
import './App.css';

function AlertDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: alert, loading, error } = useFetch(`http://localhost:5000/api/alerts/${id}`);

  if (loading) return <div className="loading">Loading alert details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!alert) return <div className="error">Alert not found.</div>;

  const center = { lat: alert.lat, lng: alert.lng };
  
  // Safely get alert level with fallback
  const alertLevel = alert.alertLevel?.toLowerCase() || 'info';

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate('/alerts')}>
        <ArrowLeft size={18} style={{ marginRight: '6px' }} /> Back to All Alerts
      </button>

      <div className={`detail-card ${alertLevel}-alert`}>
        <div className="detail-header">
          <AlertTriangle size={28} color="#ef4444" />
          <h1>{alert.alertTitle || 'Alert'}</h1>
        </div>

        <div className="meta-info">
          <p><MapPin size={16} /> {alert.location || 'Unknown location'}</p>
          <p><Clock size={16} /> {alert.time || 'Unknown time'}</p>
        </div>

        <h3>Description</h3>
        <p>{alert.description || 'No description available.'}</p>
      </div>

      <div className="map-container">
        <h2>Location Map</h2>
        <LoadScript googleMapsApiKey="AIzaSyB1ioD8kpDXyC8x32_hCc42tuv398m3t50">
          <GoogleMap
            mapContainerClassName="google-map"
            center={center}
            zoom={10}
          >
            <Marker position={center} title={alert.alertTitle || 'Alert Location'} />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}

export default AlertDetailsPage;