import React from "react";
import "../styles/Footer.css";

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

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-inner">
          <div className="footer-brand">
            <img
              src={process.env.PUBLIC_URL + "/carsdedo-background.png"}
              alt="CarsDedo"
              className="footer-logo"
            />

            <p className="footer-desc">
              CarsDedo is the most trusted way of buying and selling used cars. Choose from hundreds of
              fully inspected pre-owned car models. Select online and book a test drive at your home or
              at a CarsDedo Hub near you.
            </p>

            <div className="footer-social">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>About</h4>
              <a href="/buy">Buy cars</a>
              <a href="/sell">Sell your car</a>
              <a href="/blog">Blog</a>
              <a href="/account">Account</a>
            </div>

            <div className="footer-col">
              <h4>Popular cities</h4>
              <a href="/buy">Delhi NCR</a>
              <a href="/buy">Hyderabad</a>
              <a href="/buy">Pune</a>
              <a href="/buy">Mumbai</a>
              <a href="/buy">Jaipur</a>
            </div>

            <div className="footer-col">
              <h4>Support</h4>
              <a href="/terms">Terms</a>
              <a href="/privacy">Privacy</a>
              <a href="/contact">Contact</a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div className="footer-actions">
            <a className="footer-btn primary" href="tel:7277277275">
              <i className="fa-solid fa-phone"></i> 727-727-7275
            </a>
            <a className="footer-btn outline" href="/sell#quote">
              Get Instant Quotes
            </a>
            <a className="footer-btn outline" href="/buy">
              Browse Cars
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
