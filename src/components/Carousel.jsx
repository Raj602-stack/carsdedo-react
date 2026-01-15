import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    id: 1,
    img: process.env.PUBLIC_URL + "/slide1.png",
    title: "we make you spend less",
    subtitle: "zero down payment options",
  },
  {
    id: 2,
    img: process.env.PUBLIC_URL + "/slide2.png",
    title: "trusted used cars",
    subtitle: "assured plus certified",
  },
  {
    id: 3,
    img: process.env.PUBLIC_URL + "/slide3.png",
    title: "easy finance",
    subtitle: "finance options available",
  },
];

export default function Carousel() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      4000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero">
      <div className="carousel">
        {slides.map((s, i) => (
          <div key={s.id} className={"slide " + (i === index ? "active" : "")}>
            <img src={s.img} alt={s.title} />
            <div className="hero-text">
              <h1>{s.title}</h1>
              <p>{s.subtitle}</p>
              <button className="primary" onClick={() => navigate("/buy")}>Check eligibility</button>
            </div>
          </div>
        ))}
        <button
          className="arrow left"
          onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
        >
          &lt;
        </button>
        <button
          className="arrow right"
          onClick={() => setIndex((i) => (i + 1) % slides.length)}
        >
          &gt;
        </button>
        <div className="dots">
          {slides.map((_, i) => (
            <span
              key={i}
              onClick={() => setIndex(i)}
              className={i === index ? "dot active" : "dot"}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}
