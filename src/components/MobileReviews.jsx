import React from "react";
import "../styles/MobileReviews.css";

export default function MobileReviews() {
  const reviews = [
    {
      name: "Aftab Alam",
      avatar: "AA",
      time: "4 days ago",
      city: "Kolkata",
      rating: 5,
      text: `Today I sell my car in CarsDedo CC2 hub. 
I am very satisfied. Here all employees are very good.`,
    },
    {
      name: "Pradeep Sahoo",
      avatar: "PS",
      time: "4 days ago",
      city: "Hyderabad",
      rating: 5,
      text: `I recently sold my old car through CarsDedo. Obviously it was a nice experience in dealing with CarsDedo. The entire process was smooth, hassle-free, tran…`,
      long: true,
    },
    {
      name: "Sunny Agarwal",
      avatar: "SA",
      time: "4 days ago",
      city: "Gurgaon",
      rating: 5,
      text: `Kumar Raj was very helpful and completed the handover formalities smoothly.`,
    },
    {
      name: "Chaitali Bhise",
      avatar: "CB",
      time: "4 days ago",
      city: "Faridabad",
      rating: 5,
      text: `Its good experience not hustle & at good price great service`,
    }
  ];

  return (
    <div className="mr-root">

      {/* Header */}
      <h2 className="mr-title">User Reviews & Ratings</h2>

      <div className="mr-rating-box">
        <span className="mr-rating-value">4.9</span>
        <span className="mr-stars">★★★★★</span>
      </div>

      {reviews.map((r, i) => (
        <div key={i} className="mr-item">

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
          <p className="mr-text">{r.text}</p>

          {r.long && <button className="mr-readmore">Read more</button>}

          {/* Divider */}
          <div className="mr-divider" />
        </div>
      ))}
    </div>
  );
}
