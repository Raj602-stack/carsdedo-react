import React, { useState, useRef, useEffect } from "react";
import "../styles/FAQ.css";

const DEFAULT_FAQ_DATA = [
  {
    q: "When and where can I take a test drive?",
    a:
      "With our test drive booking form, you can schedule a test drive at home or visit our hub to try multiple cars. Once you book your preferred option, your relationship manager will call to confirm details. For home test drives please click the link in the help centre.",
  },
  {
    q: "What's the process for booking my car?",
    a:
      "Search for a car, choose 'Book test drive' or 'Buy now' and follow the checkout flow. Our team will help schedule inspection, paperwork and delivery. You can also visit any of our hubs to complete the process in person.",
  },
  {
    q: "Will CarsDedo help me with car finance?",
    a:
      "Yes — we offer finance options through multiple loan partners. You can check eligibility on the loan page, compare EMI options and pick what suits you. Our advisors can also assist with the paperwork.",
  },
  {
    q: "How does the money-back guarantee work?",
    a:
      "Our 5-day money-back guarantee lets you return the car within 5 days (terms apply). The car should be in the same condition as delivered, within allowed kilometers. Contact support for exact T&Cs.",
  },
];

export default function FAQ({ items }) {
  const data = items && items.length ? items : DEFAULT_FAQ_DATA;
  const [openIndex, setOpenIndex] = useState(0); // open first by default or -1 for none
  const refs = useRef([]);

  useEffect(() => {
    // ensure array length matches data
    refs.current = refs.current.slice(0, data.length);
  }, [data.length]);

  useEffect(() => {
    if (openIndex >= data.length) {
      setOpenIndex(data.length ? 0 : -1);
    }
  }, [data.length, openIndex]);

  const toggle = (i) => {
    setOpenIndex((prev) => (prev === i ? -1 : i));
  };

  const onKey = (e, i) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(i);
    }
  };

  return (
    <section className="faq-section">
      <div className="faq-inner">
        <h2 className="faq-title">
          <span className="faq-rule" />
          Frequently Asked Questions
          <span className="faq-rule" />
        </h2>

        <div className="faq-list" role="list" aria-label="Frequently asked questions">
          {data.map((item, i) => (
            <article
              key={i}
              className={`faq-item ${openIndex === i ? "open" : ""}`}
              aria-expanded={openIndex === i}
            >
              <div
                tabIndex={0}
                role="button"
                aria-controls={`faq-panel-${i}`}
                aria-expanded={openIndex === i}
                className="faq-question"
                onClick={() => toggle(i)}
                onKeyDown={(e) => onKey(e, i)}
                ref={(el) => (refs.current[i] = el)}
              >
                <div className="faq-q-text">
                  <span className="faq-q-prefix">Q.</span>
                  {item.q}
                </div>

                <div className="faq-toggle-icon" aria-hidden>
                  <svg
                    className="chev"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-hidden={openIndex !== i}
                className="faq-answer-wrapper"
                style={
                  openIndex === i
                    ? { maxHeight: refs.current[i]?.scrollHeight ? refs.current[i].scrollHeight + 200 : "400px" }
                    : { maxHeight: 0 }
                }
              >
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>

              <div className="faq-divider" />
            </article>
          ))}
        </div>

        <div className="faq-cta">
          <button className="faq-cta-btn" onClick={() => (window.location.href = "/help")}>
            Visit help center
          </button>
        </div>
      </div>
    </section>
  );
}
