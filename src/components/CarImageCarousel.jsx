import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/CarImageCarousel.module.css";
import { useCars } from "../context/CarsContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function CarImageCarousel({ carId }) {
  const navigate = useNavigate();
  const { cars, loading } = useCars();

  const [index, setIndex] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);

  /* -------------------------------
     1️⃣ Find car from context
  -------------------------------- */
  const car = useMemo(() => {
    return cars.find((c) => String(c.id) === String(carId)) || null;
  }, [cars, carId]);

  /* -------------------------------
     2️⃣ Normalize images HERE
     (because backend structure)
  -------------------------------- */
  const images = useMemo(() => {
    if (!car?.images) return [];

    const exterior = car.images.exterior || [];
    const interior = car.images.interior || [];

    return [...exterior, ...interior]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((img) => `http://localhost:8000${img.image}`);
  }, [car]);

  console.log(images);

  /* -------------------------------
     Guards
  -------------------------------- */
  if (loading || !car || images.length === 0) return null;

  const safeIndex =
    ((index % images.length) + images.length) % images.length;

  /* -------------------------------
     Swipe handlers
  -------------------------------- */
  function handleStart(e) {
    isDragging.current = true;
    startX.current = e.touches
      ? e.touches[0].clientX
      : e.clientX;
  }

  function handleEnd(e) {
    if (!isDragging.current) return;

    const endX = e.changedTouches
      ? e.changedTouches[0].clientX
      : e.clientX;

    const diff = startX.current - endX;

    if (Math.abs(diff) > 50) {
      setIndex((prev) => (diff > 0 ? prev + 1 : prev - 1));
    }

    isDragging.current = false;
  }

  /* -------------------------------
     Render
  -------------------------------- */
  return (
    <div
      className={styles.carousel}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onClick={() => navigate(`/car/${car.id}/gallery`)}
    >
      <img
        src={images[safeIndex]}
        alt={car.title}
        loading="lazy"
        onError={(e) => {
          e.target.src = "/placeholder-car.png";
        }}
      />

      <div className={styles.dots}>
        {images.map((_, i) => (
          <span
            key={i}
            className={i === safeIndex ? styles.active : ""}
          />
        ))}
      </div>

      {images.length > 1 && (
        <div className={styles.badge}>360°</div>
      )}
    </div>
  );
}
