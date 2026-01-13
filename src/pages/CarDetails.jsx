import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/CarDetails.css";
import ReasonsToBuy from "../components/ReasonsToBuy";
import BasicInfo from "../components/BasicInfo";
import QualityReport from "../components/QualityReport";
import Specifications from "../components/Specifications";
import Features from "../components/Features";
import SwipableInsights from "../components/SwipableInsights";
import StoryCarousel from "../components/StoryCarousel";
import FaqMob from "../components/FaqMob";
import MobileMoreAbout from "../components/MobileMoreAbout";
import FooterMobile from "../components/FooterMobile";
import CarImageCarousel from "../components/CarImageCarousel";
import MobileReportDrawer from "../components/MobileReportDrawer";
import ScrollToTop from "../components/ScrollToTop";

import { useCars } from "../context/CarsContext";
import { normalizeCar } from "../utils";
import Loader from "../components/Loader";



export default function CarDetails() {
  // const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  // const passedCar = location.state && location.state.car ? location.state.car : null;
  // const [car, setCar] = useState(passedCar);


  const { cars, loading } = useCars();
const { id } = useParams();
const location = useLocation();

const passedCar = location.state?.car ?? null;

console.log('passedCar from location.state:', passedCar);

// Always get the raw car from context to ensure we have the original API data
// The passed car might be normalized, so we need the raw data for proper normalization
const rawCar = React.useMemo(() => {
  // Always prefer raw car from context to ensure we have insurance_valid_till, insurance_type, etc.
  if (!cars || !id) return null;
  const rawCarFromContext = cars.find((c) => String(c.id) === String(id));
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Raw car from context:', rawCarFromContext);
    console.log('Has insurance_valid_till?', rawCarFromContext?.insurance_valid_till);
    console.log('Has insurance_type?', rawCarFromContext?.insurance_type);
  }
  
  return rawCarFromContext || null;
}, [cars, id]);

const car = rawCar ? normalizeCar(rawCar) : null;

