import React from "react";
import "../styles/PopularCities.css";

// Decorative/preview image you uploaded (already in your workspace)
const HEADER_IMG = "/mnt/data/0df45643-8ecd-45d8-ae6f-08f5b2dba370.png";

/**
 * PopularCities
 *
 * Props:
 *  - cities: array of { id, name, onClick? }  (optional)
 *  - onCityClick(cityName) (optional callback)
 *
 * Example usage:
 *  <PopularCities
 *    cities={[ "Ahmedabad", "Bangalore", "Chennai", "Delhi", ... ]}
 *    onCityClick={(c) => console.log("pick", c)}
 *  />
 */
export default function PopularCities({ cities, onCityClick }) {
  const defaultCities = [
    "Ahmedabad",
    "Bangalore",
    "Chennai",
    "Delhi",
    "Gurgaon",
    "Hyderabad",
    "Jaipur",
    "Kolkata",
    "Lucknow",
    "Mumbai",
    "Noida",
    "Pune",
  ];

  const list = Array.isArray(cities) && cities.length ? cities : defaultCities;

  return (
    <section className="pc-root" aria-labelledby="pc-heading">
      <div className="pc-inner">
        <div className="pc-header">
          <img src={HEADER_IMG} alt="" className="pc-decor" aria-hidden="true" />
          <h2 id="pc-heading" className="pc-title">Popular cities</h2>
          <div className="pc-rule" aria-hidden="true" />
        </div>

        <div className="pc-grid" role="list">
          {list.map((city) => (
            <button
              key={city}
              role="listitem"
              type="button"
              className="pc-chip"
              onClick={() => onCityClick?.(city)}
              aria-label={`Sell car in ${city}`}
            >
              <span className="pc-chip-text">Sell car in {city}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
