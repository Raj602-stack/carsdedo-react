import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useCars } from '../context/CarsContext';
import { normalizeCar } from '../utils';
import Loader from '../components/Loader';
import styles from '../styles/CarGallery.module.css';

/**
 * CarGallery page - Full-screen gallery view for all car images
 */
export default function CarGallery() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, loading } = useCars();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get car data
  const rawCar = useMemo(() => 
    cars.find((c) => String(c.id) === String(id)),
    [cars, id]
  );

  const car = useMemo(() => 
    rawCar ? normalizeCar(rawCar) : null,
    [rawCar]
  );

  // Get all images
  const allImages = useMemo(() => {
    if (!car?.images) return [];
    
    const exterior = car.images.exterior || [];
    const interior = car.images.interior || [];
    
    let images = [...exterior, ...interior].filter(Boolean);

    // TEST IMAGES - Remove when gallery is confirmed working
    const testImages = [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
    ];
    images = [...images, ...testImages];
    // END TEST IMAGES

    return images;
  }, [car]);

  // Initialize with first image
  useEffect(() => {
    if (allImages.length > 0 && currentIndex >= allImages.length) {
      setCurrentIndex(0);
    }
  }, [allImages.length, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        navigate(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allImages.length]);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return <Loader />;
  }

  if (!car || allImages.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <h2>Car not found</h2>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.galleryPage}>
      {/* Header */}
      <header className={styles.galleryHeader}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => navigate(-1)}
          aria-label="Close gallery"
        >
          <FiX />
        </button>
        <div className={styles.headerInfo}>
          <h1 className={styles.carTitle}>{car.title}</h1>
          <p className={styles.imageCount}>
            {currentIndex + 1} of {allImages.length}
          </p>
        </div>
      </header>

      {/* Main Image Display */}
      <div className={styles.mainGallery}>
        <div className={styles.imageContainer}>
          {allImages.map((img, index) => (
            <div
              key={index}
              className={`${styles.imageSlide} ${index === currentIndex ? styles.active : ''}`}
            >
              <img
                src={img}
                alt={`${car.title} - ${index + 1}`}
                loading={index === currentIndex ? 'eager' : 'lazy'}
                onError={(e) => {
                  e.target.src = '/placeholder-car.png';
                }}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.navArrow} ${styles.navArrowLeft}`}
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              className={`${styles.navArrow} ${styles.navArrowRight}`}
              onClick={goToNext}
              aria-label="Next image"
            >
              <FiChevronRight />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {allImages.length > 1 && (
        <div className={styles.thumbnailStrip}>
          <div className={styles.thumbnailContainer}>
            {allImages.map((img, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.thumbnail} ${index === currentIndex ? styles.thumbnailActive : ''}`}
                onClick={() => goToImage(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={img}
                  alt={`${car.title} - ${index + 1}`}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/placeholder-car.png';
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
