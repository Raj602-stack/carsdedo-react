// src/pages/CarDetailsWeb.jsx
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import styles from "../styles/CarDetailsWeb.module.css";
import { RightDrawer } from "../components/RightDrawer";
import { FeaturesDrawer } from "../components/FeaturesDrawer";
import EMICalculator from "../components/EMICalculator";
import CarHero from "../components/CarHero";
import StickyTabs from "../components/StickyTabs";
import CarOverview from "../components/CarOverview";
import CarQualityReport from "../components/CarQualityReport";
import ReasonsToBuy from "../components/ReasonsToBuy";
import CarSpecs from "../components/CarSpecs";
import CarFeatures from "../components/CarFeatures";
import CarDetailsSidebar from "../components/CarDetailsSidebar";

import { useCars } from "../context/CarsContext";
import { normalizeCar, formatKm } from "../utils";
import { useShare } from "../hooks/useShare";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { TOPBAR_HEIGHT, SECTIONS } from "../constants/carDetails";
import Loader from "../components/Loader";
import ScrollToTop from "../components/ScrollToTop";

/**
 * CarDetailsWeb page
 * - sticky tab bar appears after hero scrolls out
 * - sticky tab bar width/left aligned to left content (not full width)
 * - scrollspy highlights active tab (IntersectionObserver + rAF fallback)
 * - right card is fixed while scrolling, but stops above footer
 * - Report summary card integrated + Full Report slide-over drawer
 */



