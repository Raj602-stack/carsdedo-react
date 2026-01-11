import React, { forwardRef } from 'react';
import '../styles/Specifications.css';

const Specifications = forwardRef(({ car }, ref) => {
  // Group specs by category
  const specsByCategory = {};
  
  if (car?.specs && car.specs.length > 0) {
    car.specs.forEach(spec => {
      if (!specsByCategory[spec.category]) {
        specsByCategory[spec.category] = [];
      }
      specsByCategory[spec.category].push(spec);
    });
  }

  const categories = Object.keys(specsByCategory);

  // Icon mapping for common spec categories
  const categoryIcons = {
    'Engine': '⚙️',
    'Performance': '🚀',
    'Dimensions': '📏',
    'Capacity': '📦',
    'Transmission': '🔧',
    'Fuel': '⛽',
    'Brakes': '🛑',
    'Suspension': '🔩',
    'Steering': '🎯',
    'Tyres': '🛞',
    'Electrical': '⚡',
    'Safety': '🛡️',
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <section id="specifications" ref={ref} className="specs-section">
      <div className="specs-container">
        <h2 className="specs-heading">Car Specifications</h2>
        <p className="specs-subtitle">Detailed technical specifications</p>
        
        <div className="specs-categories">
          {categories.map((category, catIdx) => (
            <div key={catIdx} className="spec-category">
              <div className="category-header">
                <span className="category-icon">{categoryIcons[category] || '📋'}</span>
                <h3 className="category-title">{category}</h3>
              </div>
              
              <div className="specs-grid">
                {specsByCategory[category].map((spec, specIdx) => (
                  <div key={specIdx} className="spec-item">
                    <div className="spec-label">{spec.label}</div>
                    <div className="spec-value">{spec.value}</div>
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

Specifications.displayName = 'Specifications';

export default Specifications;
