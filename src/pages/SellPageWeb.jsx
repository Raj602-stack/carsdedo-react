// src/pages/SellPageWeb.jsx
import React, { useCallback, useState } from "react";
import SellCarHero from "../components/SellCarHero";
import styles from "../styles/SellPageWeb.module.css";
import { Link, useNavigate } from "react-router-dom";
import SellHowItWorks from "../components/SellHowItWorks";
import ReviewsSlider from "../components/ReviewsSlider";
import SellStats from "../components/SellStats";
import StoriesSection from "../components/StoriesSection";
import FAQ from "../components/FAQ";
import SellGuide from "../components/SellGuide";
import { SELL_FAQ_ITEMS } from "../constants/sellFaq";
import SellPriceForm from "../components/SellPriceForm";
import Topbar from "../components/Topbar";

const REVIEWS = [
// ... (keep REVIEWS)
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

const VALUE_PROPS = [
  {
    title: "Instant price clarity",
    desc: "Get a transparent quote online, with no hidden deductions later.",
  },
  {
    title: "Free doorstep inspection",
    desc: "Pick a time that suits you. We inspect and make the final offer.",
  },
  {
    title: "Same-day payment",
    desc: "Complete paperwork and get paid on the same day of sale.",
  },
  {
    title: "RC transfer handled",
    desc: "We take care of the transfer process end-to-end.",
  },
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
      } catch (err) {
        console.error("Failed to store sell lead", err);
      }
    }, []);

    const scrollToId = useCallback((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, []);

    const handleHowItWorksCta = useCallback(
      (id) => {
        if (id === "watch") {
          scrollToId("sell-guide");
          return;
        }
        openPriceForm();
      },
      [openPriceForm, scrollToId]
    );
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.heroSection} id="quote">
          <SellCarHero onOpenForm={openPriceForm} />
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <p className={styles.kicker}>Why sellers choose us</p>
              <h2 className={styles.sectionTitle}>A premium, transparent selling experience</h2>
              <p className={styles.sectionSubtitle}>
                Designed for comfort and clarity, from first quote to payout.
              </p>
            </div>

            <div className={styles.valueGrid}>
              {VALUE_PROPS.map((item, idx) => (
                <div key={item.title} className={styles.valueCard}>
                  <div className={styles.valueIndex}>{String(idx + 1).padStart(2, "0")}</div>
                  <div className={styles.valueTitle}>{item.title}</div>
                  <p className={styles.valueDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <SellHowItWorks onCtaClick={handleHowItWorksCta} />
        </section>

        <section className={styles.sectionMuted}>
          <div className={styles.container}>
            <SellStats logo={logoPath} />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <p className={styles.kicker}>Trusted by sellers</p>
              <h2 className={styles.sectionTitle}>Stories of smooth, stress-free selling</h2>
              <p className={styles.sectionSubtitle}>
                Real experiences from people who sold with confidence.
              </p>
            </div>
            <ReviewsSlider reviews={REVIEWS} truncateWords={28} />
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <StoriesSection />
        </section>

        <section className={styles.section}>
          <SellGuide
            sectionId="sell-guide"
            onGetQuote={() => openPriceForm()}
            onLearnMore={() => scrollToId("sell-faq")}
          />
        </section>

        <section className={styles.sectionMuted} id="sell-faq">
          <FAQ items={SELL_FAQ_ITEMS} />
        </section>
      </main>

      <SellPriceForm
        open={priceFormOpen}
        onClose={closePriceForm}
        onSubmit={handlePriceSubmit}
        initialValues={initialValues}
      />
    </div>
  );
}
