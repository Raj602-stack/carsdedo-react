import React, { useRef } from "react";
import "../styles/CarsAcrossCity.css"

/**
 * CarsAcrossCity
 * - hero background stays visually the same
 * - bottom location cards are horizontally swipeable (native scroll + scroll-snap)
 * - arrow buttons scroll by one card width (optional)
 *
 * Replace the image URLs with your public assets.
 */

const LOCATIONS = [
  {
    id: "l1",
    title: "carsdedo Park EDM, Ghaziabad",
    badge: "Wider selection",
    cars: "190+ cars",
    rating: "4.8",
    address: "Sector 18, Ghaziabad",
    img: process.env.PUBLIC_URL + "/slide2.png",
  },
  {
    id: "l2",
    title: "carsdedo Car Hub, Taj Vivan",
    badge: "Hub",
    cars: "120+ cars",
    rating: "4.6",
    address: "Taj Vihar, Delhi",
    img: process.env.PUBLIC_URL + "/slide2.png",
  },
  {
    id: "l3",
    title: "carsdedo Hub, Noida",
    badge: "Hub",
    cars: "80+ cars",
    rating: "4.7",
    address: "Sector 18, Noida",
    img: process.env.PUBLIC_URL + "/slide2.png",
  },
  // add more...
];

export default function CarsAcrossCity({
  heroImage = process.env.PUBLIC_URL + "/slide1.png",
  title = "Cars across Delhi",
}) {
  const listRef = useRef(null);

  const scrollByCard = (dir = 1) => {
    const el = listRef.current;
    if (!el) return;
    const card = el.querySelector(".cac-card");
    if (!card) return;
    const style = window.getComputedStyle(card);
    const gap = parseFloat(style.marginRight || 12);
    const cardWidth = Math.round(card.offsetWidth + gap);
    el.scrollBy({ left: cardWidth * dir, behavior: "smooth" });
  };

  return (
    <section className="cac-section" aria-label="Nearby car hubs">
      <div
        className="cac-hero"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="cac-hero-inner">
          <h2 className="cac-title">{title}</h2>
        </div>

        {/* horizontally scrolling cards placed at bottom of hero */}
        <div className="cac-cards-row">
          <button
            className="cac-arrow cac-left"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous"
          >
            ‹
          </button>

          <div
            className="cac-cards-viewport"
            ref={listRef}
            role="list"
            aria-label="Nearby hubs"
          >
            {LOCATIONS.map((loc) => (
              <article key={loc.id} className="cac-card" role="listitem">
                <div
                  className="cac-card-thumb"
                  style={{ backgroundImage: `url(${loc.img})` }}
                  aria-hidden="true"
                />
                <div className="cac-card-body">
                  <div className="cac-card-head">
                    <div className="cac-card-title">{loc.title}</div>
                    <div className="cac-card-badge">{loc.badge}</div>
                  </div>

                  <div className="cac-card-meta">
                    <span className="cac-rating">★ {loc.rating}</span>
                    <span className="cac-cars">{loc.cars}</span>
                  </div>

                  <div className="cac-card-addr">{loc.address}</div>
                </div>
              </article>
            ))}
          </div>

          <button
            className="cac-arrow cac-right"
            onClick={() => scrollByCard(1)}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>

      <div className="cac-cta-row">
        <button className="cac-view-all">View all cars in Delhi</button>
      </div>
    </section>
  );
}
