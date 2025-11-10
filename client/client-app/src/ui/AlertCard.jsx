import React from "react";
import { MapPin, Clock } from "lucide-react";
import "./AlertCard.css";

const AlertCard = ({ alert }) => {
  const { alertLevel, location, time, description } = alert;
  
  // Convert to lowercase for comparison
  const level = alertLevel?.toLowerCase();
  
  // Fixed color mapping
  const levelClass =
    level === "red"
      ? "critical"
      : level === "orange"
      ? "warning"
      : level === "yellow"
      ? "info"
      : "default";

  return (
    <div className={`alert-card ${levelClass}`}>
      <div className="alert-header">
        <span className={`alert-badge ${levelClass}`}>
          {alertLevel.toUpperCase()}
        </span>
        <h3 className="alert-title">Alert: {alertLevel} Level</h3>
      </div>
      <div className="alert-details">
        <div className="alert-item">
          <MapPin size={16} className="icon" />
          <span>{location}</span>
        </div>
        <div className="alert-item">
          <Clock size={16} className="icon" />
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;