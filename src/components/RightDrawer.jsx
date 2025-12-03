import styles from "../styles/CarDetailsWeb.module.css";
import React, { useEffect, useRef, useState, useCallback } from "react";

export function RightDrawer({ open, activeTab, onClose, specs = [], features = [], onTabChange }) {
    // prevent body scroll while open
    useEffect(() => {
      document.body.style.overflow = open ? "hidden" : "";
      return () => {
        document.body.style.overflow = "";
      };
    }, [open]);
  
    if (!open) {
      // we still render overlay for accessibility focus management, but simple early return ok
      return (
        <div aria-hidden="true" />
      );
    }
  
    return (
      <>
        <div
          className={styles.drawerOverlay}
          onClick={onClose}
          role="button"
          tabIndex={0}
          aria-label="Close drawer"
        />
        <aside className={styles.drawerPanel} role="dialog" aria-modal="true" aria-label="Features and specifications">
          <div className={styles.drawerHeader}>
            <button type="button" className={styles.drawerBackBtn} onClick={onClose} aria-label="Close">
              ←
            </button>
  
            <div className={styles.drawerTabs}>
              <button
                className={`${styles.drawerTab} ${activeTab === "features" ? styles.activeTab : ""}`}
                onClick={() => onTabChange("features")}
              >
                Features
              </button>
              <button
                className={`${styles.drawerTab} ${activeTab === "specs" ? styles.activeTab : ""}`}
                onClick={() => onTabChange("specs")}
              >
                Specifications
              </button>
            </div>
          </div>
  
          <div className={styles.drawerSearch}>
            <input className={styles.drawerSearchInput} placeholder="Search any features" aria-label="Search features" />
          </div>
  
          <div className={styles.drawerContent}>
            {activeTab === "features" ? (
              <div className={styles.featuresList}>
                {/* group by category lightly */}
                {groupFeatures(features).map((group) => (
                  <div key={group.name} className={styles.featuresGroup}>
                    <div className={styles.featuresGroupTitle}>{group.name}</div>
                    <ul className={styles.featuresUl}>
                      {group.items.map((f) => (
                        <li key={f.id} className={styles.featureRow}>
                          <span className={styles.featureCheck}>{f.present ? "✓" : "✕"}</span>
                          <span className={styles.featureLabel}>{f.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.specsList}>
                {specs.map((s) => (
                  <div key={s.id} className={styles.specRow}>
                    <div className={styles.specRowLeft}>
                      <div className={styles.specRowIcon}>{s.icon}</div>
                      <div className={styles.specRowMeta}>
                        <div className={styles.specLabel}>{s.label}</div>
                        {/* optional subtitle */}
                      </div>
                    </div>
                    <div className={styles.specRowValue}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
  
          <div className={styles.drawerFooter}>
            <button className={styles.bookBtn}>BOOK NOW</button>
            <button className={styles.testDriveBtn}>FREE TEST DRIVE</button>
          </div>
        </aside>
      </>
    );
  }
  
  // helper to group features by "group" key
  function groupFeatures(features) {
    const map = new Map();
    features.forEach((f) => {
      const g = f.group || "Other";
      if (!map.has(g)) map.set(g, []);
      map.get(g).push(f);
    });
    return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
  }
  