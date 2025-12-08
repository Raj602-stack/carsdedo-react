import React from "react";
import styles from "../styles/SellStats.module.css";

/**
 * SellStats
 *
 * Props (optional):
 * - stats: array of { id, icon, number, label } — defaults provided below
 * - title: string
 * - logo: src string for right-side logo
 */
const DEFAULT_STATS = [
  { id: "sold", icon: "📈", number: "2 Lakh+", label: "cars purchased" },
  { id: "rating", icon: "⭐", number: "4.9", label: "average rating" },
  { id: "cities", icon: "📍", number: "80+", label: "cities in India" },
];

export default function SellStats({ stats = DEFAULT_STATS, title = "Recommended by 2 Lakh+ sellers across India", logo }) {
  return (
    <section className={styles.banner} aria-label="Recommended stats">
      <div className={styles.inner}>
        <div className={styles.left}>
          <h3 className={styles.title}>{title}</h3>

          <div className={styles.cards}>
            {stats.map((s) => (
              <div className={styles.card} key={s.id}>
                <div className={styles.cardContent}>
                  <div className={styles.icon} aria-hidden>
                    {s.icon}
                  </div>
                  <div className={styles.metrics}>
                    <div className={styles.number}>{s.number}</div>
                    <div className={styles.label}>{s.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.right}>
          {logo ? (
            <img src={logo} alt="SellRight logo" className={styles.logo} />
          ) : (
            <div className={styles.logoPlaceholder}>
              <span>SellRight</span>
              <span className={styles.by}>by Spinny</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
