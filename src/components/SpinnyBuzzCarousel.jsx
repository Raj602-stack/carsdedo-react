import React from "react";
import "../styles/SpinnyBuzzMob.css";

const buzzItems = [
  {
    id: 1,
    image: process.env.PUBLIC_URL + "/moneyback.png",
    tag: "AFAQS",
    title: "Sachin and Sara Tendulkar share bond with their dogs in new CarsDedo ad",
  },
  {
    id: 2,
    image: process.env.PUBLIC_URL + "/fixedprice.png",
    tag: "AFAQS",
    title: "CarsDedo celebrates December with new brand partnerships",
  },
  {
    id: 3,
    image: process.env.PUBLIC_URL + "/inspection.png",
    tag: "AUTO NEWS",
    title: "CarsDedo expands to new cities with premium services",
  },
];

export default function SpinnyBuzzCarousel() {
  return (
    <section className="buzz-section">
      <h2 className="buzz-title">CarsDedo Buzz</h2>

      <div className="buzz-viewport">
        <div className="buzz-track">
          {buzzItems.map((item) => (
            <div key={item.id} className="buzz-card">
              <div
                className="buzz-image"
                style={{ backgroundImage: `url(${item.image})` }}
              />

              <div className="buzz-overlay">
                <div className="buzz-tag">{item.tag} ›</div>
                <div className="buzz-text">{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
