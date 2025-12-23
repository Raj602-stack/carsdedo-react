import React from "react";
import { useNavigate } from "react-router-dom";

export default function Subnav() {
  const navigate = useNavigate();

  const goToBuy = (filters) => {
    const params = new URLSearchParams(filters).toString();
    navigate(`/buy?${params}`);
  };

  return (
    <div className="subnav">
      <div className="subnav-inner">

        {/* Explore By */}
        <div className="dropdown">
          <div
            className="sub-item"
            onClick={() => navigate("/buy")}
          >
            Explore By
          </div>
        </div>

        {/* Price Range */}
        <div className="dropdown">
          <div className="sub-item">Price Range ▾</div>
          <div className="dropdown-menu dark">
            <div className="dropdown-item" onClick={() => goToBuy({ price: "under-5" })}>
              Under ₹5 Lakh
            </div>
            <div className="dropdown-item" onClick={() => goToBuy({ price: "5-10" })}>
              ₹5–10 Lakh
            </div>
            <div className="dropdown-item" onClick={() => goToBuy({ price: "10-20" })}>
              ₹10–20 Lakh
            </div>
            <div className="dropdown-item" onClick={() => goToBuy({ price: "20+" })}>
              ₹20 Lakh+
            </div>
          </div>
        </div>

        {/* Make & Model */}
        <div className="dropdown">
          <div className="sub-item">Make & Model ▾</div>
          <div className="dropdown-menu dark">
            {["Hyundai", "Maruti Suzuki", "Tata", "Mahindra", "Toyota"].map((make) => (
              <div
                key={make}
                className="dropdown-item"
                onClick={() => goToBuy({ make: make.toLowerCase().replace(" ", "-") })}
              >
                {make}
              </div>
            ))}
          </div>
        </div>

        {/* Year */}
        <div className="dropdown">
          <div className="sub-item">Year ▾</div>
          <div className="dropdown-menu dark">
            <div className="dropdown-item" onClick={() => goToBuy({ year: "2024-2025" })}>
              2024 - 2025
            </div>
            <div className="dropdown-item" onClick={() => goToBuy({ year: "2020-2023" })}>
              2020 - 2023
            </div>
            <div className="dropdown-item" onClick={() => goToBuy({ year: "before-2020" })}>
              Before 2020
            </div>
          </div>
        </div>

        {/* Fuel */}
        <div className="dropdown">
          <div className="sub-item">Fuel ▾</div>
          <div className="dropdown-menu dark">
            {["Petrol", "Diesel", "CNG", "Electric"].map((fuel) => (
              <div
                key={fuel}
                className="dropdown-item"
                onClick={() => goToBuy({ fuel: fuel.toLowerCase() })}
              >
                {fuel}
              </div>
            ))}
          </div>
        </div>

        {/* KM Driven */}
        <div className="dropdown">
          <div className="sub-item">KM Driven ▾</div>
          <div className="dropdown-menu dark">
            <div className="dropdown-item" onClick={() => goToBuy({ km: "under-25" })}>
              Under 25,000 KM
            </div>
            <div className="dropdown-item" onClick={() => goToBuy({ km: "25-50" })}>
              25K–50K KM
            </div>
            <div className="dropdown-item" onClick={() => goToBuy({ km: "50-100" })}>
              50K–100K KM
            </div>
            <div className="dropdown-item" onClick={() => goToBuy({ km: "100+" })}>
              1,00,000+ KM
            </div>
          </div>
        </div>

        {/* Body Type */}
        <div className="dropdown">
          <div className="sub-item">Body Type ▾</div>
          <div className="dropdown-menu dark">
            {["Hatchback", "Sedan", "SUV", "MUV"].map((body) => (
              <div
                key={body}
                className="dropdown-item"
                onClick={() => goToBuy({ body: body.toLowerCase() })}
              >
                {body}
              </div>
            ))}
          </div>
        </div>

        {/* Transmission */}
        <div className="dropdown">
          <div className="sub-item">Transmission ▾</div>
          <div className="dropdown-menu dark">
            {["Manual", "Automatic", "AMT"].map((t) => (
              <div
                key={t}
                className="dropdown-item"
                onClick={() => goToBuy({ transmission: t.toLowerCase() })}
              >
                {t}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
