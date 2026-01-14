import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCars } from "../context/CarsContext";
import Loader from "../components/Loader";
import styles from "../styles/CarFilterMobile.module.css";

const PRICE_PRESETS = [
  { label: "Under 5 Lakh", min: 0, max: 500000 },
  { label: "5 – 10 Lakh", min: 500000, max: 1000000 },
  { label: "10 – 20 Lakh", min: 1000000, max: 2000000 },
];

// Popular cars will be derived from actual car data


export default function CarFilterMobile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cars, loading } = useCars();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isAnimating, setIsAnimating] = useState(true);

  // Trigger animation on mount (when navigating to this page)
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 350); // Match animation duration
    return () => clearTimeout(timer);
  }, [location.pathname]);

  /* -----------------------------
     SEARCH LOGIC - using context cars
  ----------------------------- */
  function handleSearch(val) {
    setSearch(val);

    if (!val.trim() || !cars || cars.length === 0) {
      setSuggestions([]);
      return;
    }

    const q = val.toLowerCase();

    const matches = cars
      .filter((c) => {
        const searchText = `${c.title || ''} ${c.brand || ''} ${c.model || ''} ${c.fuel || ''} ${c.body || ''} ${c.city || ''} ${c.transmission || ''} ${c.color_key || ''}`.toLowerCase();
        return searchText.includes(q);
      })
      .slice(0, 6);

    setSuggestions(matches);
  }

  function go(params) {
    const qs = new URLSearchParams(params).toString();
    navigate(`/buy?${qs}`);
  }

  // Get popular cars from context - top brands/models by count
  const popularCars = useMemo(() => {
    if (!cars || cars.length === 0) return [];
    
    // Group by brand+model and get most common ones
    const carMap = new Map();
    cars.forEach(car => {
      const key = `${car.brand || ''}_${car.model || ''}`;
      if (!carMap.has(key)) {
        carMap.set(key, {
          brand: car.brand,
          model: car.model,
          title: car.title,
          image: car.images?.exterior?.[0]?.image 
            ? `http://localhost:8000${car.images.exterior[0].image}`
            : process.env.PUBLIC_URL + "/placeholder-car.png",
          count: 0
        });
      }
      carMap.get(key).count++;
    });
    
    return Array.from(carMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 9);
  }, [cars]);

  // Show loader while data is being fetched to prevent laggy UI
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button
            className={styles.backBtn}
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/");
              }
            }}
            aria-label="Go back"
          >
            ←
          </button>
          <div className={styles.headerTitle}>Search Cars</div>
        </div>
        <Loader message="Loading cars..." fullScreen={false} />
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${isAnimating ? styles.slideIn : ''}`}>

<div className={styles.header}>
    <button
      className={styles.backBtn}
      onClick={() => {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate("/");
        }
      }}
      aria-label="Go back"
    >
      ←
    </button>

    <div className={styles.headerTitle}>Search Cars</div>
  </div>
      {/* SEARCH */}
      <div className={styles.searchWrap}>
        <div className={styles.searchInputWrapper}>
          <span className={styles.searchIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            className={styles.searchInput}
            placeholder="Search cars, brands, models…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && search.trim()) {
                navigate(`/buy?q=${encodeURIComponent(search.trim())}`);
                setSuggestions([]);
                setSearch("");
              }
            }}
            autoFocus
          />
          {search && (
            <button
              className={styles.clearBtn}
              onClick={() => {
                setSearch("");
                setSuggestions([]);
              }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className={styles.suggestions}>
           {suggestions.map((car) => (
  <div
    key={car.id}
    className={styles.suggestionItem}
    onClick={() => {
      // Only use brand and model for filtering, not body/fuel
      const params = new URLSearchParams();
      if (car.brand) params.append('brand', car.brand);
      if (car.model) params.append('model', car.model);
      navigate(`/buy?${params.toString()}`);
      setSuggestions([]);
      setSearch("");
    }}
  >
    <strong>{car.brand || 'Unknown'}</strong> {car.model || ''}
    <div className={styles.meta}>
      {[car.body, car.fuel, car.city].filter(Boolean).join(' · ')}
    </div>
  </div>
))}

          </div>
        )}
      </div>

      {/* 💰 PRICE RANGE */}
      <section className={styles.section}>
        <h3 className={styles.title}>PRICE RANGE</h3>
        <div className={styles.grid}>
          {PRICE_PRESETS.map((p) => (
            <button
              key={p.label}
              className={styles.chip}
              onClick={() =>
                go({
                  priceMin: p.min,
                  priceMax: p.max,
                })
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* 🚗 POPULAR CARS */}
      {popularCars.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.title}>POPULAR CARS</h3>
          <div className={styles.popularGrid}>
            {popularCars.map((car, idx) => (
              <div
                key={`${car.brand}-${car.model}-${idx}`}
                className={styles.popularCard}
                onClick={() => {
                  const params = new URLSearchParams();
                  if (car.brand) params.append('brand', car.brand);
                  if (car.model) params.append('model', car.model);
                  navigate(`/buy?${params.toString()}`);
                }}
              >
                <div className={styles.popularImgWrap}>
                  <img
                    src={car.image}
                    alt={car.title || `${car.brand} ${car.model}`}
                    loading="lazy"
                    onError={(e) => {
                      if (!e.target.src.includes('placeholder-car.png')) {
                        e.target.src = process.env.PUBLIC_URL + "/placeholder-car.png";
                      }
                    }}
                  />
                </div>
                <div className={styles.popularName}>{car.model || car.title}</div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
