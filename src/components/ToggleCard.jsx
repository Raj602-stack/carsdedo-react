// src/components/ToggleCard.jsx
import React from "react";

export default function ToggleCard({ mode, setMode }) {
  return (
    <section className="toggle-card">
      <div className="pill">
        <button
          className={`pill-btn ${mode === "buy" ? "active" : ""}`}
          onClick={() => setMode("buy")}
        >
          Buy car
        </button>
        <button
          className={`pill-btn ${mode === "sell" ? "active" : ""}`}
          onClick={() => setMode("sell")}
        >
          Sell car
        </button>
      </div>
    </section>
  );
}
