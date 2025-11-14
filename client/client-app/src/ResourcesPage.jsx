import useFetch from './useFetch';
import ResourceCard from './ui/ResourceCard';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function ResourcesPage() {
  const { data: resources, loading, error } = useFetch('http://localhost:5000/api/resources');
  const navigate = useNavigate();

  if (loading) return <div className="loading">Loading resources...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const center = { lat: 22.9734, lng: 78.6569 }; // Centered roughly over India

  return (
    <div className="resources-page">
      {/* Header */}
      <div className="resources-header">
        <h1>All Resources</h1>
        <button className="create-resource-btn" onClick={() => navigate('/create-resource')}>
          + Add Resource
        </button>
      </div>

      {/*  Google Map Section */}
      <div className="map-container">
        <h2>Available Resources Map</h2>
        <LoadScript googleMapsApiKey="AIzaSyB1ioD8kpDXyC8x32_hCc42tuv398m3t50">
          <GoogleMap
            mapContainerClassName="google-map"
            center={center}
            zoom={5}
          >
            {resources &&
              resources.map((res) => (
                <Marker
                  key={res._id}
                  position={{ lat: res.lat, lng: res.lng }}
                  title={`${res.name} - ${res.location}`}
                />
              ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Resource Cards */}
      <div className="card-container">
        {resources && resources.length > 0 ? (
          resources.map((res) => <ResourceCard key={res._id} resource={res} />)
        ) : (
          <p>No resources available.</p>
        )}
      </div>
    </div>
  );
}

export default ResourcesPage;
