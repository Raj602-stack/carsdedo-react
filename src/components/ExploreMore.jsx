import React from "react";
import "../styles/ExploreMore.css";

export default function ExploreMore() {
  return (
    <section className="explore-more-section">
      <div className="explore-more-inner">
        <h2 className="explore-more-title">
          <span className="rule" />
          Explore More
          <span className="rule" />
        </h2>

        <div className="explore-more-grid">
          <PromoCard
            title="Loan"
            subtitle="Get your car financed today"
            cta="Check eligibility"
            imagePath={process.env.PUBLIC_URL + "/paisa.png"}
            variant="loan"
            onClick={() => console.log("Open Loan eligibility")}
          />

          <PromoCard
            title="Buyback"
            subtitle="Commit less, drive more"
            cta="Explore buyback"
            imagePath={process.env.PUBLIC_URL + "/buyback.png"}
            variant="buyback"
            onClick={() => console.log("Open Buyback")}
          />
        </div>
      </div>
    </section>
  );
}

function PromoCard({ title, subtitle, cta, imagePath, variant = "loan", onClick }) {
  return (
    <article
      className={`promo-card promo-${variant}`}
      role="region"
      aria-labelledby={`${variant}-title`}
      style={{
        backgroundImage: `url(${imagePath})`,
      }}
    >
      <div className="promo-overlay"></div>

      {/* Card Content */}
      <div className="promo-content">
        <div id={`${variant}-title`} className="promo-title">
          {title}
        </div>
        <div className="promo-sub">{subtitle}</div>
      </div>

      <div className="promo-cta-wrap">
        <button className="promo-cta" onClick={onClick}>
          {cta}
        </button>
      </div>
    </article>
  );
}
