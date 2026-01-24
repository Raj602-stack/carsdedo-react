// Updated CarCard.jsx component
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiZap, FiNavigation, FiUsers, FiCalendar, FiMapPin } from "react-icons/fi";
import styles from "../styles/CarCard.module.css";

export default function CarCard({ car }) {
  const navigate = useNavigate();
  
  const formatPrice = (p) =>
    p >= 100000 ? `₹${(p / 100000).toFixed(2)} Lakh` : `₹${(p / 1000).toFixed(0)}k`;

    // console.log(car);
    console.log("RAW CAR SPECS:", car.specs);


  // Calculate EMI (60 months)
  const formatEMI = (price) => {
    const emi = Math.round(price / 60);
    return `EMI ₹${emi.toLocaleString()}/m*`;
  };

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
          alt={car.title || "Car image"}
          className={styles["car-image"]}
          loading="lazy"
          onError={(e) => {
            // Prevent infinite loop by checking if already on fallback
            if (!e.target.src.includes('placeholder-car.png')) {
              e.target.src = process.env.PUBLIC_URL + "/placeholder-car.png";
            }
          }}
        />
      </div>

      {/* Body */}
      <div className={styles["car-body"]}>
        {/* Title and Price row */}
        <div className={styles["car-title-row"]}>
          <h4 id={`car-${car.id}`} className={styles["car-title"]}>
            {car.title}
          </h4>
          <div className={styles["price-section"]}>
            {car.hasDiscount && car.originalPrice ? (
              <div className={styles["price-with-discount"]}>
                <div className={styles["price-discounted"]}>
                  {formatPrice(car.price)}
                </div>
                <div className={styles["price-original"]}>
                  {formatPrice(car.originalPrice)}
                </div>
              </div>
            ) : (
              <div className={styles["price-tag"]}>
                {formatPrice(car.price)}
              </div>
            )}
          </div>
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
          {car.power && (
            <div className={styles["spec-item"]}>
              <FiZap className={styles["spec-icon"]} />
              <span>Power: <span className={styles["spec-value"]}>{car.power}</span></span>
            </div>
          )}
          {car.mileage && (
            <div className={styles["spec-item"]}>
              <FiNavigation className={styles["spec-icon"]} />
              <span>Mileage: <span className={styles["spec-value"]}>{car.mileage}</span></span>
            </div>
          )}
          {car.seats && (
            <div className={styles["spec-item"]}>
              <FiUsers className={styles["spec-icon"]} />
              <span>Seats: <span className={styles["spec-value"]}>{car.seats}</span></span>
            </div>
          )}
          <div className={styles["spec-item"]}>
            <FiCalendar className={styles["spec-icon"]} />
            <span>Year: <span className={styles["spec-value"]}>{car.year || "N/A"}</span></span>
          </div>
        </div>

        {/* Bottom section */}
        <div className={styles["car-bottom"]}>
          <div className={styles["car-city"]}>
            <FiMapPin className={styles["city-icon"]} />
            HUB • {car.city}
          </div>
          <div className={styles["bottom-right"]}>
            <div className={styles["emi-text"]}>
              {formatEMI(car.price)}
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
      </div>
    </article>
  );
}