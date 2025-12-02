// src/layout/Layout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Topbar from "../components/Topbar";
import Subnav from "../components/Subnav";
import Footer from "../components/Footer";

export default function Layout() {
  const location = useLocation();
  const pathname = location.pathname || "";

  // Add route patterns where you DON'T want Subnav shown.
  // Update these as needed if your routes differ.
  const hideSubnavFor = [
    /^\/car(\/|$)/,   // any /car/:id route
    /^\/buy(\/|$)/,   // /buy route (or buy page)
    /^\/car-details(\/|$)/, // any other detail-like route (optional)
  ];

  const shouldHideSubnav = hideSubnavFor.some((rx) => rx.test(pathname));

  return (
    <div className="page">
      <Topbar />
      {/* Conditionally render Subnav */}
      {!shouldHideSubnav && <Subnav />}

      {/* page-specific content will render here */}
      <main>
        <Outlet />
      </main>


<Footer />

    </div>
  );
}
