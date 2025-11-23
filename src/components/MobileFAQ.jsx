import React, { useState, useRef, useEffect } from "react";
import "../styles/MobileFAQ.css";

// Replace with your uploaded image path (the system will transform it to a URL).
const HEADER_IMG = "/mnt/data/a7f96920-0a53-47ca-bd6a-bcd114b125a7.png";

const FAQ_DATA = [
  {
    id: "q1",
    q: "Q. How can I sell car online in Noida at Spinny?",
    a:
      "To sell car online in Noida, you just need to share the basic car details, get an instant quote, check car valuation online, and book a free doorstep evaluation to complete the sale easily with Spinny.",
  },
  {
    id: "q2",
    q: "Q. What is the fastest way to sell a used car?",
    a:
      "The fastest way is to upload accurate details and clear photos, accept a fair instant offer, and schedule an evaluation at a nearby hub — this minimizes back-and-forth and speeds up closing.",
  },
  {
    id: "q3",
    q: "Q. My car is not listed in your form. What should I do?",
    a:
      "If your specific model isn’t listed, choose the closest matching variant or contact support — we can manually verify the car details during inspection.",
  },
  {
    id: "q4",
    q: "Q. How long will it take for the payment to get transferred into my account?",
    a:
      "Payments are usually processed the same day after paperwork and RC transfer checks. Some bank-specific delays may apply depending on the bank processing times.",
  },
  {
    id: "q5",
    q: "Q. How long will it take for the RC to be transferred from my name?",
    a:
      "RC transfer timelines vary by RTO but typically complete within a few weeks. We help guide you through required documents to speed up the process.",
  },
  // add more items as needed
];

export default function MobileFAQ({ singleOpen = true, headerImage = HEADER_IMG }) {
  const [openId, setOpenId] = useState(null);

  // Refs map to measure content height for smooth animation
  const contentRefs = useRef({});

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpenId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : (singleOpen ? id : id)));
  };

  const handleKey = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(id);
    }
  };

  return (
    <section className="faq-root" aria-labelledby="faq-heading">
      {headerImage ? (
        <div className="faq-header">
          <img src={headerImage} alt="" className="faq-header-img" aria-hidden="true" />
        </div>
      ) : null}

      <div className="faq-inner">
        <h2 id="faq-heading" className="faq-title">Frequently asked questions</h2>

        <div className="faq-list" role="list">
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div className="faq-item" key={item.id}>
                <button
                  className={`faq-question ${isOpen ? "open" : ""}`}
                  aria-expanded={isOpen}
                  aria-controls={`${item.id}-panel`}
                  id={`${item.id}-button`}
                  onClick={() => toggle(item.id)}
                  onKeyDown={(e) => handleKey(e, item.id)}
                >
                  <span className="faq-q-text">{item.q}</span>
                  <span className="faq-chevron" aria-hidden>
                    {/* simple chevron — rotates when open */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>

                <div
                  id={`${item.id}-panel`}
                  className="faq-answer-wrap"
                  role="region"
                  aria-labelledby={`${item.id}-button`}
                  ref={(el) => (contentRefs.current[item.id] = el)}
                  style={{
                    maxHeight: isOpen
                      ? `${contentRefs.current[item.id]?.scrollHeight ?? 0}px`
                      : "0px",
                  }}
                >
                  <div className="faq-answer">
                    {item.a}
                  </div>
                </div>

                <div className="faq-divider" aria-hidden />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
