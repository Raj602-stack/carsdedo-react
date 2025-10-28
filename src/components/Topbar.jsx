import React from "react";

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="logo">
          <img className="logo-img" src="/carsdedo.jpeg" alt="Company Logo" />
        </div>
        <div className="location">Lucknow ▾</div>
      </div>

      <div className="topbar-center">
        <input
          className="top-search"
          placeholder="Search by assured plus cars"
        />
      </div>

      <div className="topbar-right">
        <nav className="top-actions">
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
  );
}
