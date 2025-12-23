// src/components/CarCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from  "../styles/BuyPageweb.module.css";

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
    <div className={styles["car-image-wrap"]}>
      <img
        src={car.image}
        alt={car.title}
        className={styles["car-image"]}
        onError={(e) => (e.target.src = "/cars/default-car.png")}
      />
    </div>
  
    <div className={styles["car-body"]}>


    <div
  style={{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  }}
>

      <h4
        id={`car-${car.id}`}
        className={styles["car-title"]}
      >
        {car.title}
      </h4>
      <span className={styles["price"]}>
          {formatPrice(car.price)}
        </span>

        </div>

      <div className={styles["car-meta"]}>
        
        <span className={styles["km"]}>
          {Math.round(car.km / 1000)}k km
        </span>
        <span className={styles["badge"]}>
          {car.transmission}
        </span>
        <span className={styles["badge"]}>
          {car.fuel}
        </span>

        <span className={styles["badge"]}>
          {car.colorKey}
        </span>
        
      </div>
  
      <div className={styles["car-bottom"]}>
        <div className={styles["car-city"]}>
          {car.city}
        </div>
        <button className={styles["btn-small"]}>
          Vieww
        </button>
      </div>
    </div>
  </article>
  
  );
}
