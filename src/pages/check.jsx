// BuyPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import BottomNav from "../components/BottomNav";
import "../styles/BuyPage.css";

// Use uploaded hero/banner image (from conversation files)
const HERO_BANNER = "/mnt/data/93f9b768-4f04-44ea-a832-90320b25060b.png";

/* small SVG checkmark used across controls */
function IconCheck({ checked }) {
  return (
    <svg className={`checkmark ${checked ? "show" : ""}`} width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <path fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
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
    function onDoc(e) {
      if ((btnRef.current && btnRef.current.contains(e.target)) || (menuRef.current && menuRef.current.contains(e.target))) return;
      setOpen(false);
    }
    window.addEventListener("click", onDoc);
    return () => window.removeEventListener("click", onDoc);
  }, []);

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
          e.stopPropagation();
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
          </div>,
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

  const categories = [
    "Saved Filters", "Price Range", "Brands + Models", "Year", "Kms Driven", "Fuel Type",
    "Body Type", "Transmission", "Car Category", "Color", "Features", "Seats", "RTO",
    "Owner"
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
      priceMin: safeMin,
      priceMax: safeMax,
      owner: local.owner ?? []
    });

    onClose?.();
  }

  function handleClear() {
    setLocal({
      year: [], kms: [], brands: [], brandModels: {}, colors: [], trans: [], features: [], seats: [], rto: [], body: [], priceMin: PRICE_MIN, priceMax: PRICE_MAX, owner: []
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
                      #f0e8ff 0%,
                      #f0e8ff ${topPct}%,
                      #6b2be6 ${topPct}%,
                      #6b2be6 ${bottomPct}%,
                      #f0e8ff ${bottomPct}%,
                      #f0e8ff 100%)`
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
                  <span className="search-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </span>
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

            {/* fallback */}
            {["Saved Filters", "Fuel Type", "Car Category"].includes(active) && (
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
        <div className="swipe-card-inner">
          <h4 className="swipe-title">{current.title ?? `Info ${idx + 1}`}</h4>
          <p className="swipe-text">{current.text ?? current}</p>
        </div>
        <div className="swipe-controls">
          <button aria-label="Previous" onClick={prev} className="swipe-btn">‹</button>
          <div className="swipe-dots">{slides.map((_, i) => <button key={i} onClick={() => setIdx(i)} className={`swipe-dot ${i === idx ? "active" : ""}`} aria-label={`Go to slide ${i + 1}`} />)}</div>
          <button aria-label="Next" onClick={next} className="swipe-btn">›</button>
        </div>
      </div>
    </div>
  );
}

/* Main BuyPage component */
export default function BuyPage() {
  const navigate = useNavigate();

  const yearOptionsTop = [
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2019-2021", label: "2019 - 2021" },
    { value: "older", label: "Before 2019" }
  ];
  const transOptionsTop = [{ value: "automatic", label: "Automatic" }, { value: "manual", label: "Manual" }, { value: "amt", label: "AMT" }];
  const bodyOptionsTop = [{ value: "Hatchback", label: "Hatchback" }, { value: "Sedan", label: "Sedan" }, { value: "SUV", label: "SUV" }, { value: "MPV", label: "MPV" }];
  const colorOptionsTop = [{ value: "White", label: "White" }, { value: "Black", label: "Black" }, { value: "Silver", label: "Silver" }, { value: "Red", label: "Red" }];

  // local price defaults (numbers in rupees)
  const PRICE_MIN = 50000;
  const PRICE_MAX = 2000000; // 80 lakh cap

  const [appliedFilters, setAppliedFilters] = useState({
    year: null, kms: null, brands: [], brandModels: {}, color: null, trans: null, features: [], seats: [], rto: [], body: [], priceMin: PRICE_MIN, priceMax: PRICE_MAX, owner: []
  });

  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortKey, setSortKey] = useState("relevance");

  /* sample cars data */
  const [cars, setCars] = useState([]);
  useEffect(() => {
    const sample = [
      { id: "c1", brand: "Maruti Suzuki", model: "Tiago", title: "2018 Maruti Tiago", priceNum: 3.74, price: "₹3.74 Lakh", emi: "EMI ₹6,369/m*", kmNum: 61000, km: "61,000 km", fuel: "CNG", trans: "Manual", transVal: "manual", location: "DL12", year: "2018", body: "Hatchback", color: "White", thumb: process.env.PUBLIC_URL + "/baleno.avif" },
      { id: "c2", brand: "Tata", model: "Harrier", title: "2022 Tata Harrier", priceNum: 19.75, price: "₹19.75 Lakh", emi: "EMI ₹39,126/m*", kmNum: 24500, km: "24,500 km", fuel: "Diesel", trans: "Automatic", transVal: "automatic", location: "HR98", year: "2022", body: "SUV", color: "Black", thumb: process.env.PUBLIC_URL + "/venue.avif" },
      { id: "c3", brand: "Maruti Suzuki", model: "Swift", title: "2020 Maruti Swift", priceNum: 6.10, price: "₹6.10 Lakh", emi: "EMI ₹10,500/m*", kmNum: 45000, km: "45,000 km", fuel: "Petrol", trans: "Manual", transVal: "manual", location: "DL05", year: "2020", body: "Hatchback", color: "Red", thumb: process.env.PUBLIC_URL + "/swift.avif" },
      { id: "c4", brand: "Hyundai", model: "Verna", title: "2021 Hyundai Verna", priceNum: 8.40, price: "₹8.40 Lakh", emi: "EMI ₹14,500/m*", kmNum: 33000, km: "33,000 km", fuel: "Petrol", trans: "AMT", transVal: "amt", location: "MH04", year: "2021", body: "Sedan", color: "Silver", thumb: process.env.PUBLIC_URL + "/verna.avif" },
      { id: "c5", brand: "Honda", model: "City", title: "2019 Honda City", priceNum: 9.25, price: "₹9.25 Lakh", emi: "EMI ₹15,900/m*", kmNum: 52000, km: "52,000 km", fuel: "Petrol", trans: "Automatic", transVal: "automatic", location: "DL01", year: "2019", body: "Sedan", color: "White", thumb: process.env.PUBLIC_URL + "/city.avif" },
      { id: "c6", brand: "Ford", model: "EcoSport", title: "2017 Ford EcoSport", priceNum: 6.50, price: "₹6.50 Lakh", emi: "EMI ₹11,200/m*", kmNum: 85000, km: "85,000 km", fuel: "Diesel", trans: "Manual", transVal: "manual", location: "KA05", year: "2017", body: "SUV", color: "Black", thumb: process.env.PUBLIC_URL + "/ecosport.avif" },
      { id: "c7", brand: "Toyota", model: "Glanza", title: "2023 Toyota Glanza", priceNum: 7.60, price: "₹7.60 Lakh", emi: "EMI ₹13,000/m*", kmNum: 12000, km: "12,000 km", fuel: "Petrol", trans: "AMT", transVal: "amt", location: "DL09", year: "2023", body: "Hatchback", color: "Silver", thumb: process.env.PUBLIC_URL + "/glanza.avif" },
      { id: "c8", brand: "Mahindra", model: "XUV500", title: "2016 Mahindra XUV500", priceNum: 9.90, price: "₹9.90 Lakh", emi: "EMI ₹17,000/m*", kmNum: 110000, km: "1,10,000 km", fuel: "Diesel", trans: "Manual", transVal: "manual", location: "UP14", year: "2016", body: "SUV", color: "White", thumb: process.env.PUBLIC_URL + "/xuv.avif" },
    ];
    setCars(sample);
  }, []);

  /* matchesFilters - robust price & year handling */
  function matchesFilters(c, filters) {
    // brands + models
    if (filters.brands && filters.brands.length > 0) {
      const brandSelected = filters.brands.includes(c.brand);
      const brandModelSelections = filters.brandModels && filters.brandModels[c.brand];
      if (brandModelSelections && brandModelSelections.length > 0) {
        if (!brandModelSelections.includes(c.model)) return false;
      } else if (!brandSelected) {
        return false;
      }
    }

    // transmission (single)
    if (filters.trans && c.transVal && filters.trans !== c.transVal) return false;

    // year handling
    if (filters.year) {
      const f = String(filters.year).trim();
      const cy = Number(c.year || 0);
      if (/&\s*above/.test(f) || f.includes("& above")) {
        const num = Number(f.split("&")[0].trim());
        if (!isNaN(num) && cy < num) return false;
      } else if (f.includes("-")) {
        const parts = f.replace(/\s/g, "").split("-");
        if (parts.length === 2) {
          const low = Number(parts[0]);
          const high = Number(parts[1]);
          if (!isNaN(low) && !isNaN(high)) {
            if (cy < low || cy > high) return false;
          }
        }
      } else if (f === "older" || /before/i.test(f)) {
        if (cy >= 2019) return false;
      } else if (/^\d{4}$/.test(f)) {
        const num = Number(f);
        if (!isNaN(num) && cy < num) return false;
      } else {
        if (String(c.year) !== f) return false;
      }
    }

    // kms
    if (filters.kms) {
      const kms = c.kmNum || 0;
      if (filters.kms === "< 20,000" && kms > 20000) return false;
      if (filters.kms === "20,001 - 50,000" && (kms < 20001 || kms > 50000)) return false;
      if (filters.kms === "50,001 - 1,00,000" && (kms < 50001 || kms > 100000)) return false;
      if (filters.kms === "< 125000 kms" && kms > 125000) return false;
      if (filters.kms === "100,001+" && kms <= 100000) return false;
    }

    // color
    if (filters.color && c.color && filters.color !== c.color) return false;

    // body
    if (filters.body && filters.body.length > 0) {
      if (!filters.body.includes(c.body)) return false;
    }

    // price logic (car.priceNum is in lakhs, filters are rupees)
    const rawMin = filters.priceMin;
    const rawMax = filters.priceMax;
    const min = rawMin != null ? Number(rawMin) : null;
    const max = rawMax != null ? Number(rawMax) : null;

    if ((min !== null && isNaN(min)) || (max !== null && isNaN(max))) {
      // ignore bad filter values
    } else {
      const carPrice = Number(c.priceNum || 0) * 100000;
      let _min = min;
      let _max = max;
      if (_min !== null && _max !== null && _min > _max) {
        const t = _min; _min = _max; _max = t;
      }
      if (_min !== null && _min < PRICE_MIN) _min = PRICE_MIN;
      if (_max !== null && _max > PRICE_MAX) _max = PRICE_MAX;

      if (_min !== null && carPrice < _min) return false;
      if (_max !== null && carPrice > _max) return false;
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

  // compute visible list using appliedFilters
  const filtered = applySort(cars.filter((c) => matchesFilters(c, appliedFilters)));

  const sampleSlides = [
    { title: "Why CarsDedo?", text: "Verified listings · Easy EMI options · 7-day test drive" },
    { title: "Tips", text: "Check service history and insurance papers before buying." },
  ];

  return (
    <div className="buypage-root">
      <header className="buy-header">
        <div className="buy-header-inner">
          <button className="hamburger" aria-label="Open menu">☰</button>
          <div className="brand">CarsDedo</div>
          <div className="header-actions"><button className="action">Sell</button><button className="action active">Buy</button></div>
        </div>

        <div className="hero-banner"><img src={HERO_BANNER} alt="Top deals" className="hero-img" /></div>

        <div className="filters-top" role="toolbar" aria-label="Top filters">
          <FilterDropdown id="year-top" label={`Year${appliedFilters.year ? `: ${appliedFilters.year}` : ""}`} options={yearOptionsTop} selected={appliedFilters.year} onChange={(v) => setAppliedFilters((s) => ({ ...s, year: v }))} />
          <FilterDropdown id="trans-top" label={`Transmission${appliedFilters.trans ? `: ${appliedFilters.trans}` : ""}`} options={transOptionsTop} selected={appliedFilters.trans} onChange={(v) => setAppliedFilters((s) => ({ ...s, trans: v }))} />
          <FilterDropdown id="body-top" label={`Body Type${appliedFilters.body && appliedFilters.body.length ? `: ${appliedFilters.body[0]}` : ""}`} options={bodyOptionsTop} selected={appliedFilters.body && appliedFilters.body[0]} onChange={(v) => setAppliedFilters((s) => ({ ...s, body: v ? [v] : [] }))} />
          <FilterDropdown id="color-top" label={`Color${appliedFilters.color ? `: ${appliedFilters.color}` : ""}`} options={colorOptionsTop} selected={appliedFilters.color} onChange={(v) => setAppliedFilters((s) => ({ ...s, color: v }))} />
        </div>
      </header>

      <div className="results-header"><h3>{filtered.length} Used cars in Delhi</h3></div>

      <main className="buy-main">
        <div className="list">
          {filtered.length > 0 ? filtered.map((car, i) => (
            <React.Fragment key={car.id}>
              <article key={car.id} className="car-card" tabIndex={0} onClick={() => navigate(`/car/${car.id}`, { state: { car } })}
  role="button">
                <div className="car-thumb"><img src={car.thumb} alt={car.title} loading="lazy" /></div>
                <div className="car-content">
                  <div className="car-row">
                    <div>
                      <div className="car-title">{car.title}</div>
                      <div className="car-variant">{car.variant ?? `${car.brand} ${car.model}`}</div>
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

              {/* inject swipe info after every 6 cards */}
              {((i + 1) % 6 === 0) && <div key={`swipe-${i}`} className="swipe-insert"><SwipableInfo slides={sampleSlides} /></div>}
            </React.Fragment>
          )) : <div style={{ padding: 20 }}>No cars match your filters.</div>}
        </div>
      </main>

      <BottomNav />

      {!filterOpen && (
        <div className="bottom-controls">
          <button className="bottom-btn" onClick={() => setSortOpen(true)}>⇅ Sort</button>
          <button className="bottom-btn primary" onClick={() => setFilterOpen(true)}>⚙ Filter</button>
        </div>
      )}

      <SortModal open={sortOpen} onClose={() => setSortOpen(false)} value={sortKey} onChange={(k) => { setSortKey(k); setSortOpen(false); }} />

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        appliedFilters={appliedFilters}
        onApply={(filters) => {
          // ensure numeric rupee values and clamp to allowed bounds
          const pm = Math.max(PRICE_MIN, Math.min(PRICE_MAX, Number(filters.priceMin)));
          const px = Math.max(PRICE_MIN, Math.min(PRICE_MAX, Number(filters.priceMax)));
          setAppliedFilters({
            ...filters,
            priceMin: Number(pm),
            priceMax: Number(px),
          });
          setFilterOpen(false);
        }}
        onClear={() => setAppliedFilters({ year: null, kms: null, brands: [], brandModels: {}, color: null, trans: null, features: [], seats: [], rto: [], body: [], priceMin: PRICE_MIN, priceMax: PRICE_MAX, owner: [] })}
      />
    </div>
  );
}

