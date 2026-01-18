// src/pages/SellPageWeb.jsx
import React, { useState, useCallback } from "react";
import SellCarHero from "../components/SellCarHero";
import styles from "../styles/SellPageWeb.module.css";
import { Link, useNavigate } from "react-router-dom";
import SellHowItWorks from "../components/SellHowItWorks";
import ReviewsSlider from "../components/ReviewsSlider";
import SellStats from "../components/SellStats";
import StoriesSection from "../components/StoriesSection";
import FAQ from "../components/FAQ";
import SellGuide from "../components/SellGuide";
import SellPriceForm from "../components/SellPriceForm";
import ScrollToTop from "../components/ScrollToTop";

const REVIEWS = [
    {
      id: 1,
      name: "Aftab Alam",
      date: "17 Nov 2025",
      city: "Kolkata",
      rating: 5,
      text: "Today I sell my car in Spinny CC2 hub. I am very satisfied. Here all employees are very good. The transaction was quick and the staff explained all documents clearly. I recommend them to everyone who wants a hassle free experience.",
    },
    {
      id: 2,
      name: "Pradeep Sahoo",
      date: "17 Nov 2025",
      city: "Hyderabad",
      rating: 5,
      text: "I recently sold my old car through Spinny. Obviously it was a nice experience in dealing with Spinny. The entire process was smooth, hassle-free, transparent and a professional approach that makes me very comfortable in dealing with Spinny. I would strongly recommend Spinny to anyone planning to sell or buy car with complete peace of mind.",
    },
    {
      id: 3,
      name: "Sunny Agarwal",
      date: "16 Nov 2025",
      city: "Delhi",
      rating: 4,
      text: "Great service. Pickup and paperwork handled properly. A small delay in handover but overall a good experience.",
    },
    {
        id: 4,
        name: "Sunny Agarwal",
        date: "16 Nov 2025",
        city: "Delhi",
        rating: 4,
        text: "Great service. Pickup and paperwork handled properly. A small delay in handover but overall a good experience.",
      },
    // ...more
  ];
  

export default function SellPageWeb() {
    const navigate = useNavigate();
    const logoPath = process.env.PUBLIC_URL + "/carsdedo-background.png";
    
    const [priceFormOpen, setPriceFormOpen] = useState(false);
    const [initialValues, setInitialValues] = useState({});

    const openPriceForm = useCallback((values = {}) => {
      setInitialValues(values);
      setPriceFormOpen(true);
    }, []);

    const closePriceForm = useCallback(() => setPriceFormOpen(false), []);

    const handlePriceSubmit = useCallback((payload) => {
      try {
        localStorage.setItem("sellLead", JSON.stringify(payload));
        console.log("Sell lead saved:", payload);
      } catch (err) {
        console.error("Failed to store sell lead", err);
      }
    }, []);

  return (
    <div className={styles.page}>
      {/* <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <Link to="/">SellRight</Link>
          </div>

          <nav className={styles.nav}>
            <Link to="/buy" className={styles.navItem}>Buy</Link>
            <Link to="/sell" className={`${styles.navItem} ${styles.active}`}>Sell</Link>
            <Link to="/account" className={styles.navItem}>Account</Link>
          </nav>

          <div className={styles.headerCtas}>
            <button className={styles.btnOutline}>Login</button>
            <button 
              className={styles.btnPrimary}
              onClick={() => navigate("/sell")}
            >
              Sell Your Car
            </button>
          </div>
        </div>
      </header> */}

      <main className={styles.main}>
        {/* HERO */}
        <section className={styles.heroWrap}>
          <SellCarHero onOpenForm={openPriceForm} />
        </section>

        {/* BENEFIT STRIP */}
        {/* <section className={styles.benefits}>
          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>💸</div>
            <div className={styles.benefitTitle}>Instant Payment</div>
            <div className={styles.benefitSub}>Get paid quickly after sale</div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>🔍</div>
            <div className={styles.benefitTitle}>Free Evaluation</div>
            <div className={styles.benefitSub}>Comprehensive car inspection</div>
          </div>

          <div className={styles.benefitItem}>
            <div className={styles.benefitIcon}>📄</div>
            <div className={styles.benefitTitle}>RC Transfer & Support</div>
            <div className={styles.benefitSub}>End-to-end paperwork assistance</div>
          </div>
        </section> */}

     
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>© {new Date().getFullYear()} SellRight — All rights reserved</div>
          <div className={styles.footerLinks}>
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>

      <SellHowItWorks/>
      <ReviewsSlider reviews={REVIEWS} truncateWords={28} />
      

<SellStats logo={logoPath} />
<StoriesSection/>
<FAQ/>
<SellGuide/>

      {/* Sell Price Form Drawer */}
      <SellPriceForm
        open={priceFormOpen}
        onClose={closePriceForm}
        onSubmit={handlePriceSubmit}
        initialValues={initialValues}
      />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  );
}
