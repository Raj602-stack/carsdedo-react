import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BrandsGridMob.css";

/**
 * BrandsGrid
 * - Replace the image paths with your real brand logos in public/
 * - The `brands` array controls which cards show up. You can also pass props if you want.
 */
const brands = [
  { id: "b1", name: "Maruti Suzuki", count: "310+ cars", logo: process.env.PUBLIC_URL + "/maruti-suzuki.avif" },
  { id: "b2", name: "Hyundai", count: "220+ cars", logo: process.env.PUBLIC_URL + "/hyundailogo.avif" },
  { id: "b3", name: "Honda", count: "140+ cars", logo: process.env.PUBLIC_URL + "/honda.avif" },
  { id: "b4", name: "Tata", count: "120+ cars", logo: process.env.PUBLIC_URL + "/tatalogo.avif" },
  { id: "b5", name: "Kia", count: "70+ cars", logo: process.env.PUBLIC_URL + "/kialogo.avif" },
  { id: "b6", name: "Renault", count: "60+ cars", logo: process.env.PUBLIC_URL + "/renault.avif" },
  { id: "b7", name: "Ford", count: "40+ cars", logo: process.env.PUBLIC_URL + "/fordlogo.avif" },
  { id: "b8", name: "Mahindra", count: "30+ cars", logo: process.env.PUBLIC_URL + "/mahindralogo.avif" },
  { id: "b9", name: "Skoda", count: "20+ cars", logo: process.env.PUBLIC_URL + "/skodalogo.avif" },
];

export default function BrandsGridMob({ onViewAll }) {
  const navigate = useNavigate();

  const handleBrandClick = (brand) => {
    navigate(`/buy?brand=${encodeURIComponent(brand.name)}`);
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate("/buy");
    }
  };

  return (
    <section className="brands-section" aria-label="Explore popular brands">
      <div className="brands-inner">
        <h2 className="brands-title">Explore Popular Brands</h2>

        <div className="brands-grid" role="list">
          {brands.map((b) => (
            <button
              key={b.id}
              className="brand-card"
              role="listitem"
              onClick={() => handleBrandClick(b)}
              aria-label={`View ${b.name}`}
            >
              <div className="brand-logo-wrap">
                <img src={b.logo} alt={b.name + " logo"} className="brand-logo" />
              </div>
              {/* <div className="brand-name">{b.name}</div> */}
              <div className="brand-count">{b.count}</div>
            </button>
          ))}

          {/* bottom-left promo card (spans two columns on desktop) */}
          <div className="brand-card promo" role="listitem" aria-hidden>
          <div className="promo-logos">
  <img
    src={process.env.PUBLIC_URL + "/shortlogoo.png"}
    alt="CarsDedo"
    className="promo-logo-img"
  />
  
  <img
    src={process.env.PUBLIC_URL + "/max.png"} 
    alt="Premium Brand"
    className="promo-logo-img"
  />
</div>

          </div>

          {/* bottom-right view-all */}
          <button
            className="brand-card view-all"
            onClick={handleViewAll}
            aria-label="View all brands"
          >
            <div className="view-all-inner">
              <div className="view-all-text">View all brands ›</div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
