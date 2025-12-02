// src/pages/CarDetails.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import carsData from "../data/cars";
import styles from "../styles/CarDetailsWeb.module.css";

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
      const intersecting = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
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
      <div className={styles.carDetailsPageWrapper}>
        <div className={styles.cdCard}>
          <p>Car not found</p>
          <button className={styles.btn} onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    );
  }

  // small thumbnails (example uses same image placeholders)
  const thumbs = car.images && car.images.length ? car.images : [car.image];

  return (
    <div className={styles.carDetailsPageWrapper}>
      {/* sticky tabs (positioned left only) */}
      <div
        className={`${styles.cdStickyTabs} ${showStickyTabs ? styles.visible : ""}`}
        style={{
          top: `${TOPBAR_HEIGHT + 8}px`,
          left: `${stickyStyle.left}px`,
          width: `${stickyStyle.width}px`,
        }}
      >
        <div className={styles.cdStickyInner}>
          <button
            className={`${styles.cdTab} ${activeTab === "overview" ? styles.cdTabActive : ""}`}
            onClick={() => scrollToRef(overviewRef)}
          >
            Overview
          </button>
          <button
            className={`${styles.cdTab} ${activeTab === "report" ? styles.cdTabActive : ""}`}
            onClick={() => scrollToRef(reportRef)}
          >
            Report
          </button>
          <button
            className={`${styles.cdTab} ${activeTab === "specs" ? styles.cdTabActive : ""}`}
            onClick={() => scrollToRef(specsRef)}
          >
            Feature & Specs
          </button>
          <button
            className={`${styles.cdTab} ${activeTab === "finance" ? styles.cdTabActive : ""}`}
            onClick={() => scrollToRef(financeRef)}
          >
            Finance
          </button>
        </div>
      </div>

      {/* main centered container */}
      <div className={styles.carDetailsContainer} ref={containerRef}>
        {/* LEFT column */}
        <main className={styles.cdLeft} ref={leftRef}>
          {/* HERO */}
          <div className={styles.cdHero} ref={heroRef}>
            <div className={styles.cdHeroInner}>
              <div className={styles.cdHeroImage}>
                <img src={heroImage} alt={car.title} />
                <div className={styles.cdHeroControls}>
                  <button className={styles.cdBack} onClick={() => navigate(-1)}>
                    ← Back
                  </button>
                </div>
              </div>

              <div className={styles.cdThumbs}>
                {thumbs.map((t, i) => (
                  <button
                    key={i}
                    className={`${styles.cdThumb} ${t === heroImage ? styles.cdThumbSelected : ""}`}
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
          <nav className={styles.cdHeroTabs} aria-label="Car sections">
            <button
              className={`${styles.heroTab} ${activeTab === "overview" ? styles.heroTabActive : ""}`}
              onClick={() => scrollToRef(overviewRef)}
            >
              Overview
            </button>
            <button
              className={`${styles.heroTab} ${activeTab === "report" ? styles.heroTabActive : ""}`}
              onClick={() => scrollToRef(reportRef)}
            >
              Report
            </button>
            <button
              className={`${styles.heroTab} ${activeTab === "specs" ? styles.heroTabActive : ""}`}
              onClick={() => scrollToRef(specsRef)}
            >
              Feature & Specs
            </button>
            <button
              className={`${styles.heroTab} ${activeTab === "finance" ? styles.heroTabActive : ""}`}
              onClick={() => scrollToRef(financeRef)}
            >
              Finance
            </button>
          </nav>

          {/* Overview section */}
          <section id="overview" ref={overviewRef} data-section="overview" className={styles.cdSection}>
            <h2 className={styles.cdSectionTitle}>Car Overview</h2>

            <div className={styles.cdCard}>
              <div className={styles.overviewCardRow}>
                <div className={styles.overviewCardField}>
                  <div className={styles.label}>Make Year</div>
                  <div className={styles.value}>May 2024</div>
                </div>
                <div className={styles.overviewCardField}>
                  <div className={styles.label}>Registration Year</div>
                  <div className={styles.value}>Jun 2024</div>
                </div>
                <div className={styles.overviewCardField}>
                  <div className={styles.label}>Fuel Type</div>
                  <div className={styles.value}>{car.fuel}</div>
                </div>
              </div>

              <div className={styles.overviewCardRow}>
                <div className={styles.overviewCardField}>
                  <div className={styles.label}>Km driven</div>
                  <div className={styles.value}>{car.km.toLocaleString()} km</div>
                </div>
                <div className={styles.overviewCardField}>
                  <div className={styles.label}>Transmission</div>
                  <div className={styles.value}>{car.transmission}</div>
                </div>
                <div className={styles.overviewCardField}>
                  <div className={styles.label}>No. of Owner</div>
                  <div className={styles.value}>{car.owner || "1st Owner"}</div>
                </div>
              </div>

              <div className={styles.overviewCardRow}>
                <div className={styles.overviewCardFieldFull}>
                  <div className={styles.label}>Car Location</div>
                  <div className={styles.value}>{car.city}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Report */}
          <section id="report" ref={reportRef} data-section="report" className={styles.cdSection}>
            <h2 className={styles.cdSectionTitle}>Quality report</h2>
            <p className={styles.meta}>1571 parts evaluated by 5 automotive experts</p>

            <div className={styles.cdCard}>
              <div className={styles.reportCardGrid}>
                <div className={styles.reportItem}>
                  <div className={styles.reportTitle}>Core systems</div>
                  <div className={styles.reportScore}>9.8</div>
                </div>
                <div className={styles.reportItem}>
                  <div className={styles.reportTitle}>Supporting systems</div>
                  <div className={styles.reportScore}>9.7</div>
                </div>
                <div className={styles.reportItem}>
                  <div className={styles.reportTitle}>Interiors & AC</div>
                  <div className={styles.reportScore}>9.6</div>
                </div>
                <div className={styles.reportItem}>
                  <div className={styles.reportTitle}>Exteriors & lights</div>
                  <div className={styles.reportScore}>9.3</div>
                </div>
              </div>
            </div>
          </section>

          {/* Feature & Specs */}
          <section id="specs" ref={specsRef} data-section="specs" className={styles.cdSection}>
            <h2 className={styles.cdSectionTitle}>Feature & Specs</h2>

            <div className={styles.cdCard}>
              <div className={styles.specsCardGrid}>
                <div className={styles.spec}>
                  <div className={styles.specTtl}>Mileage (ARAI)</div>
                  <div className={styles.specVal}>22.35 kmpl</div>
                </div>
                <div className={styles.spec}>
                  <div className={styles.specTtl}>Boot space</div>
                  <div className={styles.specVal}>318 litres</div>
                </div>
                <div className={styles.spec}>
                  <div className={styles.specTtl}>Displacement</div>
                  <div className={styles.specVal}>1197 cc</div>
                </div>
              </div>

              <div className={styles.features}>
                <h4>Top Features of this car</h4>
                <div className={styles.featuresGrid}>
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
          <section id="finance" ref={financeRef} data-section="finance" className={styles.cdSection}>
            <h2 className={styles.cdSectionTitle}>Finance</h2>

            <div className={styles.cdCard}>
              <div className={styles.financeCardEmi}>
                <div className={styles.emiLeft}>
                  <div className={styles.emiNumber}>₹9,400</div>
                  <div className={styles.meta}>per month (approx)</div>
                </div>
                <div className={styles.emiRight}>
                  <div className={styles.meta}>Loan Amount</div>
                  <div className={styles.value}>₹{(car.price - 110400).toLocaleString()}</div>
                  <div className={styles.meta}>Duration</div>
                  <div className={styles.value}>66 Months</div>
                </div>
              </div>

              <div className={styles.financeCta}>
                <button className={`${styles.btn} ${styles.btnPrimary}`}>Check eligibility</button>
              </div>
            </div>
          </section>

          <div style={{ height: 48 }} />
        </main>

        {/* RIGHT column wrapper (relative). This wrapper is used to switch fixed->absolute */}
        <aside className={styles.cdRight} ref={rightRef}>
          <div
            className={`${styles.cdRightCard} ${isStopped ? styles.cdRightStopCard : ""}`}
            ref={rightCardRef}
            style={
              isStopped
                ? { position: "absolute", bottom: 0, top: "auto", right: 0 }
                : { position: "fixed", top: `${TOPBAR_HEIGHT + 12}px` }
            }
          >
            <div className={styles.rightInner}>
              <div className={styles.titleRow}>
                <h3 className={styles.carTitle}>{car.title}</h3>
                <button className={styles.like} aria-label="save">
                  ♡
                </button>
              </div>

              <div className={styles.meta}>
                <div>
                  {car.km.toLocaleString()} km • {car.fuel} • {car.transmission}
                </div>
                <div className={styles.hub}>Spinny Car Hub, {car.city}</div>
              </div>

              <div className={styles.priceBlock}>
                <div className={styles.priceBlockLabel}>Fixed on road price</div>
                <div className={styles.priceBlockPrice}>₹{(car.price / 100000).toFixed(2)} L</div>
                <div className={styles.priceBlockSmall}>Includes RC transfer, insurance & more</div>
              </div>

              <div className={styles.cta}>
                <button className={styles.btnBook}>BOOK NOW</button>
                <button className={styles.btnTest}>FREE TEST DRIVE</button>
              </div>

              <div className={styles.share}>
                <p>Share with a friend :</p>
                <div className={styles.icons}>📷 • f • ✕ • ✉️</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
