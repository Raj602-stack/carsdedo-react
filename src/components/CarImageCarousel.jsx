import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/CarImageCarousel.module.css";
import { useCars } from "../context/CarsContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function CarImageCarousel({ carId }) {
  const navigate = useNavigate();
  const { cars, loading } = useCars();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const carouselRef = useRef(null);
  const containerRef = useRef(null);

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
      .map((img) => `https:api.carsdedo.com${img.image}`);
  }, [car]);

  /* -------------------------------
     Scroll detection for smooth progress bar update
     MUST be called before any early returns
  -------------------------------- */
  const handleScroll = React.useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollWidth = container.scrollWidth - container.offsetWidth;
    const scrollLeft = container.scrollLeft;
    
    if (scrollWidth > 0) {
      const progress = (scrollLeft / scrollWidth) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    }
  }, []);

  /* -------------------------------
     Initialize scroll progress
     MUST be called before any early returns
  -------------------------------- */
  useEffect(() => {
    if (containerRef.current && images.length > 0) {
      handleScroll();
    }
  }, [images.length, handleScroll]);

  /* -------------------------------
     Guards (after all hooks)
  -------------------------------- */
  if (loading || !car || images.length === 0) return null;

  /* -------------------------------
     Touch/Mouse handlers for smooth swipe
  -------------------------------- */
  const handleStart = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    startX.current = clientX;
    if (containerRef.current) {
      scrollLeft.current = containerRef.current.scrollLeft;
      containerRef.current.style.scrollBehavior = 'auto';
    }
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX.current;
    
    if (containerRef.current) {
      // Smooth manual scrolling during drag
      containerRef.current.scrollLeft = scrollLeft.current - diff;
    }
  };

  const handleEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (!containerRef.current) return;

    const container = containerRef.current;
    container.style.scrollBehavior = 'smooth';
    
    // Let the scroll continue naturally - no snapping
    // The progress bar will update via the scroll handler
  };

  /* -------------------------------
     Render
  -------------------------------- */
  return (
    <div className={styles.carouselWrapper}>
      <div
        ref={containerRef}
        className={styles.carouselContainer}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onScroll={handleScroll}
      >
        {images.map((img, index) => (
          <div key={index} className={styles.carouselSlide}>
            <img
              src={img}
              alt={`${car.title} - ${index + 1}`}
              loading={index === 0 ? "eager" : "lazy"}
              onError={(e) => {
                e.target.src = "/placeholder-car.png";
              }}
            />
          </div>
        ))}
      </div>

      {/* Progress indicator - only thing visible on image */}
      {images.length > 1 && (
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
