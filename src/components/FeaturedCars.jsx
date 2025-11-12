import React, { useRef, useState, useEffect } from "react";
import "../styles/FeaturedCars.css";

/* Example data - replace image paths with real files in your public folder */
const BEST_BUYS = [
  {
    id: "b1",
    image: process.env.PUBLIC_URL + "/baleno.avif",
    title: "2020 Maruti Baleno",
    trim: "Zeta",
    price: "₹5.46 Lakh",
    emi: "EMI ₹9,298/m*",
    tags: ["33,500 km", "Petrol", "Manual", "DL3C"],
  },
  {
    id: "b2",
    image: process.env.PUBLIC_URL + "/venue.avif",
    title: "2023 Volkswagen Taigun",
    trim: "Highline 1.0 TSI AT",
    price: "₹10.39 Lakh",
    emi: "EMI ₹17,868/m*",
    tags: ["22,000 km", "Petrol", "Automatic", "DL7C"],
  },
  {
    id: "b3",
    image: process.env.PUBLIC_URL + "/vento.avif",
    title: "2022 Maruti Swift",
    trim: "VXi AMT",
    price: "₹6.02 Lakh",
    emi: "EMI ₹10,251/m*",
    tags: ["17,500 km", "Petrol", "Automatic", "DL9C"],
  },
];

const NEWLY_ADDED = [
  {
    id: "n1",
    image: process.env.PUBLIC_URL + "/innova.avif",
    title: "2024 Hyundai Creta",
    trim: "SX(O)",
    price: "₹13.20 Lakh",
    emi: "EMI ₹21,000/m*",
    tags: ["2,100 km", "Petrol", "Automatic", "DL2A"],
  },
  {
    id: "n2",
    image: process.env.PUBLIC_URL + "/innova.avif",
    title: "2024 Toyota Urban Cruiser",
    trim: "VX",
    price: "₹9.35 Lakh",
    emi: "EMI ₹14,800/m*",
    tags: ["1,800 km", "Petrol", "Manual", "DL5B"],
  },
];

export default function FeaturedCars() {
  const [activeTab, setActiveTab] = useState("best");
  const containerRef = useRef(null);

  const items = activeTab === "best" ? BEST_BUYS : NEWLY_ADDED;

  // scroll to start when tab changes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "smooth" });
  }, [activeTab]);

  // scroll by one card width
  const scrollByCard = (dir = 1) => {
    const el = containerRef.current;
    if (!el) return;
    const card = el.querySelector(".fc-card");
    if (!card) return;
    const cardWidth = card.offsetWidth + parseInt(getComputedStyle(card).marginRight || 12);
    el.scrollBy({ left: cardWidth * dir, behavior: "smooth" });
  };

  return (
    <section className="fc-section" aria-label="Featured cars">
      <div className="fc-inner">
        <h2 className="fc-title">Featured CarsDedo cars</h2>

        <div className="fc-pill-wrap">
          <div
            className={`fc-pill ${activeTab === "best" ? "active" : ""}`}
            onClick={() => setActiveTab("best")}
            role="button"
            tabIndex={0}
          >
            Best buys.. 
          </div>
          <div
            className={`fc-pill ${activeTab === "new" ? "active" : ""}`}
            onClick={() => setActiveTab("new")}
            role="button"
            tabIndex={0}
          >
            Newly added
          </div>
        </div>

        <div className="fc-carousel-wrap">
          <button
            className="fc-nav fc-prev"
            aria-label="Previous"
            onClick={() => scrollByCard(-1)}
          >
            ‹
          </button>

          <div
            className="fc-viewport"
            ref={containerRef}
            // allow programmatic focus etc
          >
            <div className="fc-track">
              {items.map((c) => (
                <article key={c.id} className="fc-card" role="group" aria-label={c.title}>
                  <div className="fc-image" style={{ backgroundImage: `url(${c.image})` }} />
                  <div className="fc-body">
                    <div className="fc-row">
                      <div className="fc-title-line">{c.title}</div>
                      <div className="fc-price">{c.price}</div>
                    </div>
                    <div className="fc-trim">{c.trim}</div>
                    <div className="fc-tags">
                      {c.tags.map((t, i) => (
                        <span key={i} className="fc-tag">{t}</span>
                      ))}
                    </div>

                    <div className="fc-bottom-row">
                      <div className="fc-hub">HUB • Gaur City Mall, Noida</div>
                      <div className="fc-assured">Assured</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <button
            className="fc-nav fc-next"
            aria-label="Next"
            onClick={() => scrollByCard(1)}
          >
            ›
          </button>
        </div>

        <div className="fc-action">
          <button className="fc-view-all">View all CarsDedo cars</button>
        </div>
      </div>
    </section>
  );
}
