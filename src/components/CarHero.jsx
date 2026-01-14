import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/CarDetailsWeb.module.css';

/**
 * CarHero component - Displays the main hero image and thumbnail gallery
 */
const CarHero = React.memo(({ car, heroImage, onImageChange }) => {
  const navigate = useNavigate();

  const thumbs = useMemo(() => {
    return car?.images && car.images.length ? car.images : [car?.image || ''];
  }, [car]);

  if (!car) return null;

  return (
    <div className={styles.cdHero}>
      <div className={styles.cdHeroInner}>
        <div className={styles.cdHeroImage}>
          <img src={heroImage} alt={car.title} loading="lazy" />
          <div className={styles.cdHeroControls}>
            <button type="button" className={styles.cdBack} onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>
        </div>

        <div className={styles.cdThumbs}>
          {thumbs.map((t, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.cdThumb} ${t === heroImage ? styles.cdThumbSelected : ""}`}
              onClick={() => onImageChange(t)}
              aria-label={`Show image ${i + 1}`}
            >
              <img src={t} alt={`thumb ${i + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

CarHero.displayName = 'CarHero';

export default CarHero;
