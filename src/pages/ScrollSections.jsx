import React, { useRef, useEffect, useState } from "react";

const TOPBAR_HEIGHT = 72;

export default function ScrollSection() {
  const [activeTab, setActiveTab] = useState("overview");

  // 🔹 SCROLLING CONTAINER REF (THIS IS THE FIX)
  const containerRef = useRef(null);

  // 🔹 SECTION REFS
  const overviewRef = useRef(null);
  const reportRef = useRef(null);
  const specsRef = useRef(null);
  const financeRef = useRef(null);

  const sections = [
    { id: "overview", label: "Overview", ref: overviewRef },
    { id: "report", label: "Report", ref: reportRef },
    { id: "specs", label: "Specs", ref: specsRef },
    { id: "finance", label: "Finance", ref: financeRef },
  ];

  /**
   * CLICK → SCROLL (CONTAINER SCROLL)
   */
  const scrollToSection = (ref, id) => {
    if (!ref?.current || !containerRef.current) {
      console.error("Missing ref:", id);
      return;
    }

    const containerTop =
      containerRef.current.getBoundingClientRect().top;

    const sectionTop =
      ref.current.getBoundingClientRect().top;

    const scrollTop =
      containerRef.current.scrollTop +
      (sectionTop - containerTop) -
      TOPBAR_HEIGHT;

    containerRef.current.scrollTo({
      top: scrollTop,
      behavior: "smooth",
    });

    setActiveTab(id);
  };

  /**
   * SCROLL → HIGHLIGHT
   */
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.dataset.section);
          }
        });
      },
      {
        root: containerRef.current,
        rootMargin: `-${TOPBAR_HEIGHT + 8}px 0px -60% 0px`,
        threshold: 0.1,
      }
    );

    sections.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ================= NAV BAR ================= */}
      <div
        style={{
          height: TOPBAR_HEIGHT,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "0 24px",
          borderBottom: "1px solid #eee",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollToSection(s.ref, s.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: activeTab === s.id ? 600 : 400,
              color: activeTab === s.id ? "#b11226" : "#666",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ================= SCROLL CONTAINER ================= */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        <Section refProp={overviewRef} id="overview" title="Overview" />
        <Section refProp={reportRef} id="report" title="Report" />
        <Section refProp={specsRef} id="specs" title="Specs" />
        <Section refProp={financeRef} id="finance" title="Finance" />
      </div>
    </div>
  );
}

/**
 * SECTION
 */
function Section({ refProp, id, title }) {
  return (
    <section
      ref={refProp}
      data-section={id}
      style={{
        minHeight: "100vh",
        padding: "96px 24px",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <h2>{title}</h2>
      <p>
        This is the {title} section. Clicking the navbar WILL scroll
        correctly now.
      </p>
    </section>
  );
}
