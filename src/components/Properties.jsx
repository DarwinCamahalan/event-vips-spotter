// src/components/Properties.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Properties = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  const goToSeat1 = () => navigate("/seat1"); // Navigate to seat1
  const goToSeat2 = () => navigate("/seat2"); // Navigate to seat2

  return (
    <div className="properties-container">
      <button className="property-button" onClick={goToSeat1}>
        Day 1 Seat
      </button>
      <button className="property-button" onClick={goToSeat2}>
        Day 2 Seat
      </button>
    </div>
  );
};

export default Properties;
