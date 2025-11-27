// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

/* Desktop pages/layout (existing) */
import Layout from "./pages/Layout";
import Home from "./pages/Home";

/* Mobile layout & page */
import useIsMobile from "./hooks/useIsMobile";
import MobileLayout from "./layouts/MobileLayout";
import MobileHome from "./components/MobileHome";
import MobileSellPage from "./pages/MobileSellPage";

/* Shared pages */
import BuyPage from "./pages/BuyPage";
import CarDetails from "./pages/CarDetails";

/**
 * App - chooses between mobile shell and desktop routes.
 * MobileLayout is used only for MobileHome and MobileSellPage.
 * BuyPage / CarDetails are top-level routes so they can render their own headers/footers.
 */
export default function App() {
  const isMobile = useIsMobile(900);

  // ------------------- Mobile routes -------------------
  if (isMobile) {
    return (
      <Routes>
        {/* Mobile shell only wraps the home & sell flows */}
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<MobileHome />} />
          <Route path="sell" element={<MobileSellPage />} />
        </Route>

        {/* Buy & details pages: standalone routes so they can render their own nav/footer */}
        <Route path="buy" element={<BuyPage />} />
        <Route path="car/:id" element={<CarDetails />} />

        {/* fallback -> mobile home */}
        <Route path="*" element={<MobileHome />} />
      </Routes>
    );
  }

  // ------------------- Desktop routes -------------------
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* listing and details are siblings under the desktop layout */}
        <Route path="buy" element={<BuyPage />} />
        <Route path="car/:id" element={<CarDetails />} />

        {/* add other desktop routes here */}
      </Route>
    </Routes>
  );
}
