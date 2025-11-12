import React, { useEffect } from "react";
import "../styles/Sidebar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";


export default function Sidebar({ open, onClose }) {
  // close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`ml-sidebar-overlay ${open ? "visible" : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`ml-sidebar ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
      >
        <div className="ml-sidebar-header">
          <div className="ml-sidebar-brand">
            <img src={process.env.PUBLIC_URL + "/carsdedo-background.png"} alt="CarsDedo" />
          </div>

          <button className="ml-sidebar-close" onClick={onClose} aria-label="Close menu">✕</button>
        </div>

        <div className="ml-sidebar-scroll">
          {/* Login / Signup */}
          <button className="ml-sidebar-login">
          <FontAwesomeIcon icon={faRightToBracket} className="ml-login-icon" />
            <span>Login / Signup</span>
            <span className="ml-chevron">›</span>
          </button>

          {/* BUY section */}
          <div className="ml-section">
            <h4>Buy</h4>


            <p className="para">By Body Type</p>
            <div className="ml-categories">
              {/* each category: image + label */}
              <div className="ml-cat">
                <img src={process.env.PUBLIC_URL + "/lux.png"} alt="Max" />
                <div className="ml-cat-label">Luxury cars</div>
              </div>
              <div className="ml-cat">
                <img src={process.env.PUBLIC_URL + "/assured.png"} alt="Assured+" />
                <div className="ml-cat-label">Premium benefits</div>
              </div>
              <div className="ml-cat">
                <img src={process.env.PUBLIC_URL + "/assuredd.png"} alt="Assured" />
                <div className="ml-cat-label">Quality cars</div>
              </div>
              <div className="ml-cat">
                <img src={process.env.PUBLIC_URL + "/budget.png"} alt="Budget" />
                <div className="ml-cat-label">Value picks</div>
              </div>
            </div>

            {/* By body type row */}

            <p className="para">By Body Type</p>
            <div className="ml-bodytypes">
              <div className="ml-body-item">
                <img src={process.env.PUBLIC_URL + "/suvsidebar.png"} alt="SUV" />
                <div>SUV</div>
              </div>
              <div className="ml-body-item">
                <img src={process.env.PUBLIC_URL + "/muvsidebar.png"} alt="MUV" />
                <div>MUV</div>
              </div>
              <div className="ml-body-item">
                <img src={process.env.PUBLIC_URL + "/sedanside.png"} alt="Hatchback" />
                <div>Hatchback</div>
              </div>
              <div className="ml-body-item">
                <img src={process.env.PUBLIC_URL + "sed.png"} alt="Sedan" />
                <div>Sedan</div>
              </div>
            </div>

            <button className="ml-view-all">View all cars ›</button>
          </div>

          {/* SELL section */}
          <div className="ml-section">
            <h4>SELL</h4>
            <ul className="ml-links">
              <li><a href="/sell">Sell car</a></li>
              <li><a href="/scrap">Scrap car</a></li>
              <li><a href="/valuation">Car valuation</a></li>
            </ul>
          </div>

          {/* More sections: Finance, Exchange */}
          <div className="ml-section">
            <ul className="ml-links">
              <li><a href="/finance">Finance</a></li>
              <li><a href="/exchange">Exchange <span className="ml-badge">NEW</span></a></li>
            </ul>
          </div>

          <div className="ml-cta-row">
            <div className="ml-help">
              <div className="ml-help-icon">📞</div>
              <div>
                <div className="ml-help-small">Need Help?</div>
                <a href="tel:7277277275" className="ml-help-phone">Call us at 727-727-7275</a>
              </div>
              <span className="ml-chevron">›</span>
            </div>

            <button className="ml-download-app">
              <img src={process.env.PUBLIC_URL + "/icons/apple.svg"} alt="" />
              <span>Get the CarsDedo App</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
