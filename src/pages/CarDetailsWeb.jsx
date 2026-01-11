// src/pages/CarDetails.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import styles from "../styles/CarDetailsWeb.module.css";
import '../components/RightDrawer'
import { RightDrawer } from "../components/RightDrawer";
import { FeaturesDrawer } from "../components/FeaturesDrawer";
import EMICalculator from "../components/EMICalculator";

import { useCars } from "../context/CarsContext";
import { normalizeCar } from "../utils"; // or wherever you placed it
import Loader from "../components/Loader";


/**
 * CarDetails page
 * - sticky tab bar appears after hero scrolls out
 * - sticky tab bar width/left aligned to left content (not full width)
 * - scrollspy highlights active tab (IntersectionObserver + rAF fallback)
 * - right card is fixed while scrolling, but stops above footer
 * - Report summary card integrated + Full Report slide-over drawer
 *
 * Keep TOPBAR_HEIGHT in sync with CSS :root --topbar-height
 */
const TOPBAR_HEIGHT = 68;



// sample data — replace with your real data or props
const sampleSpecs = [
  { id: "mileage", label: "Mileage (ARAI)", value: "14 kmpl", icon: "⏱" },
  { id: "ground_clearance", label: "Ground clearance", value: "205 mm", icon: "⬆️" },
  { id: "boot", label: "Boot space", value: "447 litres", icon: "🧳" },
  { id: "displacement", label: "Displacement", value: "1956 cc", icon: "🔧" },
];

const sampleFeatures = [
  { id: "fog", group: "Exterior", label: "Fog lamps", present: true },
  { id: "tail_led", group: "Exterior", label: "Tail lamps - LEDs", present: true },
  { id: "xenon", group: "Exterior", label: "Xenon headlamps / hid-headlamps", present: false },
  // ...more features
];

