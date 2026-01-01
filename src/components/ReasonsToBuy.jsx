import React, { forwardRef } from 'react';
import styles from '../styles/ReasonsToBuy.module.css';

// Using forwardRef to allow the parent to scroll to this section
const ReasonsToBuy = forwardRef((props, ref) => {
  const reasons = [
    {
      id: 1,
      title: 'Indian Car of the Year (ICOTY)',
      description: 'Winner of the prestigious award in 2014',
      icon: '🏆',
    },
    {
      id: 2,
      title: 'New battery',
      description: 'New battery for a reduced ownership cost',
      icon: '🔋',
    },
    {
      id: 3,
      title: 'Less driven per year',
      description: 'Usage lower than 5,000km per year',
      icon: '🛣️',
    }
  ];

  return (
    <section 
      id="overview" 
      ref={ref} 
      className={styles.container}
    >
      <h2 className={styles.mainHeading}>Reasons to buy</h2>
      <div className={styles.reasonsList}>
        {reasons.map((reason) => (
          <div key={reason.id} className={styles.reasonItem}>
            <div className={styles.iconWrapper}>
              <span className={styles.icon}>{reason.icon}</span>
            </div>
            <div className={styles.textContent}>
              <h3 className={styles.reasonTitle}>{reason.title}</h3>
              <p className={styles.reasonDescription}>{reason.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

// Important: Add a display name for debugging
ReasonsToBuy.displayName = 'ReasonsToBuy';

export default ReasonsToBuy;