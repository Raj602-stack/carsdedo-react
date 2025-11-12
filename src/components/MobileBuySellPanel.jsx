import React, { useState } from "react";
import "../styles/MobileBuySellPanel.css";

/**
 * MobileBuySellPanel
 * - Shows a pill toggle ("Buy" / "Sell") centered at top of a card.
 * - Renders different content for Buy vs Sell underneath (images, bullet highlights, CTA).
 * - Use inside your mobile shell: <MobileBuySellPanel />
 */

export default function MobileBuySellPanel() {
  const [mode, setMode] = useState("buy"); // 'buy' or 'sell'

  return (
    <section className="mbs-root" aria-label="Buy or Sell panel">
      <div className="mbs-card">
        {/* Pill toggle - visually overlapping top edge */}
        <div className="mbs-pill" role="tablist" aria-label="Choose mode">
          <button
            role="tab"
            aria-selected={mode === "buy"}
            className={`mbs-pill-btn ${mode === "buy" ? "active" : ""}`}
            onClick={() => setMode("buy")}
          >
            Buy
          </button>
          <button
            role="tab"
            aria-selected={mode === "sell"}
            className={`mbs-pill-btn ${mode === "sell" ? "active" : ""}`}
            onClick={() => setMode("sell")}
          >
            Sell
          </button>
        </div>

        {/* Hero image / top area */}
        <div className="mbs-hero">
          {/* Play icon (left) */}
          <button
            className="mbs-play"
            aria-label="Play video"
            onClick={() => window.alert("Play video")}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="rgba(255,255,255,0.95)" />
              <path d="M10 8v8l6-4-6-4z" fill="#2d063b" />
            </svg>
          </button>

          {/* Title takes up center */}
          <div className="mbs-hero-title">
            {mode === "buy" ? (
              <>
                <div className="mbs-hero-kicker">Spinny Assured</div>
                <h3 className="mbs-hero-head"><img src={process.env.PUBLIC_URL + "/shortlogoo.png"}/>benefits</h3>
              </>
            ) : (
              <>
                <div className="mbs-hero-kicker">Sell your car</div>
                <h3 className="mbs-hero-head">get the best price</h3>
              </>
            )}
          </div>
        </div>

        {/* Body depending on mode */}
        <div className="mbs-body">
          {mode === "buy" ? <BuyContent /> : <SellContent />}
        </div>

        {/* CTA */}
        <div className="mbs-cta-wrap">
          <button
            className="mbs-cta-primary"
            onClick={() =>
              window.alert(mode === "buy" ? "Browse cars" : "Get price")
            }
          >
            {mode === "buy" ? "Browse cars" : "Get price"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---- Buy content ---- */
function BuyContent() {
  const bullets = [
    { key: 1, title: "200-Points Inspection", desc: "Every car is handpicked after a quality inspection." },
    { key: 2, title: "Warranty included", desc: "We support you through the ownership journey." },
    { key: 3, title: "5-Day Money Back", desc: "No-questions-asked 5-day money back guarantee." },
    { key: 4, title: "Fixed Price Assurance", desc: "Transparent pricing — no endless negotiations." },
  ];

  return (
    <div className="mbs-features">
      {bullets.map((b) => (
        <div className="mbs-feature" key={b.key}>
          <div className="mbs-feature-icon" aria-hidden>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="#7a45f0" strokeWidth="1.6" />
              <path d="M7 12l3 3 7-7" stroke="#7a45f0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="mbs-feature-text">
            <div className="mbs-feature-title">{b.title}</div>
            <div className="mbs-feature-desc">{b.desc}</div>
          </div>
        </div>
      ))}

      <a className="mbs-learn" href="#learn" onClick={(e)=>e.preventDefault()}>Learn more</a>
    </div>
  );
}

/* ---- Sell content ---- */
function SellContent() {
  const brands = [
    { name: "Maruti Suzuki", img: process.env.PUBLIC_URL + "/marutilogo.avif"},
    { name: "Hyundai", img: process.env.PUBLIC_URL + "/hyundailogo.avif"},
    { name: "Tata", img: process.env.PUBLIC_URL + "/tata.avif" },
    { name: "Honda", img:process.env.PUBLIC_URL + "/hondalogo.avif"  },
    { name: "Renault", img: process.env.PUBLIC_URL + "/renault.avif"  },
    { name: "Ford", img: process.env.PUBLIC_URL + "/fordlogo.avif" },
    { name: "Volkswagen", img: process.env.PUBLIC_URL + "/volkslogo.avif" },
    { name: "Mahindra", img: process.env.PUBLIC_URL + "/mahindralogo.avif"  },
  ];
  

  return (
    <div className="mbs-sell">
      <ul className="mbs-sell-list">
        <li className="mbs-sell-point">Instant online quote</li>
        <li className="mbs-sell-point">Free car evaluation</li>
        <li className="mbs-sell-point">Same day payment</li>
      </ul>

      <div className="mbs-sell-grid">
        {brands.map((b, i) => (
          <div className="mbs-brand" key={b.name}>
          <div className="mbs-brand-box">
            <img
              src={process.env.PUBLIC_URL + b.img}
              alt={b.name}
              className="mbs-brand-img"
            />
          </div>
          <div className="mbs-brand-name">{b.name}</div>
        </div>
        
        ))}
        <div className="mbs-brand mbs-brand-more">
          <div className="mbs-brand-box">...</div>
          <div className="mbs-brand-name">MORE</div>
        </div>
      </div>

      <div className="mbs-sell-footer">
        <img src={process.env.PUBLIC_URL + "/shortlogoo.png"} alt="SellRight" className="mbs-sell-logo"/>
      </div>
    </div>
  );
}
