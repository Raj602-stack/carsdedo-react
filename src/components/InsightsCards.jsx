import React from "react";
import "../styles/InsightsCards.css";

/**
 * InsightsCards
 *
 * Usage:
 *  <InsightsCards items={MY_ITEMS} />
 *
 * Each item: { id, value, label, description, icon: ReactNode, iconSrc: "/public/..." }
 * If both icon and iconSrc provided, icon (ReactNode) wins.
 */

const DEFAULT_ITEMS = [
  {
    id: "i1",
    value: "4.8/5",
    label: "Average rating",
    description: "Our average review rating on Google and on Social platforms",
    iconSrc: process.env.PUBLIC_URL + "/star.png",
  },
  {
    id: "i2",
    value: "35%",
    label: "Referrals",
    description: "The number of Spinny customers that are referrals",
    iconSrc: process.env.PUBLIC_URL + "/thirty.png",
  },
  {
    id: "i3",
    value: "> 70%",
    label: "Test drive conversion",
    description: "People who've become customers after their first test drive",
    iconSrc: process.env.PUBLIC_URL + "/sard.png",
  },
  {
    id: "i4",
    value: "32%",
    label: "Women quotient",
    description: "Our women customer quotient",
    iconSrc: process.env.PUBLIC_URL + "/wom.png",
  },
];

export default function InsightsCards({ items = DEFAULT_ITEMS }) {
  return (
    <section className="ic-section" aria-labelledby="insights-heading">
      <div className="ic-inner">
        <h2 id="insights-heading" className="ic-title">
          <span className="ic-rule" />
          Insights That Drive Us
          <span className="ic-rule" />
        </h2>

        <div className="ic-grid" role="list">
          {items.map((it) => (
            <article className="ic-card" key={it.id} role="listitem" aria-label={it.label}>
              <div className="ic-left">
                <div className="ic-icon">
                  {it.icon ? (
                    it.icon
                  ) : it.iconSrc ? (
                    <img src={it.iconSrc} alt="" aria-hidden="true" />
                  ) : (
                    <DefaultSVG />
                  )}
                </div>
              </div>

              <div className="ic-right">
                <div className="ic-value">{it.value}</div>
                <div className="ic-label">{it.label}</div>
                {it.description && <div className="ic-desc">{it.description}</div>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* small fallback inline svg */
function DefaultSVG() {
  return (
    <svg width="76" height="76" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="4" y="4" width="56" height="56" rx="10" stroke="rgba(255,255,255,0.18)" strokeWidth="1.8" />
      <circle cx="32" cy="24" r="10" fill="rgba(255,255,255,0.18)" />
      <rect x="20" y="38" width="24" height="6" rx="3" fill="rgba(255,255,255,0.18)" />
    </svg>
  );
}
