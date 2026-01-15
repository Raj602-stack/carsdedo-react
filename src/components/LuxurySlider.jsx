import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LuxurySlider.css";

const SAMPLE = [
  {
    id: "1",
    image: process.env.PUBLIC_URL + "/venue.avif",
    title: "2022 BMW X1",
    subtitle: "sDrive20i xLine",
    price: "₹27.50 Lakh",
    emi: "EMI ₹47,296/m*",
  },
  {
    id: "2",
    image: process.env.PUBLIC_URL + "/innova.avif",
    title: "2018 Jeep Compass",
    subtitle: "Sport 1.4 Petrol",
    price: "₹7.50 Lakh",
    emi: "EMI ₹12,772/m*",
  },
  {
    id: "3",
    image: process.env.PUBLIC_URL + "/vento.avif",
    title: "2019 Mercedes C-Class",
    subtitle: "C 200",
    price: "₹14.20 Lakh",
    emi: "EMI ₹24,000/m*",
  },
];

export default function LuxurySlider({ cars = SAMPLE }) {
  const navigate = useNavigate();
  const viewportRef = useRef(null);
  const cardRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(320); // initial guess

  useEffect(() => {
    const measure = () => {
      const card = cardRef.current;
      if (!card) return;
      const style = getComputedStyle(card);
      const mr = parseFloat(style.marginRight || 0);
      setCardWidth(card.offsetWidth + mr);
    };
    // measure after paint
    setTimeout(measure, 60);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // scroll by one card
  const scrollByCard = (dir = 1) => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  };

  return (
    <section className="lux-section" aria-label="Luxury cards">
      <div className="lux-card-shell">
        <header className="lux-hero">
          <div className="lux-hero-inner">
            <img
              src={process.env.PUBLIC_URL + "/shortlogoo.png"}
              alt="logo"
              className="lux-logo"
            />
            <div className="lux-title">MAX</div>
            <div className="lux-sub">22+ similar luxury cars</div>
          </div>
        </header>

        <div className="lux-carousel-row">
          <button
            className="lux-arrow lux-left"
            aria-label="Previous"
            onClick={() => scrollByCard(-1)}
          >
            ‹
          </button>

          <div className="lux-viewport" ref={viewportRef}>
            <div className="lux-track">
              {cars.map((c, i) => (
                <article
                  key={c.id}
                  className="lux-card"
                  ref={i === 0 ? cardRef : null}
                  onClick={() => navigate("/buy?tags=luxury,premium")}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className="lux-card-img"
                    style={{ backgroundImage: `url(${c.image})` }}
                    role="img"
                    aria-label={c.title}
                  />
                  <div className="lux-card-body">
                    <div className="lux-row">
                      <div className="lux-title-line">{c.title}</div>
                      <div className="lux-price">{c.price}</div>
                    </div>
                    <div className="lux-subline">{c.subtitle}</div>
                    <div className="lux-emi">{c.emi}</div>
                  </div>
                </article>
              ))}

              {/* Last tile: view more preview */}
              {/* <article className="lux-card lux-more">
                <div className="lux-more-bg" />
                <div className="lux-more-content">
                  <div className="lux-more-text">View more luxury cars</div>
                </div>
              </article> */}

              <article className="lux-card lux-card-more">
                <div className="lux-more-inner">
                  <div className="lux-more-text">View more luxury cars</div>
                  <button className="lux-explore-btn" onClick={() => navigate("/buy?tags=luxury,premium")}>Explore</button>
                </div>
              </article>
            </div>
          </div>

          <button
            className="lux-arrow lux-right"
            aria-label="Next"
            onClick={() => scrollByCard(1)}
          >
            ›
          </button>
        </div>

        <div className="lux-cta-wrap">
          <button className="lux-cta" onClick={() => navigate("/buy?tags=luxury,premium")}>Explore</button>
        </div>
      </div>
    </section>
  );
}
