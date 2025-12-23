// src/layout/Layout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Topbar from "../components/Topbar";
import Subnav from "../components/Subnav";
import Footer from "../components/Footer";

export default function Layout() {
  const location = useLocation();
  const pathname = location.pathname || "";

  // Routes where Subnav should be hidden
  const hideSubnavFor = [
    /^\/buy(\/|$)/, 
    /^\/car(\/|$)/,  // any /car/:id route
    // /^\/buy(\/|$)/, // <-- removed: don't hide subnav for /buy
    /^\/car-details(\/|$)/,
    /^\/sell(\/|$)/,
    /^\/login(\/|$)/,
    /^\/account(\/|$)/,
    // keep other patterns as needed
  ];

  const hideFooterFor = [
    
    /^\/login(\/|$)/,
    // keep other patterns as needed
  ];

  // Routes where Topbar should be hidden (only sell for now)
  const hideTopbarFor = [
    /^\/sell(\/|$)/,
  ];

  const shouldHideSubnav = hideSubnavFor.some((rx) => rx.test(pathname));
  const shouldHideTopbar = hideTopbarFor.some((rx) => rx.test(pathname));
  const shouldHideFooter = hideFooterFor.some((rx) => rx.test(pathname));
  return (
    <div className="page">
      {/* Topbar shown except on routes matched by hideTopbarFor */}
      {!shouldHideTopbar && <Topbar />}

      {/* Conditionally render Subnav (hidden on matched routes) */}
      {!shouldHideSubnav && <Subnav />}

      {/* page-specific content will render here */}
      <main>
        <Outlet />
      </main>

     {!shouldHideFooter && <Footer />} 
    </div>
  );
}
