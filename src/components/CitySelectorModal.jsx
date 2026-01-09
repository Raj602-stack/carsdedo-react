import React, { useEffect, useRef } from "react";
import "../styles/CitySelectorModal.css";

/**
 * CitySelectorModal
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onSelect: (city) => void
 * - headerImage?: string (optional image url)
 */
export default function CitySelectorModal({
  open,
  onClose,
  onSelect,
  selectedCity = "Lucknow",
  headerImage = "/mnt/data/987949e3-8737-42a6-b4dc-775dfa4097ec.png",
  
}) {

  const enabledCities = ["Lucknow"];

  const overlayRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    // trap focus to search input when opened
    if (open) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 80);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

 

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && open) onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  

  // Map each city to its image (PUT YOUR IMAGE PATHS HERE)
const cityImages = {
    Lucknow: process.env.PUBLIC_URL + "/lucknow.png",
    DelhiNCR:process.env.PUBLIC_URL + "/delhincr.png",
    Bangalore: process.env.PUBLIC_URL + "/banglore.png",
    Hyderabad: process.env.PUBLIC_URL + "/hyderabad.png",
    Mumbai: process.env.PUBLIC_URL + "/mumbai.png",
    Pune:process.env.PUBLIC_URL + "/pune.png",
    Delhi: process.env.PUBLIC_URL + "/delhincr.png",
    Gurgaon: process.env.PUBLIC_URL + "/gurgaon.png",
    Noida: process.env.PUBLIC_URL + "/noida.png",
    Ahmedabad: process.env.PUBLIC_URL + "/ahmedabad.png",
    Chennai: process.env.PUBLIC_URL + "/chennai.png",
    Kolkata: process.env.PUBLIC_URL + "/kolkata.png",
    
    Jaipur: process.env.PUBLIC_URL + "/jaipur.png",
    Chandigarh: process.env.PUBLIC_URL + "/chandigarh.png",
  
    // More cities (optional images):
    Ambala: "/images/cities/ambala.png",
    Coimbatore: "/images/cities/coimbatore.png",
    Faridabad: "/images/cities/faridabad.png",
    Ghaziabad: "/images/cities/ghaziabad.png",
    Agra: "/images/cities/agra.png",
  };
  

  const popular = [
    "Lucknow",
    "DelhiNCR",
    "Bangalore",
    "Hyderabad",
    "Mumbai",
    "Pune",
    "Delhi",
    "Gurgaon",
    "Noida",
    "Ahmedabad",
    "Chennai",
    "Kolkata",
    
    "Jaipur",
    "Chandigarh",
  ];

  const more = ["Ambala", "Coimbatore", "Faridabad", "Ghaziabad", "Agra"];

  return (
    <div
      className="cs-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Select your city"
      ref={overlayRef}
      onClick={(e) => {
        // close only when clicking backdrop
        if (e.target === overlayRef.current) onClose?.();
      }}
    >
      <div className="cs-sheet" role="document">
        <button className="cs-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="cs-header">
          {headerImage ? (
            <img src={headerImage} alt="Cities" className="cs-header-img" />
          ) : null}
          <div className="cs-header-controls">
           
            {/* <div className="cs-search">
              <input
                ref={searchRef}
                type="search"
                placeholder="Search for your city"
                aria-label="Search for your city"
              />
              <button className="cs-detect" aria-label="Detect location">
                ⊕ Detect
              </button>
            </div> */}
          </div>
        </div>

        <div className="cs-body">
          <h3 className="cs-subheading">POPULAR CITIES</h3>

          {/* <div className="cs-grid">
            {popular.map((c,index) => (
              <button
                key={c}
                className={`cs-grid-item ${c === selectedCity ? "selected" : ""}`}
                onClick={() => onSelect?.(c)}
              >
               
                <div className="cs-icon" aria-hidden>
                  
                  <img
    src={cityImages[c] || "/images/cities/default.png"}
    
    alt=""
    className="cs-city-img"
  />
                </div>
                <div className="cs-city">{c}</div>
              </button>
            ))}
          </div> */}

<div className="cs-grid">
  {popular.map((c) => {
    const isEnabled = enabledCities.includes(c);
    const isSelected = c === selectedCity;

    return (
      <button
        key={c}
        className={`cs-grid-item 
          ${isSelected ? "selected" : ""} 
          ${!isEnabled ? "disabled" : ""}`
        }
        disabled={!isEnabled}
        onClick={() => {
          if (isEnabled) onSelect?.(c);
        }}
      >
        <div className="cs-icon" aria-hidden>
          <img
            src={cityImages[c] || "/images/cities/default.png"}
            alt=""
            className="cs-city-img"
          />
        </div>

        <div className="cs-city">{c}</div>

        {!isEnabled && (
          <div className="cs-coming-soon">Coming Soon</div>
        )}
      </button>
    );
  })}
</div>


          {/* <h4 className="cs-more-title">MORE CITIES</h4>
          <ul className="cs-more-list">
            {more.map((m) => (
              <li key={m}>
                <button className="cs-more-item" onClick={() => onSelect?.(m)}>
                  {m}
                </button>
              </li>
            ))}
          </ul> */}
        </div>
      </div>
    </div>
  );
}