// Debug: Log the normalized car data being used in CarDetails
React.useEffect(() => {
  if (car && process.env.NODE_ENV === 'development') {
    console.log('=== CarDetails - Normalized Car Data ===');
    console.log('Full normalized car object:', car);
    console.log('Insurance fields:', {
      insuranceValid: car.insuranceValid,
      insuranceType: car.insuranceType,
    });
    console.log('Location fields:', {
      locationRto: car.locationRto,
      locationFull: car.locationFull,
      city: car.city,
    });
    console.log('Owner info:', {
      owner: car.owner,
    });
    console.log('Other key fields:', {
      makeYear: car.makeYear,
      regYear: car.regYear,
      km: car.km,
      fuel: car.fuel,
      transmission: car.transmission,
    });
    console.log('========================================');
  }
}, [car]);


  // useEffect(() => {
  //   const y = sessionStorage.getItem("cars_list_scroll");
  //   console.log(y);
  //   if (y) {
  //     window.scrollTo(0, Number(y));
  //     sessionStorage.removeItem("cars_list_scroll");
  //   }
  // }, []);

  useEffect(() => {
    const el = document.querySelector("main.cd-main");
    const y = sessionStorage.getItem("cd_main_scroll");
  
    if (el && y) {
      el.scrollTo({
        top: Number(y),
        behavior: "auto",
      });
      sessionStorage.removeItem("cd_main_scroll");
    }
  }, []);
  

  // deep-link fetch placeholder
  useEffect(() => {
    if (!car && params.id) {
      // fetch(`/api/cars/${params.id}`).then(r=>r.json()).then(setCar)
    }
  }, [car, params.id]);
 console.log(car);
  // images & carousel state
  const images = (car && (car.images || [car.thumb])) || [];

  // Report drawer state
  const [showReportDrawer, setShowReportDrawer] = useState(false);
  
  const openReportDrawer = () => {
    setShowReportDrawer(true);
  };
  
  const closeReportDrawer = () => {
    setShowReportDrawer(false);
  };
  const [idx, setIdx] = useState(0);

  // touch tracking to distinguish horizontal swipe vs vertical scroll
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isSwiping = useRef(false);

  useEffect(() => {
    if (idx >= images.length) setIdx(0);
  }, [images.length, idx]);

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);
  const goTo = (i) => setIdx(i);

  function handleTouchStart(e) {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    isSwiping.current = false;
  }

  function handleTouchMove(e) {
    if (!touchStartX.current || !touchStartY.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;

    // treat as horizontal swipe only when horizontal movement clearly dominates
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      isSwiping.current = true;
      e.preventDefault(); // prevent vertical page scroll while performing horizontal swipe
    }
  }

  function handleTouchEnd(e) {
    if (!touchStartX.current || !touchStartY.current) {
      touchStartX.current = null;
      touchStartY.current = null;
      isSwiping.current = false;
      return;
    }

    if (isSwiping.current) {
      const t = (e.changedTouches && e.changedTouches[0]) || null;
      const endX = t ? t.clientX : touchStartX.current;
      const dx = endX - touchStartX.current;

      if (dx > 40) prev();
      else if (dx < -40) next();
    }

    touchStartX.current = null;
    touchStartY.current = null;
    isSwiping.current = false;
  }

  console.log(car);

  // sections & refs
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "basic-info", label: "Basic info" },
    { id: "quality-report", label: "Quality report" },
    { id: "specifications", label: "specifications" },
    { id: "features", label: "features" },
    { id: "more", label: "more" },
   
  ];
  const [active, setActive] = useState("overview");
  const sectionRefs = useRef({});
  const registerRef = (id) => (el) => { sectionRefs.current[id] = el; };

  // container refs
  const mainRef = useRef(null);
  const carouselRef = useRef(null);
  const tabsRef = useRef(null);

  // tabs fixed state once carousel scrolls out
  const [fixedTabs, setFixedTabs] = useState(false);

  // optional compact header state
  const [compactHeader, setCompactHeader] = useState(false);

  // Refs to track previous values and prevent flickering
  const lastFixedTabsRef = useRef(false);
  const lastActiveRef = useRef(active);
  const rafIdRef = useRef(null);
  const carouselBottomScrollRef = useRef(0); // Store scroll position when carousel bottom reaches threshold

  // scroll handling: update fixedTabs, compactHeader, active tab
  useEffect(() => {
    const main = mainRef.current;
    const carousel = carouselRef.current;
    if (!main || !carousel) return;

    const ACTIVE_TAB_THRESHOLD = 140;
    const HEADER_HEIGHT = 64;
    const TABS_HEIGHT = 50;
    
    // Calculate the scroll position where carousel bottom reaches header + tabs
    const calculateThreshold = () => {
      if (!carousel) return 0;
      // Carousel offsetTop + height - (header + tabs height)
      return carousel.offsetTop + carousel.offsetHeight - (HEADER_HEIGHT + TABS_HEIGHT);
    };
    
    // Store threshold once
    const fixedThreshold = calculateThreshold();
    
    // Hysteresis: different thresholds for becoming fixed vs unfixed (prevents flickering)
    const FIXED_THRESHOLD_ON = fixedThreshold - 5;  // Become fixed slightly earlier
    const FIXED_THRESHOLD_OFF = fixedThreshold - 15; // Unfix slightly later (larger buffer)

    function update() {
      if (rafIdRef.current) return;
      
      rafIdRef.current = requestAnimationFrame(() => {
        const scrollTop = main.scrollTop;
        
        // Determine if tabs should be fixed using scroll position with hysteresis
        let shouldBeFixed;
        if (lastFixedTabsRef.current) {
          // Currently fixed: need to scroll up MORE to unfix (prevents rapid toggling)
          shouldBeFixed = scrollTop >= FIXED_THRESHOLD_OFF;
        } else {
          // Currently not fixed: become fixed when threshold is reached
          shouldBeFixed = scrollTop >= FIXED_THRESHOLD_ON;
        }
        
        // Only update if state actually changed
        if (shouldBeFixed !== lastFixedTabsRef.current) {
          lastFixedTabsRef.current = shouldBeFixed;
          setFixedTabs(shouldBeFixed);
          // Store the scroll position when state changes
          carouselBottomScrollRef.current = scrollTop;
        }

        // Compact header logic
        const headerThreshold = Math.max(60, carousel.offsetHeight - 80);
        setCompactHeader(scrollTop >= headerThreshold);

        // Active tab detection using offsetTop (more stable than getBoundingClientRect)
        let best = lastActiveRef.current;
        let bestScrollOffset = Infinity;
        
        for (const s of sections) {
          const el = sectionRefs.current[s.id];
          if (!el) continue;
          
          // Use offsetTop which is stable regardless of fixed tabs
          const sectionOffsetTop = el.offsetTop;
          const sectionScrollOffset = sectionOffsetTop - scrollTop;
          
          // Find the section that's closest to but above the threshold
          if (sectionScrollOffset <= ACTIVE_TAB_THRESHOLD && sectionScrollOffset >= -20) {
            if (sectionScrollOffset < bestScrollOffset) {
              best = s.id;
              bestScrollOffset = sectionScrollOffset;
            }
          }
        }
        
        // Fallback: if no section found above threshold, use the one just passed
        if (best === lastActiveRef.current) {
      for (const s of sections) {
        const el = sectionRefs.current[s.id];
        if (!el) continue;
            const sectionOffsetTop = el.offsetTop;
            const sectionScrollOffset = sectionOffsetTop - scrollTop;
            
            if (sectionScrollOffset < 0 && Math.abs(sectionScrollOffset) < Math.abs(bestScrollOffset)) {
          best = s.id;
              bestScrollOffset = sectionScrollOffset;
            }
          }
        }
        
        // Only update if different to prevent unnecessary re-renders
        if (best !== lastActiveRef.current && best !== active) {
          lastActiveRef.current = best;
          setActive(best);
      }
        
        rafIdRef.current = null;
      });
    }

    main.addEventListener("scroll", update, { passive: true });
    update(); // run once
    
    return () => {
      main.removeEventListener("scroll", update);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [active, sections]);

  const scrollTo = (id) => {
    const el = sectionRefs.current[id];
    const main = mainRef.current;
    if (!el || !main) return;
    const mainRect = main.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const delta = elRect.top - mainRect.top;
    const offset = (fixedTabs && tabsRef.current) ? tabsRef.current.offsetHeight + 12 : 12;
    main.scrollTo({ top: main.scrollTop + delta - offset, behavior: "smooth" });
  };

  if (loading) {
    return <Loader message="Loading car details..." fullScreen={true} />;
  }

  if (!car) {
    return (
      <div className="car-details-root">
        <div className="cd-header">
          <button onClick={() => navigate(-1)} className="cd-back">←</button>
          <div className="cd-title">CarsDedo</div>
          <div className="cd-actions" />
        </div>
        <main className="cd-main" ref={mainRef}>
          <div className="cd-empty">
            <h3>Car not found</h3>
            <p>Open the car from buy page or use a deep link.</p>
            <button className="btn-primary" onClick={() => navigate(-1)}>Back</button>
          </div>
        </main>
      </div>
    );
  }

  // basic info mapping
  const basicFields = [
    { k: "Make Year", v: car.makeYear ?? `Jan ${car.year ?? "-"}` },
    { k: "Reg. Year", v: car.regYear ?? `Jan ${car.year ?? "-"}` },
    { k: "Fuel", v: car.fuel ?? "-" },
    { k: "Km driven", v: car.km ?? "-" },
    { k: "Transmission", v: car.transmission ?? "-" },
    { k: "No. of Owner(s)", v: car.owner ?? "1st Owner" },
    { k: "Insurance Validity", v: car.insuranceValid ?? "—" },
    { k: "Insurance Type", v: car.insuranceType ?? "—" },
    { k: "RTO", v: car.locationRto ?? "-" },
    { k: "Car Location", v: car.locationFull ?? car.location ?? "-" },
  ];

  return (
    <div className="car-details-root" id="page-scroll">
      {/* header */}
      <header className={`cd-header ${compactHeader ? "compact" : ""}`}>
        <div className="left">
          <button onClick={() => navigate(-1)} className="cd-back" aria-label="Back">←</button>
        </div>

        <div className="center">
          {!compactHeader ? (
            <div className="brand-row">
              <div className="brand-name">CarsDedo</div>
            </div>
          ) : (
            <div className="model-row">
              <div className="model-name">{car.title ?? `${car.brand} ${car.model}`}</div>
              <div className="model-price">{car.price ?? "—"}</div>
            </div>
          )}
        </div>

        <div className="cd-actions">
          <button className="icon" aria-label="Search">🔍</button>
          <button className="icon" aria-label="Share">🔗</button>
          <button className="icon" aria-label="Wishlist">♡</button>
        </div>
      </header>

      {/* MAIN: carousel moved INSIDE the scrollable main so it scrolls with the page */}
      <main
        className="cd-main"
        ref={mainRef}
        style={fixedTabs ? { paddingTop: '58px' } : {}}
      >
        {/* Carousel now inside main (so it scrolls) */}
        <section
          className="cd-carousel"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* <div className="cd-image-wrap">
            {images.length > 0 ? (
              <img src={images[idx]} alt={`${car.title} - ${idx + 1}`} className="cd-image" />
            ) : (
              <div className="cd-image placeholder">No image</div>
            )}
          </div>

          {images.length > 1 && (
            <>
              <button className="cd-arrow left" onClick={prev} aria-label="Previous image">‹</button>
              <button className="cd-arrow right" onClick={next} aria-label="Next image">›</button>

              <div className="cd-dots">
                {images.map((_, i) => (
                  <button key={i} className={`cd-dot ${i === idx ? "active" : ""}`} onClick={() => goTo(i)} aria-label={`Go to image ${i+1}`} />
                ))}
              </div>

              <div className="cd-thumbs">
                {images.map((src, i) => (
                  <button key={i} className={`cd-thumb ${i === idx ? "active" : ""}`} onClick={() => goTo(i)}>
                    <img src={src} alt={`thumb-${i+1}`} />
                  </button>
                ))}
              </div>
            </>
          )} */}

<CarImageCarousel carId={params.id} />

        </section>

        {/* Tabs (in-flow; become fixed when fixedTabs === true) */}
        <div
          ref={tabsRef}
          className={`cd-tabs ${fixedTabs ? "fixed" : ""}`}
          role="tablist"
          aria-label="Details sections"
        >
          {/* {sections.map((s) => (
            <button
              key={s.id}
              className={`cd-tab ${active === s.id ? "active" : ""}`}
              onClick={() => scrollTo(s.id)}
              role="tab"
              aria-selected={active === s.id}
            >
              {s.label}
            </button>
          ))} */}

{sections.map((s) => (
  <button
    key={s.id}
    ref={(el) => {
      if (active === s.id && el) {
        el.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }}
    className={`cd-tab ${active === s.id ? "active" : ""}`}
    onClick={() => scrollTo(s.id)}
    role="tab"
    aria-selected={active === s.id}
  >
    {s.label}
  </button>
))}

        </div>

        {/* basic car data */}
        <div className="mobile-car-card">
      {/* Main Header Section */}
      <div className="car-header">
        <h1 className="car-title">{car.title}</h1>
        
        <div className="car-specs">
          <span className="spec-badge">
            {(() => {
              if (!car.km && car.km !== 0) return '-';
              if (typeof car.km === 'string' && car.km.includes('km')) return car.km;
              const kmNum = typeof car.km === 'number' ? car.km : parseInt(String(car.km).replace(/[^0-9]/g, ''), 10);
              if (isNaN(kmNum)) return '-';
              if (kmNum >= 1000 && kmNum < 100000) return `${Math.round(kmNum / 1000)}K km`;
              return `${kmNum.toLocaleString()} km`;
            })()}
          </span>
          <span className="spec-badge">{car.fuel || '-'}</span>
          {car.transmission && <span className="spec-badge">{car.transmission}</span>}
        </div>
      </div>

      {/* Price Section */}
      <div className="price-section">
        <div className="price-display">
          {car.originalPrice && car.originalPrice > car.price ? (
            <>
              <div className="original-price">
                {car.originalPrice >= 100000 
                  ? `₹${(car.originalPrice / 100000).toFixed(2)} Lakh`
                  : `₹${(car.originalPrice / 1000).toFixed(0)}k`}
              </div>
              <div className="current-price">
                {car.price >= 100000 
                  ? `₹${(car.price / 100000).toFixed(2)} Lakh`
                  : `₹${(car.price / 1000).toFixed(0)}k`}
              </div>
              {car.originalPrice - car.price > 0 && (
                <div className="discount-badge">
                  ₹{((car.originalPrice - car.price) / 1000).toFixed(0)}k off
                </div>
              )}
            </>
          ) : (
            <div className="current-price">
              {car.price >= 100000 
                ? `₹${(car.price / 100000).toFixed(2)} Lakh`
                : `₹${(car.price / 1000).toFixed(0)}k`}
            </div>
          )}
        </div>
        <div className="includes-text">Includes RC transfer, insurance & more</div>
      </div>

      {/* EMI Section */}
      <div className="emi-section">
        <div className="emi-label">Bonus: EMI starts @10.5%</div>
      </div>
    </div>
    <ReasonsToBuy ref={registerRef("overview")} car={car} />

        {/* Overview */}
        {/* <section id="overview" ref={registerRef("overview")} className="cd-section overview-section">
          <div className="overview-card">
            <h3>Reasons to buy</h3>
            <p className="muted">Rare price for a well maintained car — Priced ~₹10.5 lakhs lower compared to its original new car on-road price</p>
          </div>

          <div className="overview-card" style={{ marginTop: 14 }}>
            <h4>Your loan status <span className="brand-tag">S CAPITAL</span></h4>
            <p className="muted">Finance your dream car. Apply for a loan and pay in easy EMIs</p>
          </div>
        </section> */}

        {/* Basic info */}
        {/* <section id="basic-info" ref={registerRef("basic-info")} className="cd-section">
          <div className="cd-info-grid big">
            <h3 className="section-title">Basic info</h3>
            <div className="basic-grid">
              {basicFields.map((f, i) => (
                <div className="basic-row" key={i}>
                  <div className="basic-key">{f.k}</div>
                  <div className="basic-val">{f.v}</div>
                </div>
              ))}
            </div>
          </div>
        </section> */}
        <BasicInfo ref={registerRef("basic-info")} car={car} />
        <QualityReport ref={registerRef("quality-report")} car={car} onViewFullReport={openReportDrawer} />
        <Specifications ref={registerRef("specifications")} car={car} />
        <Features ref={registerRef("features")} car={car} />

        {/* Quality */}
        {/* <section id="quality-report" ref={registerRef("quality-report")} className="cd-section">
          <div className="cd-quality">
            <h3 className="section-title">Quality report</h3>
            <p className="muted">1430 parts evaluated by 5 automotive experts</p>
            <ul className="quality-list">
              <li>✅ Meter not tampered</li>
              <li>✅ Non-flooded</li>
              <li>✅ Core structure intact</li>
            </ul>
            <div className="q-list-cards">
              <div className="q-card"><div className="q-title">Core systems</div><div className="q-score">9.8</div></div>
              <div className="q-card"><div className="q-title">Supporting systems</div><div className="q-score">8.3</div></div>
              <div className="q-card"><div className="q-title">Interiors & AC</div><div className="q-score">8.8</div></div>
            </div>
          </div>
        </section> */}

        {/* Benefits */}
        {/* <section id="benefits" ref={registerRef("benefits")} className="cd-section">
          <div className="cd-info-grid">
            <h3 className="section-title">Benefits & add-ons</h3>
            <p className="muted">Exchange offers, warranty add-ons and other benefits available at purchase.</p>
            <div className="benefits-list">
              <div className="benefit">₹20,000 OFF with Exchange</div>
              <div className="benefit">1-year extended warranty</div>
              <div className="benefit">Doorstep test drive</div>
            </div>
          </div>
        </section> */}
<div ref={registerRef("more")} >
 <SwipableInsights/>
  <StoryCarousel/>
  <FaqMob/>
  <MobileMoreAbout/>
  </div>
      </main>

     

      {/* Footer CTAs */}
      <footer className="cd-footer">
        <button onClick={() => navigate(`/checkout/${car.id}`)} className="btn-primary large book">Book now</button>
        <button    onClick={() => navigate(`/test-drive/${car.id}`)} className="btn-outline free">Free test drive</button>
      </footer>
      
      {/* Mobile Report Drawer */}
      <MobileReportDrawer 
        open={showReportDrawer} 
        onClose={closeReportDrawer} 
        car={car} 
      />
      <ScrollToTop />
    </div>
  );
}
  