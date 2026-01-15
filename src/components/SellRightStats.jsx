import React from "react";
import { FiTrendingUp, FiStar, FiMapPin } from "react-icons/fi";
import "../styles/SellRightStats.css";

// NOTE: the image file you uploaded is referenced below.
// On your environment this path should be served (dev server / static folder).
const LOGO_SRC = "/mnt/data/3b5846bf-7b01-4100-a592-b0d1af7a696b.png";

export default function SellRightStats({
  heading = "Recommended by 2 Lakh+ sellers across India",
  stats = [
    { key: "cars", value: "2 Lakh+", label: "cars purchased", icon: <FiTrendingUp /> },
    { key: "rating", value: "4.9", label: "average rating", icon: <FiStar /> },
    { key: "cities", value: "80+", label: "cities in India", icon: <FiMapPin /> },
  ],
}) {
  return (
    <section className="sr-root" aria-labelledby="sr-heading">
      <div className="sr-inner">
        <div className="sr-top">
          <div className="sr-brand">
            <img  src={process.env.PUBLIC_URL + "/shortlogoo.png"} alt="SellRight by Spinny" className="sr-logo" />
          </div>

          <h2 id="sr-heading" className="sr-heading">
            {heading}
          </h2>
        </div>

        <div className="sr-cards">
          {stats.map((s) => (
            <div className="sr-card" key={s.key}>
              <div className="sr-card-icon" aria-hidden>
                {s.icon}
              </div>

              <div className="sr-card-body">
                <div className="sr-card-value">{s.value}</div>
                <div className="sr-card-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
