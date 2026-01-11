import React, { forwardRef } from 'react';
import '../styles/features.css';

const Features = forwardRef(({ car }, ref) => {
  const featuresByCategory = car?.featuresByCategory || [];

  if (featuresByCategory.length === 0) {
    return null;
  }

  // Icon mapping for feature categories
  const categoryIcons = {
    'Exterior': '🚗',
    'Interior': '🪑',
    'Comfort & Convenience': '✨',
    'Safety': '🛡️',
    'Entertainment': '🎵',
    'Technology': '📱',
    'Performance': '⚡',
    'Other': '📋',
  };

  return (
    <section id="features" ref={ref} className="features-section">
      <div className="features-container">
        <h2 className="features-heading">Car Features</h2>
        <p className="features-subtitle">All the features this car has to offer</p>
        
        <div className="features-categories">
          {featuresByCategory.map((category, catIdx) => (
            <div key={catIdx} className="feature-category">
              <div className="category-header">
                <span className="category-icon">{categoryIcons[category.category] || '✨'}</span>
                <h3 className="category-title">{category.category}</h3>
                <span className="feature-count">{category.items.length}</span>
              </div>
              
              <div className="features-list">
                {category.items.map((feature, featIdx) => (
                  <div key={featIdx} className="feature-item">
                    <svg className="feature-check" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="feature-name">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

Features.displayName = 'Features';

export default Features;
