import React, { useCallback, useState } from "react";
import "../styles/MobileSell.css";
import SellSteps from "../components/SellSteps";
import MobileReviews from "../components/MobileReviews";
import SellRightStats from "../components/SellRightStats";
import StoriesSection from "../components/StoriesSection";
import StoryCarousel from "../components/StoryCarousel";
import PopularCities from "../components/PopularCities";
import MobileFAQ from "../components/MobileFAQ";
import { SELL_FAQ_ITEMS } from "../constants/sellFaq";
import SellPriceForm from "../components/SellPriceForm";
import ScrollToTop from "../components/ScrollToTop";

/**
 * MobileSellPage - mobile-optimized sell flow landing
 * - shows existing car card (if any)
 * - CTA to continue sell journey or enter registration / choose brand
 */
export default function MobileSellPage() {
  const [priceFormOpen, setPriceFormOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [regNumber, setRegNumber] = useState("");
  const brands = [
    { id: "maruti", label: "Maruti Suzuki", logo: process.env.PUBLIC_URL + "/maruti-suzuki.avif" },
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

  return (
    <div className="ms-page">
      <section className="ms-premium-hero">
        <div className="ms-hero-top-bar">
          <div className="ms-hero-logo">
            <img src={process.env.PUBLIC_URL + "/carsdedo-background.png"} alt="CarsDedo" />
          </div>
          <div className="ms-hero-badge">
            <span className="ms-dot-pulse"></span>
            Live evaluation
          </div>
        </div>

        <div className="ms-hero-body">
          <div className="ms-hero-main-text">
            <h1 className="ms-hero-h1">
              Sell your car at the <br />
              <span className="ms-text-gradient">Highest Price</span>
            </h1>
            <div className="ms-offer-tag">
              Get up to <strong>₹20,000 extra</strong> on your first sale
            </div>
            
            <ul className="ms-feature-list">
              <li><span>✓</span> Instant online quote</li>
              <li><span>✓</span> Free doorstep evaluation</li>
              <li><span>✓</span> Same-day secure payment</li>
            </ul>
          </div>

          <div className="ms-hero-person-wrap">
            <img 
              src={process.env.PUBLIC_URL + "/firstspin.png"} 
              alt="Happy customer" 
              className="ms-hero-person"
            />
          </div>
        </div>
      </section>

      <section className="ms-card-wrap">
        <div className="ms-quote-card">
          <h2 className="ms-card-title">Enter your car registration number</h2>
          <input
            className="ms-reg-input"
            placeholder="(e.g. DL34AC4564)"
            aria-label="Registration number"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
          />

          <button
            className="ms-primary-btn"
            onClick={() => openPriceForm({ registrationNumber: regNumber })}
          >
            Check Car Valuation
          </button>
        </div>

        <div className="ms-divider">
          <span className="ms-divider-line" />
          <span className="ms-divider-text">OR</span>
          <span className="ms-divider-line" />
        </div>

        <div className="ms-brand-card">
          <h3 className="ms-card-title">Select your car brand</h3>
          <div className="ms-brand-grid">
            {brands.slice(0, 11).map((brand) => (
              <button
                key={brand.id}
                type="button"
                className="ms-brand-item"
                onClick={() => openPriceForm({ brand: brand.label })}
                aria-label={`Select ${brand.label}`}
              >
                <img src={brand.logo} alt={brand.label} />
              </button>
            ))}
            <button
              type="button"
              className="ms-brand-item ms-brand-more"
              onClick={() => openPriceForm()}
            >
              More →
            </button>
          </div>
        </div>
      </section>

      {/* bottom spacing so bottom nav (if present) doesn't overlap */}
      <div style={{ height: "84px" }} />

      <SellSteps
        onCtaClick={() => openPriceForm()}
        onWatchClick={() => openPriceForm()}
        onLearnMoreClick={() => openPriceForm()}
      />
      <MobileReviews/>
      <SellRightStats/>
      <StoryCarousel/>
      <PopularCities/>
      <MobileFAQ items={SELL_FAQ_ITEMS} />

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
