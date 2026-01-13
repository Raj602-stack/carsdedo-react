import React, { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiSearch, FiInfo, FiCheckCircle, FiAlertCircle, FiXCircle } from "react-icons/fi";
import styles from "../styles/MobileFeaturesDrawer.module.css";

export default function MobileFeaturesDrawer({ open, onClose, car }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const drawerContentRef = useRef(null);

  const featuresByCategory = car?.featuresByCategory || [];

  // Set first category as default
  useEffect(() => {
    if (open && featuresByCategory.length > 0 && !selectedCategory) {
      setSelectedCategory(featuresByCategory[0].category);
    }
  }, [open, featuresByCategory, selectedCategory]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // Reset scroll when drawer opens
  useEffect(() => {
    if (open && drawerContentRef.current) {
      setTimeout(() => {
        if (drawerContentRef.current) drawerContentRef.current.scrollTop = 0;
      }, 60);
    }
  }, [open]);

  if (!open) {
    return null;
  }

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
      // Default to flawless if status is unknown
      return <FiCheckCircle className={styles.statusIcon} />;
    }
  };

  const activeCategory = featuresByCategory.find(cat => cat.category === selectedCategory) || featuresByCategory[0];

  return (
    <>
      <div className={styles.drawerOverlay} onClick={onClose} />
      <aside className={styles.drawerPanel} role="dialog" aria-modal="true">
        {/* Header */}
        <div className={styles.drawerHeader}>
          <button type="button" className={styles.drawerBackBtn} onClick={onClose} aria-label="Close">
            <FiArrowLeft />
          </button>
          <div>
            <h3 className={styles.drawerTitle}>Features</h3>
          </div>
        </div>

        {/* Search */}
        <div className={styles.drawerSearch}>
          <FiSearch className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search any features"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search features"
          />
        </div>

        {/* Content */}
        <div className={styles.drawerContent} ref={drawerContentRef}>
          <div className={styles.drawerLayout}>
            {/* Left Sidebar - Categories */}
            <div className={styles.categoryNav}>
              {featuresByCategory.map((category) => (
                <button
                  key={category.category}
                  type="button"
                  className={`${styles.categoryBtn} ${
                    selectedCategory === category.category ? styles.categoryBtnActive : ""
                  }`}
                  onClick={() => setSelectedCategory(category.category)}
                >
                  {category.category}
                </button>
              ))}
            </div>

            {/* Right Content - Features */}
            <div className={styles.featuresContent}>
              {activeCategory && (
                <>
                  <h4 className={styles.categoryTitle}>
                    {activeCategory.category.toUpperCase()}
                  </h4>
                  <div className={styles.featuresList}>
                    {getFilteredFeatures(activeCategory).length > 0 ? (
                      getFilteredFeatures(activeCategory).map((feature, idx) => {
                        const featureName = typeof feature === 'string' ? feature : feature.name;
                        const featureStatus = typeof feature === 'object' ? (feature.status || 'flawless') : 'flawless';
                        return (
                          <div key={idx} className={styles.featureRow}>
                            {getStatusIcon(featureStatus)}
                            <span className={styles.featureLabel}>{featureName}</span>
                            {/* Optional: Add info icon or image icon here */}
                          </div>
                        );
                      })
                    ) : (
                      <div className={styles.emptyState}>
                        No features found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.drawerFooter}>
          <button className={styles.bookBtn}>BOOK NOW</button>
          <button className={styles.testDriveBtn}>FREE TEST DRIVE</button>
        </div>
      </aside>
    </>
  );
}
