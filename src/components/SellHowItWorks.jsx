import React from "react";
import styles from "../styles/SellHowItWorks.module.css";

/**
 * SellHowItWorks
 *
 * Usage:
 * <SellHowItWorks />
 *
 * Images expected in public folder (change paths as needed):
 *  /images/illustrations/talk.svg
 *  /images/illustrations/pick-day.svg
 *  /images/illustrations/credited.svg
 *  /images/illustrations/protection.svg
 */

const STEPS = [
  {
    id: "talk",
    title: "Let's talk about your car",
    desc: "Tell us about your beloved and get an instant online quote",
    img: process.env.PUBLIC_URL + "/one.png",
    cta: "Get quote",
    ctaHref: "#quote",
  },
  {
    id: "pick",
    title: "Pick a day",
    desc: "At home or your nearest Spinny Car Hub, for a free car valuation and a final offer. Easy",
    img: process.env.PUBLIC_URL + "/two.png",
    cta: "Get quote",
    ctaHref: "#quote",
  },
  {
    id: "credited",
    title: "Credited, the same day",
    desc: "Complete payment and paperwork on-the-spot",
    img: process.env.PUBLIC_URL + "/three.png",
    cta: "Sell car",
    ctaHref: "#sell",
  },
  {
    id: "protect",
    title: "Sit back, relax. Car in Transit",
    desc: "Our seller protection policy ensures that you’re protected from any liabilities until your RC transfer is completed",
    img: process.env.PUBLIC_URL + "/four.png",
    cta: "Sell car",
    ctaHref: "#sell",
  },
];

export default function SellHowItWorks({ onCtaClick }) {
  return (
    <section className={styles.section} aria-labelledby="how-it-works-title">
      <div className={styles.container}>
        <h2 id="how-it-works-title" className={styles.heading}>
          Sell your car for the Best Price
        </h2>

        <div className={styles.grid}>
          {STEPS.map((s) => (
            <article key={s.id} className={styles.card}>
              <div className={styles.imgWrap}>
                <img src={s.img} alt={s.title} className={styles.illustration} />
              </div>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardDesc}>{s.desc}</p>
              <a
                className={styles.cardLink}
                href={s.ctaHref}
                onClick={(e) => {
                  if (onCtaClick) {
                    e.preventDefault();
                    onCtaClick(s.id);
                  }
                }}
              >
                {s.cta} <span className={styles.caret}>›</span>
              </a>
            </article>
          ))}
        </div>

        <div className={styles.ctaRow}>
          <button className={styles.watchBtn} onClick={() => onCtaClick?.("watch")}>
            Watch how it works ▶
          </button>

          <a className={styles.learnMore} href="#learn">
            Learn More <span className={styles.caret}>›</span>
          </a>
        </div>
      </div>
    </section>
  );
}
