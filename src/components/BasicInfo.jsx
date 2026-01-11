import React, { forwardRef } from 'react';
import styles from '../styles/BasicInfo.module.css';

const BasicInfo = forwardRef(({ car }, ref) => {
  // Format km
  const formatKm = (km) => {
    if (!km && km !== 0) return "-";
    // If km is already a string with "km", return as is
    if (typeof km === 'string' && km.includes('km')) return km;
    // Convert to number if it's a string
    const kmNum = typeof km === 'string' ? parseInt(km.replace(/[^0-9]/g, ''), 10) : km;
    if (isNaN(kmNum)) return "-";
    if (kmNum >= 1000 && kmNum < 100000) return `${Math.round(kmNum / 1000)}K km`;
    return `${kmNum.toLocaleString()} km`;
  };

  // Format year
  const formatYear = (year) => {
    if (!year) return "-";
    if (typeof year === 'string' && year.includes('-')) return year;
    return year.toString();
  };

  // Format insurance validity date
  const formatInsuranceDate = (dateStr) => {
    if (!dateStr || dateStr === 'undefined' || dateStr === 'null') {
      if (process.env.NODE_ENV === 'development') {
        console.log('formatInsuranceDate - no value provided');
      }
      return "-";
    }
    try {
      // If already formatted (e.g., "Aug 2026"), return as is
      if (typeof dateStr === 'string' && /^[A-Za-z]{3} \d{4}$/.test(dateStr.trim())) {
        return dateStr;
      }
      // Handle formats like "2026-08-10"
      if (typeof dateStr === 'string' && dateStr.includes('-')) {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const formatted = `${months[date.getMonth()]} ${date.getFullYear()}`;
          if (process.env.NODE_ENV === 'development') {
            console.log('formatInsuranceDate - formatted:', dateStr, '->', formatted);
          }
          return formatted;
        }
      }
      if (process.env.NODE_ENV === 'development') {
        console.log('formatInsuranceDate - returning as-is:', dateStr);
      }
      return dateStr;
    } catch (e) {
      console.error('formatInsuranceDate - error:', e, dateStr);
      return dateStr;
    }
  };

  // Format insurance type (capitalize first letter)
  const formatInsuranceType = (type) => {
    if (!type || type === 'undefined' || type === 'null') {
      if (process.env.NODE_ENV === 'development') {
        console.log('formatInsuranceType - no value provided');
      }
      return "-";
    }
    if (typeof type === 'string') {
      const formatted = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
      if (process.env.NODE_ENV === 'development') {
        console.log('formatInsuranceType - formatted:', type, '->', formatted);
      }
      return formatted;
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('formatInsuranceType - returning as-is:', type);
    }
    return type;
  };

  // Debug: Log car data to see what we're receiving
  if (process.env.NODE_ENV === 'development' && car) {
    console.log('BasicInfo - car object:', car);
    console.log('BasicInfo - insuranceValid:', car.insuranceValid);
    console.log('BasicInfo - insuranceType:', car.insuranceType);
  }

  // Data mapping from car object
  const infoItems = car ? [
    { label: "Make Year", value: car.makeYear ? formatYear(car.makeYear) : (car.year ? formatYear(car.year) : "-") },
    { label: "Reg. Year", value: car.regYear ? formatYear(car.regYear) : (car.year ? formatYear(car.year) : "-") },
    { label: "Fuel", value: car.fuel || "-" },
    { label: "Km driven", value: formatKm(car.km) },
    { label: "Transmission", value: car.transmission || car.trans || "-", hasInfo: true },
    { label: "No. of Owner(s)", value: car.owner || "-" },
    { label: "Insurance Validity", value: formatInsuranceDate(car.insuranceValid) },
    { label: "Insurance Type", value: formatInsuranceType(car.insuranceType) },
    { label: "RTO", value: car.locationRto || "-" },
    { label: "Car Location", value: car.locationFull || car.city || "-" },
  ] : [];

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