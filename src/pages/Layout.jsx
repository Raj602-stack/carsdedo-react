// src/layout/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";
import Subnav from "../components/Subnav";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <div className="page">
      <Topbar />
      <Subnav />

      {/* page-specific content will render here */}
      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
