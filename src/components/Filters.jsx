import React, { useMemo, useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import styles from "../styles/BuyPageweb.module.css";

/* ------------------------------------
  HARD-CODED FILTER OPTIONS
------------------------------------ */

const BRANDS = [
  "Maruti", "Hyundai", "Honda", "Toyota",
  "Tata", "Mahindra", "Kia", "Volkswagen",
  "Skoda", "BMW", "Mercedes", "Audi",
];

const YEARS = [
  2024, 2023, 2022, 2021, 2020,
  2019, 2018, 2017, 2016,
];

const FUELS = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];

const BODY_TYPES = [
  "Hatchback", "Sedan", "SUV",
  "MUV", "Coupe", "Convertible",
];

/* ✅ COLOR PALETTE (KEY → HEX) */
const COLOR_PALETTE = {
  red: "#D32F2F",
  white: "#FFFFFF",
  black: "#000000",
  silver: "#BDBDBD",
  grey: "#9E9E9E",
  blue: "#1976D2",
  green: "#388E3C",
};

/* ------------------------------------
  Helpers
------------------------------------ */

// Format for display (5L instead of 500000)
function formatDisplayPrice(val) {
  if (val == null || val === 0) return "₹0";
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(0)} L`;
  return `₹${Math.round(val / 1000)}k`;
}

// Format for input field
function formatInputPrice(val) {
  return val.toLocaleString('en-IN');
}

// Parse input value back to number
function parseInputPrice(str) {
  const num = parseInt(str.replace(/\D/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

/* ------------------------------------
  Component
------------------------------------ */

export default function Filters({ filters, setFilters }) {
  const [open, setOpen] = useState({
    transmission: true,
    color: true,
  });

  const sliderTrackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const toggleSection = (key) =>
    setOpen((s) => ({ ...s, [key]: !s[key] }));

  const toggleArray = (key, value) => {
    setFilters((s) => {
      const arr = Array.isArray(s[key]) ? s[key] : [];
      const set = new Set(arr);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...s, [key]: Array.from(set), page: 1 };
    });
  };

  const pricePresets = useMemo(
    () => [
      { label: "Up to ₹5 L", min: 0, max: 500000 },
      { label: "₹5L – ₹10L", min: 500000, max: 1000000 },
      { label: "₹10L – ₹20L", min: 1000000, max: 2000000 },
      { label: "₹20L – ₹50L", min: 2000000, max: 5000000 },
    ],
    []
  );

  // Default values if not set
  const priceMin = filters.price_min ?? 0;
  const priceMax = filters.price_max ?? 5000000;

  const handleSliderClick = (e) => {
    if (!sliderTrackRef.current) return;
    
    const track = sliderTrackRef.current;
    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newValue = Math.round(percentage * 5000000);
    
    // Determine which thumb is closer
    const minDiff = Math.abs(newValue - priceMin);
    const maxDiff = Math.abs(newValue - priceMax);
    
    if (minDiff < maxDiff) {
      // Click is closer to min thumb
      if (newValue < priceMax) {
        setFilters((s) => ({ 
          ...s, 
          price_min: newValue,
          page: 1 
        }));
      }
    } else {
      // Click is closer to max thumb
      if (newValue > priceMin) {
        setFilters((s) => ({ 
          ...s, 
          price_max: newValue,
          page: 1 
        }));
      }
    }
  };

  const handlePriceMinChange = (e) => {
    const value = Number(e.target.value);
    if (value < priceMax) {
      setFilters((s) => ({ 
        ...s, 
        price_min: value,
        page: 1 
      }));
    }
  };

  const handlePriceMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value > priceMin) {
      setFilters((s) => ({ 
        ...s, 
        price_max: value,
        page: 1 
      }));
    }
  };

  const handlePricePreset = (min, max) => {
    setFilters((s) => ({
      ...s,
      price_min: min,
      price_max: max,
      page: 1,
    }));
  };

  const handleMinInputChange = (e) => {
    const value = parseInputPrice(e.target.value);
    if (value < priceMax) {
      setFilters((s) => ({ 
        ...s, 
        price_min: value,
        page: 1 
      }));
    }
  };

  const handleMaxInputChange = (e) => {
    const value = parseInputPrice(e.target.value);
    if (value > priceMin) {
      setFilters((s) => ({ 
        ...s, 
        price_max: value,
        page: 1 
      }));
    }
  };

  // Get display values for inputs
  const minDisplayValue = priceMin === 0 ? "0" : formatDisplayPrice(priceMin);
  const maxDisplayValue = formatDisplayPrice(priceMax);

  return (
    <aside className={styles.filters}>
      <div className={styles["filter-card"]}>

        {/* SEARCH */}
        <div className={styles["filter-block"]}>
          <label className={styles["filter-label"]}>Search</label>
          <div className={styles["search-wrapper"]}>
            {/* <FiSearch /> */}
            <FiSearch className={styles["search-icon"]} />
            <input
            className={styles["filter-search"]}
              placeholder="Search brand, model..."
              value={filters.search || ""}
              onChange={(e) =>
                setFilters((s) => ({
                  ...s,
                  search: e.target.value,
                  page: 1,
                }))
              }
            />
          </div>
        </div>

        {/* PRICE RANGE */}
        <div className={styles["filter-block"]}>
          <div className={styles["section-head"]}>
            <label className={styles["filter-label"]}>Price Range</label>
            {/* <button 
              className={styles["reset-mini"]}
              onClick={() => {
                setFilters(s => ({
                  ...s,
                  price_min: 0,
                  price_max: 5000000,
                  page: 1
                }));
              }}
            >
              Reset
            </button> */}
          </div>

          {/* Price Preset Buttons */}
          <div className={styles["price-presets"]}>
            {pricePresets.map((preset) => {
              const isActive = priceMin === preset.min && priceMax === preset.max;
              return (
                <button
                  key={preset.label}
                  className={`${styles["price-preset-btn"]} ${
                    isActive ? styles["active"] : ""
                  }`}
                  onClick={() => handlePricePreset(preset.min, preset.max)}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Range Slider */}
          <div className={styles["range-container"]}>
            <div className={styles["slider-wrapper"]}>
              <div 
                ref={sliderTrackRef}
                className={styles["slider-track"]}
                style={{
                  '--min-percent': `${(priceMin / 5000000) * 100}%`,
                  '--max-percent': `${(priceMax / 5000000) * 100}%`
                }}
                onClick={handleSliderClick}
              >
                <div className={styles["slider-range"]}></div>
              </div>
              
              <input
                type="range"
                min="0"
                max="5000000"
                step="10000"
                value={priceMin}
                onChange={handlePriceMinChange}
                className={styles["slider-thumb-min"]}
                aria-label="Minimum price"
              />
              
              <input
                type="range"
                min="0"
                max="5000000"
                step="10000"
                value={priceMax}
                onChange={handlePriceMaxChange}
                className={styles["slider-thumb-max"]}
                aria-label="Maximum price"
              />
            </div>
            
            <div className={styles["slider-labels"]}>
              <span>₹0</span>
              <span>₹50 L</span>
            </div>
          </div>

          {/* Price Inputs */}
          <div className={styles["price-inputs"]}>
            <div className={styles["price-input-group"]}>
              <label className={styles["price-input-label"]}>Minimum</label>
              <div className={styles["price-input-wrapper"]}>
                <span className={styles["currency"]}>₹</span>
                <input
                  type="text"
                  value={minDisplayValue}
                  onChange={handleMinInputChange}
                  className={styles["price-input"]}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className={styles["price-separator"]}>–</div>
            
            <div className={styles["price-input-group"]}>
              <label className={styles["price-input-label"]}>Maximum</label>
              <div className={styles["price-input-wrapper"]}>
                <span className={styles["currency"]}>₹</span>
                <input
                  type="text"
                  value={maxDisplayValue}
                  onChange={handleMaxInputChange}
                  className={styles["price-input"]}
                  placeholder="50 L"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BRANDS */}
        <div className={styles["filter-block"]}>
          <label className={styles["filter-label"]}>Brands</label>
          {BRANDS.map((b) => (
            <label key={b} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={(filters.brand || []).includes(b)}
                onChange={() => toggleArray("brand", b)}
              />
              <span>{b}</span>
            </label>
          ))}
        </div>

        {/* YEAR */}
        <div className={styles["filter-block"]}>
          <label className={styles["filter-label"]}>Year</label>
          {YEARS.map((y) => (
            <label key={y} className={styles.radio}>
              <input
                type="radio"
                checked={filters.year_min === y}
                onChange={() =>
                  setFilters((s) => ({
                    ...s,
                    year_min: y,
                    page: 1,
                  }))
                }
              />
              <span>{y} & above</span>
            </label>
          ))}
        </div>

        {/* KM DRIVEN */}
        <div className={styles["filter-block"]}>
          <label className={styles["filter-label"]}>Km Driven</label>
          {[25000, 50000, 75000, 100000].map((k) => (
            <label key={k} className={styles.checkbox}>
              <input
                type="radio"
                checked={filters.km_max === k}
                onChange={() =>
                  setFilters((s) => ({
                    ...s,
                    km_max: k,
                    page: 1,
                  }))
                }
              />
              <span>Up to {k.toLocaleString()} km</span>
            </label>
          ))}
        </div>

        {/* FUEL */}
        <div className={styles["filter-block"]}>
          <label className={styles["filter-label"]}>Fuel</label>
          {FUELS.map((f) => (
            <label key={f} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={(filters.fuel || []).includes(f)}
                onChange={() => toggleArray("fuel", f)}
              />
              <span>{f}</span>
            </label>
          ))}
        </div>

        {/* BODY TYPE */}
        <div className={styles["filter-block"]}>
          <label className={styles["filter-label"]}>Body Type</label>
          {BODY_TYPES.map((b) => (
            <label key={b} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={(filters.body || []).includes(b)}
                onChange={() => toggleArray("body", b)}
              />
              <span>{b}</span>
            </label>
          ))}
        </div>

        {/* TRANSMISSION */}
        <div className={styles["filter-block"]}>
          <div className={styles["section-head"]}>
            <label>Transmission</label>
            <button onClick={() => toggleSection("transmission")}>
              {open.transmission ? "▾" : "▸"}
            </button>
          </div>

          {open.transmission &&
            ["Automatic", "Manual"].map((t) => (
              <label key={t} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={(filters.transmission || []).includes(t)}
                  onChange={() => toggleArray("transmission", t)}
                />
                <span>{t}</span>
              </label>
            ))}
        </div>

        {/* ✅ COLOR (FIXED) */}
        <div className={styles["filter-block"]}>
          <div className={styles["section-head"]}>
            <label>Color</label>
            <button onClick={() => toggleSection("color")}>
              {open.color ? "▾" : "▸"}
            </button>
          </div>

          {open.color && (
            <div className={styles["color-swatches"]}>
              {Object.entries(COLOR_PALETTE).map(([key, hex]) => (
                <button
                  key={key}
                  type="button"
                  className={`${styles.swatch} ${
                    (filters.color || []).includes(key)
                      ? styles["swatch-selected"]
                      : ""
                  } ${hex === "#FFFFFF" ? styles["swatch-white"] : ""}`}
                  style={{ backgroundColor: hex }}
                  onClick={() => toggleArray("color", key)}
                  title={key}
                />
              ))}
            </div>
          )}
        </div>

        {/* RESET */}
        {/* <button
          className={styles["reset-btn"]}
          onClick={() =>
            setFilters({
              search: "",
              price_min: 0,
              price_max: 5000000,
              year_min: null,
              km_max: null,
              brand: [],
              color: [],
              fuel: [],
              body: [],
              transmission: [],
              ordering: "-created_at",
              page: 1,
            })
          }
        >
          Reset Filters
        </button> */}

      </div>
    </aside>
  );
}