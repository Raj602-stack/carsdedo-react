import React from 'react';
import styles from '../styles/CarDetailsWeb.module.css';

/**
 * ReasonsToBuy component - Displays reasons to buy the car
 */
const ReasonsToBuy = React.memo(({ reasons }) => {
  if (!reasons || reasons.length === 0) return null;

  return (
    <section data-section="reasons" className={styles.reasonsSection}>
      <h2 className={styles.sectionTitle}>Why Choose This Car?</h2>
      <div className={styles.reasonsGrid}>
        {reasons.map((reason, idx) => (
          <div key={idx} className={styles.reasonCard}>
            <div className={styles.reasonIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.reasonContent}>
              <h3 className={styles.reasonTitle}>{reason.title}</h3>
              <p className={styles.reasonDescription}>{reason.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

ReasonsToBuy.displayName = 'ReasonsToBuy';

export default ReasonsToBuy;
