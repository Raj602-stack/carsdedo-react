import styles from "../styles/rightdrawer.module.css";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { FiZap, FiSettings, FiNavigation, FiPackage, FiSearch, FiArrowLeft } from "react-icons/fi";

export function RightDrawer({ open, onClose, specs = [] }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Set first category as default on mount or when specs change
  useEffect(() => {
    if (specs.length > 0) {
      const categories = [
        'dimension_capacity',
        'engine_transmission',
        'fuel_performance',
        'suspension_steering_brakes'
      ];
      // Find first category that has specs
      const firstCategoryWithSpecs = categories.find(cat => 
        specs.some(spec => spec.category === cat)
      );
      if (firstCategoryWithSpecs && !selectedCategory) {
        setSelectedCategory(firstCategoryWithSpecs);
      }
    }
  }, [specs]);
  
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
        <aside className={styles.drawerPanel} role="dialog" aria-modal="true" aria-label="Specifications">
          <div className={styles.drawerHeader}>
            <button type="button" className={styles.drawerBackBtn} onClick={onClose} aria-label="Close">
              <FiArrowLeft />
            </button>
            <div className={styles.drawerHeaderTitle}>
              <h2 className={styles.drawerTitle}>Specifications</h2>
            </div>
          </div>
  
          <div className={styles.drawerSearch}>
            <FiSearch className={styles.drawerSearchIcon} />
            <input 
              className={styles.drawerSearchInput} 
              placeholder="Search any specifications" 
              aria-label="Search specifications"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
  
          <div className={styles.drawerContent}>
            {(() => {
                // Group specs by category
                const specsByCategory = {};
                specs.forEach(spec => {
                  if (!specsByCategory[spec.category]) {
                    specsByCategory[spec.category] = [];
                  }
                  specsByCategory[spec.category].push(spec);
                });
                
                const categories = [
                  { key: 'dimension_capacity', label: 'Dimensions & capacity' },
                  { key: 'engine_transmission', label: 'Engine & transmission' },
                  { key: 'fuel_performance', label: 'Fuel & performance' },
                  { key: 'suspension_steering_brakes', label: 'Suspension, steering & brakes' }
                ];
                
                // Use selected category or first available category that has specs
                let activeCategory = selectedCategory;
                if (!activeCategory) {
                  // Find first category that has specs
                  const firstCategoryWithSpecs = categories.find(cat => 
                    specsByCategory[cat.key] && specsByCategory[cat.key].length > 0
                  );
                  activeCategory = firstCategoryWithSpecs?.key || categories[0]?.key;
                }
                const categorySpecs = specsByCategory[activeCategory] || [];
                
                // Filter by search query
                const filteredSpecs = searchQuery
                  ? categorySpecs.filter(spec => 
                      spec.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      spec.value.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  : categorySpecs;
                
                // Icon mapping - more comprehensive
                const getSpecIcon = (label) => {
                  const labelLower = label.toLowerCase();
                  if (labelLower.includes('mileage') || labelLower.includes('fuel')) return <FiZap />;
                  if (labelLower.includes('displacement') || labelLower.includes('engine') || labelLower.includes('power') || labelLower.includes('torque') || labelLower.includes('cylinders') || labelLower.includes('gears') || labelLower.includes('transmission') || labelLower.includes('drivetrain')) return <FiSettings />;
                  if (labelLower.includes('ground clearance') || labelLower.includes('length') || labelLower.includes('width') || labelLower.includes('height') || labelLower.includes('wheelbase')) return <FiNavigation />;
                  if (labelLower.includes('boot space') || labelLower.includes('seating') || labelLower.includes('doors') || labelLower.includes('capacity')) return <FiPackage />;
                  return <FiSettings />;
                };
                
                return (
                  <div className={styles.specsDrawerContent}>
                    <div className={styles.specsDrawerLayout}>
                      {/* Category Navigation - Left Side */}
                      <div className={styles.specsCategoryNav}>
                        {categories.map(cat => (
                          <button
                            key={cat.key}
                            className={`${styles.specsCategoryBtn} ${activeCategory === cat.key ? styles.specsCategoryBtnActive : ''}`}
                            onClick={() => setSelectedCategory(cat.key)}
                          >
                            {cat.label}
                          </button>
                ))}
              </div>
                      
                      {/* Content - Right Side */}
                      <div className={styles.specsContentArea}>
                        {/* Category Title */}
                        <h3 className={styles.specsCategoryTitle}>
                          {categories.find(c => c.key === activeCategory)?.label?.toUpperCase() || 'SPECIFICATIONS'}
                        </h3>
                        
                        {/* Specs List */}
              <div className={styles.specsList}>
                          {filteredSpecs.length > 0 ? (
                            filteredSpecs.map((spec, idx) => (
                              <div key={idx} className={styles.specRow}>
                    <div className={styles.specRowLeft}>
                                  <div className={styles.specRowIcon}>
                                    {getSpecIcon(spec.label)}
                                  </div>
                      <div className={styles.specRowMeta}>
                                    <div className={styles.specLabel}>{spec.label}</div>
                                    <div className={styles.specRowValue}>{spec.value}</div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className={styles.specsEmpty}>
                              {searchQuery ? 'No specifications found' : 'No specifications available'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
          </div>
  
          <div className={styles.drawerFooter}>
            <button className={styles.bookBtn}>BOOK NOW</button>
            <button className={styles.testDriveBtn}>FREE TEST DRIVE</button>
          </div>
        </aside>
      </>
    );
  }
  