export default function CarDetails() {
  const { cars, loading } = useCars();
  const { id } = useParams();
  const rawCar = cars.find((c) => String(c.id) === String(id));
  const car = rawCar ? normalizeCar(rawCar) : null;




  // at top of component
const [showFeaturesDrawer, setShowFeaturesDrawer] = useState(false);

const openFeaturesDrawer = () => setShowFeaturesDrawer(true);
const closeFeaturesDrawer = () => setShowFeaturesDrawer(false);

 
  const navigate = useNavigate();
  // const car = carsData.find((c) => Number(c.id) === Number(id));

  const ignoreSpyRef = useRef(false);


  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const heroRef = useRef(null);
  const overviewRef = useRef(null);
  const reportRef = useRef(null);
  const specsRef = useRef(null);
  const financeRef = useRef(null);
  const reasonsRef = useRef(null);
  const rightRef = useRef(null);
  const rightCardRef = useRef(null);

  // main observers / raf refs
  const observerRef = useRef(null);
  const rafRef = useRef(null);

  // drawer refs
  const drawerRef = useRef(null);
  const drawerContentRef = useRef(null);
  const rdCoreRef = useRef(null);
  const rdSupportingRef = useRef(null);
  const rdInteriorsRef = useRef(null);
  const rdExteriorsRef = useRef(null);
  const rdWearRef = useRef(null);

  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [heroImage, setHeroImage] = useState(car ? car.image : "");
  const [stickyStyle, setStickyStyle] = useState({ left: 0, width: 720 });
  const [isStopped, setIsStopped] = useState(false);

  // drawer UI state
  const [showReportDrawer, setShowReportDrawer] = useState(false);
  const [drawerActive, setDrawerActive] = useState("core");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState("features"); // 'features' or 'specs'

  // open drawer and set active tab
  function openDrawerTab(tab = "features") {
    setDrawerTab(tab);
    setDrawerOpen(true);
  }

  // close drawer
  function closeDrawer() {
    setDrawerOpen(false);
  }

  // close on ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") closeDrawer();
    }
    if (drawerOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const sections = [
    { id: "overview", ref: overviewRef },
    { id: "report", ref: reportRef },
    { id: "specs", ref: specsRef },
    { id: "finance", ref: financeRef },
  ];

  // ---------- HERO observer for sticky tabs ----------
  useEffect(() => {
    if (!heroRef.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setShowStickyTabs(!e.isIntersecting)),
      { threshold: 0.04 }
    );
    io.observe(heroRef.current);
    return () => io.disconnect();
  }, []);

  // ---------- IntersectionObserver scrollspy (main page) ----------
  // useEffect(() => {
  //   if (observerRef.current) {
  //     observerRef.current.disconnect();
  //     observerRef.current = null;
  //   }
  //   const rootMargin = `-${TOPBAR_HEIGHT + 8}px 0px -40% 0px`;
  //   const io = new IntersectionObserver(
  //     (entries) => {
  //       const visible = entries.filter((e) => e.isIntersecting);
  //       if (!visible.length) return;
  //       visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
  //       const id = visible[0].target.dataset.section;
  //       if (id) setActiveTab((prev) => (prev === id ? prev : id));
  //     },
  //     { threshold: [0.0, 0.1, 0.25, 0.5, 0.75], rootMargin }
  //   );

  //   sections.forEach((s) => {
  //     if (s.ref.current) io.observe(s.ref.current);
  //   });

  //   observerRef.current = io;
  //   return () => {
  //     io.disconnect();
  //     observerRef.current = null;
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [overviewRef.current, reportRef.current, specsRef.current, financeRef.current]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    
    // Wait for all refs to be available
    const allRefsReady = sections.every(s => s.ref.current);
    if (!allRefsReady) return;
    
    const rootMargin = `-${TOPBAR_HEIGHT + 8}px 0px -40% 0px`;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        
        // Find the section with the highest intersection ratio
        let maxRatio = -1;
        let maxEntry = null;
        
        visible.forEach(entry => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            maxEntry = entry;
          }
        });
        
        if (maxEntry) {
          const id = maxEntry.target.dataset.section;
          if (id) {
            // Use functional update to ensure we get the latest state
            setActiveTab(prev => {
              // Only update if different to avoid unnecessary re-renders
              return prev === id ? prev : id;
            });
          }
        }
      },
      { 
        threshold: [0.0, 0.1, 0.25, 0.5, 0.75], 
        rootMargin 
      }
    );
  
    // Observe all sections
    sections.forEach((s) => {
      if (s.ref.current) {
        // Ensure each element has the data-section attribute
        if (!s.ref.current.dataset.section) {
          s.ref.current.dataset.section = s.id;
        }
        io.observe(s.ref.current);
      }
    });
  
    observerRef.current = io;
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [sections]); // Use sections array instead of individual refs

  // ---------- rAF fallback scrollspy ----------
  // useEffect(() => {
  //   const offset = TOPBAR_HEIGHT + 8;
  //   function computeByScroll() {
  //     const scrollPos = window.scrollY + offset + 6;
  //     let current = sections[0].id;
  //     for (let s of sections) {
  //       const el = s.ref.current;
  //       if (!el) continue;
  //       const top = el.getBoundingClientRect().top + window.scrollY;
  //       if (top <= scrollPos) current = s.id;
  //     }
  //     setActiveTab((prev) => (prev !== current ? current : prev));
  //     rafRef.current = null;
  //   }
  //   function onScroll() {
  //     if (rafRef.current !== null) return;
  //     rafRef.current = requestAnimationFrame(computeByScroll);
  //   }
  //   window.addEventListener("scroll", onScroll, { passive: true });
  //   window.addEventListener("resize", onScroll);
  //   onScroll();
  //   return () => {
  //     window.removeEventListener("scroll", onScroll);
  //     window.removeEventListener("resize", onScroll);
  //     if (rafRef.current) cancelAnimationFrame(rafRef.current);
  //     rafRef.current = null;
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // ---------- sticky tab position updater ----------
  const updateStickyPosition = useCallback(() => {
    if (!leftRef.current || !containerRef.current) return;
    const leftRect = leftRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const left = Math.max(containerRect.left + 12, leftRect.left);
    const width = Math.min(leftRect.width, 760);
    setStickyStyle({ left: Math.round(left), width: Math.round(width) });
  }, []);

  useEffect(() => {
    updateStickyPosition();
    window.addEventListener("resize", updateStickyPosition);
    window.addEventListener("load", updateStickyPosition);
    const mo = new MutationObserver(updateStickyPosition);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener("resize", updateStickyPosition);
      window.removeEventListener("load", updateStickyPosition);
      mo.disconnect();
    };
  }, [updateStickyPosition]);

  // ---------- right sticky card stop logic ----------
  useEffect(() => {
    function computeStop() {
      const footer = document.querySelector("footer");
      const right = rightRef.current;
      const card = rightCardRef.current;
      if (!right || !card || !footer) return;
      const footerRect = footer.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const wouldOverlap = cardRect.bottom >= footerRect.top - 12;
      setIsStopped(wouldOverlap);
    }
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

  // ---------- helper: scroll to page ref ----------
  // function scrollToRef(ref) {
  //   if (!ref?.current) return;
  //   const offset = TOPBAR_HEIGHT + 8;
  //   const top = ref.current.getBoundingClientRect().top + window.scrollY - offset;
  //   window.scrollTo({ top, behavior: "smooth" });
  //   const sec = ref.current.dataset?.section || null;
  //   console.log(sec);
  //   if (sec) setActiveTab(sec);
  //   setTimeout(() => window.dispatchEvent(new Event("scroll")), 350);
  // }


  function scrollToRef(ref) {
    if (!ref || !ref.current) return;
    
    const element = ref.current;
    // const offset = TOPBAR_HEIGHT + 8;
    const offset = TOPBAR_HEIGHT + 80;
    element.style.scrollMarginTop = `${offset}px`;

    const sec = element.dataset.section || element.getAttribute("data-section");
      console.log("Section found:", sec);
      
      if (sec && typeof setActiveTab === "function") {
        setActiveTab(sec);
      }

    
    
    // Method 1: Using scrollIntoView (simpler)
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
    
    // Method 2: Your approach but with better error handling
    try {
      // const elementTop = element.getBoundingClientRect().top + window.scrollY;
      // const offsetPosition = elementTop - offset;
      
      // window.scrollTo({
      //   top: offsetPosition,
      //   behavior: "smooth"
      // });
      
      // const sec = element.dataset.section || element.getAttribute("data-section");
      // console.log("Section found:", sec);
      
      // if (sec && typeof setActiveTab === "function") {
      //   setActiveTab(sec);
      // }
      
      // Wait for scroll to complete
      setTimeout(() => {
        window.dispatchEvent(new Event("scroll"));
      }, 500); // Increased timeout for longer animations
      
    } catch (error) {
      console.error("Scroll error:", error);
    }
  }
 

  // ---------- DRAWER: open/close & keyboard close ----------
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setShowReportDrawer(false);
    }
    if (showReportDrawer) document.addEventListener("keydown", onKey);
    else document.removeEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showReportDrawer]);

  function openReportDrawer() {
    setShowReportDrawer(true);
    setDrawerActive("core");
    // small scroll reset after mount
    setTimeout(() => {
      if (drawerContentRef.current) drawerContentRef.current.scrollTop = 0;
    }, 60);
  }
  function closeReportDrawer() {
    setShowReportDrawer(false);
  }

  // ---------- DRAWER: scroll to a drawer section ----------
  function scrollDrawerTo(ref) {
    if (!ref?.current || !drawerContentRef.current) return;
    const container = drawerContentRef.current;
    const top = ref.current.offsetTop;
    container.scrollTo({ top: top - 8, behavior: "smooth" });
    const id = ref.current.dataset?.section;
    if (id) setDrawerActive(id);
  }

  // ---------- DRAWER: scrollspy inside drawer ----------
  useEffect(() => {
    const container = drawerContentRef.current;
    if (!container) return;

    const refs = [
      { id: "core", el: rdCoreRef },
      { id: "supporting", el: rdSupportingRef },
      { id: "interiors", el: rdInteriorsRef },
      { id: "exteriors", el: rdExteriorsRef },
      { id: "wear", el: rdWearRef },
    ];

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = visible[0].target.dataset.section;
        if (id) setDrawerActive((prev) => (prev === id ? prev : id));
      },
      { root: container, threshold: [0.12, 0.4, 0.6] }
    );

    refs.forEach((r) => {
      if (r.el.current) io.observe(r.el.current);
    });

    // fallback rAF-based
    let raf = null;
    function fallback() {
      const scrollTop = container.scrollTop + 16;
      let current = "core";
      for (const r of refs) {
        const el = r.el.current;
        if (!el) continue;
        if (el.offsetTop <= scrollTop) current = r.id;
      }
      setDrawerActive((p) => (p === current ? p : current));
      raf = null;
    }
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(fallback);
    }
    container.addEventListener("scroll", onScroll, { passive: true });
    fallback();

    return () => {
      io.disconnect();
      container.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [showReportDrawer]);

  if (loading) {
    return <Loader message="Loading car details..." fullScreen={true} />;
  }

  if (!car) {
    return (
      <div className={styles.carDetailsPageWrapper}>
        <div className={styles.cdCard}>
          <p>Car not found</p>
          <button type="button" className={styles.btn} onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    );
  }

  const thumbs = car.images && car.images.length ? car.images : [car.image];
  


  return (
    <div className={styles.carDetailsPageWrapper}>
      {/* sticky tabs */}
      <div
        className={`${styles.cdStickyTabs} ${showStickyTabs ? styles.visible : ""}`}
        style={{
          top: `${TOPBAR_HEIGHT + 8}px`,
          left: `${stickyStyle.left}px`,
          width: `${stickyStyle.width}px`,
        }}
      >
        <div className={styles.cdStickyInner}>
          <button type="button" className={`${styles.cdTab} ${activeTab === "overview" ? styles.cdTabActive : ""}`} onClick={() => scrollToRef(overviewRef)}>
            Overview
          </button>
          <button type="button" className={`${styles.cdTab} ${activeTab === "report" ? styles.cdTabActive : ""}`} onClick={() => scrollToRef(reportRef)}>
            Report
          </button>
          <button type="button" className={`${styles.cdTab} ${activeTab === "specs" ? styles.cdTabActive : ""}`} onClick={() => scrollToRef(specsRef)}>
            Feature & Specs
          </button>
          <button type="button" className={`${styles.cdTab} ${activeTab === "finance" ? styles.cdTabActive : ""}`} onClick={() => scrollToRef(financeRef)}>
            Finance
          </button>
        </div>
      </div>

      {/* main container */}
      <div className={styles.carDetailsContainer} ref={containerRef}>
        {/* LEFT */}
        <main className={styles.cdLeft} ref={leftRef}>
          {/* HERO */}
          <div className={styles.cdHero} ref={heroRef}>
            <div className={styles.cdHeroInner}>
              <div className={styles.cdHeroImage}>
                <img src={heroImage} alt={car.title} />
                <div className={styles.cdHeroControls}>
                  <button type="button" className={styles.cdBack} onClick={() => navigate(-1)}>
                    ← Back
                  </button>
                </div>
              </div>

              <div className={styles.cdThumbs}>
                {thumbs.map((t, i) => (
                  <button
                    key={i}
                    type="button"
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

          {/* hero inline tabs */}
          <nav className={styles.cdHeroTabs} aria-label="Car sections">
            <button type="button" className={`${styles.heroTab} ${activeTab === "overview" ? styles.heroTabActive : ""}`} onClick={() => scrollToRef(overviewRef)}>
              Overview
            </button>
            <button type="button" className={`${styles.heroTab} ${activeTab === "report" ? styles.heroTabActive : ""}`} onClick={() => scrollToRef(reportRef)}>
              Report
            </button>
            <button type="button" className={`${styles.heroTab} ${activeTab === "specs" ? styles.heroTabActive : ""}`} onClick={() => scrollToRef(specsRef)}>
              Feature & Specs
            </button>
            <button type="button" className={`${styles.heroTab} ${activeTab === "finance" ? styles.heroTabActive : ""}`} onClick={() => scrollToRef(financeRef)}>
              Finance
            </button>
          </nav>

          {/* Overview */}
          <section id="overview" ref={overviewRef} data-section="overview" className={styles.cdSection}>
            <h2 className={styles.pageTitle}>Car Overview</h2>

            <div className={styles.overviewCard}>
              {/* Row 1 */}
              <div className={styles.overviewRow}>
                <div className={styles.overviewField}>
                  <div className={styles.fieldLabel}>Make Year</div>
                  <div className={styles.fieldValue}>
                    {car.makeYear ? (typeof car.makeYear === 'string' && car.makeYear.includes('-') ? car.makeYear : car.makeYear.toString()) : (car.year ? car.year.toString() : "-")}
                  </div>
                </div>

                <div className={styles.overviewField}>
                  <div className={styles.fieldLabel}>Registration Year</div>
                  <div className={styles.fieldValue}>
                    {car.regYear ? (typeof car.regYear === 'string' && car.regYear.includes('-') ? car.regYear : car.regYear.toString()) : (car.year ? car.year.toString() : "-")}
                  </div>
                </div>

                <div className={styles.overviewField}>
                  <div className={styles.fieldLabel}>Fuel Type</div>
                  <div className={styles.fieldValue}>{car.fuel || "-"}</div>
                </div>
              </div>

              {/* Row 2 */}
              <div className={styles.overviewRow}>
                <div className={styles.overviewField}>
                  <div className={styles.fieldLabel}>Km driven</div>
                  <div className={styles.fieldValueLarge}>{formatKm(car.km)}</div>
                </div>

                <div className={styles.overviewField}>
                  <div className={styles.fieldLabel}>Transmission</div>
                  <div className={styles.fieldValue}>{car.transmission || "-"}</div>
                </div>

                <div className={styles.overviewField}>
                  <div className={styles.fieldLabel}>No. of Owner</div>
                  <div className={styles.fieldValue}>{car.owner || "1st Owner"}</div>
                </div>
              </div>

              {/* Row 3 */}
              <div className={styles.overviewRow}>
                <div className={styles.overviewField}>
                  <div className={styles.fieldLabel}>Insurance Validity</div>
                  <div className={styles.fieldValue}>
                    {(() => {
                      if (!car.insuranceValid) return "-";
                      try {
                        // Format date like "2026-08-10" to "Aug 2026"
                        if (typeof car.insuranceValid === 'string' && car.insuranceValid.includes('-')) {
                          const date = new Date(car.insuranceValid);
                          if (!isNaN(date.getTime())) {
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            return `${months[date.getMonth()]} ${date.getFullYear()}`;
                          }
                        }
                        return car.insuranceValid;
                      } catch (e) {
                        return car.insuranceValid;
                      }
                    })()}
                  </div>
                </div>

                <div className={styles.overviewField}>
                  <div className={styles.fieldLabel}>Insurance Type</div>
                  <div className={styles.fieldValue}>
                    {car.insuranceType 
                      ? (typeof car.insuranceType === 'string' 
                          ? car.insuranceType.charAt(0).toUpperCase() + car.insuranceType.slice(1).toLowerCase()
                          : car.insuranceType)
                      : "-"}
                  </div>
                </div>

                <div className={styles.overviewField}>
                  <div className={styles.fieldLabel}>RTO</div>
                  <div className={styles.fieldValue}>{car.locationRto || "-"}</div>
                </div>
              </div>

              {/* Row 4: Car Location spans full width */}
              <div className={`${styles.overviewRow} ${styles.locationRow}`}>
                <div>
                  <div className={styles.locationLabel}>Car Location</div>
                  <div className={styles.locationValue}>{car.locationFull || car.city || "-"}</div>
                </div>
              </div>
            </div>
          </section>

          {/* REPORT - using actual inspection data */}
<section id="report" ref={reportRef} data-section="report" className={`${styles.cdSection} ${styles.reportSection}`}>
  <h2 className={styles.cdSectionTitle}>Quality Report</h2>
  {(() => {
    // Calculate total parts
    const totalParts = car?.inspections 
      ? car.inspections.reduce((total, insp) => 
          total + insp.subsections.reduce((subTotal, sub) => subTotal + sub.items.length, 0), 0
        )
      : 0;
    
    // Helper to calculate score
    const calculateScore = (items) => {
      if (!items || items.length === 0) return 0;
      const statusValues = { flawless: 10, minor: 7, major: 4 };
      const total = items.reduce((sum, item) => sum + (statusValues[item.status] || 5), 0);
      return (total / items.length).toFixed(1);
    };
    
    // Helper to get rating
    const getRating = (score) => {
      const num = parseFloat(score);
      if (num >= 9) return "Excellent";
      if (num >= 7) return "Good";
      if (num >= 5) return "Average";
      return "Fair";
    };
    
    // Get systems from inspections
    const systems = car?.inspections?.length > 0
      ? car.inspections.map((inspection) => {
          const allItems = inspection.subsections.flatMap(sub => sub.items);
          const score = calculateScore(allItems);
          return {
            category: inspection.title,
            description: inspection.subsections[0]?.title || "",
            score: parseFloat(score),
            rating: getRating(score),
            key: inspection.key,
          };
        })
      : [];
    
    // Extract positive findings
    const findings = car?.inspections
      ? car.inspections
          .flatMap(inspection => 
            inspection.subsections.flatMap(sub => 
              sub.items
                .filter(item => item.status === 'flawless')
                .slice(0, 3)
                .map(item => item.name)
            )
          )
          .slice(0, 3)
      : [];
    
    if (systems.length === 0) return null;
    
    return (
      <>
        <p className={styles.meta}>{totalParts} parts evaluated by automotive experts</p>

        <div className={styles.reportSummaryCard}>
          {/* top badges */}
          {findings.length > 0 && (
            <div className={styles.badgesRow}>
              {findings.map((finding, idx) => (
                <span key={idx} className={styles.badge}>✓ {finding}</span>
              ))}
            </div>
          )}

          {/* main two-column inside the card */}
          <div className={styles.reportGridTwoCol}>
            {/* LEFT: stacked list with icons, descriptions and their individual ratings */}
            <div className={styles.reportLeftList}>
              {systems.map((system, idx) => (
                <div key={idx} className={styles.reportLeftItem}>
                  <div className={styles.reportLeftIcon}>
                    {idx === 0 ? '🛠' : idx === 1 ? '🎧' : '⚙️'}
                  </div>
                  <div className={styles.reportLeftText}>
                    <div className={styles.reportLeftTitle}>{system.category}</div>
                    <div className={styles.reportLeftSub}>{system.description}</div>
                  </div>

                  {/* rating */}
                  <div className={styles.itemRatingWrap}>
                    <div className={styles.scorePillLarge}>
                      <div className={styles.scoreNumLarge}>{system.score}</div>
                      <div className={styles.scoreLabelSmall}>{system.rating}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: CTA */}
            <div className={styles.reportRightCol}>
              <div className={styles.reportRightBottom}>
                <div className={styles.nextServiceWithExtra}>
                  <div className={styles.nextServiceText}>No immediate servicing required</div>
                </div>

                <button type="button" className={styles.viewReportBtn} onClick={openReportDrawer}>
                  View full report
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  })()}
</section>

{/* Reasons to Buy Section */}
<section data-section="reasons" ref={reasonsRef} className={styles.reasonsSection}>
  <h2 className={styles.sectionTitle}>Why Choose This Car?</h2>
  <div className={styles.reasonsGrid}>
    {(car?.reasonsToBuy || []).map((reason, idx) => (
      <div key={idx} className={styles.reasonCard}>
        <div className={styles.reasonIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className={styles.reasonContent}>
          <h3 className={styles.reasonTitle}>{reason.title}</h3>
          <p className={styles.reasonDescription}>{reason.description}</p>
        </div>
      </div>
    ))}
  </div>
</section>

{/* Specs Section */}
<section data-section="specs" ref={specsRef} className={styles.specsSection}>
  <h2 className={styles.sectionTitle}>Car Specifications</h2>
  <p className={styles.sectionSubtitle}>Detailed technical specifications</p>
  
  {(() => {
    const specsByCategory = {};
    if (car?.specs && car.specs.length > 0) {
      car.specs.forEach(spec => {
        if (!specsByCategory[spec.category]) {
          specsByCategory[spec.category] = [];
        }
        specsByCategory[spec.category].push(spec);
      });
    }
    const categories = Object.keys(specsByCategory);
    
    return categories.length > 0 ? (
      <div className={styles.specsCategories}>
        {categories.map((category, catIdx) => (
          <div key={catIdx} className={styles.specCategory}>
            <h3 className={styles.categoryTitle}>{category}</h3>
            <div className={styles.specsGrid}>
              {specsByCategory[category].map((spec, specIdx) => (
                <div key={specIdx} className={styles.specItem}>
                  <div className={styles.specLabel}>{spec.label}</div>
                  <div className={styles.specValue}>{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ) : null;
  })()}
  
  <div className={styles.specsActions}>
    <button
      type="button"
      className={styles.viewAllBtn}
      onClick={() => openDrawerTab("specs")}
    >
      VIEW ALL SPECIFICATIONS
    </button>
  </div>
</section>

{/* Features Section */}
<section data-section="features" className={styles.featuresSection}>
  <h2 className={styles.sectionTitle}>Car Features</h2>
  <p className={styles.sectionSubtitle}>All the features this car has to offer</p>
  
  <div className={styles.featuresCategories}>
    {(car?.featuresByCategory || []).slice(0, 3).map((category, catIdx) => (
      <div key={catIdx} className={styles.featureCategory}>
        <h3 className={styles.categoryTitle}>{category.category}</h3>
        <div className={styles.featuresList}>
          {category.items.slice(0, 6).map((feature, featIdx) => (
            <div key={featIdx} className={styles.featureItem}>
              <svg className={styles.featureCheck} width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={styles.featureName}>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
  
  <div className={styles.featuresActions}>
    <button
      type="button"
      className={styles.viewAllBtn}
      onClick={openFeaturesDrawer}
    >
      VIEW ALL FEATURES
    </button>
  </div>
</section>

{/* Right Drawer (Features + Specs) */}
<RightDrawer
  open={drawerOpen}
  activeTab={drawerTab}
  onClose={closeDrawer}
  specs={car?.specs || []}
  features={car?.featuresByCategory || []}
  onTabChange={(tab) => setDrawerTab(tab)}
/>

          {/* FINANCE */}
          {/* <section id="finance" ref={financeRef} data-section="finance" className={styles.cdSection}>
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
                <button type="button" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Check eligibility
                </button>
              </div>
            </div>
          </section> */}
          <EMICalculator refi={financeRef}/>

          <div style={{ height: 48 }} />
        </main>

        {/* RIGHT sticky card (keeps original styling) */}
        <aside className={styles.cdRight} ref={rightRef}>
          <div
            className={`${styles.cdRightCard}`}
            ref={rightCardRef}
           
          >
            <div className={styles.rightInner}>
              <div className={styles.titleRow}>
                <h3 className={styles.carTitle}>{car.title}</h3>
                <button type="button" className={styles.like} aria-label="save">
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
                <button onClick={() =>
  navigate(`/car/${car.id}/book`, {
    state: { car }
  })
}
 type="button" className={styles.btnBook}>
                  BOOK NOW
                </button>
                <button 
                  type="button" 
                  className={styles.btnTest}
                  onClick={() => navigate(`/test-drive/${car.id}`)}
                >
                  FREE TEST DRIVE
                </button>
              </div>

              <div className={styles.share}>
                <p>Share with a friend :</p>
                <div className={styles.icons}>📷 • f • ✕ • ✉️</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ---------- DRAWER (slide-over) ---------- */}
      {showReportDrawer && (
        <div className={styles.drawerWrap}>
          <div className={styles.drawerBackdrop} onClick={closeReportDrawer} />
          <aside className={styles.reportDrawer} ref={drawerRef} role="dialog" aria-modal="true">
            <div className={styles.drawerHeader}>
              <button type="button" className={styles.drawerClose} onClick={closeReportDrawer}>
                ←
              </button>
              <div>
                <h3 className={styles.drawerTitle}>Car quality report</h3>
                <div className={styles.drawerSub}>
                  {car.title} • {formatKm(car.km)} • {car.fuel}
                </div>
              </div>
            </div>

            {/* horizontally scrollable tabs with scores */}
            <div className={styles.drawerTabs} role="tablist" aria-label="Report sections">
              <div className={styles.drawerTabsInner}>
                <button type="button" className={`${styles.drawerTab} ${drawerActive === "core" ? styles.drawerTabActive : ""}`} onClick={() => scrollDrawerTo(rdCoreRef)}>
                  Core systems <span className={styles.tabScore}>9.8</span>
                </button>
                <button type="button" className={`${styles.drawerTab} ${drawerActive === "supporting" ? styles.drawerTabActive : ""}`} onClick={() => scrollDrawerTo(rdSupportingRef)}>
                  Supporting systems <span className={styles.tabScore}>9.7</span>
                </button>
                <button type="button" className={`${styles.drawerTab} ${drawerActive === "interiors" ? styles.drawerTabActive : ""}`} onClick={() => scrollDrawerTo(rdInteriorsRef)}>
                  Interiors & AC <span className={styles.tabScore}>8.7</span>
                </button>
                <button type="button" className={`${styles.drawerTab} ${drawerActive === "exteriors" ? styles.drawerTabActive : ""}`} onClick={() => scrollDrawerTo(rdExteriorsRef)}>
                  Exteriors & lights <span className={styles.tabScore}>7.7</span>
                </button>
                <button type="button" className={`${styles.drawerTab} ${drawerActive === "wear" ? styles.drawerTabActive : ""}`} onClick={() => scrollDrawerTo(rdWearRef)}>
                  Wear & tear <span className={styles.tabScore}>7.1</span>
                </button>
              </div>
            </div>

            <div className={styles.drawerContent} ref={drawerContentRef}>
              <section ref={rdCoreRef} data-section="core" className={styles.drawerSection}>
                <div className={styles.drawerSectionHead}>
                  <div className={styles.drawerSectionTitle}>Core systems</div>
                  <div className={styles.drawerSectionScore}>
                    <div className={styles.pillScore}>9.8</div>
                    <div className={styles.pillLabel}>Excellent</div>
                  </div>
                </div>

                <div className={styles.drawerSectionSub}>196 parts across 3 assemblies</div>
                <div className={styles.callout}>✅ Chassis — Minor imperfections, most were restored</div>

                <ul className={styles.detailList}>
                  <li>Chassis — Minor imperfections</li>
                  <li>Engine — Flawless, no imperfections</li>
                  <li>Transmission — Flawless, no imperfections</li>
                </ul>
              </section>

              <section ref={rdSupportingRef} data-section="supporting" className={styles.drawerSection}>
                <div className={styles.drawerSectionHead}>
                  <div className={styles.drawerSectionTitle}>Supporting systems</div>
                  <div className={styles.drawerSectionScore}>
                    <div className={styles.pillScore}>9.7</div>
                    <div className={styles.pillLabel}>Excellent</div>
                  </div>
                </div>
                <div className={styles.drawerSectionSub}>Fuel supply, ignition & other systems</div>
                <ul className={styles.detailList}>
                  <li>Fuel pump — Good</li>
                  <li>Ignition — No issues</li>
                </ul>
              </section>

              <section ref={rdInteriorsRef} data-section="interiors" className={styles.drawerSection}>
                <div className={styles.drawerSectionHead}>
                  <div className={styles.drawerSectionTitle}>Interiors & AC</div>
                  <div className={styles.drawerSectionScore}>
                    <div className={styles.pillScore}>8.7</div>
                    <div className={styles.pillLabel}>Good</div>
                  </div>
                </div>
                <div className={styles.drawerSectionSub}>Seats, AC, audio & other features</div>
                <ul className={styles.detailList}>
                  <li>Seats — Good</li>
                  <li>AC — Cold</li>
                </ul>
              </section>

              <section ref={rdExteriorsRef} data-section="exteriors" className={styles.drawerSection}>
                <div className={styles.drawerSectionHead}>
                  <div className={styles.drawerSectionTitle}>Exteriors & lights</div>
                  <div className={styles.drawerSectionScore}>
                    <div className={styles.pillScore}>7.7</div>
                    <div className={styles.pillLabel}>Fair</div>
                  </div>
                </div>
                <div className={styles.drawerSectionSub}>Panels, glasses, lights & fixtures</div>
                <div className={styles.calloutAlt}>ℹ️ Imperfections on body panels but no impact on build quality — ₹12,000 lower price tag</div>
              </section>

              <section ref={rdWearRef} data-section="wear" className={styles.drawerSection}>
                <div className={styles.drawerSectionHead}>
                  <div className={styles.drawerSectionTitle}>Wear & tear parts</div>
                  <div className={styles.drawerSectionScore}>
                    <div className={styles.pillScore}>7.1</div>
                    <div className={styles.pillLabel}>Fair</div>
                  </div>
                </div>
                <div className={styles.drawerSectionSub}>Tyres, clutch, brakes & more</div>
                <div className={styles.calloutAlt}>ℹ️ Few components have experienced wear and tear — ₹27,000 lower price tag</div>
              </section>

              <div style={{ height: 56 }} />
            </div>
          </aside>
        </div>
      )}

{showFeaturesDrawer && (
  <FeaturesDrawer onClose={closeFeaturesDrawer} />
)}

    </div>
  );
}

// helper
function formatKm(n) {
  if (n == null) return "";
  if (n >= 1000 && n < 100000) return `${Math.round(n / 1000)}K km`;
  return `${n.toLocaleString()} km`;
}
