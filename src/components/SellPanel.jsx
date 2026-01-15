// src/components/SellPanel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/sellPanel.css"

const BRANDS = [
  { id: "maruti", label: "Maruti Suzuki", logo: process.env.PUBLIC_URL + "/maruti-suzuki.avif"},
  { id: "hyundai", label: "Hyundai", logo: process.env.PUBLIC_URL + "/hyundai.avif" },
  { id: "tata", label: "Tata", logo: process.env.PUBLIC_URL + "/tata.avif" },
  { id: "honda", label: "Honda", logo: process.env.PUBLIC_URL + "/honda.avif" },
  { id: "renault", label: "Renault", logo: process.env.PUBLIC_URL + "/renault.avif"  },
  { id: "ford", label: "Ford", logo: process.env.PUBLIC_URL + "/file.webp" },
  { id: "vw", label: "Volkswagen", logo: process.env.PUBLIC_URL + "/volkswagen.avif" },
  { id: "mahindra", label: "Mahindra", logo: process.env.PUBLIC_URL + "/mahindra.webp" },
  { id: "kia", label: "Kia", logo: process.env.PUBLIC_URL + "/v1.avif" },
  { id: "bmw", label: "BMW", logo: process.env.PUBLIC_URL + "/v1 (1).avif" },
  { id: "mercedes", label: "Mercedes-Benz", logo: process.env.PUBLIC_URL + "/merc.avif" },
];

export default function SellPanel() {
  const navigate = useNavigate();

  return (
    <section className="sell-panel">
      <div className="sell-card">
        <div className="sell-left">
          {/* Use a video thumbnail or a poster image. If you have a video, replace img with <video> */}
          <div className="sell-media">
            <img src="/promo/sell-thumb.jpg" alt="Sell your car" />
            <button className="play-btn" aria-label="Play video" onClick={() => window.open('https://www.youtube.com', '_blank')}>▶</button>
            <div className="sell-overlay-text">Sell your car for the best price</div>
          </div>
        </div>

        <div className="sell-right">
          <h3 className="sell-title">Select your car brand to get started</h3>

          <div className="sell-features">
            <div className="feature">⚡ Instant online quote</div>
            <div className="feature">📋 Free car evaluation</div>
            <div className="feature">₹ Same day payment</div>
          </div>

          <div className="brand-grid">
            {BRANDS.map((b) => (
              <button key={b.id} className="brand-card" onClick={() => navigate("/sell")}>
                <img src={b.logo} alt={b.label} />
                <div className="brand-label">{b.label}</div>
              </button>
            ))}
            <button className="brand-card more" onClick={() => navigate("/sell")}>MORE</button>
          </div>

          <div className="sell-cta-row">
            <button className="get-price" onClick={() => navigate("/sell")}>Get price</button>
            <div className="sellright-brand">SellRight</div>
          </div>
        </div>
      </div>
    </section>
  );
}
