import React from "react";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Left column */}
        <div className="footer-brand">
          <img
            src={process.env.PUBLIC_URL + "/carsdedo-background.png"}
            alt="CarsDedo"
            className="footer-logo"
          />

          <p className="footer-desc">
            CarsDedo is the most trusted way of buying and selling used cars. Choose from hundreds of
            fully inspected pre-owned car models. Select online and book a test drive at your home or
            at a CarsDedo Hub near you. Get a no-questions-asked 5-day return and a 1-year warranty
            on every certified CarsDedo car.
          </p>

          <div className="footer-social">
            <a href="#" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>

          <p className="footer-copy">
            © 2025 CarsDedo Technologies Pvt. Ltd. All rights reserved. <br />
            CIN: U74999HR2019PTC077781
          </p>
        </div>

        {/* Right columns */}
        <div className="footer-links">
          <div className="footer-col">
            <h4>ABOUT</h4>
            <a href="#">Who we are</a>
            <a href="#">FAQ’s</a>
            <a href="#">How It Works</a>
            <a href="#">Customer Reviews</a>
            <a href="#">Careers</a>
            <a href="#">Contact Us</a>
          </div>

          <div className="footer-col">
            <h4>BUY USED CARS IN</h4>
            <a href="#">Delhi NCR</a>
            <a href="#">Lucknow</a>
            <a href="#">Hyderabad</a>
            <a href="#">Pune</a>
            <a href="#">Mumbai</a>
            <a href="#">Jaipur</a>
          </div>

          <div className="footer-col">
            <h4>SERVICES</h4>
            <a href="#">Car Loan</a>
            <a href="#">Car Insurance</a>
            <a href="#">Car Servicing</a>
            <a href="#">Car Wash</a>
            <a href="#">Buyback Program</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <button className="footer-btn primary">
          <i className="fa-solid fa-phone"></i> 727-727-7275
        </button>
        <button className="footer-btn outline">Get Instant Quotes</button>
        <button className="footer-btn outline">Browse Cars</button>
      </div>
    </footer>
  );
}
