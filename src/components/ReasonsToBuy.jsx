import React, { forwardRef } from 'react';
import '../styles/ReasonsToBuy.css';

const ReasonsToBuy = forwardRef(({ car }, ref) => {
  const reasons = car?.reasonsToBuy?.length > 0 
    ? car.reasonsToBuy
    : [
        {
          title: 'Well maintained car',
          description: 'Rare price for a well maintained car',
        },
        {
          title: 'Great value',
          description: 'Priced lower compared to its original new car on-road price',
        }
      ];

  return (
    <section 
      id="overview" 
      ref={ref} 
      className="reasons-section"
    >
      <div className="reasons-container">
        <h2 className="reasons-heading">Why Choose This Car?</h2>
        <div className="reasons-grid">
          {reasons.map((reason, index) => (
            <div key={index} className="reason-card">
              <div className="reason-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="reason-content">
                <h3 className="reason-title">{reason.title}</h3>
                <p className="reason-description">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

ReasonsToBuy.displayName = 'ReasonsToBuy';

export default ReasonsToBuy;
