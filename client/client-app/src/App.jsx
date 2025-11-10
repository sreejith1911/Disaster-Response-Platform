import useFetch from "./useFetch";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AlertCard from "./ui/AlertCard.jsx";
import ResourceCard from "./ui/ResourceCard.jsx";
import AlertsPage from "./AlertsPage.jsx";
import ResourcesPage from "./ResourcesPage.jsx";
import LoginPage from "./LoginPage.jsx";
import SignupPage from "./SignupPage.jsx";
import CreateAlertPage from './CreateAlertPage';
import CreateResourcePage from './CreateResourcePage';


function App() {
  const { data: alerts, loading: loading1, error: error1 } = useFetch(
    "http://localhost:5000/api/home/alerts"
  );
  const { data: resources, loading: loading2, error: error2 } = useFetch(
    "http://localhost:5000/api/home/resources"
  );

  if (loading1 || loading2) return <div>Loading...</div>;
  if (error1 || error2) return <div>Error: {error1 || error2}</div>;

  return (
    <BrowserRouter>
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

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="banner">
                <h1>Disaster Response Platform</h1>
              </div>

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
        
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/create-alert" element={<CreateAlertPage />} />
        <Route path="/create-resource" element={<CreateResourcePage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;