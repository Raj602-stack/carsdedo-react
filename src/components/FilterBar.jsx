import React, { useEffect, useRef, useState } from "react";
import "../styles/FilterBar.css";

// optional decorative image you uploaded (will be served by your environment)
const DECOR_SRC = "/mnt/data/f1a54425-f048-4f5f-a6dd-7258e9d5d954.png";

/**
 * FilterBar
 *
 * Props:
 * - filters: [{ id, label, value? }] - list of chips
 * - selectedId: id of selected chip (optional)
 * - onSelect: (filter) => void
 * - showDecor: boolean (use uploaded image at left)
 *
 * Example:
 *  <FilterBar
 *    filters={[
 *      { id: "filter_all", label: "Filter" },
 *      { id: "sort", label: "Sort" },
 *      { id: "price", label: "Price Range" },
 *      ...
 *    ]}
 *    onSelect={(f)=> console.log(f)}
 *  />
 */
export default function FilterBar({
  filters = [],
  selectedId = null,
  onSelect = () => {},
  showDecor = false,
}) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // check overflow to show/hide chevrons
  const checkScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth + 4 < el.scrollWidth);
  };

  useEffect(() => {
    checkScroll();
    const el = trackRef.current;
    if (!el) return;
    // update on resize & scroll
    function onResize() { checkScroll(); }
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // scroll by approx one chip width (or visible width / 2) for button presses
  const scrollBy = (dir = 1) => {
    const el = trackRef.current;
    if (!el) return;
    // prefer using first chip width if available
    const firstChip = el.querySelector(".fb-chip");
    const step = firstChip ? firstChip.offsetWidth + 12 : Math.round(el.clientWidth / 2);
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <div className="fb-root" role="region" aria-label="Filters">
      {showDecor ? (
        <div className="fb-decor">
          <img src={DECOR_SRC} alt="" className="fb-decor-img" aria-hidden="true" />
        </div>
      ) : null}

      <div className="fb-track-wrap">
        {canScrollLeft && (
          <button
            className="fb-nav fb-nav-left"
            aria-label="Scroll left"
            onClick={() => scrollBy(-1)}
          >
            ‹
          </button>
        )}

        <div
          className="fb-track"
          ref={trackRef}
          tabIndex={0}
          onKeyDown={(e) => {
            // support keyboard scrolling
            if (e.key === "ArrowRight") { e.preventDefault(); scrollBy(1); }
            if (e.key === "ArrowLeft") { e.preventDefault(); scrollBy(-1); }
          }}
        >
          {filters.map((f) => {
            const isSelected = selectedId === f.id;
            return (
              <button
                key={f.id}
                className={`fb-chip ${isSelected ? "selected" : ""}`}
                onClick={() => onSelect(f)}
                aria-pressed={isSelected}
                title={f.label}
              >
                <span className="fb-chip-label">{f.label}</span>
                {/* optional small caret for chips that open menus */}
                {f.hasCaret ? <span className="fb-chip-caret">▾</span> : null}
              </button>
            );
          })}
        </div>

        {canScrollRight && (
          <button
            className="fb-nav fb-nav-right"
            aria-label="Scroll right"
            onClick={() => scrollBy(1)}
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
