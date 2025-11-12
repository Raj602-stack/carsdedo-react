// src/components/HowItWorks.jsx
import React from "react";
import "../styles/HowItWorksMob.css";

/**
 * HowItWorks
 *
 * Props:
 * - steps: array of { id, image, title, subtitle } (if not provided, defaultSteps are used)
 *
 * Usage:
 * <HowItWorks steps={[{ id:'s1', image: '/img/step1.png', title: 'Choose', subtitle: '...' }, ...]} />
 */

const defaultSteps = [
  {
    id: "step1",
    image: process.env.PUBLIC_URL + "/firstspin.png",
    title: "Choose from the best pre-owned cars",
    subtitle: "20,000+ fully inspected cars online",
  },
  {
    id: "step2",
    image: process.env.PUBLIC_URL + "/secondspin.png",
    title: "Take a test drive at your home or a CarsDedo Hub",
    subtitle: "Sanitised cars for every test drive",
  },
  {
    id: "step3",
    image: process.env.PUBLIC_URL + "/thirdspinnn.png",
    title: "Online Payment. Doorstep Delivery.",
    subtitle: "And 5-day money back guarantee",
  },
];

export default function HowItWorksMob({ steps = defaultSteps }) {
  return (
    <section className="hiw-section" aria-label="How it works">
      <div className="hiw-inner">
        <h2 className="hiw-heading">How it works</h2>
        <p className="hiw-lead">
          You won’t just love our cars, you’ll love the way you buy them.
        </p>

        <div className="hiw-steps">
          {steps.map((s) => (
            <div className="hiw-step" key={s.id}>
              <div className="hiw-icon">
                {/* keep the container size fixed - replace image path as needed */}
                {s.image ? (
                  <img src={s.image} alt="" aria-hidden className="hiw-img" />
                ) : (
                  <div className="hiw-placeholder" />
                )}
              </div>

              <div className="hiw-text">
                <div className="hiw-title">{s.title}</div>
                <div className="hiw-sub">{s.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="hiw-cta-row">
          <button
            className="hiw-watch"
            onClick={() => {
              // replace with modal/open video
              window.alert("Play How it works video");
            }}
          >
            <span className="hiw-play">▶</span> Watch how it works
          </button>

          <a className="hiw-more" href="#learn">
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}
