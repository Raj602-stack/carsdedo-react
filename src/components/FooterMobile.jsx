import React from "react";
import "../styles/FooterMobile.css";

const ABOUT_LINKS = [
  "CarsDedo Assured",
  "CarsDedo Pro",
  "FAQ's",
  "Inspection Process",
  "Used Car Loan",
  "Service Cost Calculator",
  "Car Hub Locations",
  "Trade With Us",
  "Privacy Policy",
  "Sitemap",
  "RTO Details",
];

const COMPANY_LINKS = [
  "Who we are",
  "Blog - Yellow Drive",
  "How It Works",
  "Customer Reviews",
  "CarsDedo Partners",
  "Work With Us",
  "Popular Cars Overview",
  "Contact Us",
  "Terms & Conditions",
  "eChallan",
  "EMI Calculator",
];

const CITIES = [
  "Delhi NCR","Bangalore","Hyderabad","Mumbai","Pune","Delhi",
  "Gurgaon","Noida","Ahmedabad","Chennai","Kolkata","Lucknow",
  "Jaipur","Ambala","Chandigarh","Coimbatore","Faridabad",
  "Ghaziabad","Kanpur","Karnal","Kochi","Mysuru","Sonipat","Visakhapatnam"
];

const SERVICES = [
  "Periodic service",
  "AC servicing",
  "Clutch & suspension",
  "Health check services",
  "Wheel care",
  "Washing & cleaning",
];

export default function FooterMobile() {
  return (
    <footer className="fm-root" aria-labelledby="fm-heading">
      <div className="fm-inner">
        {/* Brand + phone CTA */}
        <div className="fm-top">
          <div className="fm-brand">
            <img
              src={process.env.PUBLIC_URL + "/carsdedo-background.png"}
              alt="Brand logo"
              className="fm-logo"
            />
          </div>

          <a className="fm-phone" href="tel:7277277275" aria-label="Call 727-727-7275">
            <svg className="fm-phone-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 5.5C3 4.67 3.67 4 4.5 4h2.5C7.88 4 8.6 4.72 8.6 5.6c0 .28-.04.55-.13.8L10 9.5c.26-.06.53-.1.8-.1.88 0 1.6.72 1.6 1.6v2.5c0 .83-.67 1.5-1.5 1.5C9.27 15.5 6.5 18.27 6.5 21v2.5c0 .83-.67 1.5-1.5 1.5H4.5C3.67 25 3 24.33 3 23.5V5.5z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="fm-phone-text">727-727-7275</span>
          </a>
        </div>

        {/* Description */}
        <p className="fm-desc">
          CarsDedo is the most trusted way of buying and selling used cars. Choose from over 5000 fully inspected second-hand car models. Select online and book a test drive at your home or at a CarsDedo Car Hub near you. Get a no-questions-asked* 5-day money back guarantee and a free one-year comprehensive service warranty with Assured Resale Value on every CarsDedo car.
        </p>

        <p className="fm-legal">(*)subject to certain terms and conditions.</p>

        {/* social row */}
        <div className="fm-socials" aria-hidden>
          <img src={process.env.PUBLIC_URL + "/icons/instagram.svg"} alt="Instagram" />
          <img src={process.env.PUBLIC_URL + "/icons/linkedin.svg"} alt="LinkedIn" />
          <img src={process.env.PUBLIC_URL + "/icons/facebook.svg"} alt="Facebook" />
          <img src={process.env.PUBLIC_URL + "/icons/x.svg"} alt="X" />
        </div>

        {/* links columns */}
        <div className="fm-columns">
          <div className="fm-col">
            <h4 className="fm-col-title">ABOUT</h4>
            <ul className="fm-list">
              {ABOUT_LINKS.map((t) => (
                <li key={t}><a href="#" className="fm-link">{t}</a></li>
              ))}
            </ul>
          </div>

          <div className="fm-col">
            <h4 className="fm-col-title">&nbsp;</h4>
            <ul className="fm-list">
              {COMPANY_LINKS.map((t) => (
                <li key={t}><a href="#" className="fm-link">{t}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cities */}
        <div className="fm-section">
          <h4 className="fm-section-title">BUY USED CAR IN</h4>
          <div className="fm-cities">
            {CITIES.map((c) => (
              <a key={c} href="#" className="fm-city">{c}</a>
            ))}
          </div>
        </div>

        {/* Sell CTA */}
        <div className="fm-sell-row">
          <a href="#" className="fm-sell">SELL USED CAR AT CarsDedo &nbsp;<span aria-hidden>›</span></a>
        </div>

        {/* Services we offer */}
        <div className="fm-section">
          <h4 className="fm-section-title">SERVICES WE OFFER</h4>
          <div className="fm-services-list">
            {SERVICES.join(" | ")}
          </div>
        </div>

        {/* Car repair and servicing in */}
        <div className="fm-section">
          <h4 className="fm-section-title">CAR REPAIR AND SERVICING IN</h4>
          <div className="fm-cities">
            {CITIES.map((c) => (
              <a key={`repair-${c}`} href="#" className="fm-city">{c}</a>
            ))}
          </div>
        </div>

        {/* decorative skyline background - positioned relative to bottom */}
        <div className="fm-skyline" aria-hidden />

        {/* Copyright / CIN */}
        <div className="fm-copy">
          <div>© 2025 Valuedrive Technologies Private Limited. All rights reserved.</div>
          <div className="fm-cin">CIN: U74999HR2019PTC077781</div>
        </div>

        <div className="fm-bottom-space" />
      </div>
    </footer>
  );
}
