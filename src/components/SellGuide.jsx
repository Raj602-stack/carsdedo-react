// File: src/components/SellGuide.jsx
import React from "react";
import styles from "../styles/SellGuide.module.css";

export default function SellGuide() {
  return (
    <section className={styles.wrapper} aria-labelledby="sell-guide-title">
      <div className={styles.container}>
        <h1 id="sell-guide-title" className={styles.h1}>
          Sell Your Used Car Online Quickly & Easily — Step-by-Step Guide
        </h1>

        <div className={styles.lead}>
          Looking to sell your car online quickly and efficiently? This guide walks
          you through the complete process — from getting an instant online
          valuation to same-day payment and hassle-free RC transfer.
        </div>

        <p className={styles.intro}>
          Whether you're selling an old car or upgrading, following these steps
          will help you get the best resale value with minimal effort.
        </p>

        <h2 className={styles.h2}>Why Choose Carsdedo to Sell Your Car Online?</h2>
        <ul className={styles.bullets}>
          <li>
            <strong>Transparent Pricing:</strong> We offer a fixed price with no
            haggling — a fair, market-based offer.
          </li>
          <li>
            <strong>Hassle-Free Experience:</strong> Doorstep evaluations,
            document pickup and free RC transfer make the process convenient.
          </li>
          <li>
            <strong>Quick Turnaround:</strong> Inspection to payment — fast and
            efficient.
          </li>
          <li>
            <strong>Extensive Car Evaluation:</strong> A thorough 200-point
            inspection ensures accurate pricing.
          </li>
          <li>
            <strong>Free RC Transfer:</strong> We handle ownership transfer at no
            extra cost.
          </li>
        </ul>

        <h2 className={styles.h2}>How to Sell Your Car Online — Step-by-Step</h2>

        <ol className={styles.steps}>
          <li>
            <h3 className={styles.stepTitle}>1. Obtain an Instant Online Quote</h3>
            <p>
              Start by submitting your car details using our online valuation
              tool. You will be asked for:
            </p>
            <ul className={styles.subBullets}>
              <li>Registration number (or basic details)</li>
              <li>Car brand and RTO location</li>
              <li>Manufacturing year and model</li>
              <li>Variant and transmission (manual / automatic)</li>
              <li>Ownership (1st owner, 2nd owner, etc.)</li>
              <li>Kilometres driven</li>
              <li>When you want to sell your car</li>
              <li>Contact address and mobile number for a free evaluation</li>
            </ul>
            <p>
              After submission you'll receive an instant quote based on these
              details.
            </p>
          </li>

          <li>
            <h3 className={styles.stepTitle}>2. Book a Free Car Evaluation</h3>
            <p>
              Schedule a doorstep valuation at your home, office or nearest Carsdedo
              Hub. A certified expert will inspect the vehicle and validate the
              condition.
            </p>
          </li>

          <li>
            <h3 className={styles.stepTitle}>3. Get a Final Offer</h3>
            <p>
              Based on the inspection, we provide a non-binding final offer. The
              offer reflects current market trends and car condition. It is valid
              for a limited time so you can make an informed decision.
            </p>
          </li>

          <li>
            <h3 className={styles.stepTitle}>4. Accept the Offer</h3>
            <p>
              If you are happy with the offer, accept it — our team will begin
              the paperwork and schedule pickup if required.
            </p>
          </li>

          <li>
            <h3 className={styles.stepTitle}>5. Receive Same-Day Payment</h3>
            <p>
              Once the offer is accepted and paperwork is complete, payment is
              transferred securely to your bank account on the same day.
            </p>
          </li>

          <li>
            <h3 className={styles.stepTitle}>6. Free RC Transfer</h3>
            <p>
              Carsdedo handles the ownership transfer at no extra charge — we
              ensure a quick and accurate RC transfer so you don't have to worry
              about the paperwork.
            </p>
          </li>

          <li>
            <h3 className={styles.stepTitle}>7. After-Sale Support</h3>
            <p>
              We provide post-sale support to ensure smooth completion of RC
              transfer and any follow-up queries.
            </p>
          </li>
        </ol>

        <h2 className={styles.h2}>Documents You Need to Sell Your Car</h2>

        <p className={styles.lead}>Car owner's documents (self-attested copies):</p>
        <ul className={styles.bullets}>
          <li>PAN card — one copy (self-attested)</li>
          <li>Address proof — one copy (self-attested)</li>
          <li>Passport size photos — two copies (self-attested)</li>
        </ul>

        <p className={styles.lead}>RTO documents commonly required:</p>
        <ul className={styles.bullets}>
          <li>Form 28, Form 29, Form 30 (as applicable)</li>
          <li>Bank NOC & Form 35 (if vehicle under loan)</li>
          <li>Vehicle sale affidavit / clearance certificate</li>
        </ul>

        <p className={styles.lead}>Documents of the car:</p>
        <ul className={styles.bullets}>
          <li>Original Registration Certificate (RC)</li>
          <li>PUC (Pollution Under Control) certificate</li>
          <li>Original insurance</li>
          <li>Ownership manual & duplicate keys (if any)</li>
        </ul>

        <h2 className={styles.h2}>Carsdedo's Used Car Evaluation Process</h2>
        <ol className={styles.steps}>
          <li>
            <h3 className={styles.stepTitle}>Submit Your Car Details Online</h3>
            <p>Enter basic car details and receive an initial quote instantly.</p>
          </li>

          <li>
            <h3 className={styles.stepTitle}>Schedule Doorstep Evaluation</h3>
            <p>
              Choose a convenient time for a thorough evaluation performed by a
              certified expert.
            </p>
          </li>

          <li>
            <h3 className={styles.stepTitle}>Undergo a Thorough Car Inspection</h3>
            <p>
              Our expert conducts a 200-point inspection — usually 45 to 60
              minutes — covering exterior, interior, engine and key components.
            </p>
          </li>

          <li>
            <h3 className={styles.stepTitle}>Receive Final Offer & Payment</h3>
            <p>
              We present a final offer and, upon acceptance, arrange paperwork
              and same-day payment with RC transfer.
            </p>
          </li>
        </ol>

        <h2 className={styles.h2}>What Happens Next?</h2>
        <ul className={styles.bullets}>
          <li>
            <strong>Instant Payment:</strong> Secure same-day payment after the
            deal is finalised.
          </li>
          <li>
            <strong>Free RC Transfer:</strong> We take care of the legal
            documentation and transfer process.
          </li>
          <li>
            <strong>Car Pickup:</strong> We can arrange pickup as part of the
            process.
          </li>
          <li>
            <strong>Customer Support:</strong> Dedicated support for post-sale
            queries.
          </li>
        </ul>

        <div className={styles.ctaWrap}>
          <button className={styles.primaryBtn}>Get Instant Quote</button>
          <a className={styles.learnMore} href="#contact">Learn more</a>
        </div>
      </div>
    </section>
  );
}

