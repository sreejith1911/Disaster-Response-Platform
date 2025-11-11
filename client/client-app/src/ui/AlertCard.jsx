import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import "./AlertCard.css";

const AlertCard = ({ alert }) => {
  const { _id, alertLevel, location, time,alertTitle } = alert;


  const level = alertLevel?.toLowerCase();

  const levelClass =
    level === "red"
      ? "critical"
      : level === "orange"
      ? "warning"
      : level === "yellow"
      ? "info"
      : "default";

  return (
    <Link to={`/alerts/${_id}`} className={`alert-card-link`}>
      <div className={`alert-card ${levelClass}`}>
        {/* Header */}
        <div className="alert-header">
          <span className={`alert-badge ${levelClass}`}>
            {levelClass}
          </span>
          <h3 className="alert-title">{alertTitle} </h3>
        </div>

        {/* Details */}
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
    </Link>
  );
};

export default AlertCard;
