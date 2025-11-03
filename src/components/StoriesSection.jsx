import React, { useEffect, useState } from "react";
import "../styles/StoriesSection.css";

const STORIES = [
  {
    id: "s1",
    image: process.env.PUBLIC_URL + "/moneyback.png",
    name: "Ayush Srivastava",
    city: "Lucknow",
    text: "Our first car that we'd truly love for years to come.",
  },
  {
    id: "s2",
    image: process.env.PUBLIC_URL + "/fixedprice.png",
    name: "Darshan",
    city: "Delhi",
    text: "Our family had our hearts set on XUV 700. When we saw it on CarsDedo, we got it home instantly.",
  },
  {
    id: "s3",
    image: process.env.PUBLIC_URL + "/warranty.png",
    name: "Madhulika Singh",
    city: "Lucknow",
    text: "CarsDedo helped us find a family car that's perfect for daily commutes and long trips.",
  },
  {
    id: "s4",
    image: process.env.PUBLIC_URL + "/stories/s4.jpg",
    name: "Pazhaniappan",
    city: "Chennai",
    text: "Being able to buy a safe and affordable car was a big win for us.",
  },
];

function useVisibleCount() {
  const [count, setCount] = useState(getCount(window.innerWidth));
  useEffect(() => {
    const handleResize = () => setCount(getCount(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return count;

  function getCount(width) {
    if (width <= 600) return 1;
    if (width <= 1000) return 2;
    return 3;
  }
}

export default function StoriesSection() {
  const visibleCount = useVisibleCount();
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, STORIES.length - visibleCount);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(i + 1, maxIndex));

  return (
    <section className="stories-section">
      <div className="stories-inner">
        <h2 className="stories-title">
          <span className="rule" />
          Over 2 Lakh CarsDedo Love Stories
          <span className="rule" />
        </h2>

        <div className="stories-wrapper">
          <button
            className="stories-arrow left"
            onClick={prev}
            disabled={index === 0}
          >
            ‹
          </button>

          <div className="stories-viewport">
            <div
              className="stories-track"
              style={{
                transform: `translateX(-${index * (100 / visibleCount)}%)`,
                width: `${(STORIES.length * 100) / visibleCount}%`,
              }}
            >
              {STORIES.map((story) => (
                <div
                  key={story.id}
                  className="story-card"
                  style={{ backgroundImage: `url(${story.image})` }}
                >
                  {/* ✅ CarsDedo logo at top-right */}
                  <img
                    src={process.env.PUBLIC_URL + "/shortlogoo.png"}
                    alt="CarsDedo logo"
                    className="story-logo"
                  />

                  <div className="story-overlay" />
                  <div className="story-footer">
                    <div className="story-meta">
                      <div className="story-name">
                        {/* 🚗 small cool icon before name */}
                        <span className="story-icon">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
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
                        </span>

                        {story.name} <span className="sep">|</span>{" "}
                        <span className="city">{story.city}</span>
                      </div>
                      <div className="story-text">{story.text}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="stories-arrow right"
            onClick={next}
            disabled={index >= maxIndex}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
