// src/components/CarCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function CarCard({ car }) {
    const navigate = useNavigate();
  const formatPrice = (p) =>
    p >= 100000 ? `₹${(p / 100000).toFixed(2)} Lakh` : `₹${(p / 1000).toFixed(0)}k`;

  return (

    
    <article className="car-card"  onClick={() => navigate(`/car/${car.id}`)} aria-labelledby={`car-${car.id}`}>
      <div className="car-image-wrap">
        <img
          src={car.image}
          alt={car.title}
          className="car-image"
          onError={(e) => (e.target.src = "/cars/default-car.png")}
        />
      </div>

      <div className="car-body">
        <h4 id={`car-${car.id}`} className="car-title">{car.title}</h4>
        <div className="car-meta">
          <span className="price">{formatPrice(car.price)}</span>
          <span className="km">{Math.round(car.km / 1000)}k km</span>
          <span className="badge">{car.transmission}</span>
          <span className="badge">{car.fuel}</span>
        </div>

        <div className="car-bottom">
          <div className="car-city">{car.city}</div>
          <button className="btn-small">View</button>
        </div>
      </div>
    </article>
  );
}
