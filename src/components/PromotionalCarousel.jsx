import React, { useState, useEffect, useRef } from "react";
import "../styles/PromotionalCarousel.css";

const promotionalSlides = [
  {
    id: 1,
    title: "Test Drive, Delivery.",
    subtitle: "ably from your home",
    highlight: "",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bgColor: "linear-gradient(135deg, #4b2aa8 0%, #6b46c1 100%)",
    textColor: "#ffffff"
  },
  {
    id: 2,
    title: "Buyback on Assured cars",
    subtitle: "Commit Less. Drive more.",
    highlight: "",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bgColor: "linear-gradient(135deg, #4b2aa8 0%, #6b46c1 100%)",
    textColor: "#ffffff"
  },
  {
    id: 3,
    title: "Know each car Inside-out",
    subtitle: "360° view available",
    highlight: "",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bgColor: "linear-gradient(135deg, #4b2aa8 0%, #6b46c1 100%)",
    textColor: "#ffffff",
    icon: "360°"
  },
  {
    id: 4,
    title: "Like a car? Make it yours.",
    subtitle: "Test drive for free or reserve online",
    highlight: "",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bgColor: "linear-gradient(135deg, #4b2aa8 0%, #6b46c1 100%)",
    textColor: "#ffffff"
  },
  {
    id: 5,
    title: "3-year warranty on",
    subtitle: "Assured+ cars",
    highlight: "god promise",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bgColor: "linear-gradient(135deg, #4b2aa8 0%, #6b46c1 100%)",
    textColor: "#ffffff"
  },
  {
    id: 6,
    title: "Financing made possible",
    subtitle: "for every car buyer",
    highlight: "",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bgColor: "linear-gradient(135deg, #4b2aa8 0%, #6b46c1 100%)",
    textColor: "#ffffff",
    logo: "S CAPITAL"
  }
];

export default function PromotionalCarousel({ isMobile = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % promotionalSlides.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume after 10s
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + promotionalSlides.length) % promotionalSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % promotionalSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (isMobile) {
    // Mobile: Single slide at a time, simpler layout
    return (
      <div className="promo-carousel promo-carousel-mobile">
        <div className="promo-carousel-container">
          <div 
            className="promo-slide-wrapper"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {promotionalSlides.map((slide) => (
              <div key={slide.id} className="promo-slide promo-slide-mobile">
                <div 
                  className="promo-slide-bg"
                  style={{ background: slide.bgColor }}
                >
                  <img src={slide.image} alt={slide.title} className="promo-slide-img" />
                  <div className="promo-slide-overlay"></div>
                  <div className="promo-slide-content promo-slide-content-mobile">
                    {slide.logo && (
                      <div className="promo-logo">{slide.logo}</div>
                    )}
                    {slide.icon && (
                      <div className="promo-icon-mobile">{slide.icon}</div>
                    )}
                    <h2 className="promo-title-mobile">{slide.title}</h2>
                    {slide.subtitle && (
                      <p className="promo-subtitle-mobile">{slide.subtitle}</p>
                    )}
                    {slide.highlight && (
                      <div className="promo-highlight-mobile">{slide.highlight}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <button 
          className="promo-nav-btn promo-nav-left"
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button 
          className="promo-nav-btn promo-nav-right"
          onClick={goToNext}
          aria-label="Next slide"
        >
          ›
        </button>

        {/* Dots */}
        <div className="promo-dots">
          {promotionalSlides.map((_, index) => (
            <button
              key={index}
              className={`promo-dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Desktop: Show 3 slides at once
  const visibleSlides = 3;
  const maxStartIndex = Math.max(0, promotionalSlides.length - visibleSlides);
  const startIndex = Math.max(0, Math.min(currentIndex, maxStartIndex));

  return (
    <div className="promo-carousel promo-carousel-desktop">
      <div className="promo-carousel-container">
        <button 
          className="promo-nav-btn promo-nav-left"
          onClick={goToPrevious}
          disabled={startIndex === 0}
          aria-label="Previous slides"
        >
          ‹
        </button>

        <div className="promo-slides-viewport">
          <div 
            className="promo-slides-track"
            style={{
              transform: `translateX(-${startIndex * (100 / 3)}%)`,
            }}
          >
            {promotionalSlides.map((slide) => (
              <div key={slide.id} className="promo-slide promo-slide-desktop">
                <div 
                  className="promo-slide-bg"
                  style={{ background: slide.bgColor }}
                >
                  <img src={slide.image} alt={slide.title} className="promo-slide-img" />
                  <div className="promo-slide-overlay"></div>
                  <div className="promo-slide-content">
                    {slide.logo && (
                      <div className="promo-logo">{slide.logo}</div>
                    )}
                    {slide.icon && (
                      <div className="promo-icon">{slide.icon}</div>
                    )}
                    <h2 className="promo-title">{slide.title}</h2>
                    {slide.subtitle && (
                      <p className="promo-subtitle">{slide.subtitle}</p>
                    )}
                    {slide.highlight && (
                      <div className="promo-highlight">{slide.highlight}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          className="promo-nav-btn promo-nav-right"
          onClick={goToNext}
          disabled={startIndex >= maxStartIndex}
          aria-label="Next slides"
        >
          ›
        </button>
      </div>
    </div>
  );
}
