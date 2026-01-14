import React, { useEffect, useState } from "react";
import "../styles/MobileReviews.css";

export default function MobileReviews() {
  const [activeReview, setActiveReview] = useState(null);
  const CHAR_LIMIT = 140;

  const reviews = [
    {
      id: "aftab-alam",
      name: "Aftab Alam",
      avatar: "AA",
      time: "4 days ago",
      city: "Kolkata",
      rating: 5,
      fullText:
        "Today I sold my car in the CarsDedo CC2 hub. I am very satisfied. All employees are very good and the process was smooth and quick.",
    },
    {
      id: "pradeep-sahoo",
      name: "Pradeep Sahoo",
      avatar: "PS",
      time: "4 days ago",
      city: "Hyderabad",
      rating: 5,
      fullText:
        "I recently sold my old car through CarsDedo. Obviously it was a nice experience in dealing with CarsDedo. The entire process was smooth, hassle-free, transparent and a professional approach that made me very comfortable. I would strongly recommend CarsDedo to anyone planning to sell a car with complete peace of mind.",
    },
    {
      id: "sunny-agarwal",
      name: "Sunny Agarwal",
      avatar: "SA",
      time: "4 days ago",
      city: "Gurgaon",
      rating: 5,
      fullText:
        "Kumar Raj was very helpful and completed the handover formalities smoothly. The team was professional and responsive throughout.",
    },
    {
      id: "chaitali-bhise",
      name: "Chaitali Bhise",
      avatar: "CB",
      time: "4 days ago",
      city: "Faridabad",
      rating: 5,
      fullText:
        "It was a good experience, no hassle, and I got a good price. Great service overall.",
    }
  ];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setActiveReview(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const getPreview = (text) => {
    if (!text || text.length <= CHAR_LIMIT) return text;
    return `${text.slice(0, CHAR_LIMIT).trim()}...`;
  };

  return (
    <div className="mr-root">

      {/* Header */}
      <h2 className="mr-title">User Reviews & Ratings</h2>

      <div className="mr-rating-box">
        <span className="mr-rating-value">4.9</span>
        <span className="mr-stars">★★★★★</span>
      </div>

      {reviews.map((r) => {
        const fullText = r.fullText || "";
        const isLong = fullText.length > CHAR_LIMIT;
        const displayText = getPreview(fullText);

        return (
        <div key={r.id} className="mr-item">

          {/* Top row */}
          <div className="mr-top">
            <div className="mr-avatar">{r.avatar}</div>

            <div className="mr-info">
              <div className="mr-name">{r.name}</div>
              <div className="mr-meta">{r.time} | {r.city}</div>
            </div>

            <div className="mr-stars-right">★★★★★</div>
          </div>

          {/* Review text */}
          <p className="mr-text">
            {displayText}
          </p>

          {isLong && (
            <button
              className="mr-readmore"
              onClick={() => setActiveReview(r)}
              aria-label="Open full review"
            >
              View more
            </button>
          )}

          {/* Divider */}
          <div className="mr-divider" />
        </div>
      )})}

      {activeReview && (
        <div className="mr-modal-overlay" onClick={() => setActiveReview(null)}>
          <div
            className="mr-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mr-modal-header">
              <div className="mr-modal-name">{activeReview.name}</div>
              <button
                className="mr-modal-close"
                onClick={() => setActiveReview(null)}
                aria-label="Close review"
              >
                ✕
              </button>
            </div>
            <div className="mr-modal-meta">
              {activeReview.time} • {activeReview.city}
            </div>
            <div className="mr-modal-stars">★★★★★</div>
            <p className="mr-modal-text">{activeReview.fullText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
