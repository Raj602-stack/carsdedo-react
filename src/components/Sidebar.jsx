import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faRightToBracket, 
  faCar, 
  faDollarSign,
  faExchangeAlt,
  faPhone,
  faMobileAlt,
  faKey,
  faHeart,
  faUser
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  // close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleBodyTypeClick = (bodyType) => {
    navigate(`/buy?body=${bodyType}`);
    onClose();
  };

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
          {/* Quick Actions */}
          <div className="ml-quick-actions">
            <button 
              className="ml-quick-action-btn"
              onClick={() => handleNavigation("/sell")}
            >
              <FontAwesomeIcon icon={faKey} />
              <span>Sell</span>
            </button>
            <button 
              className="ml-quick-action-btn"
              onClick={() => handleNavigation("/buy")}
            >
              <FontAwesomeIcon icon={faCar} />
              <span>Buy</span>
            </button>
            <button 
              className="ml-quick-action-btn"
              onClick={() => handleNavigation("/wishlist")}
            >
              <FontAwesomeIcon icon={faHeart} />
              <span>Wishlist</span>
            </button>
            <button 
              className="ml-quick-action-btn"
              onClick={() => handleNavigation("/account")}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>Account</span>
            </button>
          </div>

          {/* Login / Signup */}
          <button 
            className="ml-sidebar-login"
            onClick={() => handleNavigation("/login")}
          >
            <FontAwesomeIcon icon={faRightToBracket} className="ml-login-icon" />
            <span>Login / Signup</span>
            <span className="ml-chevron">›</span>
          </button>

          {/* BUY section */}
          <div className="ml-section">
            <h4>Buy Cars</h4>

            <p className="ml-section-subtitle">Shop by Category</p>
            <div className="ml-categories">
              <button 
                className="ml-cat"
                onClick={() => handleNavigation("/buy?price=20+")}
              >
                <img src={process.env.PUBLIC_URL + "/lux.png"} alt="Luxury" />
                <div className="ml-cat-label">Luxury cars</div>
              </button>
              <button 
                className="ml-cat"
                onClick={() => handleNavigation("/buy")}
              >
                <img src={process.env.PUBLIC_URL + "/assured.png"} alt="Premium" />
                <div className="ml-cat-label">Premium benefits</div>
              </button>
              <button 
                className="ml-cat"
                onClick={() => handleNavigation("/buy")}
              >
                <img src={process.env.PUBLIC_URL + "/assuredd.png"} alt="Quality" />
                <div className="ml-cat-label">Quality cars</div>
              </button>
              <button 
                className="ml-cat"
                onClick={() => handleNavigation("/buy?price=under-5")}
              >
                <img src={process.env.PUBLIC_URL + "/budget.png"} alt="Budget" />
                <div className="ml-cat-label">Value picks</div>
              </button>
            </div>

            <p className="ml-section-subtitle">By Body Type</p>
            <div className="ml-bodytypes">
              <button 
                className="ml-body-item"
                onClick={() => handleBodyTypeClick("SUV")}
              >
                <img src={process.env.PUBLIC_URL + "/suvsidebar.png"} alt="SUV" />
                <div>SUV</div>
              </button>
              <button 
                className="ml-body-item"
                onClick={() => handleBodyTypeClick("MPV")}
              >
                <img src={process.env.PUBLIC_URL + "/muvsidebar.png"} alt="MUV" />
                <div>MUV</div>
              </button>
              <button 
                className="ml-body-item"
                onClick={() => handleBodyTypeClick("Hatchback")}
              >
                <img src={process.env.PUBLIC_URL + "/sedanside.png"} alt="Hatchback" />
                <div>Hatchback</div>
              </button>
              <button 
                className="ml-body-item"
                onClick={() => handleBodyTypeClick("Sedan")}
              >
                <img src={process.env.PUBLIC_URL + "/sed.png"} alt="Sedan" />
                <div>Sedan</div>
              </button>
            </div>

            <button 
              className="ml-view-all"
              onClick={() => handleNavigation("/buy")}
            >
              View all cars ›
            </button>
          </div>

          {/* SELL section */}
          <div className="ml-section">
            <h4>Sell Your Car</h4>
            <div className="ml-links">
              <button onClick={() => handleNavigation("/sell")}>
                <FontAwesomeIcon icon={faCar} />
                <span>Sell car</span>
                <span className="ml-chevron">›</span>
              </button>
              <button onClick={() => handleNavigation("/sell")}>
                <FontAwesomeIcon icon={faCar} />
                <span>Scrap car</span>
                <span className="ml-chevron">›</span>
              </button>
              <button onClick={() => handleNavigation("/sell")}>
                <FontAwesomeIcon icon={faCar} />
                <span>Car valuation</span>
                <span className="ml-chevron">›</span>
              </button>
            </div>
          </div>

          {/* Finance & Exchange */}
          <div className="ml-section">
            <h4>Services</h4>
            <div className="ml-links">
              <button onClick={() => handleNavigation("/buy")}>
                <FontAwesomeIcon icon={faDollarSign} />
                <span>Finance</span>
                <span className="ml-chevron">›</span>
              </button>
              <button onClick={() => handleNavigation("/buy")}>
                <FontAwesomeIcon icon={faExchangeAlt} />
                <span>Exchange</span>
                <span className="ml-badge">NEW</span>
                <span className="ml-chevron">›</span>
              </button>
            </div>
          </div>

          {/* CTA Row */}
          <div className="ml-cta-row">
            <button 
              className="ml-help"
              onClick={() => window.location.href = "tel:7277277275"}
            >
              <div className="ml-help-icon">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div className="ml-help-content">
                <div className="ml-help-small">Need Help?</div>
                <div className="ml-help-phone">Call us at 727-727-7275</div>
              </div>
              <span className="ml-chevron">›</span>
            </button>

            <button className="ml-download-app">
              <FontAwesomeIcon icon={faMobileAlt} className="ml-app-icon" />
              <span>Get the CarsDedo App</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
