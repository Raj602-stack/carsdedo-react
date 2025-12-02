// src/pages/CarDetails.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import carsData from "../data/cars";
import "../styles/CarDetailsWeb.css";

/**
 * CarDetails page
 * - sticky tab bar appears after hero scrolls out
 * - sticky tab bar width/left aligned to left content (not full width)
 * - scrollspy highlights active tab
 * - right card is fixed while scrolling, but stops above footer (no overlap)
 *
 * Keep TOPBAR_HEIGHT in sync with CSS :root --topbar-height
 */
const TOPBAR_HEIGHT = 72; // update if your topbar height differs

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = carsData.find((c) => Number(c.id) === Number(id));

  const containerRef = useRef(null); // centered container
  const leftRef = useRef(null); // left content column
  const heroRef = useRef(null);
  const overviewRef = useRef(null);
  const reportRef = useRef(null);
  const specsRef = useRef(null);
  const financeRef = useRef(null);
  const rightRef = useRef(null); // right area wrapper
  const rightCardRef = useRef(null); // fixed card element

  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [heroImage, setHeroImage] = useState(car ? car.image : "");
  const [stickyStyle, setStickyStyle] = useState({ left: 0, width: 720 }); // position for sticky bar
  const [isStopped, setIsStopped] = useState(false); // whether the right card reached footer

  // sections list for easier iteration
  const sections = [
    { id: "overview", ref: overviewRef },
    { id: "report", ref: reportRef },
    { id: "specs", ref: specsRef },
    { id: "finance", ref: financeRef },
  ];

  // ---------- HANDLE STICKY TAB APPEAR (hero observer) ----------
  useEffect(() => {
    if (!heroRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // show sticky tabs when hero is mostly out of viewport
          setShowStickyTabs(!entry.isIntersecting);
        });
      },
      { threshold: 0.04 }
    );

    obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  // ---------- SCROLLSPY: observe sections to update active tab ----------
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: `-${TOPBAR_HEIGHT + 8}px 0px -40% 0px`,
      threshold: [0.12, 0.35, 0.6],
    };

    const obs = new IntersectionObserver((entries) => {
      const intersecting = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (intersecting.length > 0) {
        const sec = intersecting[0].target.dataset.section;
        if (sec) setActiveTab(sec);
      }
    }, observerOptions);

    sections.forEach((s) => {
      if (s.ref.current) obs.observe(s.ref.current);
    });

    return () => obs.disconnect();
  }, []);

  // ---------- STICKY TAB POSITION (left-only) ----------
  const updateStickyPosition = useCallback(() => {
    if (!leftRef.current || !containerRef.current) return;
    const leftRect = leftRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // left aligned inside the centered container
    const left = Math.max(containerRect.left + 12, leftRect.left); // small padding
    const width = Math.min(leftRect.width, 760); // cap width for niceness (760 default)
    setStickyStyle({ left: Math.round(left), width: Math.round(width) });
  }, []);

  useEffect(() => {
    // compute after initial render
    updateStickyPosition();
    window.addEventListener("resize", updateStickyPosition);
    return () => window.removeEventListener("resize", updateStickyPosition);
  }, [updateStickyPosition]);

  // ---------- RIGHT CARD: stop before footer logic ----------
  useEffect(() => {
    function computeStop() {
      const footer = document.querySelector("footer");
      const right = rightRef.current;
      const card = rightCardRef.current;
      if (!right || !card || !footer) return;

      const footerRect = footer.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const rightRect = right.getBoundingClientRect();

      // viewport Y coordinate at which the bottom of the fixed card would overlap the footer
      // We'll stop when card's bottom would be >= footer.top - 12px
      const wouldOverlap = cardRect.bottom >= footerRect.top - 12;

      if (wouldOverlap) {
        // stop (make card absolute anchored to bottom of right wrapper)
        setIsStopped(true);
      } else {
        setIsStopped(false);
      }
    }

    // run on scroll and resize
    computeStop();
    window.addEventListener("scroll", computeStop, { passive: true });
    window.addEventListener("resize", computeStop);
    const mo = new MutationObserver(computeStop);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", computeStop);
      window.removeEventListener("resize", computeStop);
      mo.disconnect();
    };
  }, []);

  // ---------- scroll-to helper (accounts for topbar) ----------
  function scrollToRef(ref) {
    if (!ref?.current) return;
    const offset = TOPBAR_HEIGHT + 8; // topbar + spacing
    const top = ref.current.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  if (!car) {
    return (
      <div className="car-details-empty">
        <p>Car not found</p>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  // small thumbnails (example uses same image placeholders)
  const thumbs = car.images && car.images.length ? car.images : [car.image];

  return (
    <div className="car-details-page-wrapper">
      {/* sticky tabs (positioned left only) */}
      <div
        className={`cd-sticky-tabs ${showStickyTabs ? "visible" : ""}`}
        style={{
          top: `${TOPBAR_HEIGHT + 8}px`,
          left: `${stickyStyle.left}px`,
          width: `${stickyStyle.width}px`,
        }}
      >
        <div className="cd-sticky-inner">
          <button className={`cd-tab ${activeTab === "overview" ? "active" : ""}`} onClick={() => scrollToRef(overviewRef)}>
            Overview
          </button>
          <button className={`cd-tab ${activeTab === "report" ? "active" : ""}`} onClick={() => scrollToRef(reportRef)}>
            Report
          </button>
          <button className={`cd-tab ${activeTab === "specs" ? "active" : ""}`} onClick={() => scrollToRef(specsRef)}>
            Feature & Specs
          </button>
          <button className={`cd-tab ${activeTab === "finance" ? "active" : ""}`} onClick={() => scrollToRef(financeRef)}>
            Finance
          </button>
        </div>
      </div>

      {/* main centered container */}
      <div className="car-details-container" ref={containerRef}>
        {/* LEFT column */}
        <main className="cd-left" ref={leftRef}>
          {/* HERO */}
          <div className="cd-hero" ref={heroRef}>
            <div className="cd-hero-inner">
              <div className="cd-hero-image">
                <img src={heroImage} alt={car.title} />
                <div className="cd-hero-controls">
                  <button className="cd-back" onClick={() => navigate(-1)}>
                    ← Back
                  </button>
                </div>
              </div>

              <div className="cd-thumbs">
                {thumbs.map((t, i) => (
                  <button
                    key={i}
                    className={`cd-thumb ${t === heroImage ? "selected" : ""}`}
                    onClick={() => setHeroImage(t)}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img src={t} alt={`thumb ${i + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* hero inline tabs (visible normally under hero) */}
          <nav className="cd-hero-tabs" aria-label="Car sections">
            <button className={`hero-tab ${activeTab === "overview" ? "active" : ""}`} onClick={() => scrollToRef(overviewRef)}>
              Overview
            </button>
            <button className={`hero-tab ${activeTab === "report" ? "active" : ""}`} onClick={() => scrollToRef(reportRef)}>
              Report
            </button>
            <button className={`hero-tab ${activeTab === "specs" ? "active" : ""}`} onClick={() => scrollToRef(specsRef)}>
              Feature & Specs
            </button>
            <button className={`hero-tab ${activeTab === "finance" ? "active" : ""}`} onClick={() => scrollToRef(financeRef)}>
              Finance
            </button>
          </nav>

          {/* Overview section */}
          <section id="overview" ref={overviewRef} data-section="overview" className="cd-section overview">
            <h2 className="cd-section-title">Car Overview</h2>

            <div className="cd-card overview-card">
              <div className="row">
                <div className="field">
                  <div className="label">Make Year</div>
                  <div className="value">May 2024</div>
                </div>
                <div className="field">
                  <div className="label">Registration Year</div>
                  <div className="value">Jun 2024</div>
                </div>
                <div className="field">
                  <div className="label">Fuel Type</div>
                  <div className="value">{car.fuel}</div>
                </div>
              </div>
              <div className="row">
                <div className="field">
                  <div className="label">Km driven</div>
                  <div className="value">{car.km.toLocaleString()} km</div>
                </div>
                <div className="field">
                  <div className="label">Transmission</div>
                  <div className="value">{car.transmission}</div>
                </div>
                <div className="field">
                  <div className="label">No. of Owner</div>
                  <div className="value">{car.owner || "1st Owner"}</div>
                </div>
              </div>

              <div className="row last">
                <div className="field full">
                  <div className="label">Car Location</div>
                  <div className="value">{car.city}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Report */}
          <section id="report" ref={reportRef} data-section="report" className="cd-section report">
            <h2 className="cd-section-title">Quality report</h2>
            <p className="muted">1571 parts evaluated by 5 automotive experts</p>

            <div className="cd-card report-card">
              <div className="report-grid">
                <div className="report-item">
                  <div className="report-title">Core systems</div>
                  <div className="report-score">9.8</div>
                </div>
                <div className="report-item">
                  <div className="report-title">Supporting systems</div>
                  <div className="report-score">9.7</div>
                </div>
                <div className="report-item">
                  <div className="report-title">Interiors & AC</div>
                  <div className="report-score">9.6</div>
                </div>
                <div className="report-item">
                  <div className="report-title">Exteriors & lights</div>
                  <div className="report-score">9.3</div>
                </div>
              </div>
            </div>
          </section>

          {/* Feature & Specs */}
          <section id="specs" ref={specsRef} data-section="specs" className="cd-section specs">
            <h2 className="cd-section-title">Feature & Specs</h2>

            <div className="cd-card specs-card">
              <div className="specs-grid">
                <div className="spec">
                  <div className="spec-ttl">Mileage (ARAI)</div>
                  <div className="spec-val">22.35 kmpl</div>
                </div>
                <div className="spec">
                  <div className="spec-ttl">Boot space</div>
                  <div className="spec-val">318 litres</div>
                </div>
                <div className="spec">
                  <div className="spec-ttl">Displacement</div>
                  <div className="spec-val">1197 cc</div>
                </div>
              </div>

              <div className="features">
                <h4>Top Features of this car</h4>
                <div className="features-grid">
                  <ul>
                    <li>Airbags</li>
                    <li>Hill hold control</li>
                    <li>Parking sensors</li>
                    <li>Electronic stability program (ESP)</li>
                  </ul>
                  <ul>
                    <li>Rear defogger</li>
                  </ul>
                  <ul>
                    <li>Power boot</li>
                    <li>Automatic climate control</li>
                    <li>Adjustable ORVM</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Finance */}
          <section id="finance" ref={financeRef} data-section="finance" className="cd-section finance">
            <h2 className="cd-section-title">Finance</h2>

            <div className="cd-card finance-card">
              <div className="emi">
                <div className="emi-left">
                  <div className="emi-number">₹9,400</div>
                  <div className="muted">per month (approx)</div>
                </div>
                <div className="emi-right">
                  <div className="muted">Loan Amount</div>
                  <div className="value">₹{(car.price - 110400).toLocaleString()}</div>
                  <div className="muted">Duration</div>
                  <div className="value">66 Months</div>
                </div>
              </div>

              <div className="finance-cta">
                <button className="btn primary">Check eligibility</button>
              </div>
            </div>
          </section>

          <div style={{ height: 48 }} />
        </main>

        {/* RIGHT column wrapper (relative). This wrapper is used to switch fixed->absolute */}
        <aside className={`cd-right ${isStopped ? "stop" : ""}`} ref={rightRef}>
          <div
            className={`cd-right-card`}
            ref={rightCardRef}
            style={
              isStopped
                ? { position: "absolute", bottom: 0, top: "auto", right: 0 }
                : { position: "fixed", top: `${TOPBAR_HEIGHT + 12}px` }
            }
          >
            <div className="right-inner">
              <div className="title-row">
                <h3 className="car-title">{car.title}</h3>
                <button className="like" aria-label="save">♡</button>
              </div>

              <div className="meta">
                <div>{car.km.toLocaleString()} km • {car.fuel} • {car.transmission}</div>
                <div className="hub">Spinny Car Hub, {car.city}</div>
              </div>

              <div className="price-block">
                <div className="label muted">Fixed on road price</div>
                <div className="price">₹{(car.price / 100000).toFixed(2)} L</div>
                <div className="muted small">Includes RC transfer, insurance & more</div>
              </div>

              <div className="cta">
                <button className="btn book">BOOK NOW</button>
                <button className="btn test">FREE TEST DRIVE</button>
              </div>

              <div className="share">
                <p>Share with a friend :</p>
                <div className="icons">📷 • f • ✕ • ✉️</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
