import React, { useMemo } from 'react';
import { FiZap, FiSettings, FiNavigation, FiPackage } from 'react-icons/fi';
import styles from '../styles/CarDetailsWeb.module.css';

/**
 * CarSpecs component - Displays car specifications preview
 */
const CarSpecs = React.memo(({ car, onViewAll }) => {
  const { previewSpecs, specsByCategory } = useMemo(() => {
    if (!car?.specs || car.specs.length === 0) {
      return { previewSpecs: [], specsByCategory: {} };
    }

    // Group specs by category
    const grouped = {};
    car.specs.forEach(spec => {
      if (!grouped[spec.category]) {
        grouped[spec.category] = [];
      }
      grouped[spec.category].push(spec);
    });

    // Get preview specs (4 key specs to show)
    const preview = [];
    
    // Try to get Mileage from fuel_performance
    const fuelPerf = grouped['fuel_performance'] || [];
    const mileage = fuelPerf.find(s => s.label.toLowerCase().includes('mileage'));
    if (mileage) preview.push(mileage);
    
    // Try to get Displacement from engine_transmission
    const engineTrans = grouped['engine_transmission'] || [];
    const displacement = engineTrans.find(s => s.label.toLowerCase().includes('displacement'));
    if (displacement) preview.push(displacement);
    
    // Try to get Ground clearance from dimension_capacity
    const dimCap = grouped['dimension_capacity'] || [];
    const groundClearance = dimCap.find(s => s.label.toLowerCase().includes('ground clearance'));
    if (groundClearance) preview.push(groundClearance);
    
    // Try to get Boot space from dimension_capacity
    const bootSpace = dimCap.find(s => s.label.toLowerCase().includes('boot space'));
    if (bootSpace) preview.push(bootSpace);
    
    return { previewSpecs: preview.slice(0, 4), specsByCategory: grouped };
  }, [car?.specs]);

  // Icon mapping for common specs
  const getSpecIcon = (label) => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('mileage')) return <FiZap />;
    if (labelLower.includes('displacement')) return <FiSettings />;
    if (labelLower.includes('ground clearance')) return <FiNavigation />;
    if (labelLower.includes('boot space')) return <FiPackage />;
    return <FiSettings />;
  };

  if (previewSpecs.length === 0) return null;

  return (
    <section data-section="specs" className={styles.specsSection}>
      <h2 className={styles.sectionTitle}>Car Specifications</h2>
      
      <div className={styles.specsCard}>
        <div className={styles.specsGrid}>
          {previewSpecs.map((spec, idx) => (
            <div key={idx} className={styles.specCell}>
              <div className={styles.specIcon}>
                {getSpecIcon(spec.label)}
              </div>
              <div className={styles.specMeta}>
                <div className={styles.specLabel}>{spec.label}</div>
                <div className={styles.specValue}>{spec.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.specsActions}>
          <button
            type="button"
            className={styles.viewAllBtn}
            onClick={onViewAll}
          >
            VIEW ALL SPECIFICATIONS
          </button>
        </div>
      </div>
    </section>
  );
});

CarSpecs.displayName = 'CarSpecs';

export default CarSpecs;
