// Updated CarCard.jsx component
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/CarCard.module.css";

export default function CarCard({ car }) {
  const navigate = useNavigate();
  
  const formatPrice = (p) =>
    p >= 100000 ? `₹${(p / 100000).toFixed(2)} Lakh` : `₹${(p / 1000).toFixed(0)}k`;

  return (
    <article
      className={styles["car-card"]}
      onClick={() => navigate(`/car/${car.id}`)}
      aria-labelledby={`car-${car.id}`}
    >
      {/* Status badge */}
      <div className={styles["car-status"]}>
        {car.year} • Available
      </div>

      {/* Image section */}
      <div className={styles["car-image-wrap"]}>
        <img
          src={car.image}
          alt={car.title}
          className={styles["car-image"]}
          onError={(e) => (e.target.src = "/cars/default-car.png")}
        />
      </div>

      {/* Body */}
      <div className={styles["car-body"]}>
        {/* Title and Price row */}
        <div className={styles["car-title-row"]}>
          <h4 id={`car-${car.id}`} className={styles["car-title"]}>
            {car.title}
          </h4>
          <span className={styles["price-tag"]}>
            {formatPrice(car.price)}
          </span>
        </div>

        {/* Meta badges */}
        <div className={styles["car-meta"]}>
          <span className={styles["meta-badge"]}>
            {Math.round(car.km / 1000)}k km
          </span>
          <span className={styles["meta-badge"]}>
            {car.transmission}
          </span>
          <span className={styles["meta-badge"]}>
            {car.fuel}
          </span>
          <span className={styles["meta-badge"]}>
            {car.colorKey}
          </span>
        </div>

        {/* Specifications grid */}
        <div className={styles["car-specs"]}>
          <div className={styles["spec-item"]}>
            <span className={styles["spec-icon"]}>⚡</span>
            <span>Power: <span className={styles["spec-value"]}>{car.power || "N/A"}</span></span>
          </div>
          <div className={styles["spec-item"]}>
            <span className={styles["spec-icon"]}>🛣️</span>
            <span>Mileage: <span className={styles["spec-value"]}>{car.mileage || "N/A"}</span></span>
          </div>
          <div className={styles["spec-item"]}>
            <span className={styles["spec-icon"]}>👥</span>
            <span>Seats: <span className={styles["spec-value"]}>{car.seats || "5"}</span></span>
          </div>
          <div className={styles["spec-item"]}>
            <span className={styles["spec-icon"]}>📅</span>
            <span>Year: <span className={styles["spec-value"]}>{car.year || "N/A"}</span></span>
          </div>
        </div>

        {/* Bottom section */}
        <div className={styles["car-bottom"]}>
          <div className={styles["car-city"]}>
            <span className={styles["city-icon"]}>📍</span>
            {car.city}
          </div>
          <button 
            className={styles["view-button"]}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/car/${car.id}`);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}