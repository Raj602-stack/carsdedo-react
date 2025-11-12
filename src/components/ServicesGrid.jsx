// components/ServicesGrid.jsx
import React from "react";
import "../styles/MobileCards.css";

/**
 * services: array of { id, title, icon } where icon is a path to image
 */
export default function ServicesGrid({
  services = [
    { id: "s1", title: "Periodic Services", icon: process.env.PUBLIC_URL + "/icons/calendar.png" },
    { id: "s2", title: "Car Wash & Detailing", icon: process.env.PUBLIC_URL + "/icons/wash.png" },
    { id: "s3", title: "Car Scan & Inspect", icon: process.env.PUBLIC_URL + "/icons/inspect.png" },
  ],
  onSeeAll = () => alert("See all services"),
}) {
  return (
    <div className="mc-card mc-services">
      <div className="mc-services-header">
        <h4 className="mc-services-title">Car Services in delhi</h4>
        <div className="mc-services-sub">Tailored for the <span className="mc-fine">finest</span> experience</div>
      </div>

      <div className="mc-services-grid">
        {services.map((s) => (
          <div className="mc-service" key={s.id} role="button" tabIndex={0}>
            <div className="mc-service-box">
              <img src={s.icon} alt="" className="mc-service-icon" />
            </div>
            <div className="mc-service-label">{s.title}</div>
          </div>
        ))}

        {/* See all tile */}
        <div className="mc-service mc-seeall" onClick={onSeeAll} role="button" tabIndex={0}>
          <div className="mc-service-box mc-seeall-box">›</div>
          <div className="mc-service-label">See all</div>
        </div>
      </div>
    </div>
  );
}
