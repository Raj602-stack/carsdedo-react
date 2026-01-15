import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BrandsGrid.css";

/**
 * Example usage:
 *  <BrandsGrid />
 *
 * Replace the `logo` paths with your real /public paths.
 */

const BRANDS = [
  { key: "maruti", name: "Maruti Suzuki", count: "320+ cars", logo:  process.env.PUBLIC_URL + "/marutilogo.avif"},
  { key: "hyundai", name: "Hyundai", count: "230+ cars", logo:  process.env.PUBLIC_URL + "/hyundailogo.avif" },
  { key: "honda", name: "Honda", count: "130+ cars", logo:  process.env.PUBLIC_URL + "/hondalogo.avif"},
  { key: "tata", name: "Tata", count: "120+ cars", logo:  process.env.PUBLIC_URL + "/tatalogo.avif" },
  { key: "kia", name: "Kia", count: "70+ cars", logo: process.env.PUBLIC_URL + "/kialogo.avif" },
  { key: "renault", name: "Renault", count: "60+ cars", logo:  process.env.PUBLIC_URL + "/renaultlogo.avif" },

  { key: "ford", name: "Ford", count: "40+ cars", logo:  process.env.PUBLIC_URL + "/fordlogo.avif"},
  { key: "mahindra", name: "Mahindra", count: "30+ cars", logo: process.env.PUBLIC_URL + "/mahindralogo.avif" },
  { key: "skoda", name: "Skoda", count: "30+ cars", logo:  process.env.PUBLIC_URL + "/skodalogo.avif" },
  { key: "vw", name: "Volkswagen", count: "20+ cars", logo:  process.env.PUBLIC_URL + "/volkslogo.avif" },
  { key: "toyota", name: "Toyota", count: "20+ cars", logo:  process.env.PUBLIC_URL + "/toyotalogo.avif"},
];

export default function BrandsGrid({ brands = BRANDS, onViewAll, onBrandClick }) {
  const navigate = useNavigate();

  const handleBrandClick = (brand) => {
    if (onBrandClick) {
      onBrandClick(brand);
    } else {
      navigate(`/buy?brand=${encodeURIComponent(brand.name)}`);
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate("/buy");
    }
  };

  return (
    <section className="bg-section" aria-labelledby="bg-title">
      <div className="bg-inner">
        <h2 id="bg-title" className="bg-title">
          <span className="bg-rule" aria-hidden="true" />
          Explore Popular Brands
          <span className="bg-rule" aria-hidden="true" />
        </h2>

        <div className="bg-grid" role="list">
          {brands.map((b) => (
            <button
              key={b.key}
              className="bg-card"
              onClick={() => handleBrandClick(b)}
              type="button"
              role="listitem"
              aria-label={`View ${b.name} cars`}
            >
              <div className="bg-card-inner">
                <div className="bg-logo">
                  {/* Use img tag so /public logos work */}
                  <img src={b.logo} alt={b.name} loading="lazy" />
                </div>
                <div className="bg-name">{b.name}</div>
                {b.count ? <div className="bg-count">{b.count}</div> : <div className="bg-spacer" />}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-cta">
          <button className="bg-view-all" onClick={handleViewAll}>
            View all cars
          </button>
        </div>
      </div>
    </section>
  );
}
