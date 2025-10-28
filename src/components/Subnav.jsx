import React from "react";

export default function Subnav() {
  return (
    <div className="subnav">
      <div className="subnav-inner">
        <div className="dropdown">
          <div className="sub-item">Explore By</div>
        </div>

        <div className="dropdown">
          <div className="sub-item">Price Range ▾</div>
          <div className="dropdown-menu dark">
            <div className="dropdown-item">Under ₹5 Lakh</div>
            <div className="dropdown-item">₹5–10 Lakh</div>
            <div className="dropdown-item">₹10–20 Lakh</div>
            <div className="dropdown-item">₹20 Lakh+</div>
          </div>
        </div>

        <div className="dropdown">
          <div className="sub-item">Make & Model ▾</div>
          <div className="dropdown-menu dark">
            <div className="dropdown-item">Hyundai</div>
            <div className="dropdown-item">Maruti Suzuki</div>
            <div className="dropdown-item">Tata</div>
            <div className="dropdown-item">Mahindra</div>
            <div className="dropdown-item">Toyota</div>
          </div>
        </div>

        <div className="dropdown">
          <div className="sub-item">Year ▾</div>
          <div className="dropdown-menu dark">
            <div className="dropdown-item">2024 - 2025</div>
            <div className="dropdown-item">2020 - 2023</div>
            <div className="dropdown-item">Before 2020</div>
          </div>
        </div>

        <div className="dropdown">
          <div className="sub-item">Fuel ▾</div>
          <div className="dropdown-menu dark">
            <div className="dropdown-item">Petrol</div>
            <div className="dropdown-item">Diesel</div>
            <div className="dropdown-item">CNG</div>
            <div className="dropdown-item">Electric</div>
          </div>
        </div>

        <div className="dropdown">
          <div className="sub-item">KM Driven ▾</div>
          <div className="dropdown-menu dark">
            <div className="dropdown-item">Under 25,000 KM</div>
            <div className="dropdown-item">25K–50K KM</div>
            <div className="dropdown-item">50K–100K KM</div>
            <div className="dropdown-item">1,00,000+ KM</div>
          </div>
        </div>

        <div className="dropdown">
          <div className="sub-item">Body Type ▾</div>
          <div className="dropdown-menu dark">
            <div className="dropdown-item">Hatchback</div>
            <div className="dropdown-item">Sedan</div>
            <div className="dropdown-item">SUV</div>
            <div className="dropdown-item">MUV</div>
          </div>
        </div>

        <div className="dropdown">
          <div className="sub-item">Transmission ▾</div>
          <div className="dropdown-menu dark">
            <div className="dropdown-item">Manual</div>
            <div className="dropdown-item">Automatic</div>
            <div className="dropdown-item">AMT</div>
          </div>
        </div>
      </div>
    </div>
  );
}
