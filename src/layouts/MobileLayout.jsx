import React, { useEffect, useState, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "../styles/MobileLayout.css";
import Sidebar from "../components/Sidebar";
import CitySelectorModal from "../components/CitySelectorModal";
import BottomNav from "../components/BottomNav";

const ROW2_HEIGHT = 70; // Height of the search/location row

export default function MobileLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Lucknow");
  const [row2Offset, setRow2Offset] = useState(0); // How much row2 is translated up

  // Use refs to track scroll state without causing re-renders
  const lastScrollYRef = useRef(0);
  const currentOffsetRef = useRef(0);
  const tickingRef = useRef(false);
  const mainRef = useRef(null); // Ref to the main scrolling container

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

  // Handle scroll to slide row2 up/down
  useEffect(() => {
    // Small delay to ensure ref is attached
    const setupScroll = () => {
      const mainElement = mainRef.current;
      if (!mainElement) {
        return null;
      }

      const updateRow2 = () => {
        // Get scroll position from the main element
        const scrollY = mainElement.scrollTop || 0;
        const scrollDiff = scrollY - lastScrollYRef.current;

        // At the very top, always show row2
        if (scrollY <= 5) {
          currentOffsetRef.current = 0;
        } else {
          // Adjust offset based on scroll direction
          currentOffsetRef.current = Math.max(0, Math.min(ROW2_HEIGHT, currentOffsetRef.current + scrollDiff));
        }

        setRow2Offset(currentOffsetRef.current);
        lastScrollYRef.current = scrollY;
        tickingRef.current = false;
      };

      const onScroll = () => {
        if (!tickingRef.current) {
          window.requestAnimationFrame(updateRow2);
          tickingRef.current = true;
        }
      };

      // Initialize
      const initialScrollY = mainElement.scrollTop || 0;
      
      if (initialScrollY > 5) {
        currentOffsetRef.current = Math.min(ROW2_HEIGHT, initialScrollY);
        setRow2Offset(currentOffsetRef.current);
      }
      lastScrollYRef.current = initialScrollY;

      // Listen to scroll on the main element
      mainElement.addEventListener("scroll", onScroll, { passive: true });
      
      // Return cleanup function
      return () => {
        mainElement.removeEventListener("scroll", onScroll);
      };
    };

    // Use setTimeout to ensure DOM is ready
    const timer = setTimeout(() => {
      const cleanup = setupScroll();
      // Store cleanup for later
      if (cleanup) {
        timer.cleanup = cleanup;
      }
    }, 100); // 100ms delay to ensure DOM is rendered
    
    return () => {
      clearTimeout(timer);
      if (timer.cleanup) {
        timer.cleanup();
      }
    };
  }, []);

  // Calculate styles based on offset
  const row2Style = {
    transform: `translateY(-${row2Offset}px)`,
    opacity: Math.max(0, 1 - (row2Offset / ROW2_HEIGHT)),
  };

  const isCollapsed = row2Offset > ROW2_HEIGHT * 0.9; // Show compact view when 90% hidden (almost fully)
  const mainPaddingTop = 64 + Math.max(0, ROW2_HEIGHT - row2Offset);

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

          {/* Compact search/location - appears when row2 is mostly hidden */}
          <div className={`ml-row1-compact ${isCollapsed ? "show" : ""}`}>
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

        {/* Expanded search/location - slides up behind row1 on scroll */}
        <div className="ml-topbar-row2" style={row2Style}>
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

      <main ref={mainRef} className="ml-main" style={{ paddingTop: `${mainPaddingTop}px` }}>
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
