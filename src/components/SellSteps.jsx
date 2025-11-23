import React from "react";
import "../styles/SellSteps.css";

/**
 * SellSteps
 * - Desktop: zig-zag alternating rows
 * - Mobile: compact two-column rows (small image left, copy right)
 *
 * Update the image/icon paths if you move them into public/ folder.
 */
export default function SellSteps() {
  const steps = [
    {
      id: 1,
      title: "Let's talk about your car",
      text: "Tell us about your beloved and get an instant online quote",
      cta: "Get quote",
      image: process.env.PUBLIC_URL + "/firstspin.png",
      icon: process.env.PUBLIC_URL + "/shortlogoo.png",
    },
    {
      id: 2,
      title: "Pick a day",
      text:
        "At home or your nearest CarsDedo Car Hub, for a free car valuation and a final offer.",
      cta: "Get quote",
      image: process.env.PUBLIC_URL + "/secondspin.png",
      icon: "/mnt/data/separate_icon_2.png",
    },
    {
      id: 3,
      title: "Credited, the same day",
      text: "Complete payment and paperwork on-the-spot",
      cta: "Sell car",
      image:  process.env.PUBLIC_URL + "/thirdspinnn.png",
      icon: "/mnt/data/separate_icon_3.png",
    },
  ];

  return (
    <section className="ss-root" aria-label="How it works - Sell your car">
      <div className="ss-container">
        <h2 className="ss-heading">Sell your car for the Best Price</h2>

        {steps.map((s, idx) => (
          <article
            key={s.id}
            className={`ss-row ${idx % 2 === 1 ? "reverse-desktop" : ""}`}
            aria-labelledby={`step-title-${s.id}`}
          >
            <div className="ss-visual">
              <img src={s.image} alt="" className="ss-art" />
            </div>

            <div className="ss-copy">
              

              <h3 id={`step-title-${s.id}`} className="ss-title">
                {s.title}
              </h3>

              <p className="ss-text">{s.text}</p>

              <button
                className="ss-link"
                onClick={() => {
                  /* Replace with navigation if needed */
                  console.log("CTA clicked:", s.cta);
                }}
                aria-label={s.cta}
              >
                {s.cta} <span className="ss-arrow">›</span>
              </button>
            </div>
          </article>
        ))}

        <div className="ss-final">
          <div className="ss-final-left">
            <h3 className="ss-final-title">Sit back, relax. Car in Transit</h3>
            <p className="ss-final-text">
              Our seller protection policy ensures that you're protected from any liabilities until your RC transfer is completed
            </p>

            <button className="ss-link" onClick={() => console.log("Sell car clicked")}>
              Sell car <span className="ss-arrow">›</span>
            </button>
          </div>

          <div className="ss-final-visual" aria-hidden>
            <img
              src={"/mnt/data/d2000117-1289-4f4d-9ebb-3e7e6edb26f6.png"}
              alt=""
              className="ss-final-img"
            />
          </div>
        </div>

        <div className="ss-cta-row">
          <button className="ss-watch" onClick={() => console.log("Watch how it works")}>
            Watch how it works <span className="ss-play">▶</span>
          </button>

          <a className="ss-learn" href="/learn-more" onClick={(e) => e.preventDefault()}>
            Learn More ›
          </a>
        </div>
      </div>
    </section>
  );
}
