import React, { useState, useMemo, useEffect, useRef } from "react";
import "../styles/BodyTypeCatalog.css";

/* ---------------- SAMPLE DATA (replace images with real /public paths) ---------------- */
const CARS_BY_BODY = {
  hatchback: [
    { id: "h1", title: "Tata Tiago", price: "₹3.47 Lakh", image:process.env.PUBLIC_URL + "/baleno.avif"},
    { id: "h2", title: "Hyundai Elite i20", price: "₹4.04 Lakh", image: process.env.PUBLIC_URL + "/baleno.avif" },
    { id: "h3", title: "Maruti Alto K10", price: "₹2.89 Lakh", image: process.env.PUBLIC_URL + "/baleno.avif" },
    { id: "h4", title: "Tata Altroz", price: "₹6.05 Lakh", image: process.env.PUBLIC_URL + "/baleno.avif" },
    { id: "h5", title: "Maruti Swift", price: "₹5.10 Lakh", image: process.env.PUBLIC_URL + "/baleno.avif" },
  ],
  sedan: [
    { id: "s1", title: "Honda City", price: "₹9.25 Lakh", image: process.env.PUBLIC_URL + "/vento.avif" },
    { id: "s2", title: "Hyundai Verna", price: "₹10.10 Lakh", image: process.env.PUBLIC_URL + "/vento.avif" },
    { id: "s3", title: "Skoda Slavia", price: "₹11.80 Lakh", image: process.env.PUBLIC_URL + "/vento.avif" },
    { id: "s4", title: "Maruti Ciaz", price: "₹8.90 Lakh", image:process.env.PUBLIC_URL + "/vento.avif" },
  ],
  suv: [
    { id: "u1", title: "Kia Seltos", price: "₹13.50 Lakh", image: process.env.PUBLIC_URL + "/venue.avif"  },
    { id: "u2", title: "Hyundai Creta", price: "₹12.90 Lakh", image: process.env.PUBLIC_URL + "/venue.avif"  },
    { id: "u3", title: "MG Hector", price: "₹14.20 Lakh", image: process.env.PUBLIC_URL + "/venue.avif"  },
    { id: "u4", title: "Tata Harrier", price: "₹15.30 Lakh", image: process.env.PUBLIC_URL + "/venue.avif"  },
  ],
  muv: [
    { id: "m1", title: "Mahindra XUV300", price: "₹7.75 Lakh", image: process.env.PUBLIC_URL + "/innova.avif" },
    { id: "m2", title: "Toyota Innova", price: "₹18.50 Lakh", image: process.env.PUBLIC_URL + "/innova.avif"  },
    { id: "m3", title: "Maruti Ertiga", price: "₹9.20 Lakh", image: process.env.PUBLIC_URL + "/innova.avif"  },
    { id: "m3", title: "Maruti Ertiga", price: "₹9.20 Lakh", image: process.env.PUBLIC_URL + "/innova.avif"  },
  ],
};

/* ---------------- BODY TYPE OPTIONS (with your custom icons) ---------------- */
const BODY_OPTIONS = [
  { key: "hatchback", label: "Hatchback", icon: process.env.PUBLIC_URL + "/hatch.png",},
  { key: "sedan", label: "Sedan", icon:  process.env.PUBLIC_URL + "/sedan.png", },
  { key: "suv", label: "SUV", icon:  process.env.PUBLIC_URL + "/suv.png" },
  { key: "muv", label: "MUV", icon:  process.env.PUBLIC_URL + "/muv.png" },
];

const getVisibleCount = (width) => {
  if (width <= 720) return 1;
  if (width <= 1100) return 2;
  return 4;
};

/* ---------------- CAR CARD ---------------- */
function Card({ car }) {
  return (
    <div className="btc-card">
      <div className="btc-card-media">
        <img src={car.image} alt={car.title} loading="lazy" />
      </div>
      <div className="btc-card-body">
        <div className="btc-card-title">{car.title}</div>
        <div className="btc-card-price">{car.price}</div>
      </div>
    </div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function BodyTypeCatalog() {
  const [active, setActive] = useState("hatchback");
  const cars = useMemo(() => CARS_BY_BODY[active] || [], [active]);

  const [visibleCount, setVisibleCount] = useState(() => getVisibleCount(window.innerWidth));
  const [index, setIndex] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    let tid;
    const onResize = () => {
      clearTimeout(tid);
      tid = setTimeout(() => setVisibleCount(getVisibleCount(window.innerWidth)), 120);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(tid);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => setIndex(0), [active]); // reset index when switching
  useEffect(() => setIndex((i) => Math.min(i, Math.max(0, cars.length - visibleCount))), [cars.length, visibleCount]);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(i + 1, Math.max(0, cars.length - visibleCount)));

  const itemWidthPercent = 100 / visibleCount;
  const trackWidthPercent = cars.length * itemWidthPercent;
  const translatePercent = index * itemWidthPercent;

  const bottomButtonText = `View all ${active[0].toUpperCase() + active.slice(1)}s`;

  return (
    <section className="btc-section">
      <h2 className="btc-title">Explore by Body Type</h2>

      {/* Toggle pill */}
      <div className="btc-toggle-wrap">
        <div className="btc-toggle">
          {BODY_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`btc-toggle-btn ${active === opt.key ? "active" : ""}`}
              onClick={() => setActive(opt.key)}
            >
              <img src={opt.icon} alt={opt.label} className="btc-icon-img" />
              {/* <span className="btc-label">{opt.label}</span> */}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div className="btc-carousel-wrap">
        <button className="btc-arrow left" onClick={prev} disabled={index === 0}>‹</button>
        <div className="btc-viewport" ref={carouselRef}>
          <div
            className="btc-track"
            style={{
              width: `${trackWidthPercent}%`,
              transform: `translateX(-${translatePercent}%)`,
            }}
          >
            {cars.map((c) => (
              <div key={c.id} className="btc-item" style={{ width: `${itemWidthPercent}%`, padding: 12 }}>
                <Card car={c} />
              </div>
            ))}
          </div>
        </div>
        <button
          className="btc-arrow right"
          onClick={next}
          disabled={index >= Math.max(0, cars.length - visibleCount)}
        >
          ›
        </button>
      </div>

      {/* Bottom CTA */}
      <div className="btc-cta">
        <button className="btc-view-all">{bottomButtonText}</button>
      </div>
    </section>
  );
}
