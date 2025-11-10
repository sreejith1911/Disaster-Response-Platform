import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import './CreateAlertPage.css';


function CreateAlertPage() {
  const [formData, setFormData] = useState({
    alertLevel: '',
    location: '',
    lat: '',
    lng: '',
    time: '',
    description: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create alert');
      navigate('/alerts');
    } catch (err) {
      console.error(err);
      alert('Error creating alert');
    }
  };

  return (
    <div className="create-alert-page" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Create New Alert</h2>
      <form onSubmit={handleSubmit} className="create-alert-form">
        <label>Alert Level:</label>
        <input name="alertLevel" value={formData.alertLevel} onChange={handleChange} required />

        <label>Location:</label>
        <input name="location" value={formData.location} onChange={handleChange} required />

        <label>Latitude:</label>
        <input type="number" name="lat" value={formData.lat} onChange={handleChange} required />

        <label>Longitude:</label>
        <input type="number" name="lng" value={formData.lng} onChange={handleChange} required />

        <label>Time:</label>
        <input name="time" value={formData.time} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <button type="submit" className="create-alert-btn">Submit</button>
      </form>
    </div>
  );
}

export default CreateAlertPage;
