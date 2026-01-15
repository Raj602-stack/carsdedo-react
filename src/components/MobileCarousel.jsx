import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MobileCarousel.module.css";

const promoSlides = [
  {
    id: 1,
    title: "buying a car is picnic",
    subtitle: "god promise",
    tag: "Introducing Hot Wheels — limited time deals",
    logo: process.env.PUBLIC_URL + "/hotwheels.png",
    image: process.env.PUBLIC_URL + "/slide1.png",
  },
  {
    id: 2,
    title: "best offers",
    subtitle: "trusted cars",
    tag: "Certified cars — limited time offers",
    logo: process.env.PUBLIC_URL + "/hotwheels.png",
    image: process.env.PUBLIC_URL + "/slide2.png",
  },
  {
    id: 3,
    title: "easy finance",
    subtitle: "peace of mind",
    tag: "Hassle-free ownership",
    logo: process.env.PUBLIC_URL + "/hotwheels.png",
    image: process.env.PUBLIC_URL + "/slide3.png",
  },
];

export default function MobileCarousel() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const startX = useRef(0);
  const translateX = useRef(0);
  const isInteracting = useRef(false);
  const autoPlayInterval = useRef(null);

  // Auto-change slides every 4 seconds (like desktop)
  useEffect(() => {
    // Clear any existing interval
    if (autoPlayInterval.current) {
      clearInterval(autoPlayInterval.current);
    }

    // Only auto-play if user is not interacting
    if (!isInteracting.current) {
      autoPlayInterval.current = setInterval(() => {
        setIndex((i) => (i + 1) % promoSlides.length);
      }, 4000);
    }

    return () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
      }
    };
  }, [index]);

  const handleTouchStart = (e) => {
    isInteracting.current = true;
    startX.current = e.touches[0].clientX;
    // Pause auto-play when user starts interacting
    if (autoPlayInterval.current) {
      clearInterval(autoPlayInterval.current);
    }
  };

  const handleTouchMove = (e) => {
    translateX.current = e.touches[0].clientX - startX.current;
  };

  const handleTouchEnd = () => {
    const threshold = 50;
    if (translateX.current < -threshold && index < promoSlides.length - 1) {
      setIndex(index + 1);
    } else if (translateX.current > threshold && index > 0) {
      setIndex(index - 1);
    }
    translateX.current = 0;
    
    // Resume auto-play after a short delay
    setTimeout(() => {
      isInteracting.current = false;
    }, 1000);
  };

  return (
    <div className={styles["promo-carousel"]}>
      <div
        className={styles["promo-track"]}
        style={{ transform: `translateX(calc(-${index * 100}% - ${index * 16}px))` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {promoSlides.map((s) => (
  <div
    key={s.id}
    className={styles["promo-slide"]}
    style={{ backgroundImage: `url(${s.image})` }}
  >
    <div className={styles["promo-overlay"]}>
      {/* Titles now at the top */}
      <div className={`${styles["promo-titles"]} ${styles["promo-titles--top"]}`}>
        <h4 className={styles["promo-title"]}>{s.title}</h4>
        <h2 className={styles["promo-subtitle"]}>{s.subtitle}</h2>
      </div>

      {/* Tag banner moved just above CTA */}
      <div className={styles["promo-bottom-content"]}>
        <div className={styles["promo-tag"]}>
          <span>INTRODUCING</span>
          <img src={s.logo} alt="Hot Wheels" className={styles["promo-logo"]} />
          <span>LIMITED TIME DEALS</span>
        </div>

        <button className={styles["promo-btn"]} onClick={() => navigate("/buy")}>View all cars</button>
      </div>
    </div>
  </div>
))}

      </div>

      <div className={styles["promo-dots"]}>
        {promoSlides.map((_, i) => (
          <div key={i} className={`${styles["promo-dot"]} ${i === index ? styles["active"] : ""}`} />
        ))}
      </div>
    </div>
  );
}
