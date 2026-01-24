import React from "react";
import styles from "../styles/CarCardSkeleton.module.css";

export default function CarCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.image} />
      <div className={styles.content}>
        <div className={styles.lineShort} />
        <div className={styles.line} />
        <div className={styles.line} />
        <div className={styles.lineSmall} />
      </div>
    </div>
  );
}
