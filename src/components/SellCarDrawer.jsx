// src/components/SellCarDrawer.jsx
import React from "react";
import styles from "../styles/SellCarDrawer.module.css";
import SellCarForm from "./SellCarForm";

export default function SellCarDrawer({ open, onClose, prefillData }) {
  return (
    <>
      {/* Backdrop */}
      {open && <div className={styles.backdrop} onClick={onClose} />}

      {/* Drawer */}
      <aside className={`${styles.drawer} ${open ? styles.open : ""}`}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <SellCarForm prefillData={prefillData} />
      </aside>
    </>
  );
}
