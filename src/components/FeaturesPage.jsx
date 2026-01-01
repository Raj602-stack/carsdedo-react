import React, { useState } from "react";
import styles from "../styles/featurespage.module.css";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Safety",
  "Comfort & convenience",
  "Entertainment & communication",
  "Interior",
  "Exterior",
];

const DATA = {
  Safety: [
    { label: "Engine immobilizer", info: true },
    { label: "Parking sensors", info: true },
    { label: "Anti theft device" },
    { label: "Central locking", info: true },
    { label: "Headlight height adjuster" },
    { label: "Seat belt warning" },
    { label: "Power door locks", info: true },
    { label: "Child safety lock", info: true },
    { label: "Low fuel level warning" },
    { label: "Door ajar warning", info: true },
  ],
  "Comfort & convenience": [
    { label: "Anti-glare mirrors - Manual" },
  ],
  "Entertainment & communication": [],
  Interior: [],
  Exterior: [],
};

export default function FeaturesPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Safety");

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>Features</h1>
      </header>

      {/* Content */}
      <div className={styles.content}>
        {/* Left Sidebar */}
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

        {/* Right Details */}
        <main className={styles.details}>
          <h2 className={styles.sectionTitle}>{active.toUpperCase()}</h2>

          {DATA[active]?.map((item, idx) => (
            <div key={idx} className={styles.featureRow}>
              <span className={styles.check}>✓</span>
              <span className={styles.label}>{item.label}</span>

              {item.info && (
                <span className={styles.infoIcon}>i</span>
              )}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
