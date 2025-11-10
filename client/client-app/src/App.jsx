import useFetch from "./useFetch";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AlertCard from "./ui/AlertCard.jsx";
import ResourceCard from "./ui/ResourceCard.jsx";
import AlertsPage from "./AlertsPage.jsx";
import LoginPage from "./LoginPage.jsx";
import SignupPage from "./SignupPage.jsx";
function App() {
  // Fetch alerts and resources from backend (only 3 for home page)
  const { data: alerts, loading: loading1, error: error1 } = useFetch(
    "http://localhost:5000/api/home/alerts"
  );
  const { data: resources, loading: loading2, error: error2 } = useFetch(
    "http://localhost:5000/api/home/resources"
  );

  // Handle loading/error states
  if (loading1 || loading2) return <div>Loading...</div>;
  if (error1 || error2) return <div>Error: {error1 || error2}</div>;

  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <nav>
        <h3>
          <p>ResQnet</p>
        </h3>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/create">Menu</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="banner">
                <h1 align="center">Disaster Response Platform</h1>
              </div>

              {/* Alerts Section */}
              <div className="alerts">
                <h2><Link to="/alerts">Alerts</Link></h2>
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

              {/* Resources Section */}
              <div className="resources">
                <h2><Link to="/resources">Resources</Link></h2>
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
            </>
          }
        />
        
        {/* Alerts Page Route */}
        <Route path="/alerts" element={<AlertsPage />} />
        
        {/* Resources Page */}
        <Route path="/resources" element={<div>Resources Page</div>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;