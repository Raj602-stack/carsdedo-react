import React, { useRef, useState, useEffect } from "react";
import styles from "../styles/ReviewsSlider.module.css";

/**
 * ReviewsSlider
 *
 * Props:
 *  - reviews: array of { id, name, date, city, rating (1-5), text }
 *  - truncateWords: number (default 30) - words to show before "View more"
 *
 * Example usage:
 * <ReviewsSlider reviews={REVIEWS} truncateWords={28} />
 */

function truncateByWords(text = "", maxWords = 30) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return { truncated: text, isTruncated: false };
  return {
    truncated: words.slice(0, maxWords).join(" ") + "…",
    isTruncated: true,
  };
}

export default function ReviewsSlider({ reviews = [], truncateWords = 30 }) {
  const railRef = useRef(null);
  const [modal, setModal] = useState({ open: false, review: null });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY = 6;

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") closeModal();
    }
    if (modal.open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal.open]);

  function openModal(review) {
    setModal({ open: true, review });
    // a11y: trap focus could be added for full a11y; keep minimal here.
  }
  function closeModal() {
    setModal({ open: false, review: null });
  }

  function scrollBy(amount) {
    if (!railRef.current) return;
    railRef.current.scrollBy({ left: amount, behavior: "smooth" });
    // update scroll state a little later
    setTimeout(checkScroll, 240);
  }

  function checkScroll() {
    const el = railRef.current;
    if (!el) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 8);
  }

  function handlePrev() {
    if (!railRef.current) return;
    const w = railRef.current.clientWidth;
    scrollBy(-Math.round(w * 0.8));
  }
  function handleNext() {
    if (!railRef.current) return;
    const w = railRef.current.clientWidth;
    scrollBy(Math.round(w * 0.8));
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, INITIAL_DISPLAY);

  return (
    <section className={styles.section} aria-labelledby="reviews-title">
      <div className={styles.headerRow}>
        <h2 id="reviews-title" className={styles.heading}>
          User Reviews & Ratings
        </h2>

        <div className={styles.controls}>
          <button
            className={styles.navBtn}
            onClick={handlePrev}
            aria-label="Previous reviews"
            disabled={!canScrollLeft}
          >
            ‹
          </button>
          <button
            className={styles.navBtn}
            onClick={handleNext}
            aria-label="Next reviews"
            disabled={!canScrollRight}
          >
            ›
          </button>
        </div>
      </div>

      <div
        className={styles.rail}
        ref={railRef}
        onScroll={checkScroll}
        role="list"
        aria-label="Customer reviews"
      >
        {displayedReviews.map((r) => {
          const { truncated, isTruncated } = truncateByWords(r.text, truncateWords);
          return (
            <article key={r.id} className={styles.card} role="listitem">
              <div className={styles.cardInner}>
                <div className={styles.cardHead}>
                  <div className={styles.title}>
                    <div className={styles.name}>{r.name}</div>
                    <div className={styles.meta}>
                      {r.date} {r.city ? `| ${r.city}` : ""}
                    </div>
                  </div>
                  <div className={styles.rating} aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`${styles.star} ${i < Math.round(r.rating || 0) ? styles.filled : ""}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.body}>
                  <p className={styles.text}>
                    {isTruncated ? truncated : r.text}
                    {isTruncated && (
                      <>
                        {" "}
                        <button
                          className={styles.viewMore}
                          onClick={() => openModal(r)}
                          aria-haspopup="dialog"
                        >
                          View more
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* View More Reviews Button */}
      {!showAll && reviews.length > INITIAL_DISPLAY && (
        <div className={styles.viewAllWrap}>
          <button
            className={styles.viewAllBtn}
            onClick={() => {
              setShowAll(true);
              setTimeout(() => {
                checkScroll();
              }, 100);
            }}
          >
            View more reviews
          </button>
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className={styles.modalWrap} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className={styles.modalBackdrop} onClick={closeModal} />
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 id="modal-title" className={styles.modalTitle}>
                User Review
              </h3>
              <button className={styles.modalClose} onClick={closeModal} aria-label="Close review">
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalMeta}>
                <div className={styles.modalName}>{modal.review.name}</div>
                <div className={styles.modalSub}>
                  {modal.review.date} {modal.review.city ? `| ${modal.review.city}` : ""}
                </div>
                <div className={styles.modalStars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`${styles.star} ${i < Math.round(modal.review.rating || 0) ? styles.filled : ""}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.modalText}>{modal.review.text}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
