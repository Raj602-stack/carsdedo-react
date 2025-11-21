import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import "../styles/MobileLayout.css";
import Sidebar from "../components/Sidebar";
import CitySelectorModal from "../components/CitySelectorModal";
import BottomNav from "../components/BottomNav";

export default function MobileLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Delhi");

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

          <div className="ml-right">
            <button className="ml-top-action">Sell</button>
            <button className="ml-top-action ml-top-action--active">Buy</button>
          </div>
        </div>

        <div className="ml-topbar-row2">
          <div onClick={() => setCityOpen(true)} className="ml-location"> {selectedCity} ▾</div>

          <div className="ml-search-wrap" role="search">
            <input
              className="ml-search-input"
              placeholder="Search by assured plus cars"
              aria-label="Search cars"
            />
            <button className="ml-search-icon" aria-label="Open search">🔍</button>
          </div>
        </div>
      </header>

      <main className="ml-main">{children}</main>

      <main className="ml-main">
        {/* Prefer nested routes when using <Route element={<MobileLayout/>}> */}
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
