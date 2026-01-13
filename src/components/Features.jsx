import React, { forwardRef } from 'react';
import '../styles/features.css';

const Features = forwardRef(({ car, onViewAllFeatures }, ref) => {
  const featuresByCategory = car?.featuresByCategory || [];

  if (featuresByCategory.length === 0) {
    return null;
  }

  // Get top categories to show in preview (max 4 categories)
  const previewCategories = featuresByCategory.slice(0, 4);

  return (
    <section id="features" ref={ref} className="features-section">
      <div className="features-container">
        <h2 className="features-heading">Top Features</h2>
        
        <div className="features-preview-card">
          {previewCategories.map((category, catIdx) => (
            <div key={catIdx} className="feature-category-preview">
              <div className="category-header-preview">
                <span className="category-label">{category.category.toUpperCase()}</span>
                <span className="category-line"></span>
              </div>
              
              <div className="features-preview-list">
                {category.items.slice(0, 4).map((feature, featIdx) => {
                  const featureName = typeof feature === 'string' ? feature : feature.name;
                  const featureStatus = typeof feature === 'object' ? (feature.status || 'flawless') : 'flawless';
                  const getIcon = () => {
                    const statusLower = (featureStatus || '').toLowerCase();
                    if (statusLower === 'flawless') {
                      return (
                        <svg className="feature-check-preview" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      );
                    } else if (statusLower === 'little_flaw' || statusLower === 'little flaw' || statusLower === 'minor') {
                      return (
                        <svg className="feature-check-preview feature-warning" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      );
                    } else if (statusLower === 'damaged' || statusLower === 'major') {
                      return (
                        <svg className="feature-check-preview feature-error" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 14L12 12M12 12L14 10M12 12L10 10M12 12L14 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      );
                    } else {
                      // Default to flawless
                      return (
                        <svg className="feature-check-preview" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      );
                    }
                  };
                  return (
                    <div key={featIdx} className="feature-item-preview">
                      {getIcon()}
                      <span className="feature-name-preview">{featureName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div className="features-actions-preview">
            <button
              type="button"
              className="view-all-features-btn"
              onClick={onViewAllFeatures}
            >
              View all features
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

Features.displayName = 'Features';

export default Features;
