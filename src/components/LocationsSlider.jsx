import React, { useEffect, useRef, useState } from "react";
import "../styles/LocationsSlider.css";

/**
 * Usage:
 * <LocationsSlider />
 *
 * Replace LOCATIONS array images with your own /public paths.
 */

const LOCATIONS = [
  {
    id: "delhi",
    title: "Delhi NCR",
    bg: "#FFD93B", // background color for the card
    hubs: "10 hubs",
    cars: "2030+ cars",
    image: process.env.PUBLIC_URL + "/delhi.avif",
  },
  {
    id: "hyderabad",
    title: "Hyderabad",
    bg: "#9C72C3",
    hubs: "4 hubs",
    cars: "960+ cars",
    image: process.env.PUBLIC_URL + "/hyderabad.avif",
  },
  {
    id: "bangalore",
    title: "Bangalore",
    bg: "#9FA4FF",
    hubs: "7 hubs",
    cars: "780+ cars",
    image: process.env.PUBLIC_URL + "/banglore.avif",
  },
  {
    id: "pune",
    title: "Pune",
    bg: "#4FB084",
    hubs: "4 hubs",
    cars: "700+ cars",
    image: process.env.PUBLIC_URL + "/pune.avif",
  },
  // add more if required
];

const getVisibleCount = (width) => {
  if (width <= 600) return 1;
  if (width <= 1000) return 2;
  return 4;
};

export default function LocationsSlider({ items = LOCATIONS, withAutoplay = false }) {
  const [visible, setVisible] = useState(() => getVisibleCount(window.innerWidth));
  const [index, setIndex] = useState(0); // leftmost visible item index
  const trackRef = useRef(null);
  const autoplayRef = useRef(null);

  useEffect(() => {
    const onResize = () => setVisible(getVisibleCount(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // clamp index whenever visible/items change
  useEffect(() => {
    const maxIndex = Math.max(0, items.length - visible);
    setIndex((i) => Math.min(i, maxIndex));
  }, [visible, items.length]);

  // optional autoplay
  useEffect(() => {
    if (!withAutoplay) return;
    autoplayRef.current = setInterval(() => {
      setIndex((i) => {
        const maxIndex = Math.max(0, items.length - visible);
        return i >= maxIndex ? 0 : i + 1;
      });
    }, 3500);
    return () => clearInterval(autoplayRef.current);
  }, [withAutoplay, items.length, visible]);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => {
    const maxIndex = Math.max(0, items.length - visible);
    setIndex((i) => Math.min(maxIndex, i + 1));
  };

  // track calculations
  const itemWidthPct = 100 / visible;
  const trackWidthPct = items.length * itemWidthPct;
  const translatePct = index * itemWidthPct;

  return (
    <section className="ls-section" aria-label="cars across india">
      <div className="ls-inner">
        <h2 className="ls-title">
          <span className="ls-rule" aria-hidden />
          Cars across India
          <span className="ls-rule" aria-hidden />
        </h2>

        <div className="ls-wrapper">
          <button className="ls-arrow left" onClick={prev} aria-label="previous" disabled={index === 0}>
            ‹
          </button>

          <div className="ls-viewport">
            <div
              ref={trackRef}
              className="ls-track"
              style={{
                width: `${trackWidthPct}%`,
                transform: `translateX(-${translatePct}%)`,
              }}
            >
              {items.map((it) => (
                <div
                  className="ls-item"
                  key={it.id}
                  style={{ width: `${itemWidthPct}%`, padding: "0 12px", boxSizing: "border-box" }}
                >
                  <article className="ls-card" style={{ background: it.bg }}>
                    <h3 className="ls-card-title">{it.title}</h3>

                    {/* diamond / rotated center image */}
                    <div className="ls-diamond-wrap" aria-hidden>
                      <div className="ls-diamond">
                        {/* image rotated back to appear upright inside rotated container */}
                        <img src={it.image} alt={it.title} />
                      </div>
                    </div>

                    <div className="ls-meta">
                      <span className="ls-hubs">{it.hubs}</span>
                      <span className="ls-sep">·</span>
                      <span className="ls-cars">{it.cars}</span>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <button
            className="ls-arrow right"
            onClick={next}
            aria-label="next"
            disabled={index >= Math.max(0, items.length - visible)}
          >
            ›
          </button>
        </div>

        <div className="ls-cta">
          <button className="ls-view-all">View all locations</button>
        </div>
      </div>
    </section>
  );
}
