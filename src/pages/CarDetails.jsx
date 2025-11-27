import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/CarDetails.css";

export default function CarDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const passedCar = location.state && location.state.car ? location.state.car : null;
  const [car, setCar] = useState(passedCar);

  // deep-link fetch placeholder
  useEffect(() => {
    if (!car && params.id) {
      // fetch(`/api/cars/${params.id}`).then(r=>r.json()).then(setCar)
    }
  }, [car, params.id]);

  // images & carousel state
  const images = (car && (car.images || [car.thumb])) || [];
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

  // sections & refs
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "basic-info", label: "Basic info" },
    { id: "quality-report", label: "Quality report" },
    { id: "benefits", label: "Benefits & add-ons" },
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

  // scroll handling: update fixedTabs, compactHeader, active tab
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    function update() {
      const carousel = carouselRef.current;
      const headerHeight = 64; // adjust if header CSS changes
      if (carousel) {
        const mainRect = main.getBoundingClientRect();
        const carouselRect = carousel.getBoundingClientRect();
        // carouselBottomRelative = distance from main top to carousel bottom
        const carouselBottomRelative = carouselRect.bottom - mainRect.top;
        // when carousel bottom has moved up past headerHeight, fix tabs
        setFixedTabs(carouselBottomRelative <= headerHeight + 6);
      }

      if (carousel) {
        const mainScrollTop = main.scrollTop;
        const threshold = Math.max(60, (carousel.offsetHeight || 300) - 80);
        setCompactHeader(mainScrollTop >= threshold);
      }

      // active tab detection: choose the last section whose top is <= 120px from main top
      const mainRect2 = main.getBoundingClientRect();
      let best = active;
      let bestOffset = -Infinity;
      for (const s of sections) {
        const el = sectionRefs.current[s.id];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const topOffset = r.top - mainRect2.top;
        if (topOffset <= 120 && topOffset > bestOffset) {
          best = s.id;
          bestOffset = topOffset;
        }
      }
      if (best !== active) setActive(best);
    }

    main.addEventListener("scroll", update, { passive: true });
    update(); // run once
    return () => main.removeEventListener("scroll", update);
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

  if (!car) {
    return (
      <div className="car-details-root">
        <div className="cd-header">
          <button onClick={() => navigate(-1)} className="cd-back">←</button>
          <div className="cd-title">Spinny</div>
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
    { k: "Transmission", v: car.trans ?? "-" },
    { k: "No. of Owner(s)", v: car.owner ?? "1st Owner" },
    { k: "Insurance Validity", v: car.insuranceValid ?? "—" },
    { k: "Insurance Type", v: car.insuranceType ?? "—" },
    { k: "RTO", v: car.locationRto ?? "-" },
    { k: "Car Location", v: car.locationFull ?? car.location ?? "-" },
  ];

  return (
    <div className="car-details-root">
      {/* header */}
      <header className={`cd-header ${compactHeader ? "compact" : ""}`}>
        <div className="left">
          <button onClick={() => navigate(-1)} className="cd-back" aria-label="Back">←</button>
        </div>

        <div className="center">
          {!compactHeader ? (
            <div className="brand-row">
              <div className="brand-name">Spinny</div>
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
        style={fixedTabs ? { paddingTop: (tabsRef.current ? tabsRef.current.offsetHeight + 12 : 64) } : {}}
      >
        {/* Carousel now inside main (so it scrolls) */}
        <section
          className="cd-carousel"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="cd-image-wrap">
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
          )}
        </section>

        {/* Tabs (in-flow; become fixed when fixedTabs === true) */}
        <div
          ref={tabsRef}
          className={`cd-tabs ${fixedTabs ? "fixed" : ""}`}
          role="tablist"
          aria-label="Details sections"
        >
          {sections.map((s) => (
            <button
              key={s.id}
              className={`cd-tab ${active === s.id ? "active" : ""}`}
              onClick={() => scrollTo(s.id)}
              role="tab"
              aria-selected={active === s.id}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        <section id="overview" ref={registerRef("overview")} className="cd-section overview-section">
          <div className="overview-card">
            <h3>Reasons to buy</h3>
            <p className="muted">Rare price for a well maintained car — Priced ~₹10.5 lakhs lower compared to its original new car on-road price</p>
          </div>

          <div className="overview-card" style={{ marginTop: 14 }}>
            <h4>Your loan status <span className="brand-tag">S CAPITAL</span></h4>
            <p className="muted">Finance your dream car. Apply for a loan and pay in easy EMIs</p>
          </div>
        </section>

        {/* Basic info */}
        <section id="basic-info" ref={registerRef("basic-info")} className="cd-section">
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
        </section>

        {/* Quality */}
        <section id="quality-report" ref={registerRef("quality-report")} className="cd-section">
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
        </section>

        {/* Benefits */}
        <section id="benefits" ref={registerRef("benefits")} className="cd-section">
          <div className="cd-info-grid">
            <h3 className="section-title">Benefits & add-ons</h3>
            <p className="muted">Exchange offers, warranty add-ons and other benefits available at purchase.</p>
            <div className="benefits-list">
              <div className="benefit">₹20,000 OFF with Exchange</div>
              <div className="benefit">1-year extended warranty</div>
              <div className="benefit">Doorstep test drive</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer CTAs */}
      <footer className="cd-footer">
        <button className="btn-primary large">Book now</button>
        <button className="btn-outline">Free test drive</button>
      </footer>
    </div>
  );
}
