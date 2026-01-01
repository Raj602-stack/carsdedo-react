import React, { forwardRef } from 'react';
import styles from '../styles/BasicInfo.module.css';

const BasicInfo = forwardRef(({ car }, ref) => {
  // Data mapping based on your reference image
  const infoItems = [
    { label: "Make Year", value: "Mar 2015" },
    { label: "Reg. Year", value: "May 2015" },
    { label: "Fuel", value: "Petrol (BSIV)" },
    { label: "Km driven", value: "36K km" },
    { label: "Transmission", value: "Manual (Regular)", hasInfo: true },
    { label: "No. of Owner(s)", value: "1st Owner" },
    { label: "Insurance Validity", value: "May 2026" },
    { label: "Insurance Type", value: "Comprehensive" },
    { label: "RTO", value: "DL10" },
    { label: "Car Location", value: "Rohini Sector 10, Delhi" },
  ];

  return (
    <section id="basic-info" ref={ref} className={styles.container}>
      <h2 className={styles.heading}>Basic info</h2>
      
      <div className={styles.infoTable}>
        {infoItems.map((item, index) => (
          <div key={index} className={styles.row}>
            <div className={styles.labelCol}>
              <span className={styles.label}>{item.label}</span>
            </div>
            <div className={styles.valueCol}>
              <span className={styles.value}>
                {item.value}
                {item.hasInfo && <span className={styles.infoIcon}>ⓘ</span>}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

BasicInfo.displayName = 'BasicInfo';

export default BasicInfo;