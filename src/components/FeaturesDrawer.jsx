import React, { useEffect, useRef, useState, useCallback } from "react";
import { FiArrowLeft, FiSearch, FiCheckCircle, FiAlertCircle, FiXCircle } from "react-icons/fi";
import styles from "../styles/CarDetailsWeb.module.css";

export function FeaturesDrawer({ car, onClose }) {
  const featuresByCategory = car?.featuresByCategory || [];
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Set first category as default
  useEffect(() => {
    if (featuresByCategory.length > 0 && !selectedCategory) {
      setSelectedCategory(featuresByCategory[0].category);
    }
  }, [featuresByCategory, selectedCategory]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Filter features by search query
  const getFilteredFeatures = (category) => {
    if (!searchQuery) return category.items;
    const query = searchQuery.toLowerCase();
    return category.items.filter(feature => {
      const featureName = typeof feature === 'string' ? feature : feature.name;
      return featureName.toLowerCase().includes(query) || 
             category.category.toLowerCase().includes(query);
    });
  };

  // Get icon based on status
  const getStatusIcon = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower === 'flawless') {
      return <FiCheckCircle className={styles.statusIcon} />;
    } else if (statusLower === 'little_flaw' || statusLower === 'little flaw' || statusLower === 'minor') {
      return <FiAlertCircle className={styles.statusIconWarning} />;
    } else if (statusLower === 'damaged' || statusLower === 'major') {
      return <FiXCircle className={styles.statusIconError} />;
    } else {
      return <FiCheckCircle className={styles.statusIcon} />;
    }
  };

  const activeCategory = featuresByCategory.find(cat => cat.category === selectedCategory) || featuresByCategory[0];
  
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
              <FiArrowLeft />
            </button>
            <div>
              <div className={styles.drawerTitle}>Features</div>
            </div>
          </header>
  
          <div className={styles.drawerSearch}>
            <FiSearch className={styles.searchIcon} />
            <input
              className={styles.drawerSearchInput}
              placeholder="Search any features"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search features"
            />
          </div>
  
          <div className={styles.drawerBody}>
            {/* left nav */}
            <nav className={styles.drawerNav}>
              {featuresByCategory.map((category) => {
                // Format category name: replace underscores with spaces and capitalize
                const formatCategoryName = (name) => {
                  return name
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (char) => char.toUpperCase());
                };
                
                return (
                  <button
                    key={category.category}
                    type="button"
                    onClick={() => setSelectedCategory(category.category)}
                    className={`${styles.drawerNavItem} ${
                      selectedCategory === category.category ? styles.drawerNavItemActive : ""
                    }`}
                  >
                    {formatCategoryName(category.category)}
                  </button>
                );
              })}
            </nav>
  
            {/* right list */}
            <div className={styles.drawerList}>
              {activeCategory && (
                <>
                  <div className={styles.drawerListTitle}>
                    {activeCategory.category.toUpperCase()}
                  </div>
                  
                  {getFilteredFeatures(activeCategory).length > 0 ? (
                    getFilteredFeatures(activeCategory).map((feature, idx) => {
                      const featureName = typeof feature === 'string' ? feature : feature.name;
                      const featureStatus = typeof feature === 'object' ? (feature.status || 'flawless') : 'flawless';
                      return (
                        <div key={idx} className={styles.drawerFeatureRow}>
                          {getStatusIcon(featureStatus)}
                          <span className={styles.drawerFeatureLabel}>{featureName}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className={styles.emptyState}>
                      No features found matching "{searchQuery}"
                    </div>
                  )}
                </>
              )}
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
  