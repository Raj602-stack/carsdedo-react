// src/components/Filters.jsx
import React, { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import styles from  "../styles/BuyPageweb.module.css";
/**
 * Filters.jsx
 *
 * Props:
 *  - filters: current filter state object
 *  - setFilters: setter function
 *  - metadata: { brands, years, fuels, bodies } (optional)
 *
 * Note: This component now manages collapsible sections and new filter keys:
 *  filters.transmission: Set (["Automatic","Manual"])
 *  filters.category: Set (e.g. ["Hatchback","Sedan"...])
 *  filters.colors: Set (color keys)
 *  filters.features: Set (strings)
 *  filters.seats: Set (e.g. ["4","5","7"])
 *  filters.rto: Set (strings)
 *  filters.owner: Set (strings)
 *  filters.hubs: Set (strings)
 *
 * Make sure BuyPage.jsx initial filters include empty arrays for these keys,
 * or the toggle helpers will create them on first toggle.
 */

function fmt(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 2)} L`;
  if (val === 0) return `₹0`;
  return `₹${(val / 1000).toFixed(0)}k`;
}

export default function Filters({ filters, setFilters, metadata = {} }) {
  const { brands = [], years = [], fuels = [], bodies = [] } = metadata;

  // local collapsed state for various sections
  const [open, setOpen] = useState({
    transmission: true,
    category: false,
    color: true,
    features: false,
    seats: false,
    rto: false,
    owner: false,
    hubs: false,
  });

  // helper to toggle collapse
  function toggleSection(name) {
    setOpen((s) => ({ ...s, [name]: !s[name] }));
  }

  // helper to toggle set-like filters
  function toggleArray(key, value) {
    setFilters((s) => {
      const arr = Array.isArray(s[key]) ? s[key] : [];
      const set = new Set(arr);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...s, [key]: Array.from(set) };
    });
  }

  // quick price handlers (already used)
  function setPriceMin(v) {
    const val = Number(v) || 0;
    if (val > filters.priceMax) {
      setFilters((s) => ({ ...s, priceMin: s.priceMax, priceMax: val }));
    } else {
      setFilters((s) => ({ ...s, priceMin: val }));
    }
  }
  function setPriceMax(v) {
    const val = Number(v) || 0;
    if (val < filters.priceMin) {
      setFilters((s) => ({ ...s, priceMin: val, priceMax: s.priceMin }));
    } else {
      setFilters((s) => ({ ...s, priceMax: val }));
    }
  }

  // presets
  const presets = useMemo(
    () => [
      { label: "Up to ₹5 L", min: 0, max: 500000 },
      { label: "Up to ₹10 L", min: 0, max: 1000000 },
      { label: "₹5L - ₹20L", min: 500000, max: 2000000 },
    ],
    []
  );

  // color palette (key -> color hex). You can change or extend keys.
  const palette = [
    { key: "yellow", hex: "#FFF176" },
    { key: "red", hex: "#D32F2F" },
    { key: "beige", hex: "#D8C9B2" },
    { key: "purple", hex: "#7E57C2" },
    { key: "white", hex: "#FFFFFF", stroke: true },
    { key: "silver", hex: "#BDBDBD" },
    { key: "grey", hex: "#9E9E9E" },
    { key: "black", hex: "#000000" },
    { key: "blue", hex: "#2E7DDB" },
    { key: "green", hex: "#4CAF50" },
    { key: "orange", hex: "#F57C00" },
  ];

  // sample static options for features/seats/rto/owner/hubs.
  // In a real app you'd derive these from API metadata.
  const featureOptions = ["Sunroof", "ABS", "Parking Sensors", "Reverse Camera", "Leather Seats"];
  const seatOptions = ["2", "4", "5", "7", "8+"];
  const rtoOptions = ["DL", "UP", "MH", "KA"]; // example RTO prefixes
  const ownerOptions = ["First owner", "Second owner", "Third owner+"];
  const hubOptions = ["Gaur City Mall, Noida", "Trillium Avenue, Gurgaon", "Indirapuram, Ghaziabad"];

 

return (
  <aside className={styles["filters"]} aria-label="Filters">
    <div className={styles["filter-card"]}>

      {/* SEARCH */}
      <div className={styles["filter-block"]}>
        <label className={styles["filter-label"]}>Search</label>
        <div className={styles["search-wrapper"]}>
          <FiSearch className={styles["search-icon"]} />
          <input
            className={styles["filter-search"]}
            placeholder="Search title, model..."
            value={filters.q}
            onChange={(e) => setFilters((s) => ({ ...s, q: e.target.value }))}
          />
        </div>
      </div>

      {/* PRICE */}
      <div className={styles["filter-block"]}>
        <label className={styles["filter-label"]}>Price (₹)</label>

        <div className={styles["price-presets"]}>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              className={`${styles["pill"]} ${styles["preset"]} ${
                filters.priceMin === p.min && filters.priceMax === p.max
                  ? styles["active"]
                  : ""
              }`}
              onClick={() =>
                setFilters((s) => ({ ...s, priceMin: p.min, priceMax: p.max }))
              }
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={styles["price-range-row"]}>
          <input
            type="text"
            className={`${styles["price-input"]} ${styles["readonly"]}`}
            value={fmt(filters.priceMin)}
            readOnly
          />
          <span className={styles["price-sep"]}>—</span>
          <input
            type="text"
            className={`${styles["price-input"]} ${styles["readonly"]}`}
            value={fmt(filters.priceMax)}
            readOnly
          />
        </div>

        <div
          className={styles["range-wrap"]}
          style={{
            ["--fill-start"]: `${(filters.priceMin / 5000000) * 100}%`,
            ["--fill-end"]: `${(filters.priceMax / 5000000) * 100}%`,
          }}
        >
          <input
            type="range"
            min="0"
            max="5000000"
            step="10000"
            value={filters.priceMin}
            onChange={(e) => setPriceMin(Number(e.target.value))}
            className={styles["range-min"]}
          />
          <input
            type="range"
            min="0"
            max="5000000"
            step="10000"
            value={filters.priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className={styles["range-max"]}
          />
        </div>
      </div>

      {/* BRANDS */}
      <div className={styles["filter-block"]}>
        <label className={styles["filter-label"]}>Brands</label>
        <div className={styles["brand-list"]}>
          {brands.map((b) => (
            <label key={b} className={`${styles["checkbox"]} ${styles["brand-row"]}`}>
              <input
                type="checkbox"
                checked={(filters.brands || []).includes(b)}
                onChange={() => toggleArray("brands", b)}
              />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* YEAR */}
      <div className={styles["filter-block"]}>
        <label className={styles["filter-label"]}>Year</label>
        <div className={styles["year-list"]}>
          {years.map((y) => (
            <label key={y} className={styles["radio"]}>
              <input
                type="radio"
                name="year"
                value={y}
                checked={String(filters.year) === String(y)}
                onChange={() => setFilters((s) => ({ ...s, year: y }))}
              />
              <span>{y} & above</span>
            </label>
          ))}
        </div>
      </div>

      {/* KM DRIVEN */}
<div className={styles["filter-block"]}>
  <label className={styles["filter-label"]}>Km Driven</label>

  <div className={styles["km-list"]}>
    {[10000, 30000, 50000, 75000, 100000].map((k) => (
      <label key={k} className={styles.checkbox}>
        <input
          type="checkbox"
          checked={(filters.kms || []).includes(k)}
          onChange={() =>
            setFilters((s) => {
              const set = new Set(s.kms || []);
              if (set.has(k)) set.delete(k);
              else set.add(k);
              return { ...s, kms: Array.from(set) };
            })
          }
        />
        <span>{k.toLocaleString()} km or less</span>
      </label>
    ))}
  </div>
</div>


      {/* FUEL */}
<div className={styles["filter-block"]}>
  <label className={styles["filter-label"]}>Fuel Type</label>

  <div className={styles["fuel-list"]}>
    {fuels.map((f) => (
      <label key={f} className={styles.checkbox}>
        <input
          type="checkbox"
          checked={(filters.fuel || []).includes(f)}
          onChange={() => toggleArray("fuel", f)}
        />
        <span>{f}</span>
      </label>
    ))}
  </div>
</div>


{/* BODY */}
<div className={styles["filter-block"]}>
  <label className={styles["filter-label"]}>Body Type</label>

  <div className={styles["body-list"]}>
    {bodies.map((b) => (
      <label key={b} className={styles.checkbox}>
        <input
          type="checkbox"
          checked={(filters.body || []).includes(b)}
          onChange={() => toggleArray("body", b)}
        />
        <span>{b}</span>
      </label>
    ))}
  </div>
</div>

{/* TRANSMISSION (collapsible) */}
<div className={styles["filter-block"]}>
  <div className={styles["section-head"]}>
    <div>
      <label className={styles["filter-label"]}>Transmission</label>
    </div>

    <div className={styles["guide-and-toggle"]}>
      <a
        className={styles["guide-link"]}
        href="#guide"
        onClick={(e) => e.preventDefault()}
      >
        Guide <span className={styles["guide-i"]}>i</span>
      </a>

      <button
        className={styles["collapse-toggle"]}
        onClick={() => toggleSection("transmission")}
        aria-expanded={open.transmission}
        aria-controls="transmission-panel"
      >
        {open.transmission ? "▾" : "▸"}
      </button>
    </div>
  </div>

  {open.transmission && (
    <div
      id="transmission-panel"
      className={styles["transmission-list"]}
    >
      {["Automatic", "Manual"].map((t) => (
        <label key={t} className={styles.checkbox}>
          <input
            type="checkbox"
            checked={(filters.transmission || []).includes(t)}
            onChange={() => toggleArray("transmission", t)}
          />
          <span>{t}</span>
        </label>
      ))}
    </div>
  )}
</div>

{/* CAR CATEGORY (collapsible) */}
<div className={styles["filter-block"]}>
  <div className={styles["section-head"]}>
    <label className={styles["filter-label"]}>Car Category</label>

    <button
      className={styles["collapse-toggle"]}
      onClick={() => toggleSection("category")}
      aria-expanded={open.category}
      aria-controls="category-panel"
    >
      {open.category ? "▾" : "▸"}
    </button>
  </div>

  {open.category && (
    <div
      id="category-panel"
      className={styles["category-list"]}
    >
      {["Hatchback", "Sedan", "SUV", "MUV", "Convertible", "Coupe"].map((cat) => (
        <label key={cat} className={styles.checkbox}>
          <input
            type="checkbox"
            checked={(filters.category || []).includes(cat)}
            onChange={() => toggleArray("category", cat)}
          />
          <span>{cat}</span>
        </label>
      ))}
    </div>
  )}
</div>




      {/* COLOR */}
      <div className={styles["filter-block"]}>
        <div className={styles["section-head"]}>
          <label className={styles["filter-label"]}>Color</label>
          <button
            className={styles["collapse-toggle"]}
            onClick={() => toggleSection("color")}
          >
            {open.color ? "▾" : "▸"}
          </button>
        </div>

        {open.color && (
          <div className={styles["color-swatches"]}>
            {palette.map((c) => {
              const selected = (filters.colors || []).includes(c.key);
              return (
                <button
                  key={c.key}
                  type="button"
                  className={`${styles["swatch"]} ${
                    selected ? styles["swatch-selected"] : ""
                  } ${c.hex === "#FFFFFF" ? styles["swatch-white"] : ""}`}
                  style={{ background: c.hex }}
                  onClick={() => toggleArray("colors", c.key)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* FEATURES */}
      <div className={styles["filter-block"]}>
        <div className={styles["section-head"]}>
          <label className={styles["filter-label"]}>Features</label>
          <button
            className={styles["collapse-toggle"]}
            onClick={() => toggleSection("features")}
          >
            {open.features ? "▾" : "▸"}
          </button>
        </div>

        {open.features && (
          <div className={styles["feature-list"]}>
            {featureOptions.map((f) => (
              <label key={f} className={styles["checkbox"]}>
                <input
                  type="checkbox"
                  checked={(filters.features || []).includes(f)}
                  onChange={() => toggleArray("features", f)}
                />
                <span>{f}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* SEATS */}
      <div className={styles["filter-block"]}>
        <div className={styles["section-head"]}>
          <label className={styles["filter-label"]}>Seats</label>
          <button
            className={styles["collapse-toggle"]}
            onClick={() => toggleSection("seats")}
          >
            {open.seats ? "▾" : "▸"}
          </button>
        </div>

        {open.seats && (
          <div className={styles["seats-list"]}>
            {seatOptions.map((s) => (
              <label key={s} className={styles["checkbox"]}>
                <input
                  type="checkbox"
                  checked={(filters.seats || []).includes(s)}
                  onChange={() => toggleArray("seats", s)}
                />
                <span>{s}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* RTO */}
<div className={styles["filter-block"]}>
  <div className={styles["section-head"]}>
    <label className={styles["filter-label"]}>RTO</label>

    <button
      className={styles["collapse-toggle"]}
      onClick={() => toggleSection("rto")}
      aria-expanded={open.rto}
      aria-controls="rto-panel"
    >
      {open.rto ? "▾" : "▸"}
    </button>
  </div>

  {open.rto && (
    <div
      id="rto-panel"
      className={styles["rto-list"]}
    >
      {rtoOptions.map((r) => (
        <label key={r} className={styles.checkbox}>
          <input
            type="checkbox"
            checked={(filters.rto || []).includes(r)}
            onChange={() => toggleArray("rto", r)}
          />
          <span>{r}</span>
        </label>
      ))}
    </div>
  )}
</div>


      {/* OWNER */}
      <div className={styles["filter-block"]}>
        <div className={styles["section-head"]}>
          <label className={styles["filter-label"]}>Owner</label>
          <button
            className={styles["collapse-toggle"]}
            onClick={() => toggleSection("owner")}
          >
            {open.owner ? "▾" : "▸"}
          </button>
        </div>

        {open.owner && (
          <div className={styles["owner-list"]}>
            {ownerOptions.map((o) => (
              <label key={o} className={styles["checkbox"]}>
                <input
                  type="checkbox"
                  checked={(filters.owner || []).includes(o)}
                  onChange={() => toggleArray("owner", o)}
                />
                <span>{o}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* HUBS */}
      <div className={styles["filter-block"]}>
        <div className={styles["section-head"]}>
          <label className={styles["filter-label"]}>Carsdedo Hubs</label>
          <button
            className={styles["collapse-toggle"]}
            onClick={() => toggleSection("hubs")}
          >
            {open.hubs ? "▾" : "▸"}
          </button>
        </div>

        {open.hubs && (
          <div className={styles["hubs-list"]}>
            {hubOptions.map((h) => (
              <label key={h} className={styles["checkbox"]}>
                <input
                  type="checkbox"
                  checked={(filters.hubs || []).includes(h)}
                  onChange={() => toggleArray("hubs", h)}
                />
                <span>{h}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* RESET */}
      <div className={styles["filter-actions"]}>
        <button
          className={`${styles["btn"]} ${styles["reset-btn"]}`}
          onClick={() =>
            setFilters({
              q: "",
              priceMin: 0,
              priceMax: 5000000,
              brands: [],
              year: "",
              kms: [],
              fuel: [],
              body: [],
              transmission: [],
              category: [],
              colors: [],
              features: [],
              seats: [],
              rto: [],
              owner: [],
              hubs: [],
              sortBy: "relevance",
            })
          }
        >
          Reset
        </button>
      </div>

    </div>
  </aside>
);

  
}
