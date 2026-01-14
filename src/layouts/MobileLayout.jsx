import React, { useEffect, useState, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "../styles/MobileLayout.css";
import Sidebar from "../components/Sidebar";
import CitySelectorModal from "../components/CitySelectorModal";
import BottomNav from "../components/BottomNav";

export default function MobileLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Lucknow");
  const [collapsed, setCollapsed] = useState(false);

  const [cityOpen, setCityOpen] = useState(false);
  const handleSelect = (city) => {
    setSelectedCity(city); 
    console.log("selected city:", city);
    // update app state / close modal
    setCityOpen(false);
  };  

  // lock body scroll when sidebar open
  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  // Handle scroll to collapse/expand search row
  useEffect(() => {
    let lastY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    const onScroll = () => {
      const currentY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const diff = currentY - lastY;

      // At top → expanded
      if (currentY <= 5) {
        setCollapsed(false);
      }
      // Scroll down → collapse
      else if (diff > 4) {
        setCollapsed(true);
      }
      // Small scroll up → expand
      else if (diff < -4) {
        setCollapsed(false);
      }

      lastY = currentY;
    };

    // Check initial state
    const initialY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    setCollapsed(initialY > 5);
    lastY = initialY;

    window.addEventListener("scroll", onScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="ml-root">
      <header className="ml-topbar" role="banner">
        <div className="ml-topbar-row1">
          <div className="ml-left">
            <button className="ml-hamburger ml-btn" onClick={() => setOpen(true)} aria-label="Open menu">☰</button>
            <div className="ml-brand">
              <img src={process.env.PUBLIC_URL + "/carsdedo-background.png"} alt="CarsDedo" className="ml-logo" />
            </div>
          </div>

          {/* Compact search/location - appears only when collapsed */}
          <div className={`ml-row1-compact ${collapsed ? "show" : ""}`}>
            <div onClick={() => setCityOpen(true)} className="ml-location-compact">{selectedCity} ▾</div>
            <div 
              onClick={() => navigate("/search")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate("/search");
                }
              }} 
              className="ml-search-wrap-compact" 
              role="search"
            >
              <span className="ml-search-placeholder">Search cars</span>
              <button className="ml-search-icon" aria-label="Open search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </div>

          <div className="ml-right">
            <button 
              className="ml-top-action" 
              onClick={() => navigate("/sell")}
            >
              Sell
            </button>
            <button 
              className={`ml-top-action ${location.pathname === "/buy" ? "ml-top-action--active" : ""}`}
              onClick={() => navigate("/buy")}
            >
              Buy
            </button>
          </div>
        </div>

        {/* Expanded search/location - hidden when collapsed */}
        <div className={`ml-topbar-row2 ${collapsed ? "hidden" : ""}`} data-collapsed={collapsed}>
          <div onClick={() => setCityOpen(true)} className="ml-location"> {selectedCity} ▾</div>

          <div 
            onClick={() => navigate("/search")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate("/search");
              }
            }} 
            className="ml-search-wrap" 
            role="search"
          >
            <input
              className="ml-search-input"
              placeholder="Search assured cars"
              aria-label="Search cars"
            />
            <button className="ml-search-icon" aria-label="Open search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="ml-main" style={{ paddingTop: collapsed ? '60px' : '130px', transition: 'padding-top 0.3s ease' }}>
        {children ?? <Outlet />}
      </main>

      <Sidebar open={open} onClose={() => setOpen(false)} />
      <CitySelectorModal
        open={cityOpen}
        onClose={() => setCityOpen(false)}
        onSelect={handleSelect}
        selectedCity={selectedCity} 
        
        // headerImage optional - uses uploaded image by default
        // headerImage={"/mnt/data/2b9a208d-8d89-4111-9ca0-bdd4df2506e8.png"}
      />

      <BottomNav/>
    </div>
  );
}
