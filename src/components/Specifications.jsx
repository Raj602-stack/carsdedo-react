import React, { forwardRef } from 'react';
import { FiZap, FiSettings, FiNavigation, FiPackage } from 'react-icons/fi';
import '../styles/Specifications.css';

const Specifications = forwardRef(({ car, onViewAllSpecs }, ref) => {
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

  // Icon mapping for common specs
  const getSpecIcon = (label) => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('mileage') || labelLower.includes('fuel')) return <FiZap />;
    if (labelLower.includes('displacement') || labelLower.includes('engine') || labelLower.includes('power') || labelLower.includes('torque')) return <FiSettings />;
    if (labelLower.includes('ground clearance') || labelLower.includes('length') || labelLower.includes('width') || labelLower.includes('height') || labelLower.includes('wheelbase')) return <FiNavigation />;
    if (labelLower.includes('boot space') || labelLower.includes('seating') || labelLower.includes('doors') || labelLower.includes('capacity')) return <FiPackage />;
    return <FiSettings />;
  };

  // Get preview specs (4 key specs to show)
  const getPreviewSpecs = () => {
    const preview = [];
    
    // Try to get Mileage from fuel_performance
    const fuelPerf = specsByCategory['fuel_performance'] || [];
    const mileage = fuelPerf.find(s => s.label.toLowerCase().includes('mileage'));
    if (mileage) preview.push(mileage);
    
    // Try to get Displacement from engine_transmission
    const engineTrans = specsByCategory['engine_transmission'] || [];
    const displacement = engineTrans.find(s => s.label.toLowerCase().includes('displacement'));
    if (displacement) preview.push(displacement);
    
    // Try to get Ground clearance from dimension_capacity
    const dimCap = specsByCategory['dimension_capacity'] || [];
    const groundClearance = dimCap.find(s => s.label.toLowerCase().includes('ground clearance'));
    if (groundClearance) preview.push(groundClearance);
    
    // Try to get Boot space from dimension_capacity
    const bootSpace = dimCap.find(s => s.label.toLowerCase().includes('boot space'));
    if (bootSpace) preview.push(bootSpace);
    
    return preview.slice(0, 4);
  };

  const previewSpecs = getPreviewSpecs();

  if (previewSpecs.length === 0) {
    return null;
  }

  return (
    <section id="specifications" ref={ref} className="specs-section">
      <div className="specs-container">
        <h2 className="specs-heading">Specifications</h2>
        
        <div className="specs-card">
          <div className="specs-grid">
            {previewSpecs.map((spec, idx) => (
              <div key={idx} className="spec-cell">
                <div className="spec-icon">
                  {getSpecIcon(spec.label)}
                </div>
                <div className="spec-meta">
                  <div className="spec-label">{spec.label}</div>
                  <div className="spec-value">{spec.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="specs-actions">
            <button
              type="button"
              className="view-all-specs-btn"
              onClick={onViewAllSpecs}
            >
              View all specifications
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

Specifications.displayName = 'Specifications';

export default Specifications;
