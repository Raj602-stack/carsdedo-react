/* eslint-disable react-hooks/exhaustive-deps */
/**
 * src/components/StoryCarousel.jsx
 *
 * Self-contained Story carousel:
 * - auto-advance every 3s
 * - pause on hover/touch
 * - progress bar at top
 * - delivery SVG icon shown before the customer's name (inlined)
 *
 * Make sure StoryCarousel.css exists and is imported by your app.
 */

import React, { useEffect, useRef, useState } from "react";
import "../styles/StoryCarousel.css";

/* Inline DeliveryIcon component (from the SVG you provided) */
function DeliveryIcon({ className, style }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 13l2-5h14l2 5v5H3v-5z"
        stroke="#f04438"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="18" r="1.2" fill="#f04438" />
      <circle cx="17" cy="18" r="1.2" fill="#f04438" />
    </svg>
  );
}

export default function StoryCarousel() {
  const slides = [
    {
      id: "s1",
      image: process.env.PUBLIC_URL + "/fixedprice.png",
      avatar: process.env.PUBLIC_URL + "/shortlogoo.png",
      name: "Madhulika Singh",
      place: "Lucknow",
      caption:
        "Spinny helped us find a family car that's great for daily commutes and long trips",
    },
    {
      id: "s2",
      image: process.env.PUBLIC_URL + "/moneyback.png",
      avatar: process.env.PUBLIC_URL + "/shortlogoo.png",
      name: "Ravi Kumar",
      place: "Delhi",
      caption: "Excellent process, car delivery was smooth and on time",
    },
    {
      id: "s3",
      image: process.env.PUBLIC_URL + "/inspection.png",
      avatar: process.env.PUBLIC_URL + "/shortlogoo.png",
      name: "Sneha Sharma",
      place: "Bengaluru",
      caption: "Good inspection, transparent pricing — highly recommended",
    },
  ];

  const AUTOPLAY_MS = 3000;
  const [index, setIndex] = useState(0);
  const playingRef = useRef(true);
  const timerRef = useRef(null);

  useEffect(() => {
    startTimer();
    return stopTimer;
    // we intentionally don't include startTimer/stopTimer in deps
  }, [index]);

  function startTimer() {
    stopTimer();
    if (!playingRef.current) return;
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function handleMouseEnter() {
    playingRef.current = false;
    stopTimer();
  }

  function handleMouseLeave() {
    playingRef.current = true;
    startTimer();
  }

  function handleTouchStart() {
    playingRef.current = false;
    stopTimer();
  }
  function handleTouchEnd() {
    playingRef.current = true;
    startTimer();
  }

  function goTo(i) {
    setIndex(i);
  }

  return (
    <section
      className="sc-root"
      aria-roledescription="carousel"
      aria-label="Customer stories"
    >
      {/* progress segments */}
      <div className="sc-progress">
        {slides.map((s, i) => (
          <div key={s.id} className="sc-progress-seg" aria-hidden>
            <div
              className={`sc-progress-fill ${i === index ? "active" : ""}`}
              style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
            />
          </div>
        ))}
      </div>

      {/* slide area */}
      <div
        className="sc-slide"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${slides.length}`}
        style={{
          backgroundImage: `url(${slides[index].image})`,
        }}
      >
        <div className="sc-overlay" />

        <div className="sc-top-left">
          <img src={slides[index].avatar} alt="" className="sc-badge" />
          <span className="sc-badge-text">mycarsdedo</span>
        </div>

        <div className="sc-bottom">
          <div className="sc-meta">
            <div className="sc-meta-left" style={{ alignItems: "center" }}>
              {/* Delivery icon shown before the name */}
              <DeliveryIcon style={{ marginRight: 8 }} />

              <div className="sc-name" aria-hidden={false}>
                <strong>{slides[index].name}</strong>
                <span className="sc-place"> | {slides[index].place}</span>
              </div>
            </div>

            <div className="sc-caption">{slides[index].caption}</div>
          </div>
        </div>
      </div>

      {/* small clickable dots */}
      <div className="sc-dots" role="tablist" aria-label="Slides">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`sc-dot ${i === index ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-pressed={i === index}
          />
        ))}
      </div>
    </section>
  );
}
