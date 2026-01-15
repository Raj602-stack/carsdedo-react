import React, { useEffect, useState } from "react";
import "../styles/MobileReviews.css";

export default function MobileReviews() {
  const [activeReview, setActiveReview] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const CHAR_LIMIT = 140;
  const INITIAL_DISPLAY = 6;

  const reviews = [
    {
      id: "aftab-alam",
      name: "Aftab Alam",
      avatar: "AA",
      time: "17 Nov 2025",
      city: "Kolkata",
      rating: 5,
      fullText:
        "Today I sold my car in the CarsDedo CC2 hub. I am very satisfied. All employees are very good and the process was smooth and quick. The transaction was professional and the staff explained all documents clearly. I recommend them to everyone who wants a hassle free experience.",
    },
    {
      id: "pradeep-sahoo",
      name: "Pradeep Sahoo",
      avatar: "PS",
      time: "17 Nov 2025",
      city: "Hyderabad",
      rating: 5,
      fullText:
        "I recently sold my old car through CarsDedo. Obviously it was a nice experience in dealing with CarsDedo. The entire process was smooth, hassle-free, transparent and a professional approach that made me very comfortable. I would strongly recommend CarsDedo to anyone planning to sell a car with complete peace of mind.",
    },
    {
      id: "sunny-agarwal",
      name: "Sunny Agarwal",
      avatar: "SA",
      time: "16 Nov 2025",
      city: "Gurgaon",
      rating: 5,
      fullText:
        "Kumar Raj was very helpful and completed the handover formalities smoothly. The team was professional and responsive throughout. They gave me a fair price and the payment was instant. Great experience overall.",
    },
    {
      id: "chaitali-bhise",
      name: "Chaitali Bhise",
      avatar: "CB",
      time: "15 Nov 2025",
      city: "Faridabad",
      rating: 5,
      fullText:
        "It was a good experience, no hassle, and I got a good price. Great service overall. The inspection was thorough and fair, and they handled all the paperwork efficiently.",
    },
    {
      id: "rajesh-kumar",
      name: "Rajesh Kumar",
      avatar: "RK",
      time: "14 Nov 2025",
      city: "Mumbai",
      rating: 5,
      fullText:
        "Excellent service from start to finish. The valuation was fair and transparent. The team was professional and courteous. They made selling my car a breeze. Highly recommended for anyone looking to sell their vehicle quickly and at a good price.",
    },
    {
      id: "neha-sharma",
      name: "Neha Sharma",
      avatar: "NS",
      time: "13 Nov 2025",
      city: "Bangalore",
      rating: 4,
      fullText:
        "Very smooth transaction. The pickup was on time and the payment was quick. The only minor issue was a small delay in documentation but overall a great experience. Would definitely use CarsDedo again.",
    },
    {
      id: "amit-patel",
      name: "Amit Patel",
      avatar: "AP",
      time: "12 Nov 2025",
      city: "Pune",
      rating: 5,
      fullText:
        "I was skeptical at first but CarsDedo exceeded my expectations. The price offered was better than other platforms. The entire process took less than a week and the staff was helpful throughout. Thumbs up!",
    },
    {
      id: "priya-reddy",
      name: "Priya Reddy",
      avatar: "PR",
      time: "11 Nov 2025",
      city: "Chennai",
      rating: 5,
      fullText:
        "CarsDedo made selling my car so easy. The online valuation was accurate and the final offer matched. The inspection was professional and they picked up the car from my home. Payment was transferred the same day. Fantastic service!",
    },
    {
      id: "vikram-singh",
      name: "Vikram Singh",
      avatar: "VS",
      time: "10 Nov 2025",
      city: "Delhi",
      rating: 4,
      fullText:
        "Good service and fair pricing. The staff was knowledgeable and answered all my questions patiently. The paperwork was handled efficiently. A minor delay in RC transfer but they kept me informed throughout.",
    },
    {
      id: "anita-desai",
      name: "Anita Desai",
      avatar: "AD",
      time: "9 Nov 2025",
      city: "Jaipur",
      rating: 5,
      fullText:
        "Best platform to sell your car! I got a great price and the entire process was transparent. No hidden charges or last-minute deductions. The team was professional and the payment was instant. I would highly recommend CarsDedo to everyone.",
    },
    {
      id: "rohan-mehta",
      name: "Rohan Mehta",
      avatar: "RM",
      time: "8 Nov 2025",
      city: "Ahmedabad",
      rating: 5,
      fullText:
        "I sold my 7-year-old sedan through CarsDedo and was pleasantly surprised by the offer. The inspection was detailed and fair. They handled all the documentation and the RC transfer. Very happy with the service!",
    },
    {
      id: "kavita-nair",
      name: "Kavita Nair",
      avatar: "KN",
      time: "7 Nov 2025",
      city: "Kochi",
      rating: 4,
      fullText:
        "Overall a positive experience. The valuation was fair and the process was straightforward. The pickup was convenient and payment was quick. Would recommend to friends and family looking to sell their cars.",
    },
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

  const displayedReviews = showAll ? reviews : reviews.slice(0, INITIAL_DISPLAY);

  return (
    <div className="mr-root">

      {/* Header */}
      <h2 className="mr-title">User Reviews & Ratings</h2>

      <div className="mr-rating-box">
        <span className="mr-rating-value">4.9</span>
        <span className="mr-stars">★★★★★</span>
      </div>

      {displayedReviews.map((r) => {
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
            {isLong && (
              <>
                {" "}
                <button
                  className="mr-readmore"
                  onClick={() => setActiveReview(r)}
                  aria-label="Open full review"
                >
                  View more
                </button>
              </>
            )}
          </p>

          {/* Divider */}
          <div className="mr-divider" />
        </div>
      )})}

      {/* View More Reviews Button */}
      {!showAll && reviews.length > INITIAL_DISPLAY && (
        <div className="mr-view-all-wrap">
          <button
            className="mr-view-all-btn"
            onClick={() => setShowAll(true)}
          >
            View more reviews
          </button>
        </div>
      )}

      {activeReview && (
        <div className="mr-modal-overlay" onClick={() => setActiveReview(null)}>
          <div
            className="mr-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mr-modal-header">
              <h3 className="mr-modal-name">{activeReview.name}</h3>
              <button
                className="mr-modal-close"
                onClick={() => setActiveReview(null)}
                aria-label="Close review"
              >
                ✕
              </button>
            </div>
            <div className="mr-modal-body">
              <div className="mr-modal-meta">
                {activeReview.time} | {activeReview.city}
              </div>
              <div className="mr-modal-stars"></div>
              <p className="mr-modal-text">{activeReview.fullText}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
