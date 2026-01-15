import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/carscatalogue.css";

/* ---------------- SAMPLE DATA ---------------- */
const BEST_BUYS = [
  {
    id: "c1",
    title: "2022 Maruti Suzuki Dzire VXi",
    km: "22K km",
    fuel: "Petrol",
    trans: "Manual",
    priceRupee: "₹5.69 Lakh",
    emi: "EMI from ₹9,699/m",
    tag: "₹22,000 ↓",
    image: process.env.PUBLIC_URL + "/baleno.avif",
  },
  {
    id: "c2",
    title: "2018 Renault Kwid RXL",
    km: "39K km",
    fuel: "Petrol",
    trans: "Manual",
    priceRupee: "₹2.25 Lakh",
    emi: "EMI from ₹3,807/m",
    tag: "₹7,000 ↓",
    image: process.env.PUBLIC_URL + "/baleno.avif",
  },
  {
    id: "c3",
    title: "2018 Maruti Baleno Zeta",
    km: "36K km",
    fuel: "Petrol",
    trans: "Automatic",
    priceRupee: "₹5.54 Lakh",
    emi: "EMI from ₹9,223/m",
    tag: "₹8,000 ↓",
    image: process.env.PUBLIC_URL + "/baleno.avif",
  },
  {
    id: "c4",
    title: "2020 Tata Tiago XZ Plus",
    km: "104K km",
    fuel: "Petrol",
    trans: "Manual",
    priceRupee: "₹4.30 Lakh",
    emi: "EMI from ₹7,204/m",
    tag: "₹9,000 ↓",
    image: process.env.PUBLIC_URL + "/baleno.avif",
  },
  {
    id: "c5",
    title: "2019 Hyundai i20 Asta",
    km: "45K km",
    fuel: "Petrol",
    trans: "Manual",
    priceRupee: "₹6.10 Lakh",
    emi: "EMI from ₹10,200/m",
    tag: "₹11,000 ↓",
    image: process.env.PUBLIC_URL + "/baleno.avif",
  },
];

const NEWLY_ADDED = [
  {
    id: "n1",
    title: "2023 Kia Sonet HTK+",
    km: "8K km",
    fuel: "Petrol",
    trans: "Automatic",
    priceRupee: "₹7.90 Lakh",
    emi: "EMI from ₹12,500/m",
    tag: "New",
    image: process.env.PUBLIC_URL + "/baleno.avif",
  },
  {
    id: "n2",
    title: "2022 Honda Amaze VX",
    km: "12K km",
    fuel: "Petrol",
    trans: "Manual",
    priceRupee: "₹6.85 Lakh",
    emi: "EMI from ₹10,800/m",
    tag: "New",
    image: process.env.PUBLIC_URL + "/baleno.avif",
  },
  {
    id: "n3",
    title: "2021 Toyota Glanza G",
    km: "22K km",
    fuel: "Petrol",
    trans: "Manual",
    priceRupee: "₹6.20 Lakh",
    emi: "EMI from ₹9,800/m",
    tag: "New",
    image: process.env.PUBLIC_URL + "/baleno.avif",
  },
  {
    id: "n4",
    title: "2020 Volkswagen Polo GT",
    km: "34K km",
    fuel: "Petrol",
    trans: "Manual",
    priceRupee: "₹5.80 Lakh",
    emi: "EMI from ₹9,000/m",
    tag: "New",
    image: process.env.PUBLIC_URL + "/baleno.avif",
  },
];

/* ---------------- HELPERS ---------------- */
const getVisibleCount = (width) => {
  if (width <= 720) return 1;
  if (width <= 1100) return 2;
  return 4; // default desktop view
};

/* ---------------- CARD COMPONENT ---------------- */
function CarCard({ car }) {
  const navigate = useNavigate();

  return (
    <div className="card" onClick={() => navigate("/buy")} style={{ cursor: 'pointer' }}>
      <div className="card-media">
        <div className="price-tag">{car.tag}</div>
        <img src={car.image} alt={car.title} />
      </div>
      <div className="card-body">
        <div className="card-title">
          <h4>{car.title}</h4>
          <button className="fav-btn" aria-label="save car" onClick={(e) => { e.stopPropagation(); }}>♡</button>
        </div>
        <div className="meta">
          <span>{car.km}</span> <span>· {car.fuel}</span> <span>· {car.trans}</span>
        </div>
        <div className="price-row">
          <div className="price">{car.priceRupee}</div>
          <div className="emi">{car.emi}</div>
        </div>
        <div className="card-footer">
          <small className="badge">Assured</small>
          <small className="hub">CarsDedo Hub, Indirapuram</small>
        </div>
      </div>
    </div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function CarCatalog() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("best");
  const items = useMemo(() => (mode === "best" ? BEST_BUYS : NEWLY_ADDED), [mode]);

  const [visibleCount, setVisibleCount] = useState(() => getVisibleCount(window.innerWidth));
  const [index, setIndex] = useState(0);
  const carouselRef = useRef(null);

  /* Responsive visible count */
  useEffect(() => {
    let t;
    const handleResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setVisibleCount(getVisibleCount(window.innerWidth)), 120);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* Clamp index when data or visibleCount changes */
  useEffect(() => {
    const max = Math.max(0, items.length - visibleCount);
    setIndex((prev) => Math.min(prev, max));
  }, [items.length, visibleCount]);

  /* Reset index when toggling mode */
  useEffect(() => setIndex(0), [mode]);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(i + 1, Math.max(0, items.length - visibleCount)));

  const itemWidthPercent = 100 / visibleCount;
  const trackWidthPercent = items.length * itemWidthPercent;
  const translatePercent = index * itemWidthPercent;

  return (
    <section className="catalog">
      <h2 className="catalog-title">Featured carsdedo.com cars</h2>

      {/* Toggle */}
      <div className="catalog-toggle-wrapper">
        <div className="catalog-toggle">
          <button
            className={`toggle-btn ${mode === "best" ? "active" : ""}`}
            onClick={() => setMode("best")}
          >
            Best buys for you
          </button>
          <button
            className={`toggle-btn ${mode === "new" ? "active" : ""}`}
            onClick={() => setMode("new")}
          >
            Newly added
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="carousel-wrap">
        <button className="arrow left" onClick={prev} disabled={index === 0}>
          ‹
        </button>

        <div className="carousel-viewport" ref={carouselRef}>
          <div
            className="carousel-track"
            style={{
              width: `${trackWidthPercent}%`,
              transform: `translateX(-${translatePercent}%)`,
            }}
          >
            {items.map((car) => (
              <div
                key={car.id}
                className="carousel-item"
                style={{
                  width: `${itemWidthPercent}%`,
                  padding: "12px",
                  boxSizing: "border-box",
                }}
              >
                <CarCard car={car} />
              </div>
            ))}
          </div>
        </div>

        <button
          className="arrow right"
          onClick={next}
          disabled={index >= Math.max(0, items.length - visibleCount)}
        >
          ›
        </button>
      </div>

      {/* Footer CTA */}
      <div className="catalog-cta">
        <button className="view-all" onClick={() => navigate("/buy")}>View all carsdedo.com cars</button>
      </div>
    </section>
  );
}
