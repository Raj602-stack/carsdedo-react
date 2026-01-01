import React, { forwardRef } from "react";
import "../styles/featuresmob.css";
import { useNavigate } from "react-router-dom";

const FEATURES = {
  "Entertainment & Communication": [
    { label: "Integrated (in-dash) music system" }
  ],
  Exterior: [
    { label: "Rear defogger", info: true }
  ],
  Safety: [
    { label: "Parking sensors", info: true },
    { label: "Engine immobilizer", info: true }
  ],
  "Comfort & Convenience": [
    { label: "Adjustable ORVM" },
    { label: "Glove box cooling", info: true },
    { label: "Power windows", info: true },
    { label: "Power steering" },
    { label: "One touch-down power windows - Driver", info: true }
  ]
};

const Features = forwardRef(function Features(_, ref) {
  const navigate = useNavigate();

  return (
    <section className="features-card" ref={ref}>
      <h2 className="features-title">Top Features</h2>

      {Object.entries(FEATURES).map(([category, items]) => (
        <div key={category} className="feature-group">
          <div className="feature-group-title">{category}</div>

          {items.map((item, idx) => (
            <div key={idx} className="feature-item">
              <span className="feature-check">✓</span>

              <span className="feature-label">{item.label}</span>

              {item.info && (
                <button className="feature-info">i</button>
              )}
            </div>
          ))}
        </div>
      ))}

      <button
        className="view-all-features"
        onClick={() => {
          const el = document.querySelector("main.cd-main");
          if (el) sessionStorage.setItem("cd_main_scroll", el.scrollTop);
          navigate("/features");
        }}
      >
        View all features
      </button>
    </section>
  );
});

export default Features;
