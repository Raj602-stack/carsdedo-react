import React from "react";
import "../styles/ExploreMoreCards.css";

/**
 * ExploreMoreCards
 * - Native horizontal scrolling + scroll-snap for smooth mobile swiping.
 * - Cards have purple hero area and red CTA at the bottom to match your design.
 * - Pass `items` prop to customize; defaults provided.
 */
const DEFAULT_ITEMS = [
  {
    id: 1,
    title: "Loan",
    subtitle: "Get your car financed today",
    bg: process.env.PUBLIC_URL + "/paisa.png", // optional bg image
    icon: process.env.PUBLIC_URL + "/shortlogoo.png",
    cta: "Check eligibility",
  },
  {
    id: 2,
    title: "Buyback",
    subtitle: "Commit less, drive more",
    bg: process.env.PUBLIC_URL + "/buyback.png",
    icon: process.env.PUBLIC_URL + "/shortlogoo.png",
    cta: "Explore buyback",
  },
  {
    id: 3,
    title: "Exchange",
    subtitle: "Change is good. With us, it’s great",
    bg: process.env.PUBLIC_URL + "/exchange.png",
    icon: process.env.PUBLIC_URL + "/shortlogoo.png",
    cta: "Get exchange price",
  },
];

export default function ExploreMoreCards({ items = DEFAULT_ITEMS }) {
  return (
    <section className="em-section" aria-label="Explore more services">
      <div className="em-inner">
        <h2 className="em-title">Explore More</h2>

        <div className="em-viewport" role="list">
          {items.map((it) => (
            <article
              key={it.id}
              role="listitem"
              className="em-card"
              style={{
                backgroundImage: it.bg ? `url(${it.bg})` : undefined,
              }}
            >
              <div className="em-card-hero">
                {it.icon && (
                  <img src={it.icon} alt="" aria-hidden className="em-card-icon" />
                )}
                <div className="em-card-headline">
                  <div className="em-card-title">{it.title}</div>
                  <div className="em-card-sub">{it.subtitle}</div>
                </div>
              </div>

              <div className="em-card-cta-wrap">
                <button className="em-card-cta" type="button">
                  {it.cta}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
