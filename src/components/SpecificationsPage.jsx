import React, { useState } from "react";
import styles from "../styles/SpecificationsPage.module.css";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Dimensions & capacity",
  "Engine & transmission",
  "Fuel & performance",
  "Suspension, steering & brakes",
];

const DATA = {
  "Dimensions & capacity": [
    { label: "Ground clearance", value: "165 mm" },
    { label: "Boot space", value: "256 litres" },
    { label: "Number of seating rows", value: "2 units" },
    { label: "Wheelbase", value: "2425 mm" },
    { label: "Length", value: "3765 mm" },
    { label: "Front tyre size", value: "165 / 65 R14" },
    { label: "Rear tyre size", value: "165 / 65 R14" },
    { label: "Number of doors", value: "5 units" },
    { label: "Height", value: "1520 mm" },
  ],
};

export default function SpecificationsPage({ onBack }) {
    const navigate = useNavigate();
  const [active, setActive] = useState(CATEGORIES[0]);

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn}  onClick={() => navigate(-1)}>←</button>
        <h1>Specifications</h1>
      </header>

      {/* Search */}
      {/* <div className={styles.searchWrap}>
        <input
          type="text"
          placeholder="Search any features"
          className={styles.search}
        />
      </div> */}

      {/* Content */}
      <div className={styles.content}>
        {/* Left Tabs */}
        <aside className={styles.sidebar}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.tab} ${
                active === cat ? styles.active : ""
              }`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </aside>

        {/* Specs */}
        <main className={styles.details}>
          <h2>{active.toUpperCase()}</h2>

          {DATA[active]?.map((item, idx) => (
            <div key={idx} className={styles.row}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}