export default function CarDetailsWeb() {
  const { cars, loading } = useCars();
  const { id } = useParams();
  const navigate = useNavigate();

  const rawCar = useMemo(() => 
    cars.find((c) => String(c.id) === String(id)),
    [cars, id]
  );

  const car = useMemo(() => 
    rawCar ? normalizeCar(rawCar) : null,
    [rawCar]
  );

  // Share functionality
  const handleShare = useShare(car, formatKm);

  // Features drawer state
const [showFeaturesDrawer, setShowFeaturesDrawer] = useState(false);
  const openFeaturesDrawer = useCallback(() => setShowFeaturesDrawer(true), []);
  const closeFeaturesDrawer = useCallback(() => setShowFeaturesDrawer(false), []);

  // Refs
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

  // Drawer refs
  const drawerRef = useRef(null);
  const drawerContentRef = useRef(null);
  const rdCoreRef = useRef(null);
  const rdSupportingRef = useRef(null);
  const rdInteriorsRef = useRef(null);
  const rdExteriorsRef = useRef(null);
  const rdWearRef = useRef(null);

  // State
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const [heroImage, setHeroImage] = useState(car?.image || "");
  const [stickyStyle, setStickyStyle] = useState({ left: 0, width: 720 });
  const [isStopped, setIsStopped] = useState(false);

  // Drawer state
  const [showReportDrawer, setShowReportDrawer] = useState(false);
  const [drawerActive, setDrawerActive] = useState("core");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerTabsInnerRef = useRef(null);
  const tabRefs = {
    core: useRef(null),
    supporting: useRef(null),
    interiors: useRef(null),
    exteriors: useRef(null),
    wear: useRef(null),
  };

  // Drawer functions
  const openDrawerTab = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Sections for scroll spy - refs are stable, so no need for dependencies
  const sections = useMemo(() => [
    { id: "overview", ref: overviewRef },
    { id: "report", ref: reportRef },
    { id: "specs", ref: specsRef },
    { id: "finance", ref: financeRef },
  ], []);

  // Scroll spy hook
  const { activeTab, setActiveTab, scrollToRef } = useScrollSpy(sections);

  // Hero observer for sticky tabs - improved to prevent flickering
  useEffect(() => {
    if (!heroRef.current) return;
    
    let rafId = null;
    let lastState = false;
    
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          // Cancel any pending animation frame
          if (rafId) {
            cancelAnimationFrame(rafId);
          }
          
          // Use requestAnimationFrame for smooth state updates
          rafId = requestAnimationFrame(() => {
            const shouldShow = !e.isIntersecting;
            // Only update if state actually changed to prevent flickering
            if (shouldShow !== lastState) {
              lastState = shouldShow;
              setShowStickyTabs(shouldShow);
            }
          });
        });
      },
      { 
        threshold: [0, 0.1, 0.2], // Multiple thresholds for smoother detection
        rootMargin: '-20px 0px 0px 0px' // Add small margin to trigger slightly before
      }
    );
    
    io.observe(heroRef.current);
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
    };
  }, []);

  // Sticky tab position updater
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

  // Right sticky card stop logic - stops when reaching footer
  useEffect(() => {
    function computeStop() {
      const footer = document.querySelector("footer");
      const right = rightRef.current;
      const card = rightCardRef.current;
      if (!right || !card || !footer) return;
      
      const footerRect = footer.getBoundingClientRect();
      const rightRect = right.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      
      // Check if card bottom would overlap footer top (with 12px margin)
      const wouldOverlap = rightRect.bottom >= footerRect.top - 12;
      
      setIsStopped(wouldOverlap);
      
      // If stopped, position card absolutely at bottom of container
      if (wouldOverlap) {
        const containerRect = right.getBoundingClientRect();
        const footerTop = footerRect.top;
        const maxBottom = footerTop - 12; // 12px margin above footer
        const cardHeight = cardRect.height;
        const availableTop = maxBottom - containerRect.top - cardHeight;
        
        // Set card position to stay above footer
        if (availableTop >= 0) {
          card.style.position = 'absolute';
          card.style.bottom = `${containerRect.bottom - maxBottom}px`;
          card.style.top = 'auto';
        } else {
          card.style.position = 'absolute';
          card.style.top = '0';
          card.style.bottom = 'auto';
        }
      } else {
        // Reset to default sticky behavior
        card.style.position = '';
        card.style.top = '';
        card.style.bottom = '';
      }
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

  // Update hero image when car changes
  useEffect(() => {
    if (car?.image) {
      setHeroImage(car.image);
    }
  }, [car?.image]);
 

  // Drawer functions
  const openReportDrawer = useCallback(() => {
    setShowReportDrawer(true);
    setDrawerActive("core");
      setTimeout(() => {
      if (drawerContentRef.current) drawerContentRef.current.scrollTop = 0;
    }, 60);
  }, []);

  const closeReportDrawer = useCallback(() => {
    setShowReportDrawer(false);
  }, []);

  // Close drawer on ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        if (showReportDrawer) closeReportDrawer();
        if (drawerOpen) closeDrawer();
        if (showFeaturesDrawer) closeFeaturesDrawer();
    }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showReportDrawer, drawerOpen, showFeaturesDrawer, closeReportDrawer, closeDrawer, closeFeaturesDrawer]);

  // ---------- DRAWER: scroll to a drawer section ----------
  function scrollDrawerTo(ref) {
    if (!ref?.current || !drawerContentRef.current) return;
    const container = drawerContentRef.current;
    const element = ref.current;
    const containerTop = container.scrollTop;
    const elementTop = element.offsetTop;
    const offset = 16; // Offset from top of container
    
    container.scrollTo({ 
      top: elementTop - offset, 
      behavior: "smooth" 
    });
    
    const id = element.dataset?.section;
    if (id) {
      // Update active state immediately for better UX
      setDrawerActive(id);
    }
  }

  // ---------- DRAWER: Auto-scroll active tab to center ----------
  useEffect(() => {
    if (!drawerTabsInnerRef.current || !tabRefs[drawerActive]?.current) return;
    
    const tabsContainer = drawerTabsInnerRef.current;
    const activeTab = tabRefs[drawerActive].current;
    
    if (!activeTab) return;
    
    const containerWidth = tabsContainer.offsetWidth;
    const tabLeft = activeTab.offsetLeft;
    const tabWidth = activeTab.offsetWidth;
    const tabCenter = tabLeft + tabWidth / 2;
    const scrollLeft = tabCenter - containerWidth / 2;
    
    tabsContainer.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: 'smooth'
    });
  }, [drawerActive, showReportDrawer]);

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
        // Sort by intersection ratio and position
        visible.sort((a, b) => {
          const ratioDiff = b.intersectionRatio - a.intersectionRatio;
          if (Math.abs(ratioDiff) > 0.1) return ratioDiff;
          // If ratios are close, prefer the one closer to top
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });
        const id = visible[0].target.dataset.section;
        if (id) {
          setDrawerActive((prev) => {
            if (prev !== id) {
              return id;
            }
            return prev;
          });
        }
      },
      { root: container, threshold: [0.1, 0.3, 0.5, 0.7], rootMargin: '-20% 0px -60% 0px' }
    );

    refs.forEach((r) => {
      if (r.el.current) io.observe(r.el.current);
    });

    // fallback rAF-based for better scroll detection
    let raf = null;
    let lastActive = "core";
    function fallback() {
      const scrollTop = container.scrollTop + 80; // Offset to detect section in view
      let current = "core";
      let minDistance = Infinity;
      
      // Find the section closest to the viewport center
      for (const r of refs) {
        const el = r.el.current;
        if (!el) continue;
        const elTop = el.offsetTop;
        const elHeight = el.offsetHeight;
        const elCenter = elTop + elHeight / 2;
        const distance = Math.abs(scrollTop - elCenter);
        
        if (elTop <= scrollTop + 100 && distance < minDistance) {
          minDistance = distance;
          current = r.id;
        }
      }
      
      if (current !== lastActive) {
        lastActive = current;
        setDrawerActive(current);
      }
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

  


  return (
    <div className={styles.carDetailsPageWrapper}>
      {/* Sticky tabs */}
      <StickyTabs
        showStickyTabs={showStickyTabs}
        activeTab={activeTab}
        onTabClick={(tabId) => {
          // Immediately update active tab for visual feedback
          setActiveTab(tabId);
          
          // Find section and scroll to it
          const section = sections.find(s => s.id === tabId);
          if (section && section.ref?.current) {
            scrollToRef(section.ref);
          }
        }}
        stickyStyle={stickyStyle}
      />

      {/* main container */}
      <div className={styles.carDetailsContainer} ref={containerRef}>
        {/* LEFT */}
        <main className={styles.cdLeft} ref={leftRef}>
          {/* Hero */}
          <div ref={heroRef}>
            <CarHero
              car={car}
              heroImage={heroImage}
              onImageChange={setHeroImage}
            />
          </div>

          {/* hero inline tabs */}
          <nav className={styles.cdHeroTabs} aria-label="Car sections">
            <button 
              type="button" 
              className={`${styles.heroTab} ${activeTab === "overview" ? styles.heroTabActive : ""}`} 
              onClick={() => {
                setActiveTab("overview");
                if (overviewRef?.current) {
                  scrollToRef(overviewRef);
                }
              }}
            >
              Overview
            </button>
            <button 
              type="button" 
              className={`${styles.heroTab} ${activeTab === "report" ? styles.heroTabActive : ""}`} 
              onClick={() => {
                setActiveTab("report");
                if (reportRef?.current) {
                  scrollToRef(reportRef);
                }
              }}
            >
              Report
            </button>
            <button 
              type="button" 
              className={`${styles.heroTab} ${activeTab === "specs" ? styles.heroTabActive : ""}`} 
              onClick={() => {
                setActiveTab("specs");
                if (specsRef?.current) {
                  scrollToRef(specsRef);
                }
              }}
            >
              Feature & Specs
            </button>
            <button 
              type="button" 
              className={`${styles.heroTab} ${activeTab === "finance" ? styles.heroTabActive : ""}`} 
              onClick={() => {
                setActiveTab("finance");
                if (financeRef?.current) {
                  scrollToRef(financeRef);
                }
              }}
            >
              Finance
            </button>
          </nav>

          {/* Overview */}
          <div ref={overviewRef} data-section="overview">
            <CarOverview car={car} />
                </div>

          {/* Quality Report */}
          <div ref={reportRef} data-section="report">
            <CarQualityReport car={car} onViewFullReport={openReportDrawer} />
                </div>

          {/* Reasons to Buy */}
          <div ref={reasonsRef} data-section="reasons">
            <ReasonsToBuy reasons={car?.reasonsToBuy || []} />
              </div>

          {/* Specs */}
          <div ref={specsRef} data-section="specs">
            <CarSpecs car={car} onViewAll={openDrawerTab} />
                </div>

          {/* Features */}
          <div data-section="features">
            <CarFeatures car={car} onViewAll={openFeaturesDrawer} />
                </div>

      {/* Right Drawer (Features + Specs) */}
      <RightDrawer
           open={drawerOpen}
           onClose={closeDrawer}
  specs={car?.specs || []}
/>

          {/* FINANCE */}
          <div ref={financeRef} data-section="finance">
            <EMICalculator />
          </div>

          <div style={{ height: 48 }} />
        </main>

        {/* Right sidebar */}
        <div ref={rightRef} className={styles.cdRight}>
          <div className={`${styles.cdRightCard} ${isStopped ? styles.cdRightCardStopped : ""}`} ref={rightCardRef}>
            <CarDetailsSidebar car={car} onShare={handleShare} />
          </div>
        </div>
      </div>

      {/* ---------- DRAWER (slide-over) ---------- */}
      {showReportDrawer && (
        <div className={styles.drawerWrap}>
          <div className={styles.drawerBackdrop} onClick={closeReportDrawer} />
          <aside className={styles.reportDrawer} ref={drawerRef} role="dialog" aria-modal="true">
            <div className={styles.drawerHeader}>
              <button type="button" className={styles.drawerClose} onClick={closeReportDrawer} aria-label="Close report">
                <FiArrowLeft />
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
              <div className={styles.drawerTabsInner} ref={drawerTabsInnerRef}>
                {(() => {
                  const getInspectionScore = (key) => {
                    const inspection = car?.inspections?.find(ins => 
                      ins.key === key || 
                      (key === 'core' && ins.title?.toLowerCase().includes('core')) ||
                      (key === 'supporting' && ins.title?.toLowerCase().includes('supporting')) ||
                      (key === 'interiors' && ins.title?.toLowerCase().includes('interior')) ||
                      (key === 'exteriors' && ins.title?.toLowerCase().includes('exterior')) ||
                      (key === 'wear' && ins.title?.toLowerCase().includes('wear'))
                    );
                    return inspection?.score || (key === 'core' ? 9.8 : key === 'supporting' ? 9.7 : key === 'interiors' ? 8.7 : key === 'exteriors' ? 7.7 : 7.1);
                  };
                  
                  return (
                    <>
                <button 
                  ref={tabRefs.core}
                  type="button" 
                  className={`${styles.drawerTab} ${drawerActive === "core" ? styles.drawerTabActive : ""}`} 
                  onClick={() => scrollDrawerTo(rdCoreRef)}
                >
                  <span className={styles.tabLabel}>Core systems</span>
                  {drawerActive !== "core" && <span className={styles.tabScore}>{getInspectionScore('core_systems')}</span>}
                </button>
                <button 
                  ref={tabRefs.supporting}
                  type="button" 
                  className={`${styles.drawerTab} ${drawerActive === "supporting" ? styles.drawerTabActive : ""}`} 
                  onClick={() => scrollDrawerTo(rdSupportingRef)}
                >
                  <span className={styles.tabLabel}>Supporting systems</span>
                  {drawerActive !== "supporting" && <span className={styles.tabScore}>{getInspectionScore('supporting_systems')}</span>}
                </button>
                <button 
                  ref={tabRefs.interiors}
                  type="button" 
                  className={`${styles.drawerTab} ${drawerActive === "interiors" ? styles.drawerTabActive : ""}`} 
                  onClick={() => scrollDrawerTo(rdInteriorsRef)}
                >
                  <span className={styles.tabLabel}>Interiors & AC</span>
                  {drawerActive !== "interiors" && <span className={styles.tabScore}>{getInspectionScore('interiors_ac')}</span>}
                </button>
                <button 
                  ref={tabRefs.exteriors}
                  type="button" 
                  className={`${styles.drawerTab} ${drawerActive === "exteriors" ? styles.drawerTabActive : ""}`} 
                  onClick={() => scrollDrawerTo(rdExteriorsRef)}
                >
                  <span className={styles.tabLabel}>Exteriors & lights</span>
                  {drawerActive !== "exteriors" && <span className={styles.tabScore}>{getInspectionScore('exteriors_lights')}</span>}
                </button>
                <button 
                  ref={tabRefs.wear}
                  type="button" 
                  className={`${styles.drawerTab} ${drawerActive === "wear" ? styles.drawerTabActive : ""}`} 
                  onClick={() => scrollDrawerTo(rdWearRef)}
                >
                  <span className={styles.tabLabel}>Wear & tear</span>
                  {drawerActive !== "wear" && <span className={styles.tabScore}>{getInspectionScore('wear_tear_parts')}</span>}
                </button>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className={styles.drawerContent} ref={drawerContentRef}>
              <section ref={rdCoreRef} data-section="core" className={styles.drawerSection}>
                {(() => {
                  const coreInspection = car?.inspections?.find(ins => 
                    ins.key === 'core_systems' || ins.title?.toLowerCase().includes('core')
                  );
                  
                  if (!coreInspection) {
                    return (
                      <>
                <div className={styles.drawerSectionHead}>
                  <div className={styles.drawerSectionTitle}>Core systems</div>
                  <div className={styles.drawerSectionScore}>
                    <div className={styles.pillScore}>9.8</div>
                    <div className={styles.pillLabel}>Excellent</div>
                  </div>
                </div>
                <div className={styles.drawerSectionSub}>196 parts across 3 assemblies</div>
                <ul className={styles.detailList}>
                  <li>Chassis — Minor imperfections</li>
                  <li>Engine — Flawless, no imperfections</li>
                  <li>Transmission — Flawless, no imperfections</li>
                </ul>
                      </>
                    );
                  }
                  
                  const score = coreInspection.score || 9.8;
                  const rating = coreInspection.rating ? coreInspection.rating.charAt(0).toUpperCase() + coreInspection.rating.slice(1) : 'Excellent';
                  const totalItems = (coreInspection.subsections || []).reduce((sum, sub) => sum + (sub.items || []).length, 0);
                  
                  return (
                    <>
                      <div className={styles.drawerSectionHead}>
                        <div className={styles.drawerSectionTitle}>{coreInspection.title}</div>
                        <div className={styles.drawerSectionScore}>
                          <div className={styles.pillScore}>{score}</div>
                          <div className={styles.pillLabel}>{rating}</div>
                        </div>
                      </div>
                      <div className={styles.drawerSectionSub}>
                        {totalItems} parts across {coreInspection.subsections.length} assemblies
                      </div>
                      {coreInspection.remarks && (
                        <div className={styles.callout}>✅ {coreInspection.remarks}</div>
                      )}
                      
                      {(coreInspection.subsections || []).map((subsection, subIdx) => (
                        <div key={subIdx} style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '18px' }}>
                              {subsection.status === 'flawless' ? '✅' : subsection.status === 'minor' ? '⚠️' : '❌'}
                            </span>
                            <div className={styles.drawerSectionSub} style={{ margin: 0, fontWeight: 600, fontSize: '15px', color: '#111827' }}>
                              {subsection.title}
                            </div>
                          </div>
                          {subsection.remarks && (
                            <div style={{ marginBottom: '12px', fontSize: '14px', color: '#6b7280', lineHeight: '1.6', paddingLeft: '26px' }}>
                              {subsection.remarks}
                            </div>
                          )}
                          {(subsection.items || []).length > 0 && (
                            <ul className={styles.detailList} style={{ marginTop: '12px' }}>
                              {subsection.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <strong>{item.name}</strong> — <span style={{ color: item.status === 'flawless' ? '#10b981' : item.status === 'minor' ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>
                                    {item.status === 'flawless' ? 'Flawless' : item.status === 'minor' ? 'Minor issues' : 'Major issues'}
                                  </span>
                                  {item.remarks && <span style={{ display: 'block', marginTop: '4px', color: '#6b7280', fontSize: '13px' }}>• {item.remarks}</span>}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </>
                  );
                })()}
              </section>

              <section ref={rdSupportingRef} data-section="supporting" className={styles.drawerSection}>
                {(() => {
                  const supportingInspection = car?.inspections?.find(ins => 
                    ins.key === 'supporting_systems' || ins.title?.toLowerCase().includes('supporting')
                  );
                  
                  if (!supportingInspection) {
                    return (
                      <>
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
                      </>
                    );
                  }
                  
                  const score = supportingInspection.score || 9.7;
                  const rating = supportingInspection.rating ? supportingInspection.rating.charAt(0).toUpperCase() + supportingInspection.rating.slice(1) : 'Excellent';
                  
                  return (
                    <>
                      <div className={styles.drawerSectionHead}>
                        <div className={styles.drawerSectionTitle}>{supportingInspection.title}</div>
                        <div className={styles.drawerSectionScore}>
                          <div className={styles.pillScore}>{score}</div>
                          <div className={styles.pillLabel}>{rating}</div>
                        </div>
                      </div>
                      <div className={styles.drawerSectionSub}>
                        {supportingInspection.description || `${supportingInspection.subsections.length} subsystems evaluated`}
                      </div>
                      {supportingInspection.remarks && (
                        <div className={styles.callout}>✅ {supportingInspection.remarks}</div>
                      )}
                      
                      {/* Render all 6 subsections */}
                      {(supportingInspection.subsections || []).map((subsection, subIdx) => (
                        <div key={subIdx} style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '18px' }}>
                              {subsection.status === 'flawless' ? '✅' : subsection.status === 'minor' ? '⚠️' : '❌'}
                            </span>
                            <div className={styles.drawerSectionSub} style={{ margin: 0, fontWeight: 600, fontSize: '15px', color: '#111827' }}>
                              {subsection.title}
                            </div>
                          </div>
                          {subsection.remarks && (
                            <div style={{ marginBottom: '12px', fontSize: '14px', color: '#6b7280', lineHeight: '1.6', paddingLeft: '26px' }}>
                              {subsection.remarks}
                            </div>
                          )}
                          {subsection.items && subsection.items.length > 0 && (
                            <ul className={styles.detailList} style={{ marginTop: '12px' }}>
                              {subsection.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <strong>{item.name}</strong> — <span style={{ color: item.status === 'flawless' ? '#10b981' : item.status === 'minor' ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>
                                    {item.status === 'flawless' ? 'Flawless' : item.status === 'minor' ? 'Minor issues' : 'Major issues'}
                                  </span>
                                  {item.remarks && <span style={{ display: 'block', marginTop: '4px', color: '#6b7280', fontSize: '13px' }}>• {item.remarks}</span>}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </>
                  );
                })()}
              </section>

              <section ref={rdInteriorsRef} data-section="interiors" className={styles.drawerSection}>
                {(() => {
                  const interiorsInspection = car?.inspections?.find(ins => 
                    ins.key === 'interiors_ac' || ins.title?.toLowerCase().includes('interior')
                  );
                  
                  if (!interiorsInspection) {
                    return (
                      <>
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
                      </>
                    );
                  }
                  
                  const score = interiorsInspection.score || 8.7;
                  const rating = interiorsInspection.rating ? interiorsInspection.rating.charAt(0).toUpperCase() + interiorsInspection.rating.slice(1) : 'Good';
                  
                  return (
                    <>
                      <div className={styles.drawerSectionHead}>
                        <div className={styles.drawerSectionTitle}>{interiorsInspection.title}</div>
                        <div className={styles.drawerSectionScore}>
                          <div className={styles.pillScore}>{score}</div>
                          <div className={styles.pillLabel}>{rating}</div>
                        </div>
                      </div>
                      <div className={styles.drawerSectionSub}>
                        {interiorsInspection.description || `${interiorsInspection.subsections.length} subsystems evaluated`}
                      </div>
                      {interiorsInspection.remarks && (
                        <div className={styles.callout}>✅ {interiorsInspection.remarks}</div>
                      )}
                      
                      {(interiorsInspection.subsections || []).map((subsection, subIdx) => (
                        <div key={subIdx} style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '18px' }}>
                              {subsection.status === 'flawless' ? '✅' : subsection.status === 'minor' ? '⚠️' : '❌'}
                            </span>
                            <div className={styles.drawerSectionSub} style={{ margin: 0, fontWeight: 600, fontSize: '15px', color: '#111827' }}>
                              {subsection.title}
                            </div>
                          </div>
                          {subsection.remarks && (
                            <div style={{ marginBottom: '12px', fontSize: '14px', color: '#6b7280', lineHeight: '1.6', paddingLeft: '26px' }}>
                              {subsection.remarks}
                            </div>
                          )}
                          {subsection.items && subsection.items.length > 0 && (
                            <ul className={styles.detailList} style={{ marginTop: '12px' }}>
                              {subsection.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <strong>{item.name}</strong> — <span style={{ color: item.status === 'flawless' ? '#10b981' : item.status === 'minor' ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>
                                    {item.status === 'flawless' ? 'Flawless' : item.status === 'minor' ? 'Minor issues' : 'Major issues'}
                                  </span>
                                  {item.remarks && <span style={{ display: 'block', marginTop: '4px', color: '#6b7280', fontSize: '13px' }}>• {item.remarks}</span>}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </>
                  );
                })()}
              </section>

              <section ref={rdExteriorsRef} data-section="exteriors" className={styles.drawerSection}>
                {(() => {
                  const exteriorsInspection = car?.inspections?.find(ins => 
                    ins.key === 'exteriors_lights' || ins.title?.toLowerCase().includes('exterior')
                  );
                  
                  if (!exteriorsInspection) {
                    return (
                      <>
                <div className={styles.drawerSectionHead}>
                  <div className={styles.drawerSectionTitle}>Exteriors & lights</div>
                  <div className={styles.drawerSectionScore}>
                    <div className={styles.pillScore}>7.7</div>
                    <div className={styles.pillLabel}>Fair</div>
                  </div>
                </div>
                <div className={styles.drawerSectionSub}>Panels, glasses, lights & fixtures</div>
                <div className={styles.calloutAlt}>ℹ️ Imperfections on body panels but no impact on build quality — ₹12,000 lower price tag</div>
                      </>
                    );
                  }
                  
                  // Calculate score if not provided
                  const allItems = (exteriorsInspection.subsections || []).flatMap(sub => (sub.items || []));
                  const statusValues = { flawless: 10, minor: 7, major: 4 };
                  const total = allItems.reduce((sum, item) => sum + (statusValues[item.status] || 5), 0);
                  const calculatedScore = allItems.length > 0 ? (total / allItems.length).toFixed(1) : 7.7;
                  const score = exteriorsInspection.score || parseFloat(calculatedScore);
                  const rating = exteriorsInspection.rating ? exteriorsInspection.rating.charAt(0).toUpperCase() + exteriorsInspection.rating.slice(1) : 'Fair';
                  
                  return (
                    <>
                      <div className={styles.drawerSectionHead}>
                        <div className={styles.drawerSectionTitle}>{exteriorsInspection.title}</div>
                        <div className={styles.drawerSectionScore}>
                          <div className={styles.pillScore}>{score}</div>
                          <div className={styles.pillLabel}>{rating}</div>
                        </div>
                      </div>
                      <div className={styles.drawerSectionSub}>
                        {exteriorsInspection.description || `${exteriorsInspection.subsections.length} subsystems evaluated`}
                      </div>
                      {exteriorsInspection.remarks && (
                        <div className={styles.calloutAlt}>ℹ️ {exteriorsInspection.remarks}</div>
                      )}
                      
                      {(exteriorsInspection.subsections || []).map((subsection, subIdx) => (
                        <div key={subIdx} style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '18px' }}>
                              {subsection.status === 'flawless' ? '✅' : subsection.status === 'minor' ? '⚠️' : '❌'}
                            </span>
                            <div className={styles.drawerSectionSub} style={{ margin: 0, fontWeight: 600, fontSize: '15px', color: '#111827' }}>
                              {subsection.title}
                            </div>
                          </div>
                          {subsection.remarks && (
                            <div style={{ marginBottom: '12px', fontSize: '14px', color: '#6b7280', lineHeight: '1.6', paddingLeft: '26px' }}>
                              {subsection.remarks}
                            </div>
                          )}
                          {subsection.items && subsection.items.length > 0 && (
                            <ul className={styles.detailList} style={{ marginTop: '12px' }}>
                              {subsection.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <strong>{item.name}</strong> — <span style={{ color: item.status === 'flawless' ? '#10b981' : item.status === 'minor' ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>
                                    {item.status === 'flawless' ? 'Flawless' : item.status === 'minor' ? 'Minor issues' : 'Major issues'}
                                  </span>
                                  {item.remarks && <span style={{ display: 'block', marginTop: '4px', color: '#6b7280', fontSize: '13px' }}>• {item.remarks}</span>}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </>
                  );
                })()}
              </section>

              <section ref={rdWearRef} data-section="wear" className={styles.drawerSection}>
                {(() => {
                  const wearInspection = car?.inspections?.find(ins => 
                    ins.key === 'wear_tear_parts' || ins.title?.toLowerCase().includes('wear')
                  );
                  
                  if (!wearInspection) {
                    return (
                      <>
                <div className={styles.drawerSectionHead}>
                  <div className={styles.drawerSectionTitle}>Wear & tear parts</div>
                  <div className={styles.drawerSectionScore}>
                    <div className={styles.pillScore}>7.1</div>
                    <div className={styles.pillLabel}>Fair</div>
                  </div>
                </div>
                <div className={styles.drawerSectionSub}>Tyres, clutch, brakes & more</div>
                <div className={styles.calloutAlt}>ℹ️ Few components have experienced wear and tear — ₹27,000 lower price tag</div>
                      </>
                    );
                  }
                  
                  const score = wearInspection.score || 7.1;
                  const rating = wearInspection.rating ? wearInspection.rating.charAt(0).toUpperCase() + wearInspection.rating.slice(1) : 'Fair';
                  
                  return (
                    <>
                      <div className={styles.drawerSectionHead}>
                        <div className={styles.drawerSectionTitle}>{wearInspection.title}</div>
                        <div className={styles.drawerSectionScore}>
                          <div className={styles.pillScore}>{score}</div>
                          <div className={styles.pillLabel}>{rating}</div>
                        </div>
                      </div>
                      <div className={styles.drawerSectionSub}>
                        {wearInspection.description || `${wearInspection.subsections.length} subsystems evaluated`}
                      </div>
                      {wearInspection.remarks && (
                        <div className={styles.calloutAlt}>ℹ️ {wearInspection.remarks}</div>
                      )}
                      
                      {(wearInspection.subsections || []).map((subsection, subIdx) => (
                        <div key={subIdx} style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <span style={{ fontSize: '18px' }}>
                              {subsection.status === 'flawless' ? '✅' : subsection.status === 'minor' ? '⚠️' : '❌'}
                            </span>
                            <div className={styles.drawerSectionSub} style={{ margin: 0, fontWeight: 600, fontSize: '15px', color: '#111827' }}>
                              {subsection.title}
                            </div>
                          </div>
                          {subsection.remarks && (
                            <div style={{ marginBottom: '12px', fontSize: '14px', color: '#6b7280', lineHeight: '1.6', paddingLeft: '26px' }}>
                              {subsection.remarks}
                            </div>
                          )}
                          {subsection.items && subsection.items.length > 0 && (
                            <ul className={styles.detailList} style={{ marginTop: '12px' }}>
                              {subsection.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <strong>{item.name}</strong> — <span style={{ color: item.status === 'flawless' ? '#10b981' : item.status === 'minor' ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>
                                    {item.status === 'flawless' ? 'Flawless' : item.status === 'minor' ? 'Minor issues' : 'Major issues'}
                                  </span>
                                  {item.remarks && <span style={{ display: 'block', marginTop: '4px', color: '#6b7280', fontSize: '13px' }}>• {item.remarks}</span>}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </>
                  );
                })()}
              </section>

              <div style={{ height: 56 }} />
            </div>
          </aside>
        </div>
      )}

{showFeaturesDrawer && (
  <FeaturesDrawer car={car} onClose={closeFeaturesDrawer} />
)}

      {!showReportDrawer && <ScrollToTop />}
    </div>
  );
}

