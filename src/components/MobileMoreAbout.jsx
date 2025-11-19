import React, { useState, useRef, useEffect } from "react";
import "../styles/MobileMoreAbout.css";

/**
 * MobileMoreAbout
 *
 * - Tap header to toggle visibility of the content.
 * - Smooth height animation using max-height.
 * - Collapses to hide the "Why buy..." content when closed.
 */
export default function MobileMoreAbout() {
  const [open, setOpen] = useState(true); // default open (change to false if you want closed by default)
  const contentRef = useRef(null);
  const [maxH, setMaxH] = useState("0px");

  useEffect(() => {
    // update max-height based on scrollHeight so CSS transition animates
    const el = contentRef.current;
    if (!el) return;
    if (open) {
      // set to scrollHeight + small buffer
      setMaxH(`${el.scrollHeight + 20}px`);
    } else {
      setMaxH("0px");
    }
  }, [open]);

  const toggle = () => setOpen((v) => !v);

  return (
    <div className="ma-root" aria-live="polite">
      <div
        className="ma-header"
        role="button"
        aria-expanded={open}
        aria-controls="ma-content"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <div className="ma-header-title">More about CarsDedo</div>

        <div className={`ma-chevron ${open ? "open" : ""}`} aria-hidden>
          {/* simple chevron*/}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="#2d063b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div
        id="ma-content"
        ref={contentRef}
        className="ma-content"
        style={{ maxHeight: maxH }}
        aria-hidden={!open}
      >
        <div className="ma-inner">
          <h3 className="ma-heading">Why buy a used car from carsdedo?</h3>

          <p className="ma-paragraph">
            carsdedo takes the uncertainty and risk out of buying a used car,
            offering peace of mind at every step with zero compromises. Our
            selection process ensures that only the highest quality certified
            second hand cars in your city make it to carsdedo. A carsdedo car is
            certified only once it passes a thorough 200-point evaluation that
            checks the condition of every part of the car. Any used car can get
            certified, but it takes perfection to be carsdedo Assured.
          </p>

          <p className="ma-paragraph">
            Experience a simple & fully transparent way of buying used cars with
            carsdedo. Find your perfect match from our wide range of fully
            inspected & certified used cars at the best prices. All carsdedo cars
            come with hassle-free paperwork, free RC transfer, and used car
            finance options at competitive rates. With carsdedo, pre-owned is
            often better than new — get the savings of a pre-owned car with the
            confidence of a certified inspection.
          </p>
        </div>
      </div>
    </div>
  );
}
