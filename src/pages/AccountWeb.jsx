import React, { useState } from "react";
import styles from "../styles/Account.module.css";

export default function AccountWeb() {
  const [activeTab, setActiveTab] = useState("buy");

  return (
    <div className={styles.page}>
      {/* Top Card */}
      <div className={styles.topCard}>
        <span className={styles.phone}>9664573074</span>
        <button className={styles.settings}>Settings</button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {["buy", "sell", "services"].map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${
              activeTab === tab ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders */}
      <h3 className={styles.sectionTitle}>Your orders</h3>

      <div className={styles.orderCard}>
        <p className={styles.noOrders}>You have no orders yet</p>

        <div className={styles.carIcon}>🚗</div>

        <button className={styles.buyButton}>
          Buy car <span>→</span>
        </button>
      </div>

      {/* Loan Banner */}
      <div className={styles.loanBanner}>
        <div>
          <h3>Loan made easier than ever.</h3>
          <p>Finance your future ride today</p>
          <button className={styles.eligibilityBtn}>
            CHECK ELIGIBILITY
          </button>
        </div>

        <div className={styles.coin}>₹</div>
      </div>

      {/* Links */}
      <div className={styles.linkCard}>FAQs <span>›</span></div>
      <div className={styles.linkCard}>Terms and privacy <span>›</span></div>
    </div>
  );
}
