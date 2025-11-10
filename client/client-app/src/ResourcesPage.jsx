import useFetch from './useFetch';
import ResourceCard from './ui/ResourceCard';
import './App.css';

function ResourcesPage() {
  const { data: resources, loading, error } = useFetch('http://localhost:5000/api/resources');

  if (loading) return <div className="loading">Loading resources...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="resources-page">
      <h1>All Resources</h1>
      <div className="card-container">
        {resources && resources.length > 0 ? (
          resources.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} />
          ))
        ) : (
          <p>No resources available.</p>
        )}
      </div>
    </div>
  );
}

export default ResourcesPage;