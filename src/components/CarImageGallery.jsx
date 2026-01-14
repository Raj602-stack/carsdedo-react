import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from '../styles/CarImageGallery.module.css';

/**
 * CarImageGallery component - Main image display with thumbnail carousel
 * Similar to the design shown in the reference image
 */
const CarImageGallery = ({ car, currentImage, onImageChange }) => {
  const navigate = useNavigate();
  const thumbnailRef = useRef(null);
  const [thumbnailScroll, setThumbnailScroll] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isInternalNavigation = useRef(false);

  // Get all images from car object
  const allImages = useMemo(() => {
    if (!car) return [];
    
    let images = [];
    
    // Normalized format: images.exterior and images.interior are arrays of URL strings
    if (car.images && typeof car.images === 'object') {
      const exterior = car.images.exterior || [];
      const interior = car.images.interior || [];
      
      // Combine and filter out empty values
      images = [...exterior, ...interior].filter(Boolean);
    }
    
    // Fallback to car.image if no images found
    if (images.length === 0 && car.image) {
      images = [car.image];
    }

    return images;
  }, [car]);

  // Update currentIndex when currentImage or allImages change (only if change is external)
  useEffect(() => {
    // Skip if this change came from internal navigation
    if (isInternalNavigation.current) {
      isInternalNavigation.current = false;
      return;
    }
    
    if (allImages.length === 0) {
      setCurrentIndex(-1);
      return;
    }
    
    // Try to find the index of currentImage
    const index = allImages.findIndex(img => {
      const img1 = String(img || '').trim();
      const img2 = String(currentImage || '').trim();
      return img1 === img2;
    });
    
    // If found, update index; otherwise keep current index (don't reset to 0)
    if (index >= 0) {
      setCurrentIndex(index);
    } else if (currentImage && allImages.length > 0) {
      // If currentImage doesn't match but exists, try to find closest match
      const normalizedCurrent = String(currentImage || '').trim().toLowerCase();
      const closestIndex = allImages.findIndex(img => {
        const normalizedImg = String(img || '').trim().toLowerCase();
        return normalizedImg.includes(normalizedCurrent) || normalizedCurrent.includes(normalizedImg);
      });
      if (closestIndex >= 0) {
        setCurrentIndex(closestIndex);
      }
    }
  }, [allImages, currentImage]);

  // Navigation functions
  const goToPrevious = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (allImages.length === 0) return;
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const newIndex = safeIndex > 0 ? safeIndex - 1 : allImages.length - 1;
    const newImage = allImages[newIndex];
    if (newImage) {
      isInternalNavigation.current = true;
      setCurrentIndex(newIndex);
      if (onImageChange) {
        onImageChange(newImage);
      }
    }
  }, [allImages, currentIndex, onImageChange]);

  const goToNext = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (allImages.length === 0) return;
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const newIndex = safeIndex < allImages.length - 1 ? safeIndex + 1 : 0;
    const newImage = allImages[newIndex];
    if (newImage) {
      isInternalNavigation.current = true;
      setCurrentIndex(newIndex);
      if (onImageChange) {
        onImageChange(newImage);
      }
    }
  }, [allImages, currentIndex, onImageChange]);

  const goToImage = useCallback((index, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (index >= 0 && index < allImages.length) {
      const newImage = allImages[index];
      if (newImage) {
        isInternalNavigation.current = true;
        setCurrentIndex(index);
        if (onImageChange) {
          onImageChange(newImage);
        }
      }
    }
  }, [allImages, onImageChange]);

  // Thumbnail scroll handlers
  const checkThumbnailScroll = () => {
    if (!thumbnailRef.current) return;
    
    const container = thumbnailRef.current;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkThumbnailScroll();
    const container = thumbnailRef.current;
    if (container) {
      container.addEventListener('scroll', checkThumbnailScroll);
      window.addEventListener('resize', checkThumbnailScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkThumbnailScroll);
        window.removeEventListener('resize', checkThumbnailScroll);
      }
    };
  }, [allImages.length]);

  // Scroll thumbnail to show current image
  useEffect(() => {
    if (thumbnailRef.current && currentIndex >= 0) {
      const container = thumbnailRef.current;
      const thumbWidth = 80; // thumbnail width + gap
      const scrollPosition = currentIndex * thumbWidth - container.clientWidth / 2 + thumbWidth / 2;
      
      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  // Initialize currentImage when component mounts or images change (only if no currentImage)
  useEffect(() => {
    if (allImages.length > 0) {
      if (!currentImage && typeof onImageChange === 'function') {
        // Only set to first image if there's no currentImage at all
        isInternalNavigation.current = true;
        onImageChange(allImages[0]);
        setCurrentIndex(0);
      } else if (currentImage) {
        // If currentImage exists, try to find its index
        const index = allImages.findIndex(img => {
          const img1 = String(img || '').trim();
          const img2 = String(currentImage || '').trim();
          return img1 === img2;
        });
        if (index >= 0) {
          setCurrentIndex(index);
        }
      }
    }
  }, [allImages.length]); // Only depend on length to avoid resetting during navigation

  if (!car || allImages.length === 0) return null;

  return (
    <div className={styles.gallery}>
      {/* Main Image Display */}
      <div className={styles.mainImageContainer}>
        <img 
          key={currentIndex}
          src={allImages[Math.max(0, currentIndex)] || currentImage || allImages[0]} 
          alt={car.title} 
          className={styles.mainImage}
          loading="eager"
          onError={(e) => {
            e.target.src = "/placeholder-car.png";
          }}
        />
        
        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.navButton} ${styles.navButtonLeft}`}
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              className={`${styles.navButton} ${styles.navButtonRight}`}
              onClick={goToNext}
              aria-label="Next image"
            >
              <FiChevronRight />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Carousel */}
      {allImages.length > 1 && (
        <div className={styles.thumbnailContainer}>
          <div 
            ref={thumbnailRef}
            className={styles.thumbnailCarousel}
          >
            {allImages.map((img, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.thumbnail} ${index === currentIndex ? styles.thumbnailActive : ''}`}
                onClick={(e) => goToImage(index, e)}
                aria-label={`View image ${index + 1}`}
              >
                <img 
                  src={img} 
                  alt={`${car.title} - ${index + 1}`}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/placeholder-car.png";
                  }}
                />
              </button>
            ))}
            
            {/* View All Button */}
            <button
              type="button"
              className={styles.viewAllButton}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/car/${car.id}/gallery`);
              }}
              aria-label="View all images"
            >
              <div className={styles.viewAllIcon}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
          
          {/* Thumbnail scroll indicator */}
          {canScrollRight && (
            <div className={styles.scrollIndicator}>
              <FiChevronRight />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

CarImageGallery.displayName = 'CarImageGallery';

export default CarImageGallery;
