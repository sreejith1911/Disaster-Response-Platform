import React from "react";
import { MapPin, Bed, Utensils, HeartPulse } from "lucide-react";
import "./ResourceCard.css";

const ResourceCard = ({ resource }) => {
  const {
    name,
    location,
    bedsAvailable,
    foodAvailable,
    medicalAid,
    lastUpdated,
  } = resource;

  return (
    <div className="resource-card">
      <h3 className="resource-title">{name}</h3>

      <div className="resource-location">
        <MapPin size={16} className="icon" />
        <span>{location}</span>
      </div>

      <div className="resource-info">
        <div className="resource-tag">
          <Bed size={14} className="tag-icon" />
          <span>{bedsAvailable} beds available</span>
        </div>

        {foodAvailable && (
          <div className="resource-tag">
            <Utensils size={14} className="tag-icon" />
            <span>Food Available</span>
          </div>
        )}

        {medicalAid && (
          <div className="resource-tag">
            <HeartPulse size={14} className="tag-icon" />
            <span>Medical Aid</span>
          </div>
        )}
      </div>

      
    </div>
  );
};

export default ResourceCard;
