// src/components/SellCarHero.jsx
import React, { useState } from "react";
import styles from "../styles/SellCarHero.module.css";
import SellPriceForm from "./SellPriceForm";

export default function SellCarHero() {
  const [formOpen, setFormOpen] = useState(false);

  const BRANDS = [
    { id: "maruti", label: "Maruti Suzuki", logo: process.env.PUBLIC_URL + "/maruti-suzuki.avif"},
    { id: "hyundai", label: "Hyundai", logo: process.env.PUBLIC_URL + "/hyundai.avif" },
    { id: "tata", label: "Tata", logo: process.env.PUBLIC_URL + "/tata.avif" },
    { id: "honda", label: "Honda", logo: process.env.PUBLIC_URL + "/honda.avif" },
    { id: "renault", label: "Renault", logo: process.env.PUBLIC_URL + "/renault.avif" },
    { id: "ford", label: "Ford", logo: process.env.PUBLIC_URL + "/file.webp" },
    { id: "vw", label: "Volkswagen", logo: process.env.PUBLIC_URL + "/volkswagen.avif" },
    { id: "mahindra", label: "Mahindra", logo: process.env.PUBLIC_URL + "/mahindra.webp" },
    { id: "kia", label: "Kia", logo: process.env.PUBLIC_URL + "/v1.avif" },
    { id: "bmw", label: "BMW", logo: process.env.PUBLIC_URL + "/v1 (1).avif" },
    { id: "mercedes", label: "Mercedes-Benz", logo: process.env.PUBLIC_URL + "/merc.avif" },
  ];

  function handleOpenForm() {
    setFormOpen(true);
  }
  function handleCloseForm() {
    setFormOpen(false);
  }

  function handleFormSubmit(data) {
    // example: forward to API or show toast
    console.log("Received form data:", data);
    // TODO: call API to request evaluation
  }

  return (
    <section className={styles.section}>
      {/* Decorative background */}
      <svg
        className={styles.bgSvg}
        preserveAspectRatio="none"
        viewBox="0 0 1920 480"
        aria-hidden
      >
        <defs>
          <linearGradient id="g2" x1="0" x2="1">
            <stop offset="0%" stopColor="#3b0f4f" />
            <stop offset="100%" stopColor="#2b0a3b" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#g2)" />
        <g opacity="0.08" stroke="#fff" strokeWidth="10" fill="none">
          <path d="M0 420 C480 300 960 300 1920 420" />
          <path d="M0 360 C420 260 960 260 1920 360" />
          <path d="M0 300 C360 220 960 220 1920 300" />
        </g>
      </svg>

      <div className={styles.container}>
        {/* LEFT COLUMN */}
        <div className={styles.leftCol}>
          <div className={styles.promoBox}>
            <div className={styles.promoMain}>SELL YOUR CAR</div>
            <div className={styles.promoSub}>
              before 31<sup>st</sup> December
            </div>
          </div>

          <div className={styles.beatBox}>
            <div className={styles.beatSmall}>BEAT THE</div>
            <div className={styles.beatBig}>YEAR-END PRICE DROP</div>
          </div>
        </div>

        {/* CENTER CARD */}
        <div className={styles.centerCardWrap}>
          <div className={styles.centerCard}>
            <h1 className={styles.heading}>
              Sell Car Online{" "}
              <span className={styles.headingAccent}>at the Best Price</span>
            </h1>

            <div className={styles.formRow}>
              <div>
                <label className={styles.label}>
                  Enter your car registration number
                </label>
                <input
                  className={styles.input}
                  placeholder="(e.g. DL34AC4564)"
                />
              </div>

              <button className={styles.ctaBtn} onClick={handleOpenForm}>GET YOUR CAR PRICE</button>
            </div>

            <div className={styles.or}>Or</div>

            <div>
              <div className={styles.brandTitle}>
                Select your car brand to get started
              </div>

              <div className={styles.brandsGrid}>
                {BRANDS.map((b) => (
                  <div key={b.id} className={styles.brandBox} title={b.label}>
                    <img src={b.logo} alt={b.label} className={styles.brandImg} />
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT HERO IMAGE */}
        <div className={styles.rightImgWrap}>
          <img
            src={process.env.PUBLIC_URL + "/firstspin.png"}
            alt="hero-person"
            className={styles.rightImg}
          />
        </div>
      </div>

      {/* BOTTOM FEATURES ROW */}
      <div className={styles.bottomRow}>
        <div className={styles.bottomItem}>
          <div className={styles.bottomIcon}>💸</div>
          <div className={styles.bottomText}>Instant Payment</div>
        </div>
        <div className={styles.bottomItem}>
          <div className={styles.bottomIcon}>🔍</div>
          <div className={styles.bottomText}>Free Car Evaluation</div>
        </div>
        <div className={styles.bottomItem}>
          <div className={styles.bottomIcon}>📄</div>
          <div className={styles.bottomText}>Fast RC Transfer</div>
        </div>
      </div>

      {/* Slide-in price form */}
      <SellPriceForm open={formOpen} onClose={handleCloseForm} onSubmit={handleFormSubmit} />
    </section>
  );
}
