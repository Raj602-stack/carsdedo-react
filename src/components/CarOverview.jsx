import React from 'react';
import styles from '../styles/CarDetailsWeb.module.css';
import { formatKm, formatDate, formatInsuranceType, formatYear } from '../utils';

/**
 * CarOverview component - Displays car overview information
 */
const CarOverview = React.memo(({ car }) => {
  if (!car) return null;

  return (
    <section id="overview" data-section="overview" className={styles.cdSection}>
      <h2 className={styles.pageTitle}>Car Overview</h2>

      <div className={styles.overviewCard}>
        {/* Row 1 */}
        <div className={styles.overviewRow}>
          <div className={styles.overviewField}>
            <div className={styles.fieldLabel}>Make Year</div>
            <div className={styles.fieldValue}>
              {formatYear(car.makeYear || car.year)}
            </div>
          </div>

          <div className={styles.overviewField}>
            <div className={styles.fieldLabel}>Registration Year</div>
            <div className={styles.fieldValue}>
              {formatYear(car.regYear || car.year)}
            </div>
          </div>

          <div className={styles.overviewField}>
            <div className={styles.fieldLabel}>Fuel Type</div>
            <div className={styles.fieldValue}>{car.fuel || "-"}</div>
          </div>
        </div>

        {/* Row 2 */}
        <div className={styles.overviewRow}>
          <div className={styles.overviewField}>
            <div className={styles.fieldLabel}>Km driven</div>
            <div className={styles.fieldValueLarge}>{formatKm(car.km)}</div>
          </div>

          <div className={styles.overviewField}>
            <div className={styles.fieldLabel}>Transmission</div>
            <div className={styles.fieldValue}>{car.transmission || "-"}</div>
          </div>

          <div className={styles.overviewField}>
            <div className={styles.fieldLabel}>No. of Owner</div>
            <div className={styles.fieldValue}>{car.owner || "1st Owner"}</div>
          </div>
        </div>

        {/* Row 3 */}
        <div className={styles.overviewRow}>
          <div className={styles.overviewField}>
            <div className={styles.fieldLabel}>Insurance Validity</div>
            <div className={styles.fieldValue}>
              {formatDate(car.insuranceValid)}
            </div>
          </div>

          <div className={styles.overviewField}>
            <div className={styles.fieldLabel}>Insurance Type</div>
            <div className={styles.fieldValue}>
              {formatInsuranceType(car.insuranceType)}
            </div>
          </div>

          <div className={styles.overviewField}>
            <div className={styles.fieldLabel}>RTO</div>
            <div className={styles.fieldValue}>{car?.locationRto || "-"}</div>
          </div>
        </div>

        {/* Row 4: Car Location spans full width */}
        <div className={`${styles.overviewRow} ${styles.locationRow}`}>
          <div>
            <div className={styles.locationLabel}>Car Location</div>
            <div className={styles.locationValue}>
              {car.locationFull || car.city || "-"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

CarOverview.displayName = 'CarOverview';

export default CarOverview;
