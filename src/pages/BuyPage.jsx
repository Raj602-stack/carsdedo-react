// BuyPage.jsx
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import FilterBar from "../components/FilterBar"; // optional: keep or remove
import BottomNav from "../components/BottomNav";
import "../styles/BuyPage.css";

// Use your uploaded banner image (local path)
const HERO_BANNER = "/mnt/data/53e3c8d8-bc90-46c5-846f-ee263aec5ece.png";

/**
 * FilterDropdown (portal-based) - with global "closeAllDropdowns" event
 * Props:
 *  - label: string
 *  - options: [{ value, label }]
 *  - selected: string | null
 *  - onChange: fn(value)
 */
function FilterDropdown({ label, options = [], selected = null, onChange }) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const rootRef = useRef(null);
  const btnRef = useRef(null);

  // close when clicking outside (works across portals)
  useEffect(() => {
    function onDoc(e) {
      if (rootRef.current && rootRef.current.contains(e.target)) return;
      setOpen(false);
    }
    window.addEventListener("click", onDoc);
    return () => window.removeEventListener("click", onDoc);
  }, []);

  // listen for global close-all signal
  useEffect(() => {
    function onCloseAll() {
      setOpen(false);
    }
    window.addEventListener("closeAllDropdowns", onCloseAll);
    return () => window.removeEventListener("closeAllDropdowns", onCloseAll);
  }, []);

  // position the menu near the button using fixed positioning
  useLayoutEffect(() => {
    if (!open) return;

    function updatePos() {
      const btn = btnRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();

      const minWidth = rect.width;
      let left = rect.left;
      let top = rect.bottom + 8;

      const maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const estimatedMenuWidth = Math.max(minWidth, 200);
      if (left + estimatedMenuWidth > maxWidth - 12) {
        left = Math.max(12, maxWidth - estimatedMenuWidth - 12);
      }

      setMenuStyle({
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        minWidth: `${minWidth}px`,
        zIndex: 999999,
      });
    }

    updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, true); // capture scrolls in containers
    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
    };
  }, [open]);

  // keyboard handling
  const handleKey = (e) => {
    if (e.key === "Escape") setOpen(false);
  };

  // the menu content (rendered into body)
  const menu = open ? (
    <div
      className="fp-menu"
      role="menu"
      aria-hidden={!open}
      style={{
        ...menuStyle,
        display: open ? "block" : "none",
      }}
      onKeyDown={handleKey}
    >
      <ul role="none" className="fp-options">
        <li role="none">
          <button
            role="menuitem"
            className={`fp-opt ${selected === null ? "selected" : ""}`}
            onClick={() => {
              onChange?.(null);
              setOpen(false);
            }}
          >
            All
          </button>
        </li>

        {options.map((o) => (
          <li role="none" key={o.value}>
            <button
              role="menuitem"
              className={`fp-opt ${selected === o.value ? "selected" : ""}`}
              onClick={() => {
                onChange?.(o.value);
                setOpen(false);
              }}
            >
              {o.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  ) : null;

  return (
    <div className="fp-root" ref={rootRef}>
      <button
        type="button"
        ref={btnRef}
        className={`fp-chip ${open ? "open" : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          // If we're opening, first tell others to close
          if (!open) {
            // dispatch a simple DOM event other dropdowns listen for
            window.dispatchEvent(new Event("closeAllDropdowns"));
            setOpen(true);
          } else {
            setOpen(false);
          }
        }}
        onKeyDown={handleKey}
      >
        <span className="fp-chip-label">{label}</span>
        <span className="fp-chip-caret">▾</span>
      </button>

      {createPortal(menu, document.body)}
    </div>
  );
}

/**
 * SwipableInfo - simple carousel
 */
function SwipableInfo({ slides = [] }) {
  const [idx, setIdx] = useState(0);
  const startXRef = useRef(null);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    setIdx((i) => Math.min(i, slides.length - 1));
  }, [slides]);

  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx((i) => (i + 1) % slides.length);

  function onTouchStart(e) {
    startXRef.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    if (startXRef.current == null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startXRef.current;
    if (diff > 40) prev();
    else if (diff < -40) next();
    startXRef.current = null;
  }

  if (!slides || slides.length === 0) return null;
  const current = slides[idx];

  return (
    <div
      className="swipe-root"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      <div className="swipe-card">
        <div className="swipe-card-inner">
          <h4 className="swipe-title">{current.title ?? `Info ${idx + 1}`}</h4>
          <p className="swipe-text">{current.text ?? current}</p>
        </div>
        <div className="swipe-controls">
          <button aria-label="Previous" onClick={prev} className="swipe-btn">‹</button>
          <div className="swipe-dots" role="tablist">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`swipe-dot ${i === idx ? "active" : ""}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button aria-label="Next" onClick={next} className="swipe-btn">›</button>
        </div>
      </div>
    </div>
  );
}

/**
 * BuyPage - main page
 */
export default function BuyPage() {
  const yearOptions = [
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2019-2021", label: "2019 - 2021" },
    { value: "older", label: "Before 2019" },
  ];

  const transmissionOptions = [
    { value: "automatic", label: "Automatic" },
    { value: "manual", label: "Manual" },
    { value: "amt", label: "AMT" },
  ];

  const bodyOptions = [
    { value: "hatch", label: "Hatchback" },
    { value: "sedan", label: "Sedan" },
    { value: "suv", label: "SUV" },
    { value: "mpv", label: "MPV" },
  ];

  const colorOptions = [
    { value: "white", label: "White" },
    { value: "black", label: "Black" },
    { value: "silver", label: "Silver" },
    { value: "red", label: "Red" },
  ];

  const [selYear, setSelYear] = useState(null);
  const [selTrans, setSelTrans] = useState(null);
  const [selBody, setSelBody] = useState(null);
  const [selColor, setSelColor] = useState(null);

  const [cars, setCars] = useState([]);
  useEffect(() => {
    const sample = [
      {
        id: "c1",
        title: "2018 Tata Tiago",
        variant: "XT CNG (Outside Fitted)",
        price: "₹3.74 Lakh",
        emi: "EMI ₹6,369/m*",
        km: "61,000 km",
        fuel: "CNG",
        trans: "Manual",
        transVal: "manual",
        location: "DL12",
        year: "2018",
        body: "hatch",
        color: "white",
        thumb: process.env.PUBLIC_URL + "/baleno.avif",
      },
      {
        id: "c2",
        title: "2022 Jeep Meridian",
        variant: "Limited (O) 4X2 AT",
        price: "₹22.75 Lakh",
        emi: "EMI ₹39,126/m*",
        km: "24,500 km",
        fuel: "Diesel",
        trans: "Automatic",
        transVal: "automatic",
        location: "HR98",
        year: "2022",
        body: "suv",
        color: "black",
        thumb: process.env.PUBLIC_URL + "/venue.avif",
      },
      {
        id: "c3",
        title: "2020 Maruti Swift",
        variant: "VXI",
        price: "₹6.10 Lakh",
        emi: "EMI ₹10,500/m*",
        km: "45,000 km",
        fuel: "Petrol",
        trans: "Manual",
        transVal: "manual",
        location: "DL05",
        year: "2020",
        body: "hatch",
        color: "red",
        thumb: process.env.PUBLIC_URL + "/swift.avif",
      },
      {
        id: "c4",
        title: "2021 Hyundai Verna",
        variant: "SX",
        price: "₹8.40 Lakh",
        emi: "EMI ₹14,500/m*",
        km: "33,000 km",
        fuel: "Petrol",
        trans: "AMT",
        transVal: "amt",
        location: "MH04",
        year: "2021",
        body: "sedan",
        color: "silver",
        thumb: process.env.PUBLIC_URL + "/verna.avif",
      },
      {
        id: "c5",
        title: "2019 Honda City",
        variant: "ZX CVT",
        price: "₹9.25 Lakh",
        emi: "EMI ₹15,900/m*",
        km: "52,000 km",
        fuel: "Petrol",
        trans: "Automatic",
        transVal: "automatic",
        location: "DL01",
        year: "2019",
        body: "sedan",
        color: "white",
        thumb: process.env.PUBLIC_URL + "/city.avif",
      },
      {
        id: "c6",
        title: "2017 Ford EcoSport",
        variant: "Trend",
        price: "₹6.50 Lakh",
        emi: "EMI ₹11,200/m*",
        km: "85,000 km",
        fuel: "Diesel",
        trans: "Manual",
        transVal: "manual",
        location: "KA05",
        year: "2017",
        body: "suv",
        color: "black",
        thumb: process.env.PUBLIC_URL + "/ecosport.avif",
      },
      {
        id: "c7",
        title: "2023 Toyota Glanza",
        variant: "G",
        price: "₹7.60 Lakh",
        emi: "EMI ₹13,000/m*",
        km: "12,000 km",
        fuel: "Petrol",
        trans: "AMT",
        transVal: "amt",
        location: "DL09",
        year: "2023",
        body: "hatch",
        color: "silver",
        thumb: process.env.PUBLIC_URL + "/glanza.avif",
      },
      {
        id: "c8",
        title: "2016 Mahindra XUV500",
        variant: "W8",
        price: "₹9.90 Lakh",
        emi: "EMI ₹17,000/m*",
        km: "1,10,000 km",
        fuel: "Diesel",
        trans: "Manual",
        transVal: "manual",
        location: "UP14",
        year: "2016",
        body: "suv",
        color: "white",
        thumb: process.env.PUBLIC_URL + "/xuv.avif",
      },
    ];
    setCars(sample);
  }, []);

  const filtered = cars.filter((c) => {
    if (selTrans && c.transVal && selTrans !== c.transVal) return false;

    if (selYear && c.year) {
      if (selYear === "older") {
        if (Number(c.year) >= 2019) return false;
      } else if (selYear === "2019-2021") {
        const y = Number(c.year);
        if (y < 2019 || y > 2021) return false;
      } else {
        if (Number(c.year) !== Number(selYear)) return false;
      }
    }

    if (selBody && c.body && selBody !== c.body) return false;
    if (selColor && c.color && selColor !== c.color) return false;

    return true;
  });

  const sampleSlides = [
    { title: "Why CarsDedo?", text: "Verified listings · Easy EMI options · 7-day test drive" },
    { title: "Tips", text: "Check service history and insurance papers before buying." },
    { title: "Financing", text: "Compare EMIs across banks — low interest offers available." },
  ];

  const rendered = [];
  for (let i = 0; i < filtered.length; i++) {
    const car = filtered[i];
    rendered.push(
      <article key={car.id} className="car-card" tabIndex={0}>
        <div className="car-thumb">
          <img src={car.thumb} alt={car.title} loading="lazy" />
        </div>

        <div className="car-content">
          <div className="car-row">
            <div>
              <div className="car-title">{car.title}</div>
              <div className="car-variant">{car.variant}</div>
            </div>

            <div className="car-price">
              <div className="price">{car.price}</div>
              <div className="emi">{car.emi}</div>
            </div>
          </div>

          <div className="car-tags">
            <span className="tag">{car.km}</span>
            <span className="tag">{car.fuel}</span>
            <span className="tag">{car.trans}</span>
            <span className="tag">{car.location}</span>
          </div>

          <div className="car-footer">
            <div className="hub">HUB · Trillium Avenue, Gurgaon</div>
            <button className="fav" aria-label="Add to wishlist">♡</button>
          </div>
        </div>
      </article>
    );

    if ((i + 1) % 6 === 0) {
      rendered.push(
        <div key={`swipe-${i}`} className="swipe-insert">
          <SwipableInfo slides={sampleSlides} />
        </div>
      );
    }
  }

  return (
    <div className="buypage-root">
      <header className="buy-header">
        <div className="buy-header-inner">
          <button className="hamburger" aria-label="Open menu">☰</button>
          <div className="brand">CarsDedo</div>
          <div className="header-actions">
            <button className="action">Sell</button>
            <button className="action active">Buy</button>
          </div>
        </div>

        <div className="hero-banner">
          <img src={HERO_BANNER} alt="Top deals" className="hero-img" />
        </div>

        <div className="filters-top" role="toolbar" aria-label="Filters">
          <FilterDropdown
            label={`Year${selYear ? `: ${selYear}` : ""}`}
            options={yearOptions}
            selected={selYear}
            onChange={(v) => setSelYear(v)}
          />
          <FilterDropdown
            label={`Transmission${selTrans ? `: ${transmissionOptions.find(o=>o.value===selTrans)?.label ?? ''}` : ""}`}
            options={transmissionOptions}
            selected={selTrans}
            onChange={(v) => setSelTrans(v)}
          />
          <FilterDropdown
            label={`Body Type${selBody ? `: ${bodyOptions.find(o=>o.value===selBody)?.label ?? ''}` : ""}`}
            options={bodyOptions}
            selected={selBody}
            onChange={(v) => setSelBody(v)}
          />
          <FilterDropdown
            label={`Color${selColor ? `: ${colorOptions.find(o=>o.value===selColor)?.label ?? ''}` : ""}`}
            options={colorOptions}
            selected={selColor}
            onChange={(v) => setSelColor(v)}
          />
        </div>
      </header>

      <div className="results-header">
        <h3>{filtered.length} Used cars in Delhi</h3>
      </div>

      <main className="buy-main">
        <div className="list">
          {rendered.length > 0 ? rendered : <div style={{padding:20}}>No cars match your filters.</div>}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
