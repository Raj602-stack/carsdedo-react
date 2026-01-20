// src/components/Topbar.jsx
import React, { useEffect, useRef, useState } from "react";
import "../styles/Topbar.css"; // make sure path is correct
import { Link, useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { useCars } from "../context/CarsContext";
import { useLocation } from "react-router-dom";


export default function Topbar() {
  const navigate = useNavigate();
  const { cars, loading } = useCars();
  const [searchValue, setSearchValue] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(
    typeof window !== "undefined" ? localStorage.getItem("selectedCity") || "Lucknow" : "Lucknow"
  );
 
  const modalRef = useRef(null);


  // -------------------------

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  
  
  const handleSearch = (value) => {
    setQuery(value);
  
    // Don't show suggestions if data is still loading
    if (loading) {
      setSuggestions([]);
      return;
    }
  
    if (!value.trim() || !cars || cars.length === 0) {
      setSuggestions([]);
      return;
    }
  
    const q = value.toLowerCase();
  
    const matches = cars
      .filter((c) => {
        const searchText = `${c.title || ''} ${c.brand || ''} ${c.model || ''} ${c.fuel || ''} ${c.body || ''} ${c.city || ''} ${c.transmission || ''} ${c.color_key || ''}`.toLowerCase();
        return searchText.includes(q);
      })
      .slice(0, 6); // limit suggestions
  
    setSuggestions(matches);
  };
  


  // ===========================

  const popularCities = [
    "Lucknow",
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


const location = useLocation();

useEffect(() => {
  // Clear search when route changes
  setQuery("");
  setSuggestions([]);
  setSearchValue("");
}, [location.pathname]);

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
          <Link to="/">
            <img className="logo-img" src="/carsdedo.jpeg" alt="Company Logo" />
            </Link>
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

          {/* <input
            className="top-search"
            placeholder="Search by assured plus cars"
            aria-label="Search by assured plus cars"
  
            onChange={(e) => handleSearch(e.target.value)}
          /> */}

<input
  className="top-search"
  placeholder={loading ? "Loading cars..." : "Search cars, brands, models…"}
  value={searchValue}              // 🔑 controlled
  disabled={loading}                // Disable input while loading
  onChange={(e) => {
    const val = e.target.value;
    setSearchValue(val);
    handleSearch(val);
  }}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && searchValue.trim() && !loading) {
      navigate(`/buy?q=${encodeURIComponent(searchValue.trim())}`);
      setSuggestions([]);
      setQuery("");
      setSearchValue("");
    }
  }}
/>

            {loading && searchValue.trim() && (
              <div className="search-suggestions">
                <div className="suggestion-item" style={{ 
                  textAlign: 'center', 
                  color: '#666', 
                  cursor: 'default',
                  pointerEvents: 'none'
                }}>
                  Loading suggestions...
                </div>
              </div>
            )}

            {!loading && suggestions.length > 0 && (
    <div className="search-suggestions">
      {suggestions.map((car) => {
        // Only use brand and model for filtering, not body/fuel
        const params = new URLSearchParams();
        if (car.brand) params.append('brand', car.brand);
        if (car.model) params.append('model', car.model);
        
        return (
          <div
            key={car.id}
            className="suggestion-item"
            onClick={() => {
              navigate(`/buy?${params.toString()}`);
              setSuggestions([]);
              setQuery("");
              setSearchValue("");
            }}
          >
            <strong>{car.brand || 'Unknown'}</strong> {car.model || ''}
            <span className="meta">
              {[car.body, car.fuel, car.city].filter(Boolean).join(' · ')}
            </span>
          </div>
        );
      })}
    </div>
  )}



        </div>

        <div className="topbar-right">
  {/* LEFT PART: menus */}
  <nav className="top-actions" aria-label="Top actions">
    <div className="dropdown">
      <div className="action">Buy Car ▾</div>
      <div className="dropdown-menu">
        <div onClick={() => navigate("/buy")}  className="dropdown-item">Used Cars</div>
        <div className="dropdown-item">Certified Cars</div>
      </div>
    </div>

    <div className="dropdown">
      <div className="action">Sell Car ▾</div>
      <div className="dropdown-menu">
        <div onClick={() => navigate("/sell")}  className="dropdown-item">sell Used Cars</div>
        <div className="dropdown-item">Certified Cars</div>
      </div>
    </div>

    <div className="dropdown">
      <div className="action">More ▾</div>
      <div className="dropdown-menu">
        <div onClick={() => navigate("/blog")} className="dropdown-item">Blogs</div>
      </div>
    </div>
  </nav>

  {/* RIGHT PART: shortlist + account */}
  <div className="topbar-user">
    <div onClick={() => navigate("/wishlist")} className="shortlist">
    <FiHeart className="shortlist-icon" />
       <span className="badge">1</span>
      <div className="label">Shortlisted</div>
    </div>

    <div className="account dropdown">
  <div className="account-trigger">
    <FiUser className="account-icon" />
    <div className="action">Account ▾</div>
  </div>

  <div className="dropdown-menu">
    <div onClick={() => navigate("/account")} className="dropdown-item">Your Account</div>
    <div onClick={() => navigate("/login")} className="dropdown-item">Login</div>
  </div>
</div>


    <div className="call">
      Call us: <strong>+91 98109 92133</strong>
    </div>
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
            <div style={{marginBottom:"20px"}} className="modal-header">
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

            {/* <div className="search-box">
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
            </div> */}

<section className="popular-section">
  <div className="section-title">POPULAR CITIES</div>

  <div className="popular-grid">
    {popularCities.map((city) => {
      const isActiveCity = city === "Lucknow";
      const isSelected = city === selectedCity && isActiveCity;

      return (
        <button
          key={city}
          className={`city-card 
            ${isSelected ? "selected" : ""} 
            ${!isActiveCity ? "disabled" : ""}`}
          onClick={() => {
            if (isActiveCity) handleSelectCity(city);
          }}
          disabled={!isActiveCity}
          aria-pressed={isSelected}
          aria-disabled={!isActiveCity}
        >
          <img
            src={cityImages[city] || defaultCityIcon}
            alt={`${city} icon`}
            className="city-icon-img"
            loading="lazy"
          />

          <div className="city-name">{city}</div>

          {!isActiveCity && (
            <div className="coming-soon">Coming Soon</div>
          )}
        </button>
      );
    })}
  </div>
</section>


            {/* <section className="more-section">
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
                  </button>
                ))}
              </div>
            </section> */}

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
