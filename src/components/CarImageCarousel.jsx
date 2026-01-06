import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/CarImageCarousel.module.css";
import cars from "../data/cars";

export default function CarImageCarousel({ carId }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const startX = useRef(0);
  const isDragging = useRef(false);

  // 🔹 HOOK 1
  const car = useMemo(() => {
    return cars.find(c => c.id === Number(carId));
  }, [carId]);

  // 🔹 HOOK 2
  const images = useMemo(() => {
    if (!car?.images) return [];
    const all = Object.values(car.images).flat();
    return [...new Set(all)];
  }, [car]);

  if (!car || !images.length) return null;

  const safeIndex = ((index % images.length) + images.length) % images.length;

  /* ---------------- SWIPE HANDLERS ---------------- */

  function handleStart(e) {
    isDragging.current = true;
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
  }

  function handleEnd(e) {
    if (!isDragging.current) return;

    const endX = e.changedTouches
      ? e.changedTouches[0].clientX
      : e.clientX;

    const diff = startX.current - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setIndex(prev => prev + 1); // swipe left
      } else {
        setIndex(prev => prev - 1); // swipe right
      }
    }

    isDragging.current = false;
  }

  return (
    <div
      className={styles.carousel}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onClick={() => navigate(`/car/${car.id}/gallery`)}
    >
      <img src={images[safeIndex]} alt={car.title} />

      <div className={styles.dots}>
        {images.map((_, i) => (
          <span
            key={i}
            className={i === safeIndex ? styles.active : ""}
          />
        ))}
      </div>

      <div className={styles.badge}>360°</div>
    </div>
  );
}
