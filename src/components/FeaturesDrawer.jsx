import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "../styles/CarDetailsWeb.module.css";
export function FeaturesDrawer({ onClose }) {
    // fake grouped data – plug your real data here
    const groups = [
      {
        id: "comfort",
        label: "Comfort & convenience",
        items: [
          { id: "cruise", label: "Cruise control", present: true },
          { id: "keyless", label: "Keyless start", present: true },
          { id: "dual_zone", label: "Dual zone climate control", present: true },
        ],
      },
      {
        id: "exterior",
        label: "Exterior",
        items: [
          { id: "sunroof", label: "Sunroof", present: true },
          { id: "rain", label: "Rain sensing wipers", present: true },
        ],
      },
      {
        id: "safety",
        label: "Safety",
        items: [
          { id: "airbags", label: "Airbags", present: true },
          { id: "rear_cam", label: "Rear camera", present: true },
        ],
      },
    ];
  
    const [activeGroupId, setActiveGroupId] = React.useState(groups[0]?.id);
  
    const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];
  
    return (
      <>
        {/* overlay */}
        <div
          className={styles.drawerOverlay}
          onClick={onClose}
        />
  
        {/* right panel */}
        <aside className={styles.drawerPanel} role="dialog" aria-modal="true">
          <header className={styles.drawerHeader}>
            <button
              type="button"
              className={styles.drawerBackBtn}
              onClick={onClose}
              aria-label="Close"
            >
              ←
            </button>
            <div className={styles.drawerTitle}>Features</div>
          </header>
  
          <div className={styles.drawerSearch}>
            <input
              className={styles.drawerSearchInput}
              placeholder="Search any features"
            />
          </div>
  
          <div className={styles.drawerBody}>
            {/* left nav */}
            <nav className={styles.drawerNav}>
              {groups.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setActiveGroupId(g.id)}
                  className={`${styles.drawerNavItem} ${
                    g.id === activeGroupId ? styles.drawerNavItemActive : ""
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </nav>
  
            {/* right list */}
            <div className={styles.drawerList}>
              <div className={styles.drawerListTitle}>
                {activeGroup.label.toUpperCase()}
              </div>
  
              {activeGroup.items.map((item) => (
                <div key={item.id} className={styles.drawerFeatureRow}>
                  <span
                    className={`${styles.drawerFeatureTick} ${
                      item.present ? styles.tickPresent : styles.tickAbsent
                    }`}
                  >
                    {item.present ? "✓" : "✕"}
                  </span>
                  <span className={styles.drawerFeatureLabel}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
  
          <footer className={styles.drawerFooter}>
            <button className={styles.bookBtn}>BOOK NOW</button>
            <button className={styles.testDriveBtn}>FREE TEST DRIVE</button>
          </footer>
        </aside>
      </>
    );
  }
  