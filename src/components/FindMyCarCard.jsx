// components/FindMyCarCard.jsx
import React from "react";
import "../styles/MobileCards.css";

export default function FindMyCarCard({
  title = "Find the perfect\ncar for you!",
  desc = "Answer a few questions to find a car that fits your needs.",
  cta = "Fin my car",
  img = process.env.PUBLIC_URL + "/options.jpeg", // replace with your art
  onClick = () => alert("Find my car pressed"),
}) {
  return (
    <div className="mc-card mc-find">
      <div className="mc-left">
        <h3 className="mc-heading">{title}</h3>
        <p className="mc-desc">{desc}</p>
        <button className="mc-cta" onClick={onClick}>
          {cta}
        </button>
      </div>

      <div className="mc-right">
        <img src={img} alt="" className="mc-illustration" />
      </div>
    </div>
  );
}
