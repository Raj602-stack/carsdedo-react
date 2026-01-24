// BuyPage.jsx
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiSearch, FiX } from "react-icons/fi";
import { useLocation } from "react-router-dom";

import BottomNav from "../components/BottomNav";
import "../styles/BuyPage.css";
import { useCars } from "../context/CarsContext";
import Loader from "../components/Loader";
import Sidebar from "../components/Sidebar";
import PromotionalCarousel from "../components/PromotionalCarousel";
import ScrollToTop from "../components/ScrollToTop";

import { API_BASE_URL } from "../config/api";

// Use uploaded hero/banner image (from conversation files)
const HERO_BANNER = "/mnt/data/93f9b768-4f04-44ea-a832-90320b25060b.png";

/* small SVG checkmark used across controls */
function IconCheck({ checked }) {
  return (
    <svg className={`checkmark ${checked ? "show" : ""}`} width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* Fancy checkbox used across filters */
function FancyCheckbox({ checked = false, onToggle, label, id }) {
  return (
    <label className="f-chk" htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={() => onToggle(!checked)} />
      <span className="f-chk-box" aria-hidden><IconCheck checked={checked} /></span>
      <span className="f-chk-label">{label}</span>
    </label>
  );
}

/* Color option */
function ColorOption({ name, colorCode, checked, onToggle, id }) {
  return (
    <label className="color-option" htmlFor={id}>
      <span className="color-swatch" style={{ background: colorCode }} aria-hidden />
      <span className="color-name">{name}</span>
      <input id={id} type="checkbox" checked={checked} onChange={() => onToggle(!checked)} />
      <span className={`color-check ${checked ? "on" : ""}`} aria-hidden><IconCheck checked={checked} /></span>
    </label>
  );
}

/**
 * FilterDropdown - single-open behavior
 * - dispatches a custom 'fp-open' event to close other dropdowns
 * - positions portal menu below the button
 */
function FilterDropdown({ id, label, options = [], selected = null, onChange }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({});

  useEffect(() => {
    function handleClose(e) {
      // Check if the click is outside BOTH the button and the menu
      const isInsideButton = btnRef.current?.contains(e.target);
      const isInsideMenu = menuRef.current?.contains(e.target);
  
      if (!isInsideButton && !isInsideMenu) {
        setOpen(false);
      }
    }
  
    if (open) {
      // Adding 'touchstart' is critical for mobile closure
      window.addEventListener("mousedown", handleClose);
      window.addEventListener("touchstart", handleClose);
    }
  
    return () => {
      window.removeEventListener("mousedown", handleClose);
      window.removeEventListener("touchstart", handleClose);
    };
  }, [open]);

  // close when another dropdown opens
  useEffect(() => {
    function onOtherOpen(e) {
      const otherId = e?.detail?.id;
      if (otherId && otherId !== id) setOpen(false);
    }
    window.addEventListener("fp-open", onOtherOpen);
    return () => window.removeEventListener("fp-open", onOtherOpen);
  }, [id]);

  // compute absolute position for portal menu
  useEffect(() => {
    if (!open) return;
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const gap = 8;
    const top = rect.bottom + window.scrollY + gap;
    const left = rect.left + window.scrollX;
    const minWidth = Math.max(160, rect.width);
    setMenuStyle({ position: "absolute", top: `${top}px`, left: `${left}px`, minWidth: `${minWidth}px` });

    const onResize = () => {
      const r = btn.getBoundingClientRect();
      setMenuStyle({ position: "absolute", top: `${r.bottom + window.scrollY + gap}px`, left: `${r.left + window.scrollX}px`, minWidth: `${Math.max(160, r.width)}px` });
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
  }, [open]);

  return (
    <div className="fp-root" style={{ display: "inline-block" }}>
      <button
        ref={btnRef}
        className={`fp-chip ${open ? "open" : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          const next = !open;
          setOpen(next);
          if (next) window.dispatchEvent(new CustomEvent("fp-open", { detail: { id } }));
        }}
      >
        <span className="fp-chip-label">{label}</span>
        <span className="fp-chip-caret">▾</span>
      </button>

      {open &&
        createPortal(
          <>
            {/* OVERLAY */}
            <div
              className="fp-overlay"
              onClick={() => setOpen(false)}
            />

            {/* MENU */}
            <div
              className="fp-menu"
              role="menu"
              ref={(el) => (menuRef.current = el)}
              onClick={(e) => e.stopPropagation()}
              style={menuStyle}
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
          </>,
          document.body
        )}
    </div>
  );
}

/* SortModal: sheet at bottom */
function SortModal({ open, onClose, value, onChange }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  const opts = [
    { key: "relevance", label: "Relevance (Default)" },
    { key: "discount_desc", label: "Discount - High to Low" },
    { key: "price_asc", label: "Price - Low to High" },
    { key: "price_desc", label: "Price - High to Low" },
    { key: "km_asc", label: "KM Driven - Low to High" },
    { key: "year_desc", label: "Year - New to Old" },
    { key: "newest", label: "Newest First" },
  ];
  return createPortal(
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet sheet-bottom" role="dialog" aria-modal="true">
        <div className="sheet-handle" />
        <div className="sheet-content">
          <h4 className="sheet-title">Sort by</h4>
          <ul className="sheet-list" role="radiogroup">
            {opts.map((opt) => (
              <li key={opt.key} className="sheet-row" onClick={() => onChange(opt.key)}>
                <div>{opt.label}</div>
                <div className={`radio-outer ${value === opt.key ? "checked" : ""}`}><div className="radio-inner" /></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>,
    document.body
  );
}

/* FilterDrawer: vertical price UI + many filter categories (keeps same logic) */
function FilterDrawer({ open, onClose, appliedFilters = {}, onApply, onClear }) {
  // price constants in rupees
  const PRICE_MIN = 50000;
  const PRICE_MAX = 2000000; // 80 lakh cap
  const PRICE_STEP = 50000;

  const brandsToModels = {
    "Maruti Suzuki": ["Baleno", "Swift", "Dzire", "Wagon R", "Ciaz"],
    Hyundai: ["i20", "Creta", "Verna", "Venue"],
    Honda: ["City", "Amaze", "Jazz"],
    Tata: ["Tiago", "Altroz", "Harrier"],
    Kia: ["Sonet", "Seltos"],
    Renault: ["Kiger", "Triber"],
    Ford: ["EcoSport"],
    Mahindra: ["XUV500"],
    Volkswagen: ["Polo", "Virtus"],
    Skoda: ["Rapid"],
    Toyota: ["Glanza"],
    Nissan: ["Magnite"],
    "MG Motors": ["Astor", "ZS EV"],
    Datsun: ["Go"],
  };
  const brandOptions = Object.keys(brandsToModels).sort();

  const yearOptions = ["2023 & above", "2021 & above", "2019 & above", "2017 & above", "2015 & above", "2013 & above", "2011 & above", "2009 & above"];
  const kmsOptions = ["< 20,000", "20,001 - 50,000", "50,001 - 1,00,000", "< 125000 kms", "100,001+"];
  const transmissionOptions = ["Automatic", "Manual", "AMT"];
  const featuresOptions = ["Sunroof", "Keyless start", "ABS", "Airbags", "Rear camera", "Rear parking sensor", "Power windows", "Power steering"];
  const seatsOptions = ["4 seater", "5 seater", "6+ seater"];
  const rtoOptions = ["UP", "DL", "HR"];
  const colorMap = [
    { name: "White", code: "#FFFFFF" },
    { name: "Black", code: "#000000" },
    { name: "Silver", code: "#CFCFCF" },
    { name: "Grey", code: "#949494" },
    { name: "Red", code: "#C8342A" },
    { name: "Blue", code: "#2D76E6" },
    { name: "Green", code: "#3BB54A" },
    { name: "Orange", code: "#F08D2E" },
    { name: "Violet", code: "#7B35D9" },
    { name: "Beige", code: "#D9CBB3" },
  ];
  const bodyOptions = ["Hatchback", "Sedan", "SUV", "MPV", "Coupe", "Convertible", "Wagon", "Van", "Crossover", "Micro"];
  const ownerOptions = ["1st owner", "2nd owner", "3rd owner"];
  const fuelOptions = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
  const categoryOptions = ["Hatchback", "Sedan", "SUV", "MUV", "Convertible", "Coupe"];
  const hubOptions = ["Gaur City Mall, Noida", "Trillium Avenue, Gurgaon", "Indirapuram, Ghaziabad"];

  const categories = [
    "Saved Filters", "Price Range", "Brands + Models", "Year", "Kms Driven", "Fuel Type",
    "Body Type", "Transmission", "Car Category", "Color", "Features", "Seats", "RTO",
    "Owner", "Hubs"
  ];

  const [local, setLocal] = useState({
    year: appliedFilters.year ? [appliedFilters.year] : [],
    kms: appliedFilters.kms ? [appliedFilters.kms] : [],
    brands: appliedFilters.brands ?? [],
    brandModels: appliedFilters.brandModels ?? {},
    colors: appliedFilters.color ? [appliedFilters.color] : [],
    trans: appliedFilters.trans ? [appliedFilters.trans] : [],
    features: appliedFilters.features ?? [],
    seats: appliedFilters.seats ?? [],
    rto: appliedFilters.rto ?? [],
    body: appliedFilters.body ?? [],
    fuel: appliedFilters.fuel ?? [],
    category: appliedFilters.category ?? [],
    hubs: appliedFilters.hubs ?? [],
    priceMin: appliedFilters.priceMin ?? PRICE_MIN,
    priceMax: appliedFilters.priceMax ?? PRICE_MAX,
    owner: appliedFilters.owner ?? []
  });

  const [active, setActive] = useState("Price Range");
  const [brandQuery, setBrandQuery] = useState("");
  const [expandedBrand, setExpandedBrand] = useState(null);
  const [dragging, setDragging] = useState({ min: false, max: false });

  useEffect(() => {
    if (open) {
      setLocal({
        year: appliedFilters.year ? [appliedFilters.year] : [],
        kms: appliedFilters.kms ? [appliedFilters.kms] : [],
        brands: appliedFilters.brands ?? [],
        brandModels: appliedFilters.brandModels ?? {},
        colors: appliedFilters.color ? [appliedFilters.color] : [],
        trans: appliedFilters.trans ? [appliedFilters.trans] : [],
        features: appliedFilters.features ?? [],
        seats: appliedFilters.seats ?? [],
        rto: appliedFilters.rto ?? [],
        body: appliedFilters.body ?? [],
        fuel: appliedFilters.fuel ?? [],
        category: appliedFilters.category ?? [],
        hubs: appliedFilters.hubs ?? [],
        priceMin: appliedFilters.priceMin ?? PRICE_MIN,
        priceMax: appliedFilters.priceMax ?? PRICE_MAX,
        owner: appliedFilters.owner ?? []
      });
      setActive("Price Range");
      setBrandQuery("");
      setExpandedBrand(null);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [open, appliedFilters]);

  if (!open) return null;

  function toggleArray(key, value) {
    setLocal((s) => {
      const prev = s[key] || [];
      const found = prev.includes(value);
      return { ...s, [key]: found ? prev.filter((x) => x !== value) : [...prev, value] };
    });
  }
  function singleSelect(key, value) {
    setLocal((s) => ({ ...s, [key]: s[key] && s[key][0] === value ? [] : [value] }));
  }

  function toggleBrand(brand) {
    setLocal((s) => {
      const prev = s.brands || [];
      const found = prev.includes(brand);
      const brands = found ? prev.filter((b) => b !== brand) : [...prev, brand];
      const bm = { ...(s.brandModels || {}) };
      if (found) delete bm[brand];
      else {
        const modelsForBrand = brandsToModels[brand] || [];
        if (modelsForBrand.length > 0) {
          if (!bm[brand] || bm[brand].length === 0) bm[brand] = [modelsForBrand[0]];
        }
      }
      return { ...s, brands, brandModels: bm };
    });
  }

  function toggleModel(brand, model) {
    setLocal((s) => {
      const bm = { ...(s.brandModels || {}) };
      const prev = bm[brand] || [];
      const found = prev.includes(model);
      bm[brand] = found ? prev.filter((m) => m !== model) : [...prev, model];
      if (!bm[brand] || bm[brand].length === 0) {
        const modelsForBrand = brandsToModels[brand] || [];
        if (modelsForBrand.length > 0) bm[brand] = [modelsForBrand[0]];
        else delete bm[brand];
      }
      const brands = new Set(s.brands || []);
      if ((bm[brand] || []).length > 0) brands.add(brand);
      return { ...s, brandModels: bm, brands: Array.from(brands) };
    });
  }

  function handleApply() {
    // Convert to numbers & clamp
    let safeMin = Number(local.priceMin || PRICE_MIN);
    let safeMax = Number(local.priceMax || PRICE_MAX);
    if (isNaN(safeMin)) safeMin = PRICE_MIN;
    if (isNaN(safeMax)) safeMax = PRICE_MAX;
    if (safeMin > safeMax) { const t = safeMin; safeMin = safeMax; safeMax = t; }
    if (safeMin < PRICE_MIN) safeMin = PRICE_MIN;
    if (safeMax > PRICE_MAX) safeMax = PRICE_MAX;
    safeMin = Math.round(safeMin);
    safeMax = Math.round(safeMax);

    onApply?.({
      year: local.year[0] ?? null,
      kms: local.kms[0] ?? null,
      brands: local.brands,
      brandModels: local.brandModels,
      color: local.colors[0] ?? null,
      trans: local.trans[0] ?? null,
      features: local.features,
      seats: local.seats,
      rto: local.rto,
      body: local.body,
      fuel: local.fuel,
      category: local.category,
      hubs: local.hubs,
      priceMin: safeMin,
      priceMax: safeMax,
      owner: local.owner ?? []
    });

    onClose?.();
  }

  function handleClear() {
    setLocal({
      year: [], kms: [], brands: [], brandModels: {}, colors: [], trans: [], features: [], seats: [], rto: [], body: [], fuel: [], category: [], hubs: [], priceMin: PRICE_MIN, priceMax: PRICE_MAX, owner: []
    });
    onClear?.();
  }

  const filteredBrands = brandOptions.filter((b) => b.toLowerCase().includes(brandQuery.toLowerCase()));

  function leftMetaLines(cat) {
    switch (cat) {
      case "Brands + Models": {
        const count = (local.brands || []).length;
        return count > 0 ? `${count} selected` : null;
      }
      case "Color": {
        const n = (local.colors || []).length;
        return n > 0 ? `${n} selected` : null;
      }
      case "Transmission": {
        const n = (local.trans || []).length;
        return n > 0 ? `${n} selected` : null;
      }
      case "Features": {
        const n = (local.features || []).length;
        return n > 0 ? `${n} selected` : null;
      }
      case "Seats": {
        const n = (local.seats || []).length;
        return n > 0 ? `${n} selected` : null;
      }
      case "RTO": {
        const n = (local.rto || []).length;
        return n > 0 ? `${n} selected` : null;
      }
      case "Year": {
        return local.year && local.year[0] ? `${local.year[0]}` : null;
      }
      case "Kms Driven": {
        return local.kms && local.kms[0] ? `${local.kms[0]}` : null;
      }
      case "Body Type": {
        const n = (local.body || []).length;
        return n > 0 ? `${n} selected` : null;
      }
      case "Price Range": {
        if (local.priceMin !== PRICE_MIN || local.priceMax !== PRICE_MAX) {
          const fmt = (v) => v >= 100000 ? `${Math.round(v / 100000)}L` : `${Math.round(v / 1000)}k`;
          return `${fmt(local.priceMin)} - ${fmt(local.priceMax)}`;
        }
        return null;
      }
      case "Owner": {
        const n = (local.owner || []).length;
        return n > 0 ? `${n} selected` : null;
      }
      case "Fuel Type": {
        const n = (local.fuel || []).length;
        return n > 0 ? `${n} selected` : null;
      }
      case "Car Category": {
        const n = (local.category || []).length;
        return n > 0 ? `${n} selected` : null;
      }
      case "Hubs": {
        const n = (local.hubs || []).length;
        return n > 0 ? `${n} selected` : null;
      }
      default:
        return null;
    }
  }

  /* slider helpers for vertical UI */
  const rangeSpan = PRICE_MAX - PRICE_MIN;
  const pct = (v) => Math.round(((Number(v) - PRICE_MIN) / rangeSpan) * 100);
  function setPriceMin(v) {
    const raw = Number(v);
    const val = Math.min(raw, Number(local.priceMax) - PRICE_STEP);
    setLocal((s) => ({ ...s, priceMin: Math.max(PRICE_MIN, val) }));
  }
  function setPriceMax(v) {
    const raw = Number(v);
    const val = Math.max(raw, Number(local.priceMin) + PRICE_STEP);
    setLocal((s) => ({ ...s, priceMax: Math.min(PRICE_MAX, val) }));
  }

  const topPct = 100 - pct(local.priceMax);
  const bottomPct = 100 - pct(local.priceMin);

  function fmt(v) {
    return `₹${Number(v).toLocaleString()}`;
  }

  return createPortal(
    <>
      <div className="filter-backdrop" onClick={onClose} />
      <aside className="filter-drawer" role="dialog" aria-modal="true" aria-label="Filter">
        <header className="filter-head">
          <button className="back" onClick={onClose} aria-label="Close filter">←</button>
          <div className="title">Filter</div>
          <button className="clear-all" onClick={handleClear}>CLEAR ALL</button>
        </header>

        <div className="filter-body">
          <nav className="filter-nav" aria-label="Filter categories">
            {categories.map((c) => (
              <button
                key={c}
                className={`filter-nav-item ${c === active ? "active" : ""}`}
                onClick={() => setActive(c)}
                aria-current={c === active}
              >
                <div className="nav-label">{c}</div>
                <div className="nav-meta-line">{leftMetaLines(c)}</div>
              </button>
            ))}
          </nav>

          <div className="filter-panel">
            {/* Price Range */}
            {active === "Price Range" && (
              <div className="panel-section">
                <h4 className="panel-title">{`₹${Number(local.priceMin).toLocaleString()} - ₹${Number(local.priceMax).toLocaleString()}`}</h4>

                <div className="price-range-wrap">
                  <div className="price-rail-vertical" style={{
                    background: `linear-gradient(180deg,
                      #e8f0f8 0%,
                      #e8f0f8 ${topPct}%,
                      #0c213a ${topPct}%,
                      #0c213a ${bottomPct}%,
                      #e8f0f8 ${bottomPct}%,
                      #e8f0f8 100%)`
                  }} />

                  <div className="bubbles-wrapper">
                    <div className="price-bubble top" style={{ top: `${topPct}%` }}>{fmt(local.priceMax)}</div>
                    <div className="price-bubble bottom" style={{ top: `${bottomPct}%` }}>{fmt(local.priceMin)}</div>
                  </div>

                  <div className="vertical-ranges">
                    <input
                      className={`v-range min ${dragging.min ? "dragging" : ""}`}
                      type="range"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      step={PRICE_STEP}
                      value={local.priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      onMouseDown={() => setDragging((d) => ({ ...d, min: true }))}
                      onMouseUp={() => setDragging((d) => ({ ...d, min: false }))}
                      onTouchStart={() => setDragging((d) => ({ ...d, min: true }))}
                      onTouchEnd={() => setDragging((d) => ({ ...d, min: false }))}
                      aria-label="Min price"
                    />
                    <input
                      className={`v-range max ${dragging.max ? "dragging" : ""}`}
                      type="range"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      step={PRICE_STEP}
                      value={local.priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      onMouseDown={() => setDragging((d) => ({ ...d, max: true }))}
                      onMouseUp={() => setDragging((d) => ({ ...d, max: false }))}
                      onTouchStart={() => setDragging((d) => ({ ...d, max: true }))}
                      onTouchEnd={() => setDragging((d) => ({ ...d, max: false }))}
                      aria-label="Max price"
                    />
                  </div>
                </div>

                <p className="hint">Drag handles to set price bracket.</p>
              </div>
            )}

            {/* Brands + Models */}
            {active === "Brands + Models" && (
              <div className="panel-section brands-panel">
                <label className="search">
                  <input placeholder="Search brands" value={brandQuery} onChange={(e) => setBrandQuery(e.target.value)} />
                  <span className="search-icon">🔍</span>
                </label>

                <div className="brand-list">
                  {filteredBrands.map((brand) => {
                    const brandSelected = (local.brands || []).includes(brand);
                    const selectedModels = (local.brandModels && local.brandModels[brand]) || [];
                    const expanded = expandedBrand === brand;
                    return (
                      <div key={brand} className="brand-block">
                        <div className="brand-row">
                          <label className="brand-checkbox" htmlFor={`brand-${brand}`}>
                            <input id={`brand-${brand}`} type="checkbox" checked={brandSelected} onChange={() => toggleBrand(brand)} />
                            <span className="brand-name">{brand}</span>
                          </label>

                          <button className="brand-expand" onClick={() => setExpandedBrand((p) => (p === brand ? null : brand))} aria-expanded={expanded}>
                            <span className={`chev ${expanded ? "open" : ""}`}>▾</span>
                          </button>
                        </div>

                        {expanded && (
                          <div className="models-list">
                            {(brandsToModels[brand] || []).map((model) => {
                              const checked = selectedModels.includes(model);
                              return (
                                <label key={model} className="model-row" htmlFor={`model-${brand}-${model}`}>
                                  <input id={`model-${brand}-${model}`} type="checkbox" checked={checked} onChange={() => toggleModel(brand, model)} />
                                  <span className="model-name">{model}</span>
                                </label>
                              );
                            })}

                            <div className="model-actions">
                              <button type="button" onClick={() => {
                                (brandsToModels[brand] || []).forEach((m) => {
                                  setLocal((s) => {
                                    const bm = { ...(s.brandModels || {}) };
                                    bm[brand] = Array.from(new Set([...(bm[brand] || []), m]));
                                    const brands = new Set(s.brands || []); brands.add(brand);
                                    return { ...s, brandModels: bm, brands: Array.from(brands) };
                                  });
                                });
                              }}>Select all</button>

                              <button type="button" onClick={() => {
                                setLocal((s) => {
                                  const bm = { ...(s.brandModels || {}) }; delete bm[brand];
                                  const brands = (s.brands || []).filter((b) => b !== brand);
                                  return { ...s, brandModels: bm, brands };
                                });
                              }}>Clear</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Year */}
            {active === "Year" && (
              <div className="panel-section">
                <h5 className="select-by">SELECT BY</h5>
                <div className="radio-list">
                  {yearOptions.map((y, idx) => {
                    const id = `year-${idx}`;
                    const checked = local.year.includes(y);
                    return (
                      <div key={y} className="radio-row">
                        <input id={id} type="radio" name="year" checked={checked} onChange={() => singleSelect("year", y)} />
                        <label htmlFor={id} className="radio-label">{y}</label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Kms Driven */}
            {active === "Kms Driven" && (
              <div className="panel-section">
                <h5 className="select-by">SELECT BY</h5>
                <div className="radio-list">
                  {kmsOptions.map((k, idx) => {
                    const id = `kms-${idx}`;
                    const checked = local.kms.includes(k);
                    return (
                      <div key={k} className="radio-row">
                        <input id={id} type="radio" name="kms" checked={checked} onChange={() => singleSelect("kms", k)} />
                        <label htmlFor={id} className="radio-label">{k}</label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Transmission */}
            {active === "Transmission" && (
              <div className="panel-section">
                <h5 className="select-by">SELECT BY</h5>
                <div className="grid-cols">
                  {transmissionOptions.map((t) => {
                    const checked = (local.trans || []).includes(t);
                    return <FancyCheckbox key={t} id={`trans-${t}`} label={t} checked={checked} onToggle={() => toggleArray("trans", t)} />;
                  })}
                </div>
              </div>
            )}

            {/* Body Type */}
            {active === "Body Type" && (
              <div className="panel-section">
                <h5 className="select-by">SELECT BY</h5>
                <div className="grid-cols">
                  {bodyOptions.map((b) => {
                    const checked = (local.body || []).includes(b);
                    return <FancyCheckbox key={b} id={`body-${b}`} label={b} checked={checked} onToggle={() => toggleArray("body", b)} />;
                  })}
                </div>
              </div>
            )}

            {/* Color */}
            {active === "Color" && (
              <div className="panel-section">
                <h5 className="select-by">SELECT BY</h5>
                <div className="color-grid">
                  {colorMap.map((c) => {
                    const checked = (local.colors || []).includes(c.name);
                    return <ColorOption key={c.name} id={`color-${c.name}`} name={c.name} colorCode={c.code} checked={checked} onToggle={() => toggleArray("colors", c.name)} />;
                  })}
                </div>
              </div>
            )}

            {/* Features */}
            {active === "Features" && (
              <div className="panel-section">
                <h5 className="select-by">SELECT BY</h5>
                <div className="grid-cols">
                  {featuresOptions.map((f) => {
                    const checked = (local.features || []).includes(f);
                    return <FancyCheckbox key={f} id={`feat-${f}`} label={f} checked={checked} onToggle={() => toggleArray("features", f)} />;
                  })}
                </div>
              </div>
            )}

            {/* Seats */}
            {active === "Seats" && (
              <div className="panel-section">
                <h5 className="select-by">SELECT BY</h5>
                <div className="grid-cols">
                  {seatsOptions.map((s) => {
                    const checked = (local.seats || []).includes(s);
                    return <FancyCheckbox key={s} id={`seat-${s}`} label={s} checked={checked} onToggle={() => toggleArray("seats", s)} />;
                  })}
                </div>
              </div>
            )}

            {/* RTO */}
            {active === "RTO" && (
              <div className="panel-section">
                <h5 className="select-by">SELECT BY</h5>
                <div className="grid-cols">
                  {rtoOptions.map((r) => {
                    const checked = (local.rto || []).includes(r);
                    return <FancyCheckbox key={r} id={`rto-${r}`} label={r} checked={checked} onToggle={() => toggleArray("rto", r)} />;
                  })}
                </div>
              </div>
            )}

            {/* Owner */}
            {active === "Owner" && (
              <div className="panel-section">
                <h5 className="select-by">SELECT BY</h5>
                <div className="grid-cols">
                  {ownerOptions.map((o) => {
                    const checked = (local.owner || []).includes(o);
                    return <FancyCheckbox key={o} id={`owner-${o}`} label={o} checked={checked} onToggle={() => toggleArray("owner", o)} />;
                  })}
                </div>
              </div>
            )}

            {/* Fuel Type */}
            {active === "Fuel Type" && (
              <div className="panel-section">
                <h5 className="select-by">SELECT BY</h5>
                <div className="grid-cols">
                  {fuelOptions.map((f) => {
                    const checked = (local.fuel || []).includes(f);
                    return <FancyCheckbox key={f} id={`fuel-${f}`} label={f} checked={checked} onToggle={() => toggleArray("fuel", f)} />;
                  })}
                </div>
              </div>
            )}

            {/* Car Category */}
            {active === "Car Category" && (
              <div className="panel-section">
                <h5 className="select-by">SELECT BY</h5>
                <div className="grid-cols">
                  {categoryOptions.map((c) => {
                    const checked = (local.category || []).includes(c);
                    return <FancyCheckbox key={c} id={`category-${c}`} label={c} checked={checked} onToggle={() => toggleArray("category", c)} />;
                  })}
                </div>
              </div>
            )}

            {/* Hubs */}
            {active === "Hubs" && (
              <div className="panel-section">
                <h5 className="select-by">SELECT BY</h5>
                <div className="grid-cols">
                  {hubOptions.map((h) => {
                    const checked = (local.hubs || []).includes(h);
                    return <FancyCheckbox key={h} id={`hub-${h}`} label={h} checked={checked} onToggle={() => toggleArray("hubs", h)} />;
                  })}
                </div>
              </div>
            )}

            {/* fallback */}
            {active === "Saved Filters" && (
              <div className="panel-section"><p className="placeholder">Options for <strong>{active}</strong> go here.</p></div>
            )}
          </div>
        </div>

        <footer className="filter-footer">
          <button className="btn-outline" onClick={handleClear}>Reset</button>
          <button className="btn-primary" onClick={handleApply}>Apply</button>
        </footer>
      </aside>
    </>,
    document.body
  );
}

/* SwipableInfo - small component inserted between cards */
function SwipableInfo({ slides = [] }) {
  const [idx, setIdx] = useState(0);
  const startXRef = useRef(null);
  useEffect(() => { if (!slides || slides.length === 0) return; setIdx((i) => Math.min(i, slides.length - 1)); }, [slides]);
  function prev() { setIdx((i) => (i - 1 + slides.length) % slides.length); }
  function next() { setIdx((i) => (i + 1) % slides.length); }
  function onTouchStart(e) { startXRef.current = e.touches[0].clientX; }
  function onTouchEnd(e) { if (startXRef.current == null) return; const endX = e.changedTouches[0].clientX; const diff = endX - startXRef.current; if (diff > 40) prev(); else if (diff < -40) next(); startXRef.current = null; }
  if (!slides || slides.length === 0) return null;
  const current = slides[idx];
  return (
    <div className="swipe-root" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} aria-roledescription="carousel">
      <div className="swipe-card">
        <div className="swipe-card-header">
          <div className="swipe-icon">✦</div>
        </div>
        <div className="swipe-card-inner">
          <h4 className="swipe-title">{current.title ?? `Info ${idx + 1}`}</h4>
          <p className="swipe-text">{current.text ?? current}</p>
        </div>
        <div className="swipe-controls">
          <div className="swipe-dots">{slides.map((_, i) => <button key={i} onClick={() => setIdx(i)} className={`swipe-dot ${i === idx ? "active" : ""}`} aria-label={`Go to slide ${i + 1}`} />)}</div>
        </div>
      </div>
    </div>
  );
}

/* Helper functions for formatting */
const formatPrice = (price) => {
  // Convert to lakhs if >= 100,000
  if (price >= 100000) {
    const lakhs = price / 100000;
    return `₹${lakhs.toFixed(2)} Lakh`;
  }
  // Otherwise show in thousands
  const thousands = price / 1000;
  return `₹${thousands.toFixed(0)}k`;
};

const formatEMI = (price) => {
  const emi = Math.round(price / 60); // Simple EMI calculation (60 months)
  return `EMI ₹${emi.toLocaleString()}/m*`;
};

const formatKM = (km) => {
  if (km >= 100000) {
    const lakhs = km / 100000;
    return `${lakhs.toFixed(1)} Lakh km`;
  }
  return `${km.toLocaleString()} km`;
};

const getTransmissionVal = (transmission) => {
  const lower = transmission.toLowerCase();
  if (lower.includes("auto")) return "automatic";
  if (lower.includes("manual")) return "manual";
  if (lower.includes("amt")) return "amt";
  return "manual";
};

/* Main BuyPage component */
export default function BuyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Add pagination states
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [filtersChanged, setFiltersChanged] = useState(false);
  
  // Refs for infinite scroll
  const observer = useRef();
  const lastCarElementRef = useRef();
  const initialLoadDone = useRef(false);
  const isInitialMount = useRef(true);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.classList.toggle("no-scroll", sidebarOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [sidebarOpen]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
  
    const brand = params.get("brand");
    const model = params.get("model");
    const body = params.get("body");
    const fuel = params.get("fuel");
    const trans = params.get("trans");
    const q = params.get("q");
  
    const priceMin = params.get("priceMin");
    const priceMax = params.get("priceMax");
  
    setAppliedFilters((prev) => ({
      ...prev,
  
      // text search
      q: q ?? null,
  
      // brand + model
      brands: brand ? [brand] : [],
      brandModels:
        brand && model ? { [brand]: [model] } : {},
  
      // simple filters
      body: body ? [body] : [],
      trans: trans ?? null,
      color: null,
  
      // price
      priceMin: priceMin ? Number(priceMin) : prev.priceMin,
      priceMax: priceMax ? Number(priceMax) : prev.priceMax,
    }));
    
    // Mark filters as changed when URL params change
    if (brand || model || body || fuel || trans || q || priceMin || priceMax) {
      setFiltersChanged(true);
    }
  }, [location.search]);

  useEffect(() => {
    const key = "buy_scroll_top";
    const saved = sessionStorage.getItem(key);
    if (!saved) return;
  
    let attempts = 0;
    const maxAttempts = 20;
  
    const tryRestore = () => {
      const scroller = document.querySelector(".buy-main");
  
      if (
        scroller &&
        scroller.scrollHeight > scroller.clientHeight
      ) {
        scroller.scrollTop = Number(saved);
  
        // ✅ DELETE ONLY AFTER SUCCESSFUL RESTORE
        sessionStorage.removeItem(key);
  
        return;
      }
  
      if (attempts < maxAttempts) {
        attempts += 1;
        requestAnimationFrame(tryRestore);
      }
    };
  
    // unlock body scroll just in case
    document.body.style.overflow = "";
  
    requestAnimationFrame(tryRestore);
  }, []);

  // FIX: Add fuel options to top dropdown
  const yearOptionsTop = [
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2019-2021", label: "2019 - 2021" },
    { value: "older", label: "Before 2019" }
  ];
  const transOptionsTop = [
    // FIX: Use lowercase values for API
    { value: "automatic", label: "Automatic" },
    { value: "manual", label: "Manual" },
    { value: "amt", label: "AMT" }
  ];
  const bodyOptionsTop = [
    { value: "Hatchback", label: "Hatchback" },
    { value: "Sedan", label: "Sedan" },
    { value: "SUV", label: "SUV" },
    { value: "MPV", label: "MPV" }
  ];
  // FIX: Color values should be lowercase
  const colorOptionsTop = [
    { value: "white", label: "White" },
    { value: "black", label: "Black" },
    { value: "silver", label: "Silver" },
    { value: "red", label: "Red" }
  ];
  // ADD: Fuel options for top dropdown
  const fuelOptionsTop = [
    { value: "Petrol", label: "Petrol" },
    { value: "Diesel", label: "Diesel" },
    { value: "CNG", label: "CNG" },
    { value: "Electric", label: "Electric" },
    { value: "Hybrid", label: "Hybrid" }
  ];

  // local price defaults (numbers in rupees)
  const PRICE_MIN = 50000;
  const PRICE_MAX = 2000000; // 80 lakh cap

  const [appliedFilters, setAppliedFilters] = useState({
    year: null,
    kms: null,
    brands: [],
    brandModels: {},
    color: null,
    trans: null,
    features: [],
    seats: [],
    rto: [],
    body: [],
    fuel: [],
    category: [],
    hubs: [],
    priceMin: PRICE_MIN,
    priceMax: PRICE_MAX,
    owner: [],
    q: null
  });

  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortKey, setSortKey] = useState("relevance");

  const mapCarForMobileCard = (car) => {
    // ✅ Properly format image URL with fallback
    const getImageUrl = () => {
      // If car already has formatted image, use it
      if (car.image && car.image.startsWith('https')) {
        return car.image;
      }
      // If car has images.exterior array, use first image
      if (car.images?.exterior?.[0]?.image) {
        return `${API_BASE_URL}${car.images.exterior[0].image}`;
      }
      // Fallback to placeholder
      return process.env.PUBLIC_URL + "/placeholder-car.png";
    };

    // Get prices - API provides: price (original) and discount_price (discounted)
    // Check if discount_price exists and is different from price
    const originalPrice = car.price || 0; // Original price from API
    const discountedPrice = car.discount_price || car.price || 0; // Discounted price if available
    const hasDiscount = car.discount_price && car.discount_price < car.price && car.discount_price > 0;

    // FIX: Normalize color to lowercase
    const normalizedColor = car.colorKey ? car.colorKey.toLowerCase() : null;

    return {
      id: car.id,
      brand: car.brand,
      model: car.model,
      title: car.title,

      priceNum: discountedPrice / 100000, // lakhs (use discounted for sorting/filtering)
      price: formatPrice(discountedPrice), // Discounted price (display)
      originalPrice: hasDiscount ? formatPrice(originalPrice) : null, // Original price (for strikethrough)
      hasDiscount: hasDiscount,
      emi: formatEMI(discountedPrice),

      kmNum: car.km,
      km: formatKM(car.km),

      fuel: car.fuel,
      trans: car.transmission || car.trans || '-',
      transVal: getTransmissionVal(car.transmission || car.trans),

      location: car.city,
      year: String(car.year),
      body: car.body,
      color: normalizedColor, // Use normalized color

      thumb: getImageUrl(),
      variant: `${car.brand} ${car.model}`,

      // ✅ NEW — reuse everywhere
      features: car.features,
      reasonsToBuy: car.reasons_to_buy,
      specs: car.specs,
      inspections: car.inspections,
    };
  };

  // Instead of using useCars context, fetch cars directly with pagination
  const [mobileCars, setMobileCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Build query string from filters - FIXED VERSION
  const buildQuery = useCallback((filters, page = 1) => {
    const params = new URLSearchParams();
    
    // Page parameter
    params.set('page', page.toString());
    
    // Text search
    if (filters.q) {
      params.set('search', filters.q);
    }
    
    // Price filters
    if (filters.priceMin && filters.priceMin !== PRICE_MIN) {
      params.set('price_min', filters.priceMin.toString());
    }
    if (filters.priceMax && filters.priceMax !== PRICE_MAX) {
      params.set('price_max', filters.priceMax.toString());
    }
    
    // Year filter - FIX: Handle different year formats
    if (filters.year) {
      if (filters.year === "2024") {
        params.set('year_min', '2024');
      } else if (filters.year === "2023") {
        params.set('year_min', '2023');
      } else if (filters.year === "2022") {
        params.set('year_min', '2022');
      } else if (filters.year === "2019-2021") {
        params.set('year_min', '2019');
        params.set('year_max', '2021');
      } else if (filters.year === "older") {
        params.set('year_max', '2018');
      }
    }
    
    // Transmission - FIX: Convert to lowercase for API
    if (filters.trans) {
      // Convert display value to lowercase for API
      const transValue = filters.trans.toLowerCase();
      params.set('transmission', transValue);
    }
    
    // Body type - FIX: Handle array
    if (filters.body && filters.body.length > 0) {
      params.set('body', filters.body.join(','));
    }
    
    // Brands
    if (filters.brands && filters.brands.length > 0) {
      params.set('brand', filters.brands.join(','));
    }
    
    // Color - FIX: Use lowercase
    if (filters.color) {
      params.set('color', filters.color.toLowerCase());
    }
    
    // Fuel type - FIX: Handle array
    if (filters.fuel && filters.fuel.length > 0) {
      params.set('fuel', filters.fuel.join(','));
    }
    
    // Sort - FIX: Map sortKey to proper ordering
    let ordering = '-created_at'; // default
    switch(sortKey) {
      case 'price_asc': ordering = 'price'; break;
      case 'price_desc': ordering = '-price'; break;
      case 'km_asc': ordering = 'km'; break;
      case 'year_desc': ordering = '-year'; break;
      case 'newest': ordering = '-created_at'; break;
      case 'discount_desc': ordering = '-discount'; break;
      default: ordering = '-created_at';
    }
    params.set('ordering', ordering);
    
    return params.toString();
  }, [PRICE_MIN, PRICE_MAX, sortKey]);

  // Fetch cars function - FIXED to handle glitches
  const fetchCars = useCallback(async (isLoadMore = false) => {
    // Prevent loading more when already loading or no more pages
    if (isLoadMore && (!nextPage || !hasMore)) return;
    
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setIsLoading(true);
        if (filtersChanged) {
          setMobileCars([]);
          setHasMore(false);
          setNextPage(null);
          setTotalCount(0);
        }
      }
      
      const url = isLoadMore 
        ? nextPage 
        : `${API_BASE_URL}/api/cars/?${buildQuery(appliedFilters, 1)}`;
      
      console.log('Fetching cars from:', url);
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch cars');
      
      const data = await response.json();
      
      const newCars = data.results.map(mapCarForMobileCard);
      
      if (isLoadMore) {
        setMobileCars(prev => [...prev, ...newCars]);
      } else {
        setMobileCars(newCars);
      }
      
      setTotalCount(data.count || 0);
      setNextPage(data.next);
      setHasMore(!!data.next);
      initialLoadDone.current = true;
      setFiltersChanged(false);
      setInitialLoad(false);
      
    } catch (err) {
      console.error('Error fetching cars:', err);
      // Reset loading states on error
      setHasMore(false);
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [nextPage, hasMore, loadingMore, appliedFilters, buildQuery, filtersChanged]);

  // Initial fetch on mount and when filters change - FIXED to prevent multiple calls
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Initial load on mount
      fetchCars(false);
      return;
    }
    
    const timer = setTimeout(() => {
      fetchCars(false);
    }, 300); // Debounce
    
    return () => clearTimeout(timer);
  }, [fetchCars, appliedFilters, sortKey]);

  // Infinite scroll observer - FIXED to prevent glitches
  useEffect(() => {
    if (isLoading || loadingMore || !hasMore || !nextPage) {
      if (observer.current) {
        observer.current.disconnect();
      }
      return;
    }

    const currentObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && nextPage) {
        console.log('Loading more cars...');
        fetchCars(true);
      }
    }, {
      rootMargin: '400px', // Increased margin for smoother loading
      threshold: 0.1
    });

    observer.current = currentObserver;

    if (lastCarElementRef.current && hasMore && nextPage) {
      currentObserver.observe(lastCarElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }
    };
  }, [isLoading, loadingMore, hasMore, fetchCars,hasMore, nextPage]);

  /* matchesFilters - FIXED to handle normalized values */
  function matchesFilters(c, filters) {
    if (!filters) return true;
  
    /* ------------------------------
       Normalize once (CRITICAL FIX)
    ------------------------------ */
    const car = {
      ...c,
      brand: c.brand ?? null,
      model: c.model ?? null,
      trans: c.transVal ?? c.trans ?? null,
      year: c.year != null ? Number(c.year) : null,
      kmNum:
        c.kmNum != null
          ? Number(c.kmNum)
          : c.km != null
          ? Number(String(c.km).replace(/[^\d]/g, ""))
          : null,
      priceNum:
        c.priceNum != null
          ? Number(c.priceNum)
          : c.price != null
          ? Number(String(c.price).replace(/[^\d]/g, "")) / 100000
          : null, // lakhs
      color: c.color ?? null,
      body: c.body ?? null,
      fuel: c.fuel ?? null,
    };
  
    /* ------------------------------
       Fuel Type - NEW
    ------------------------------ */
    if (filters.fuel && filters.fuel.length > 0) {
      if (!car.fuel || !filters.fuel.includes(car.fuel)) {
        return false;
      }
    }
  
    /* ------------------------------
       Brands + Models
    ------------------------------ */
    if (filters.brands?.length) {
      const brandSelected = filters.brands.includes(car.brand);
      const modelSelections = filters.brandModels?.[car.brand];
  
      if (modelSelections?.length) {
        if (!modelSelections.includes(car.model)) return false;
      } else if (!brandSelected) {
        return false;
      }
    }
  
    /* ------------------------------
       Transmission - FIX: Use lowercase comparison
    ------------------------------ */
    if (filters.trans) {
      // Normalize both values to lowercase for comparison
      const carTrans = (car.transVal || car.trans || "").toLowerCase().trim();
      const filterTrans = String(filters.trans).toLowerCase().trim();
      
      if (!carTrans || carTrans !== filterTrans) {
        return false;
      }
    }
  
    /* ------------------------------
       Year
    ------------------------------ */
    if (filters.year) {
      if (!car.year) return false;
  
      const f = String(filters.year).trim();
      const cy = car.year;
  
      if (/&\s*above/i.test(f)) {
        const num = Number(f.split("&")[0]);
        if (!isNaN(num) && cy < num) return false;
      } else if (f.includes("-")) {
        const [low, high] = f.replace(/\s/g, "").split("-").map(Number);
        if (!isNaN(low) && !isNaN(high) && (cy < low || cy > high)) return false;
      } else if (/older|before/i.test(f)) {
        if (cy >= 2019) return false;
      } else if (/^\d{4}$/.test(f)) {
        const num = Number(f);
        if (cy < num) return false;
      }
    }
  
    /* ------------------------------
       Kilometers
    ------------------------------ */
    if (filters.kms) {
      if (car.kmNum == null || isNaN(car.kmNum)) return false;
      const kms = car.kmNum;
  
      if (filters.kms === "< 20,000" && kms > 20000) return false;
      if (filters.kms === "20,001 - 50,000" && (kms < 20001 || kms > 50000)) return false;
      if (filters.kms === "50,001 - 1,00,000" && (kms < 50001 || kms > 100000)) return false;
      if (filters.kms === "< 125000 kms" && kms > 125000) return false;
      if (filters.kms === "100,001+" && kms <= 100000) return false;
    }
  
    /* ------------------------------
       Color - FIX: Use lowercase comparison
    ------------------------------ */
    if (filters.color) {
      // Normalize color comparison (case-insensitive)
      const carColor = (car.color || "").toLowerCase().trim();
      const filterColor = String(filters.color).toLowerCase().trim();
      if (!carColor || carColor !== filterColor) return false;
    }
  
    /* ------------------------------
       Body Type
    ------------------------------ */
    if (filters.body?.length) {
      if (!car.body) return false;
      // Normalize body type comparison (case-insensitive)
      const carBody = (car.body || "").toLowerCase().trim();
      const filterBodies = filters.body.map(b => String(b).toLowerCase().trim());
      if (!filterBodies.includes(carBody)) return false;
    }
  
    /* ------------------------------
       Price (filters in rupees, car in lakhs)
    ------------------------------ */
    // Only filter by price if both min and max are set and valid
    if (filters.priceMin != null && filters.priceMax != null) {
      const min = Number(filters.priceMin);
      const max = Number(filters.priceMax);
      
      // Skip price filtering if values are invalid or at defaults
      if (!isNaN(min) && !isNaN(max) && min !== PRICE_MIN && max !== PRICE_MAX) {
        if (car.priceNum == null || isNaN(car.priceNum)) return false;
  
        let carPrice = car.priceNum * 100000;
        let _min = min;
        let _max = max;
  
        if (_min > _max) {
          [_min, _max] = [_max, _min];
        }
  
        if (carPrice < _min || carPrice > _max) return false;
      }
    }
  
    return true;
  }

  function applySort(list) {
    const arr = [...list];
    switch (sortKey) {
      case "price_asc": return arr.sort((a, b) => a.priceNum - b.priceNum);
      case "price_desc": return arr.sort((a, b) => b.priceNum - a.priceNum);
      case "km_asc": return arr.sort((a, b) => a.kmNum - b.kmNum);
      case "year_desc": return arr.sort((a, b) => Number(b.year) - Number(a.year));
      default: return arr;
    }
  }

  // Apply filters to the current cars
  const filtered = useMemo(() => {
    return applySort(mobileCars.filter((c) => matchesFilters(c, appliedFilters)));
  }, [mobileCars, appliedFilters, sortKey]);

  const sampleSlides = [
    { title: "Why CarsDedo?", text: "Verified listings · Easy EMI options · 7-day test drive" },
    { title: "Tips", text: "Check service history and insurance papers before buying." },
  ];

  // Get unique cities from filtered cars for the results header
  const uniqueCities = [...new Set(filtered.map(car => car.location))];
  const locationText = uniqueCities.length === 1 
    ? uniqueCities[0]
    : uniqueCities.length > 1 
      ? `${uniqueCities.slice(0, 2).join(", ")}${uniqueCities.length > 2 ? ` +${uniqueCities.length - 2} more` : ''}`
      : "Delhi"; // Default fallback

  // Handle filter changes
  const handleSetAppliedFilters = useCallback((updater) => {
    setAppliedFilters(prev => {
      const newFilters = typeof updater === 'function' ? updater(prev) : updater;
      
      // Check if filters actually changed
      const oldFilters = { ...prev };
      const newFiltersCopy = { ...newFilters };
      
      // Compare stringified versions to detect changes
      const oldStr = JSON.stringify(oldFilters);
      const newStr = JSON.stringify(newFiltersCopy);
      
      if (oldStr !== newStr) {
        console.log('Filters changed, setting filtersChanged to true');
        setFiltersChanged(true);
      }
      
      return newFilters;
    });
  }, []);

  const handleClearFilters = () => {
    setAppliedFilters({
      year: null,
      kms: null,
      brands: [],
      brandModels: {},
      color: null,
      trans: null,
      features: [],
      seats: [],
      rto: [],
      body: [],
      fuel: [],
      category: [],
      hubs: [],
      priceMin: PRICE_MIN,
      priceMax: PRICE_MAX,
      owner: [],
      q: null
    });
    setFiltersChanged(true);
  };

  // Format filter display labels
  const formatFilterLabel = (filterType, value) => {
    switch(filterType) {
      case 'trans':
        return value === 'automatic' ? 'Automatic' : 
               value === 'manual' ? 'Manual' : 
               value === 'amt' ? 'AMT' : value;
      case 'color':
        return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
      case 'fuel':
        return Array.isArray(value) ? value.join(', ') : value;
      default:
        return value;
    }
  };

  if (initialLoad && isLoading) {
    return <Loader message="Loading cars..." fullScreen={true} />;
  }

  return (
    <div className="buypage-root">
      <header className="buy-header">
        <div className="buy-header-inner">
          <button 
            className="hamburger" 
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <div className="brand">
            <img
              src={process.env.PUBLIC_URL + "/carsdedo-background.png"}
              alt="CarsDedo"
              className="brand-logo"
            />
          </div>
          <div className="header-actions">
            <button 
              className="action search-icon-btn" 
              onClick={() => navigate("/search")}
              aria-label="Search cars"
            >
              <FiSearch />
            </button>
            <button 
              className="action" 
              onClick={() => navigate("/sell")}
            >
              Sell
            </button>
          </div>
        </div>

        <div className="filters-top" role="toolbar" aria-label="Top filters">
          <FilterDropdown 
            id="year-top" 
            label={`Year${appliedFilters.year ? `: ${appliedFilters.year}` : ""}`} 
            options={yearOptionsTop} 
            selected={appliedFilters.year} 
            onChange={(v) => handleSetAppliedFilters((s) => ({ ...s, year: v }))} 
          />
          <FilterDropdown 
            id="trans-top" 
            label={`Transmission${appliedFilters.trans ? `: ${formatFilterLabel('trans', appliedFilters.trans)}` : ""}`} 
            options={transOptionsTop} 
            selected={appliedFilters.trans} 
            onChange={(v) => handleSetAppliedFilters((s) => ({ ...s, trans: v }))} 
          />
          <FilterDropdown 
            id="body-top" 
            label={`Body Type${appliedFilters.body && appliedFilters.body.length ? `: ${appliedFilters.body[0]}` : ""}`} 
            options={bodyOptionsTop} 
            selected={appliedFilters.body && appliedFilters.body[0]} 
            onChange={(v) => handleSetAppliedFilters((s) => ({ ...s, body: v ? [v] : [] }))} 
          />
          <FilterDropdown 
            id="color-top" 
            label={`Color${appliedFilters.color ? `: ${formatFilterLabel('color', appliedFilters.color)}` : ""}`} 
            options={colorOptionsTop} 
            selected={appliedFilters.color} 
            onChange={(v) => handleSetAppliedFilters((s) => ({ ...s, color: v }))} 
          />
          {/* ADD: Fuel type dropdown */}
          <FilterDropdown 
            id="fuel-top" 
            label={`Fuel${appliedFilters.fuel && appliedFilters.fuel.length > 0 ? `: ${formatFilterLabel('fuel', appliedFilters.fuel[0])}` : ""}`} 
            options={fuelOptionsTop} 
            selected={appliedFilters.fuel && appliedFilters.fuel[0]} 
            onChange={(v) => handleSetAppliedFilters((s) => ({ ...s, fuel: v ? [v] : [] }))} 
          />
        </div>
      </header>

      {/* Promotional Carousel */}
      <PromotionalCarousel isMobile={true} />

      {/* Applied Filters Display - UPDATED to include fuel type */}
      {((appliedFilters.year || appliedFilters.kms || appliedFilters.brands?.length || appliedFilters.color || appliedFilters.trans || appliedFilters.body?.length || appliedFilters.fuel?.length > 0 || (appliedFilters.priceMin !== PRICE_MIN || appliedFilters.priceMax !== PRICE_MAX)) && (
        <div className="applied-filters-bar">
          <div className="applied-filters-container">
            <button 
              className="clear-all-btn-mobile"
              onClick={handleClearFilters}
            >
              Clear All
            </button>
            {appliedFilters.year && (
              <span className="applied-filter-tag">
                Year: {appliedFilters.year}
                <button 
                  className="filter-remove-btn" 
                  onClick={() => handleSetAppliedFilters(s => ({ ...s, year: null }))}
                  aria-label="Remove year filter"
                >
                  <FiX size={12} />
                </button>
              </span>
            )}
            {appliedFilters.kms && (
              <span className="applied-filter-tag">
                KMs: {appliedFilters.kms}
                <button 
                  className="filter-remove-btn" 
                  onClick={() => handleSetAppliedFilters(s => ({ ...s, kms: null }))}
                  aria-label="Remove kms filter"
                >
                  <FiX size={12} />
                </button>
              </span>
            )}
            {appliedFilters.brands?.length > 0 && (
              <span className="applied-filter-tag">
                Brand{appliedFilters.brands.length > 1 ? 's' : ''}: {appliedFilters.brands.join(', ')}
                <button 
                  className="filter-remove-btn" 
                  onClick={() => handleSetAppliedFilters(s => ({ ...s, brands: [], brandModels: {} }))}
                  aria-label="Remove brand filter"
                >
                  <FiX size={12} />
                </button>
              </span>
            )}
            {appliedFilters.color && (
              <span className="applied-filter-tag">
                Color: {formatFilterLabel('color', appliedFilters.color)}
                <button 
                  className="filter-remove-btn" 
                  onClick={() => handleSetAppliedFilters(s => ({ ...s, color: null }))}
                  aria-label="Remove color filter"
                >
                  <FiX size={12} />
                </button>
              </span>
            )}
            {appliedFilters.trans && (
              <span className="applied-filter-tag">
                Transmission: {formatFilterLabel('trans', appliedFilters.trans)}
                <button 
                  className="filter-remove-btn" 
                  onClick={() => handleSetAppliedFilters(s => ({ ...s, trans: null }))}
                  aria-label="Remove transmission filter"
                >
                  <FiX size={12} />
                </button>
              </span>
            )}
            {appliedFilters.body?.length > 0 && (
              <span className="applied-filter-tag">
                Body: {appliedFilters.body.join(', ')}
                <button 
                  className="filter-remove-btn" 
                  onClick={() => handleSetAppliedFilters(s => ({ ...s, body: [] }))}
                  aria-label="Remove body filter"
                >
                  <FiX size={12} />
                </button>
              </span>
            )}
            {appliedFilters.fuel?.length > 0 && (
              <span className="applied-filter-tag">
                Fuel: {appliedFilters.fuel.join(', ')}
                <button 
                  className="filter-remove-btn" 
                  onClick={() => handleSetAppliedFilters(s => ({ ...s, fuel: [] }))}
                  aria-label="Remove fuel filter"
                >
                  <FiX size={12} />
                </button>
              </span>
            )}
            {(appliedFilters.priceMin !== PRICE_MIN || appliedFilters.priceMax !== PRICE_MAX) && (
              <span className="applied-filter-tag">
                Price: ₹{Math.round(appliedFilters.priceMin / 1000)}k - ₹{Math.round(appliedFilters.priceMax / 100000)}L
                <button 
                  className="filter-remove-btn" 
                  onClick={() => handleSetAppliedFilters(s => ({ ...s, priceMin: PRICE_MIN, priceMax: PRICE_MAX }))}
                  aria-label="Remove price filter"
                >
                  <FiX size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      ))}

      <div className="results-header">
        <h3>
          {isLoading && filtersChanged 
            ? "Searching..." 
            : isLoading && initialLoad
              ? "Loading..."
              : `${totalCount} Used cars in ${locationText}`
          }
        </h3>
      </div>

      <main className="buy-main">
        <div className="list">
          {/* Show skeletons on initial load OR when filters are changing */}
          {(initialLoad || (isLoading && filtersChanged)) ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="car-card skeleton">
                <div className="car-thumb skeleton-thumb"></div>
                <div className="car-content">
                  <div className="car-row">
                    <div>
                      <div className="car-title skeleton-text"></div>
                      <div className="car-variant skeleton-text"></div>
                    </div>
                    <div className="car-price">
                      <div className="price skeleton-text"></div>
                      <div className="emi skeleton-text"></div>
                    </div>
                  </div>
                  <div className="car-tags">
                    <span className="tag skeleton-tag"></span>
                    <span className="tag skeleton-tag"></span>
                    <span className="tag skeleton-tag"></span>
                  </div>
                  <div className="car-footer">
                    <div className="hub skeleton-text"></div>
                    <div className="fav skeleton-icon"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Show actual cars
            filtered.map((car, index) => (
              <React.Fragment key={car.id}>
                <article 
                  className="car-card" 
                  tabIndex={0} 
                  onClick={() => {
                    const scroller = document.querySelector(".buy-main");
                    if (scroller) {
                      sessionStorage.setItem("buy_scroll_top", scroller.scrollTop);
                    }
                    navigate(`/car/${car.id}`, { state: { car } });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/car/${car.id}`, { state: { car } });
                    }
                  }}
                  role="button"
                  aria-label={`View details for ${car.title}`}
                  ref={filtered.length === index + 1 && hasMore ? lastCarElementRef : null}
                >
                  {/* Status badge */}
                  <div className="car-badge">
                    {car.year || 'Certified'}
                  </div>

                  {/* Thumbnail */}
                  <div className="car-thumb">
                    <img 
                      src={car.thumb} 
                      alt={car.title || "Car image"}
                      loading="lazy"
                      onError={(e) => {
                        if (!e.target.src.includes('placeholder-car.png')) {
                          e.target.src = process.env.PUBLIC_URL + "/placeholder-car.png";
                        }
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="car-content">
                    {/* Title and Price row */}
                    <div className="car-row">
                      <div>
                        <div className="car-title">{car.title}</div>
                        <div className="car-variant">{car.variant}</div>
                      </div>
                      <div className="car-price">
                        {car.hasDiscount && car.originalPrice ? (
                          <div className="price-with-discount">
                            <div className="price-discounted">{car.price}</div>
                            <div className="price-original">{car.originalPrice}</div>
                          </div>
                        ) : (
                          <div className="price">{car.price}</div>
                        )}
                        <div className="emi">{car.emi}</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="car-tags">
                      <span className="tag">{car.km}</span>
                      <span className="tag">{car.fuel}</span>
                      <span className="tag">{car.trans || '-'}</span>
                      {car.color && <span className="tag">{formatFilterLabel('color', car.color)}</span>}
                    </div>

                    {/* Footer */}
                    <div className="car-footer">
                      <div className="hub">
                        <FiMapPin className="hub-icon" />
                        HUB · Trillium Avenue, Gurgaon
                      </div>
                      <button 
                        className="fav" 
                        aria-label="Add to wishlist"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add to wishlist logic here
                        }}
                      >
                        ♡
                      </button>
                    </div>
                  </div>
                </article>

                {/* inject swipe info after every 6 cards */}
                {((index + 1) % 6 === 0) && <div key={`swipe-${index}`} className="swipe-insert"><SwipableInfo slides={sampleSlides} /></div>}
              </React.Fragment>
            ))
          )}
          
          {/* Show skeletons while loading more */}
          {loadingMore && 
            Array.from({ length: 4 }).map((_, i) => (
              <div key={`loadmore-skeleton-${i}`} className="car-card skeleton">
                <div className="car-thumb skeleton-thumb"></div>
                <div className="car-content">
                  <div className="car-row">
                    <div>
                      <div className="car-title skeleton-text"></div>
                      <div className="car-variant skeleton-text"></div>
                    </div>
                    <div className="car-price">
                      <div className="price skeleton-text"></div>
                      <div className="emi skeleton-text"></div>
                    </div>
                  </div>
                  <div className="car-tags">
                    <span className="tag skeleton-tag"></span>
                    <span className="tag skeleton-tag"></span>
                    <span className="tag skeleton-tag"></span>
                  </div>
                  <div className="car-footer">
                    <div className="hub skeleton-text"></div>
                    <div className="fav skeleton-icon"></div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>

        {/* End of results message - FIX: Only show when no more results AND we have some cars */}
        {!hasMore && filtered.length > 0 && (
          <div className="end-of-results">
            <p>You've reached the end of results</p>
          </div>
        )}

        {/* No results message */}
        {!isLoading && !loadingMore && filtered.length === 0 && mobileCars.length > 0 && (
          <div className="no-results">
            <p>No cars match your filters. Try adjusting your search criteria.</p>
          </div>
        )}
      </main>

      <BottomNav />

      {!filterOpen && (
        <div className="bottom-controls">
          <button className="bottom-btn" onClick={() => setSortOpen(true)}>⇅ Sort</button>
          <button className="bottom-btn primary" onClick={() => setFilterOpen(true)}>⚙ Filter</button>
        </div>
      )}

      <SortModal 
        open={sortOpen} 
        onClose={() => setSortOpen(false)} 
        value={sortKey} 
        onChange={(k) => { 
          setSortKey(k); 
          setSortOpen(false); 
          setFiltersChanged(true);
        }} 
      />

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        appliedFilters={appliedFilters}
        onApply={(filters) => {
          // ensure numeric rupee values and clamp to allowed bounds
          const pm = Math.max(PRICE_MIN, Math.min(PRICE_MAX, Number(filters.priceMin)));
          const px = Math.max(PRICE_MIN, Math.min(PRICE_MAX, Number(filters.priceMax)));
          handleSetAppliedFilters({
            ...filters,
            priceMin: Number(pm),
            priceMax: Number(px),
          });
          setFilterOpen(false);
        }}
        onClear={() => {
          handleSetAppliedFilters({ 
            year: null, 
            kms: null, 
            brands: [], 
            brandModels: {}, 
            color: null, 
            trans: null, 
            features: [], 
            seats: [], 
            rto: [], 
            body: [], 
            fuel: [],
            category: [],
            hubs: [],
            priceMin: PRICE_MIN, 
            priceMax: PRICE_MAX, 
            owner: [] 
          });
        }}
      />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <ScrollToTop />
    </div>
  );
}