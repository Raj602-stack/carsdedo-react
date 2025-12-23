import React from "react";
import styles from "../styles/Login.module.css";

export default function LoginWeb() {
  return (
    <div className={styles.page}>
      {/* Background decorative shapes */}
      <div className={`${styles.bgIcon} ${styles.heart}`} />
      <div className={`${styles.bgIcon} ${styles.thumbs}`} />
      <div className={`${styles.bgIcon} ${styles.bell}`} />

      {/* Login Card */}
      <div className={styles.card}>
        <h2 className={styles.title}>Login to view Account</h2>

        <input
          type="text"
          placeholder="Mobile Number"
          className={styles.input}
        />

        <p className={styles.terms}>
          By proceeding, you agree to our{" "}
          <a href="#">terms</a> and <a href="#">conditions</a>
        </p>

        <button className={styles.button}>Verify your number</button>
      </div>
    </div>
  );
}
