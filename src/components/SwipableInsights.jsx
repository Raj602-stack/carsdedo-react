import React, { useRef, useEffect, useState } from "react";
import "../styles/SwipableInsights.css";

/**
 * SwipableInsights
 * - Mobile-first horizontal swipable cards
 * - Uses native scrolling + scroll-snap for smooth behaviour on mobile
 * - Dots reflect the currently visible card
 *
 * Replace icons/images in `cards` as needed (public folder paths used).
 */
export default function SwipableInsights() {
  const cards = [
    {
      id: "i1",
      icon: process.env.PUBLIC_URL + "/star.png",
      big: "4.8/5",
      text: "Our average review rating on Google and on Social platforms",
      bg: "#BFB7FF", // optional per-card tint
    },
    {
      id: "i2",
      icon: process.env.PUBLIC_URL + "/thirty.png",
      big: "35%",
      text: "The number of CarsDedo customers that are referrals",
      bg: "#BFB7FF",
    },
    {
      id: "i3",
      icon: process.env.PUBLIC_URL + "/sard.png",
      big: "> 70%",
      text: "People who've become customers after their first test drive",
      bg: "#BFB7FF",
    },
    {
      id: "i4",
      icon: process.env.PUBLIC_URL + "/wom.png",
      big: "32%",
      text: "Our women customer quotient",
      bg: "#BFB7FF",
    },
  ];

  const viewportRef = useRef(null);
  const [active, setActive] = useState(0);

  // update active index while user scrolls
  useEffect(() => {
    if (!viewportRef.current) return;
    const el = viewportRef.current;

    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.firstElementChild
        ? el.firstElementChild.getBoundingClientRect().width + // width
          parseFloat(getComputedStyle(el.firstElementChild).marginRight || 0)
        : el.clientWidth;
      // calculate index with rounding to nearest integer
      const idx = Math.round(scrollLeft / (cardWidth || el.clientWidth));
      setActive(Math.min(Math.max(idx, 0), cards.length - 1));
    };

    // run once to set initial active
    onScroll();

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [cards.length]);

  // helper to programmatically snap to a card (used if you want prev/next)
  const goTo = (i) => {
    const el = viewportRef.current;
    if (!el) return;
    const card = el.children[i];
    if (!card) return;
    const left = card.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft || 0);
    el.scrollTo({ left, behavior: "smooth" });
  };

  return (
    <section className="si-section" aria-label="Insights that drive us">
      <h3 className="si-heading">Insights That Drive Us</h3>

      <div className="si-viewport-wrap">
        <div className="si-viewport" ref={viewportRef}>
          {cards.map((c, i) => (
            <article
              key={c.id}
              className="si-card"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${cards.length}`}
              style={{ backgroundColor: c.bg }}
            >
              <div className="si-card-inner">
                <div className="si-icon-wrap">
                  <img src={c.icon} alt="" className="si-icon" />
                </div>

                <div className="si-text-wrap">
                  <div className="si-big">{c.big}</div>
                  <div className="si-desc">{c.text}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="si-dots" role="tablist" aria-label="Slide navigation">
        {cards.map((_, i) => (
          <button
            key={i}
            className={`si-dot ${i === active ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-pressed={i === active}
          />
        ))}
      </div>
    </section>
  );
}
