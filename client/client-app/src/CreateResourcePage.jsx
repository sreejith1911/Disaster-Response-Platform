import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function CreateResourcePage() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    lat: '',
    lng: '',
    bedsAvailable: '',
    foodAvailable: false,
    medicalAid: false,
    lastUpdated: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create resource');
      navigate('/resources');
    } catch (err) {
      console.error(err);
      alert('Error creating resource');
    }
  };

  return (
    <div className="create-alert-page" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Create New Resource</h2>
      <form onSubmit={handleSubmit} className="create-alert-form">
        <label>Name:</label>
        <input name="name" value={formData.name} onChange={handleChange} required />

        <label>Location:</label>
        <input name="location" value={formData.location} onChange={handleChange} required />

        <label>Latitude:</label>
        <input type="number" name="lat" value={formData.lat} onChange={handleChange} required />

        <label>Longitude:</label>
        <input type="number" name="lng" value={formData.lng} onChange={handleChange} required />

        <label>Beds Available:</label>
        <input
          type="number"
          name="bedsAvailable"
          value={formData.bedsAvailable}
          onChange={handleChange}
          required
        />

        <label>
          <input
            type="checkbox"
            name="foodAvailable"
            checked={formData.foodAvailable}
            onChange={handleChange}
          />{' '}
          Food Available
        </label>

        <label>
          <input
            type="checkbox"
            name="medicalAid"
            checked={formData.medicalAid}
            onChange={handleChange}
          />{' '}
          Medical Aid
        </label>

        <label>Last Updated:</label>
        <input name="lastUpdated" value={formData.lastUpdated} onChange={handleChange} required />

        <button type="submit" className="create-alert-btn">Submit</button>
      </form>
    </div>
  );
}

export default CreateResourcePage;
