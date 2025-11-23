import React from "react";
import { useNavigate } from "react-router-dom";
import MobileSellHeader from "../components/MobileSellHeader";
import "../styles/MobileSell.css";
import SellSteps from "../components/SellSteps";
import MobileReviews from "../components/MobileReviews";
import SellRightStats from "../components/SellRightStats";
import StoriesSection from "../components/StoriesSection";
import StoryCarousel from "../components/StoryCarousel";
import PopularCities from "../components/PopularCities";
import MobileFAQ from "../components/MobileFAQ";

/**
 * MobileSellPage - mobile-optimized sell flow landing
 * - shows existing car card (if any)
 * - CTA to continue sell journey or enter registration / choose brand
 */
export default function MobileSellPage() {
  const navigate = useNavigate();

  function onContinue() {
    // navigate to first step of sell flow (create route as needed)
    navigate("/sell/step1");
  }

  function onEditCar() {
    navigate("/sell/edit");
  }

  function onUseReg() {
    navigate("/sell/registration");
  }

  return (
    <div className="ms-page">
      {/* <MobileSellHeader onBack={() => navigate(-1)} onHelp={() => navigate("/help")} /> */}

      {/* Hero — left text / right image */}
<div className="ms-hero">
  <div className="ms-hero-inner">
    <div className="ms-hero-text">
      <div className="ms-badge">SellRight</div>
      <h1 className="ms-hero-title">
        Sell Car Online<br />
        <span className="ms-hero-accent">at the Best Price</span>
      </h1>
      <p className="ms-hero-sub">before <strong>1st December</strong></p>
    </div>

    <div className="ms-hero-visual" aria-hidden>
      <img
        src={ process.env.PUBLIC_URL + "/shortlogoo.png"}
        alt="Sell hero"
        className="ms-hero-img"
      />
    </div>
  </div>
</div>


      <section className="ms-card-wrap">
        <div className="ms-card">
          <div className="ms-card-top">
          <div className="ms-car-thumb">
  <img 
    src={process.env.PUBLIC_URL + "/baleno.avif"} 
    alt="Car" 
    className="ms-car-img" 
  />
</div>


            <div className="ms-car-meta">
              <div className="ms-car-title">2025 Maruti Suzuki Baleno Alpha MT</div>
              <div className="ms-car-sub">1st owner • Petrol • Manual</div>
            </div>

            <button className="ms-edit" onClick={onEditCar} aria-label="Edit">✎ Edit</button>
          </div>

          <div className="ms-cta-row">
            <button className="ms-primary" onClick={onContinue}>Continue sell journey</button>
            <div className="ms-progress">8 out of 9 questions answered</div>
          </div>
        </div>

        <div className="ms-or">OR</div>

        <div className="ms-alt">
          <h3 className="ms-alt-title">Selling a different car?</h3>
          <p className="ms-alt-sub">Enter your registration number or select your car brand</p>

          <input
            className="ms-reg-input"
            placeholder="(e.g. DL34AC4564)"
            aria-label="Registration number"
          />

          <button className="ms-secondary" onClick={onUseReg}>Continue with registration number</button>

          <div className="ms-or-line">Or</div>

          <button className="ms-outline" onClick={() => navigate("/sell/brand")}>Select your car brand</button>
        </div>
      </section>

      {/* bottom spacing so bottom nav (if present) doesn't overlap */}
      <div style={{ height: "84px" }} />

      {/* -------------------------------- */}
      <div className="wc-section">
  <h2 className="wc-title">Why choose CarsDedo?</h2>

  <div className="wc-grid">
    {/* Item 1 */}
    <div className="wc-item">
      <img
        src={process.env.PUBLIC_URL + "/instant.png"}
        alt="Instant Payment"
        className="wc-icon"
      />
      <p className="wc-text">Instant Payment</p>
    </div>

    {/* Item 2 */}
    <div className="wc-item">
      <img
        src={process.env.PUBLIC_URL + "/free.png"}
        alt="Free Car Evaluation"
        className="wc-icon"
      />
      <p className="wc-text">Free Car<br />Evaluation</p>
    </div>

    {/* Item 3 */}
    <div className="wc-item">
      <img
        src={process.env.PUBLIC_URL + "/rc.png"}
        alt="Fast RC Transfer"
        className="wc-icon"
      />
      <p className="wc-text">Free & Fast RC<br />Transfer</p>
    </div>
  </div>
</div>


      {/* -------------------------------- */}


      <SellSteps/>
      <MobileReviews/>
      <SellRightStats/>
      <StoryCarousel/>
      <PopularCities/>
      <MobileFAQ/>
    </div>
  );
}
