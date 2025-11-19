import React, { useState } from "react";
import "../styles/FaqMob.css";

export default function FaqMob() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "When and where can I take a test drive?",
      a: "With our test drive booking form, you can conveniently schedule a test drive at home or visit our hub to try out multiple cars. Once you book your preferred option, your relationship manager will call you to confirm the details before arriving at your location. To know more about home test drives, please click on the following link.",
    },
    {
      q: "What’s the process for booking my car?",
      a: "Once you select your desired car, you can reserve it online or book a test drive. After confirmation, your carsdedo Relationship Manager will guide you through the full process until delivery.",
    },
    {
      q: "Will carsdedo help me with car finance?",
      a: "Yes! carsdedo provides multiple finance options with low interest rates and minimal documentation.",
    },
    {
      q: "How does carsdedo’s money back guarantee work?",
      a: "If you are not satisfied with your purchase, you can return the car within the trial period for a full refund.",
    },
  ];

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>

      <div className="faq-list">
        {faqs.map((item, i) => (
          <div key={i} className="faq-item">
            <button className="faq-question" onClick={() => toggle(i)}>
              <span>Q. {item.q}</span>
              <span className={`faq-arrow ${openIndex === i ? "open" : ""}`}>
                ▼
              </span>
            </button>

            {openIndex === i && (
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            )}

            <div className="faq-divider" />
          </div>
        ))}
      </div>
    </section>
  );
}
