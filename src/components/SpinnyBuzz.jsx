import React, { useState, useEffect, useRef } from "react";
import "../styles/SpinnyBuzz.css";

const SAMPLE = [
  {
    id: "b1",
    source: "AFAQS",
    title: "Someone share bond with their dogs in new Spinny ad",
    image: process.env.PUBLIC_URL + "/moneyback.png",
    url: "#",
  },
  {
    id: "b2",
    source: "AFAQS",
    title: "carsDedo celebrate 3 years of partnership",
    image: process.env.PUBLIC_URL + "/fixedprice.png",
    url: "#",
  },
  {
    id: "b3",
    source: "Yourstory",
    title: "Earning trust with no shortcuts, no price negotiations",
    image: process.env.PUBLIC_URL + "/inspection.png",
    url: "#",
  },
  {
    id: "b4",
    source: "Dainik Bhaskar",
    title: "CarsDedo Park Lucknow with North-India's Largest car inventory",
    image: process.env.PUBLIC_URL + "/warranty.png",
    url: "#",
  },
  // add more if you want the carousel longer
];

export default function SpinnyBuzz({ items = SAMPLE }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(getVisibleCount(window.innerWidth));
  const trackRef = useRef(null);

  useEffect(() => {
    const onResize = () => setVisible(getVisibleCount(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    // clamp index when visible or items change
    const max = Math.max(0, items.length - visible);
    setIndex((i) => Math.min(i, max));
  }, [visible, items.length]);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () =>
    setIndex((i) => Math.min(i + 1, Math.max(0, items.length - visible)));

  const itemWidthPercent = 100 / visible;
  const trackWidthPercent = items.length * itemWidthPercent;
  const translatePercent = index * itemWidthPercent;

  return (
    <section className="sb-section">
      <div className="sb-inner">
        <h2 className="sb-title">
          <span className="sb-rule" />
          <span>CarsDedo Buzz</span>
          <span className="sb-rule" />
        </h2>

        <div className="sb-wrapper">
          <button
            className="sb-arrow left"
            onClick={prev}
            aria-label="Previous"
            disabled={index === 0}
          >
            ‹
          </button>

          <div className="sb-viewport">
            <div
              className="sb-track"
              ref={trackRef}
              style={{
                width: `${trackWidthPercent}%`,
                transform: `translateX(-${translatePercent}%)`,
              }}
            >
              {items.map((it) => (
                <article
                  key={it.id}
                  className="sb-item"
                  style={{ width: `${itemWidthPercent}%` }}
                >
                  <a className="sb-card" href={it.url} aria-label={it.title}>
                    <div className="sb-bg">
                      <img src={it.image} alt={it.title} loading="lazy" />
                    </div>

                    <div className="sb-overlay" />

                    <div className="sb-content">
                      <div className="sb-source">{it.source} ›</div>
                      <h3 className="sb-headline">{it.title}</h3>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>

          <button
            className="sb-arrow right"
            onClick={next}
            aria-label="Next"
            disabled={index >= Math.max(0, items.length - visible)}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

/* helper: visible count based on width */
function getVisibleCount(width) {
  if (width <= 600) return 1;
  if (width <= 980) return 2;
  return 4;
}
