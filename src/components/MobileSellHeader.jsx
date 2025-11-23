import React from "react";
import "../styles/MobileSellHeader.css";

/**
 * MobileSellHeader - a compact header used only on the Sell flow mobile page.
 * Looks like your screenshot: slim topbar, brand left, help CTA on right.
 */
export default function MobileSellHeader({ onBack, onHelp }) {
  return (
    <header className="ms-header" role="banner">
      <div className="ms-left">
        <button className="ms-back" onClick={onBack} aria-label="Back">←</button>
        <img
          src={process.env.PUBLIC_URL + "/carsdedo-background.png"}
          alt="CarsDedo"
          className="ms-logo"
        />
      </div>

      <div className="ms-right">
        <button className="ms-help" onClick={onHelp} aria-label="Need help?">Need help?</button>
      </div>
    </header>
  );
}
