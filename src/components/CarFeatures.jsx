import React, { useMemo } from 'react';
import { FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi';
import styles from '../styles/CarDetailsWeb.module.css';

/**
 * CarFeatures component - Displays top features preview
 */
const CarFeatures = React.memo(({ car, onViewAll }) => {
  const prioritizedCategories = useMemo(() => {
    if (!car?.featuresByCategory || car.featuresByCategory.length === 0) {
      return [];
    }

    const allCategories = car.featuresByCategory;
    const prioritized = [];
    const categoryMap = {};
    
    // Create a map for quick lookup
    allCategories.forEach(cat => {
      const key = cat.category.toLowerCase();
      categoryMap[key] = cat;
    });
    
    // Try to get Safety first
    if (categoryMap['safety'] && prioritized.length < 3) {
      prioritized.push(categoryMap['safety']);
    }
    
    // Try to get Exterior second
    if (categoryMap['exterior'] && prioritized.length < 3) {
      prioritized.push(categoryMap['exterior']);
    }
    
    // Try to get Interior or Comfort & Convenience third
    if (prioritized.length < 3) {
      if (categoryMap['interior']) {
        prioritized.push(categoryMap['interior']);
      } else if (categoryMap['comfort & convenience']) {
        prioritized.push(categoryMap['comfort & convenience']);
      } else if (categoryMap['comfort']) {
        prioritized.push(categoryMap['comfort']);
      }
    }
    
    // Fill remaining slots with other categories
    const used = new Set(prioritized.map(c => c.category));
    allCategories.forEach(cat => {
      if (!used.has(cat.category) && prioritized.length < 3) {
        prioritized.push(cat);
      }
    });
    
    return prioritized.slice(0, 3);
  }, [car?.featuresByCategory]);

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

  if (prioritizedCategories.length === 0) return null;

  return (
    <section data-section="features" className={styles.featuresSection}>
      <h2 className={styles.featuresSectionTitle}>Top Features of this car</h2>
      
      <div className={styles.featuresCardWrapper}>
        <div className={styles.featuresCard}>
          <div className={styles.featuresCategoriesGrid}>
            {prioritizedCategories.map((category, catIdx) => (
              <div key={catIdx} className={styles.featureCategoryColumn}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryLabel}>
                    {category.category.toUpperCase()}
                  </span>
                </div>
                <div className={styles.featuresList}>
                  {category.items.slice(0, 6).map((feature, featIdx) => {
                    const featureName = typeof feature === 'string' ? feature : feature.name;
                    const featureStatus = typeof feature === 'object' 
                      ? (feature.status || 'flawless') 
                      : 'flawless';
                    
                    return (
                      <div key={featIdx} className={styles.featureRow}>
                        {getStatusIcon(featureStatus)}
                        <span className={styles.featureName}>{featureName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.featuresActions}>
            <button
              type="button"
              className={styles.viewAllFeaturesBtn}
              onClick={onViewAll}
            >
              VIEW ALL FEATURES
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

CarFeatures.displayName = 'CarFeatures';

export default CarFeatures;
