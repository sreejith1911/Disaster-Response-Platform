import useFetch from './useFetch';
import ResourceCard from './ui/ResourceCard';
import './App.css';
import { useNavigate } from 'react-router-dom'; // ✅ added

function ResourcesPage() {
  const { data: resources, loading, error } = useFetch('http://localhost:5000/api/resources');
  const navigate = useNavigate(); // ✅ added

  if (loading) return <div className="loading">Loading resources...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="resources-page">
      <div className="resources-header">
        <h1>All Resources</h1>
        <button className="create-resource-btn" onClick={() => navigate('/create-resource')}>
          + Add Resource
        </button>
      </div>

      <div className="card-container">
        {resources && resources.length > 0 ? (
          resources.map((res) => (
            <ResourceCard key={res._id} resource={res} />
          ))
        ) : (
          <p>No resources available.</p>
        )}
      </div>
    </div>
  );
}

export default ResourcesPage;
