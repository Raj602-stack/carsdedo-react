// src/components/Topbar.jsx
import React, { useEffect, useRef, useState } from "react";
import "../styles/Topbar.css"; // make sure path is correct

export default function Topbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(
    typeof window !== "undefined" ? localStorage.getItem("selectedCity") || "Lucknow" : "Lucknow"
  );
  const [query, setQuery] = useState("");
  const modalRef = useRef(null);

  const popularCities = [
    "Delhi NCR",
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
    "Lucknow",
    "Jaipur",
    "Chandigarh",
  ];


  const cityImages = {
    "Delhi NCR":process.env.PUBLIC_URL + "/delhincr.png",
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
    Lucknow: process.env.PUBLIC_URL + "/lucknow.png",
    Jaipur: process.env.PUBLIC_URL + "/jaipur.png",
    Chandigarh: process.env.PUBLIC_URL + "/chandigarh.png",
  
    // More cities (optional images):
    Ambala: "/images/cities/ambala.png",
    Coimbatore: "/images/cities/coimbatore.png",
    Faridabad: "/images/cities/faridabad.png",
    Ghaziabad: "/images/cities/ghaziabad.png",
    Agra: "/images/cities/agra.png",
  };
  

  const moreCities = [
    "Ambala",
    "Coimbatore",
    "Faridabad",
    "Ghaziabad",
    "Kanpur",
    "Karnal",
    "Kochi",
    "Mysuru",
    "Sonipat",
    "Visakhapatnam",
  ];

  const allCities = Array.from(new Set([...popularCities, ...moreCities]));

  // mapping city -> image path (public folder)
  // const cityImages = {
  //   "Delhi NCR": "/city-icons/delhi.png",
  //   "Bangalore": "/city-icons/bangalore.png",
  //   "Hyderabad": "/city-icons/hyderabad.png",
  //   "Mumbai": "/city-icons/mumbai.png",
  //   "Pune": "/city-icons/pune.png",
  //   "Delhi": "/city-icons/delhi.png",
  //   "Gurgaon": "/city-icons/gurgaon.png",
  //   "Noida": "/city-icons/noida.png",
  //   "Ahmedabad": "/city-icons/ahmedabad.png",
  //   "Chennai": "/city-icons/chennai.png",
  //   "Kolkata": "/city-icons/kolkata.png",
  //   "Lucknow": "/city-icons/lucknow.png",
  //   "Jaipur": "/city-icons/jaipur.png",
  //   "Chandigarh": "/city-icons/chandigarh.png",
  //   Ambala: "/city-icons/ambala.png",
  //   Coimbatore: "/city-icons/coimbatore.png",
  //   Faridabad: "/city-icons/faridabad.png",
  //   Ghaziabad: "/city-icons/ghaziabad.png",
  //   Kanpur: "/city-icons/kanpur.png",
  //   Karnal: "/city-icons/karnal.png",
  //   Kochi: "/city-icons/kochi.png",
  //   Mysuru: "/city-icons/mysuru.png",
  //   Sonipat: "/city-icons/sonipat.png",
  //   Visakhapatnam: "/city-icons/visakhapatnam.png",
  // };

  const defaultCityIcon = "/city-icons/default.png";

  // close on Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // close if clicked outside modal
  useEffect(() => {
    function onMousedown(e) {
      if (!isOpen) return;
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onMousedown);
    return () => document.removeEventListener("mousedown", onMousedown);
  }, [isOpen]);

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    try {
      localStorage.setItem("selectedCity", city);
    } catch (err) {
      /* ignore storage errors in weird environments */
    }
    setIsOpen(false);
    setQuery("");
  };

  const filteredCities = allCities.filter((c) =>
    c.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
      <header className="topbar" role="banner">
        <div className="topbar-left">
          <div className="logo">
            <img className="logo-img" src="/carsdedo.jpeg" alt="Company Logo" />
          </div>

          {/* clickable location that opens modal */}
          <div
            className="location location-btn"
            role="button"
            tabIndex={0}
            onClick={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setIsOpen(true);
            }}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            title="Select city"
          >
            {selectedCity} <span className="caret">▾</span>
          </div>
        </div>

        <div className="topbar-center">
          <input
            className="top-search"
            placeholder="Search by assured plus cars"
            aria-label="Search by assured plus cars"
          />
        </div>

        <div className="topbar-right">
          <nav className="top-actions" aria-label="Top actions">
            {/* BUY CAR */}
            <div className="dropdown">
              <div className="action">Buy Car ▾</div>
              <div className="dropdown-menu">
                <div className="dropdown-item">Used Cars</div>
                <div className="dropdown-item">Certified Cars</div>
                <div className="dropdown-item">Cars Under ₹5 Lakh</div>
                <div className="dropdown-item">New Arrivals</div>
                <div className="dropdown-item">View All</div>
              </div>
            </div>

            {/* SELL CAR */}
            <div className="dropdown">
              <div className="action">Sell Car ▾</div>
              <div className="dropdown-menu">
                <div className="dropdown-item">Instant Online Quote</div>
                <div className="dropdown-item">Car Inspection Booking</div>
                <div className="dropdown-item">Exchange My Car</div>
                <div className="dropdown-item">Get Best Price</div>
              </div>
            </div>

            {/* SERVICE */}
            <div className="dropdown">
              <div className="action">Service ▾</div>
              <div className="dropdown-menu">
                <div className="dropdown-item">Periodic Maintenance</div>
                <div className="dropdown-item">Car Wash & Detailing</div>
                <div className="dropdown-item">Tyre Replacement</div>
                <div className="dropdown-item">Insurance Renewal</div>
                <div className="dropdown-item">Roadside Assistance</div>
              </div>
            </div>
          </nav>

          <div className="call">
            Call us: <strong>9664573074</strong>
          </div>
        </div>
      </header>

      {/* City modal (covers screen for desktop) */}
      {isOpen && (
        <div className="modal-overlay" aria-hidden={!isOpen}>
          <div
            className="modal"
            ref={modalRef}
            role="dialog"
            aria-label="Select a city"
            aria-modal="true"
          >
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Select a city</h3>
                <div className="modal-subtitle">Popular cities & more</div>
              </div>

              <button
                className="modal-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="search-box">
              <svg
                className="search-icon"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M12.9 14.32a8 8 0 111.414-1.414l4.3 4.3a1 1 0 01-1.414 1.414l-4.3-4.3zM8 14a6 6 0 100-12 6 6 0 000 12z" />
              </svg>
              <input
                className="search-input"
                placeholder="Search for a city"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search cities"
              />
            </div>

            <section className="popular-section">
              <div className="section-title">POPULAR CITIES</div>
              <div className="popular-grid">
                {popularCities.map((city) => {
                  const isSelected = city === selectedCity;
                  return (
                    <button
                      key={city}
                      className={`city-card ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSelectCity(city)}
                      aria-pressed={isSelected}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSelectCity(city);
                      }}
                    >
                      <img
                        src={cityImages[city] || defaultCityIcon}
                        alt={`${city} icon`}
                        className="city-icon-img"
                        loading="lazy"
                      />
                      <div className="city-name">{city}</div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="more-section">
              <div className="section-title">MORE CITIES</div>
              <div className="pills" role="list">
                {moreCities.map((city) => (
                  <button
                    key={city}
                    className={`pillv ${city === selectedCity ? "pill-selected" : ""}`}
                    onClick={() => handleSelectCity(city)}
                    role="listitem"
                  >
                    {city}
                    {/* if you want a "New" badge per city, insert a <span className="new">New</span> */}
                  </button>
                ))}
              </div>
            </section>

            {query.trim() !== "" && (
              <section className="search-results">
                <div className="results-title">Search results</div>
                <div className="results-list">
                  {filteredCities.length === 0 ? (
                    <div className="no-results">No cities found</div>
                  ) : (
                    filteredCities.map((city) => (
                      <div
                        key={city}
                        className="result-item"
                        onClick={() => handleSelectCity(city)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSelectCity(city);
                        }}
                      >
                        {city}
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </>
  );
}
