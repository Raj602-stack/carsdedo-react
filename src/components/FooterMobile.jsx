import React from "react";
import "../styles/FooterMobile.css";

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/carsdedo",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.6 8.7V7.1c0-.9.6-1.2 1.1-1.2h2V2h-2.9C11 2 9.5 3.7 9.5 6.7v2H7v3.6h2.5V22h4.1v-9.7h2.8l.4-3.6h-3.2z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://twitter.com/carsdedo",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 3h4.4l3.5 5 4.3-5H20l-6.6 7.6L21 21h-4.4l-3.9-5.6L7.7 21H4l7.3-8.3L4 3zm3.1 2.3l7.5 10.7h2.3L9.4 5.3H7.1z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/carsdedo",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.9 8.9H3.7V20h3.2V8.9zM5.3 3.5c-1 0-1.8.8-1.8 1.8S4.3 7 5.3 7s1.8-.8 1.8-1.8-.8-1.7-1.8-1.7zM20.5 13.2c0-2.7-1.4-4.4-3.9-4.4-1.8 0-2.7 1-3.1 1.7h-.1V8.9H10v11.1h3.2v-6.1c0-1.6.3-3.1 2.2-3.1 1.9 0 1.9 1.8 1.9 3.2V20h3.2v-6.8z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/carsdedo",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.3A4.7 4.7 0 1 1 7.3 13 4.7 4.7 0 0 1 12 8.3zm0 2A2.7 2.7 0 1 0 14.7 13 2.7 2.7 0 0 0 12 10.3zm5.1-2.2a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1z" />
      </svg>
    ),
  },
];

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
        <div className="fm-socials">
          {SOCIAL_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-label={item.label}
              target="_blank"
              rel="noreferrer"
              className="fm-social-link"
            >
              {item.icon}
            </a>
          ))}
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
          <div>© {new Date().getFullYear()} CarsDedo - All rights reserved</div>
          <div className="fm-cin">CIN: U74999HR2019PTC077781</div>
        </div>

        <div className="fm-bottom-space" />
      </div>
    </footer>
  );
}
