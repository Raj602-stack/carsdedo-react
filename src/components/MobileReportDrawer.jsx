import React, { useEffect, useRef, useState } from "react";
import "../styles/MobileReportDrawer.css";

function formatKm(n) {
  if (n == null) return "";
  if (n >= 1000 && n < 100000) return `${Math.round(n / 1000)}K km`;
  return `${n.toLocaleString()} km`;
}

export default function MobileReportDrawer({ open, onClose, car }) {
  // Debug: Log inspection data
  useEffect(() => {
    if (open && car?.inspections && process.env.NODE_ENV === 'development') {
      console.log('=== Mobile Report Drawer - Inspection Data ===');
      console.log('Car:', car);
      console.log('Inspections:', car.inspections);
      console.log('Number of inspections:', car.inspections.length);
      car.inspections.forEach((insp, idx) => {
        console.log(`Inspection ${idx}:`, {
          key: insp.key,
          title: insp.title,
          description: insp.description,
          score: insp.score,
          rating: insp.rating,
          status: insp.status,
          remarks: insp.remarks,
          subsections: insp.subsections?.length || 0
        });
        if (insp.subsections) {
          insp.subsections.forEach((sub, subIdx) => {
            console.log(`  Subsection ${subIdx}:`, {
              key: sub.key,
              title: sub.title,
              status: sub.status,
              remarks: sub.remarks,
              items: sub.items?.length || 0
            });
            if (sub.items) {
              sub.items.forEach((item, itemIdx) => {
                console.log(`    Item ${itemIdx}:`, {
                  name: item.name,
                  status: item.status,
                  remarks: item.remarks
                });
              });
            }
          });
        }
      });
      console.log('==============================================');
      
      // Specifically check wear and tear
      const wearInspection = car.inspections.find(ins => 
        ins.key === 'wear_tear_parts' || ins.title?.toLowerCase().includes('wear')
      );
      if (wearInspection) {
        console.log('=== Wear & Tear Inspection Details ===');
        console.log('Title:', wearInspection.title);
        console.log('Key:', wearInspection.key);
        console.log('Subsections count:', wearInspection.subsections?.length || 0);
        console.log('Subsections array:', wearInspection.subsections);
        if (wearInspection.subsections) {
          wearInspection.subsections.forEach((sub, idx) => {
            console.log(`Subsection ${idx}:`, {
              key: sub.key,
              title: sub.title,
              status: sub.status,
              remarks: sub.remarks,
              itemsCount: sub.items?.length || 0,
              hasItems: !!(sub.items && sub.items.length > 0),
              items: sub.items
            });
          });
        }
        console.log('=====================================');
      } else {
        console.log('Wear & Tear inspection NOT FOUND!');
        console.log('Available inspection keys:', car.inspections.map(i => i.key));
        console.log('Available inspection titles:', car.inspections.map(i => i.title));
      }
    }
  }, [open, car]);
  
  const [drawerActive, setDrawerActive] = useState("core");
  const drawerContentRef = useRef(null);
  const drawerTabsInnerRef = useRef(null);
  
  const rdCoreRef = useRef(null);
  const rdSupportingRef = useRef(null);
  const rdInteriorsRef = useRef(null);
  const rdExteriorsRef = useRef(null);
  const rdWearRef = useRef(null);

  const tabRefs = {
    core: useRef(null),
    supporting: useRef(null),
    interiors: useRef(null),
    exteriors: useRef(null),
    wear: useRef(null),
  };

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Reset scroll and active tab when drawer opens
  useEffect(() => {
    if (open) {
      setDrawerActive("core");
      setTimeout(() => {
        if (drawerContentRef.current) drawerContentRef.current.scrollTop = 0;
      }, 60);
    }
  }, [open]);

  // Auto-scroll active tab to center
  useEffect(() => {
    if (!drawerTabsInnerRef.current || !tabRefs[drawerActive]?.current || !open) return;
    
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
  }, [drawerActive, open]);

  // Scroll spy inside drawer
  useEffect(() => {
    const container = drawerContentRef.current;
    if (!container || !open) return;

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
        visible.sort((a, b) => {
          const ratioDiff = b.intersectionRatio - a.intersectionRatio;
          if (Math.abs(ratioDiff) > 0.1) return ratioDiff;
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });
        const id = visible[0].target.dataset.section;
        if (id) {
          setDrawerActive((prev) => (prev !== id ? id : prev));
        }
      },
      { root: container, threshold: [0.1, 0.3, 0.5, 0.7], rootMargin: '-20% 0px -60% 0px' }
    );

    refs.forEach((r) => {
      if (r.el.current) io.observe(r.el.current);
    });

    // Fallback rAF-based scroll detection
    let raf = null;
    let lastActive = "core";
    function fallback() {
      const scrollTop = container.scrollTop + 80;
      let current = "core";
      let minDistance = Infinity;
      
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
  }, [open]);

  function scrollDrawerTo(ref) {
    if (!ref?.current || !drawerContentRef.current) return;
    const container = drawerContentRef.current;
    const element = ref.current;
    const offset = 16;
    
    container.scrollTo({ 
      top: element.offsetTop - offset, 
      behavior: "smooth" 
    });
    
    const id = element.dataset?.section;
    if (id) {
      setDrawerActive(id);
    }
  }

  if (!open) return null;

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
    <div className="mobile-drawer-wrap">
      <div className="mobile-drawer-backdrop" onClick={onClose} />
      <aside className="mobile-drawer" role="dialog" aria-modal="true">
        <div className="mobile-drawer-header">
          <button type="button" className="mobile-drawer-close" onClick={onClose}>
            ←
          </button>
          <div>
            <h3 className="mobile-drawer-title">Car quality report</h3>
            <div className="mobile-drawer-sub">
              {car?.title} • {formatKm(car?.km)} • {car?.fuel}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mobile-drawer-tabs" role="tablist">
          <div className="mobile-drawer-tabs-inner" ref={drawerTabsInnerRef}>
            <button 
              ref={tabRefs.core}
              type="button" 
              className={`mobile-drawer-tab ${drawerActive === "core" ? "mobile-drawer-tab-active" : ""}`} 
              onClick={() => scrollDrawerTo(rdCoreRef)}
            >
              <span className="mobile-tab-label">Core systems</span>
              {drawerActive !== "core" && <span className="mobile-tab-score">{getInspectionScore('core_systems')}</span>}
            </button>
            <button 
              ref={tabRefs.supporting}
              type="button" 
              className={`mobile-drawer-tab ${drawerActive === "supporting" ? "mobile-drawer-tab-active" : ""}`} 
              onClick={() => scrollDrawerTo(rdSupportingRef)}
            >
              <span className="mobile-tab-label">Supporting systems</span>
              {drawerActive !== "supporting" && <span className="mobile-tab-score">{getInspectionScore('supporting_systems')}</span>}
            </button>
            <button 
              ref={tabRefs.interiors}
              type="button" 
              className={`mobile-drawer-tab ${drawerActive === "interiors" ? "mobile-drawer-tab-active" : ""}`} 
              onClick={() => scrollDrawerTo(rdInteriorsRef)}
            >
              <span className="mobile-tab-label">Interiors & AC</span>
              {drawerActive !== "interiors" && <span className="mobile-tab-score">{getInspectionScore('interiors_ac')}</span>}
            </button>
            <button 
              ref={tabRefs.exteriors}
              type="button" 
              className={`mobile-drawer-tab ${drawerActive === "exteriors" ? "mobile-drawer-tab-active" : ""}`} 
              onClick={() => scrollDrawerTo(rdExteriorsRef)}
            >
              <span className="mobile-tab-label">Exteriors & lights</span>
              {drawerActive !== "exteriors" && <span className="mobile-tab-score">{getInspectionScore('exteriors_lights')}</span>}
            </button>
            <button 
              ref={tabRefs.wear}
              type="button" 
              className={`mobile-drawer-tab ${drawerActive === "wear" ? "mobile-drawer-tab-active" : ""}`} 
              onClick={() => scrollDrawerTo(rdWearRef)}
            >
              <span className="mobile-tab-label">Wear & tear</span>
              {drawerActive !== "wear" && <span className="mobile-tab-score">{getInspectionScore('wear_tear_parts')}</span>}
            </button>
          </div>
        </div>

        <div className="mobile-drawer-content" ref={drawerContentRef}>
          {/* Core Systems */}
          <section ref={rdCoreRef} data-section="core" className="mobile-drawer-section">
            {(() => {
              const coreInspection = car?.inspections?.find(ins => 
                ins.key === 'core_systems' || ins.title?.toLowerCase().includes('core')
              );
              
              if (!coreInspection) {
                return (
                  <>
                    <div className="mobile-drawer-section-head">
                      <div className="mobile-drawer-section-title">Core systems</div>
                      <div className="mobile-drawer-section-score">
                        <div className="mobile-pill-score">9.8</div>
                        <div className="mobile-pill-label">Excellent</div>
                      </div>
                    </div>
                    <div className="mobile-drawer-section-sub">196 parts across 3 assemblies</div>
                    <ul className="mobile-detail-list">
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
                  <div className="mobile-drawer-section-head">
                    <div className="mobile-drawer-section-title">{coreInspection.title}</div>
                    <div className="mobile-drawer-section-score">
                      <div className="mobile-pill-score">{score}</div>
                      <div className="mobile-pill-label">{rating}</div>
                    </div>
                  </div>
                  <div className="mobile-drawer-section-sub">
                    {totalItems} parts across {coreInspection.subsections.length} assemblies
                  </div>
                  {coreInspection.remarks && (
                    <div className="mobile-callout">✅ {coreInspection.remarks}</div>
                  )}
                  
                  {(coreInspection.subsections || []).map((subsection, subIdx) => (
                    <div key={subIdx} className="mobile-subsection-card">
                      <div className="mobile-subsection-header">
                        <span className="mobile-subsection-icon">
                          {subsection.status === 'flawless' ? '✅' : subsection.status === 'minor' ? '⚠️' : '❌'}
                        </span>
                        <div className="mobile-subsection-title">{subsection.title}</div>
                      </div>
                      {subsection.remarks && (
                        <div className="mobile-subsection-remarks">{subsection.remarks}</div>
                      )}
                      {(subsection.items || []).length > 0 && (
                        <ul className="mobile-detail-list">
                          {subsection.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <strong>{item.name}</strong> — <span className={`mobile-item-status mobile-item-status-${item.status}`}>
                                {item.status === 'flawless' ? 'Flawless' : item.status === 'minor' ? 'Minor issues' : 'Major issues'}
                              </span>
                              {item.remarks && <span className="mobile-item-remarks">• {item.remarks}</span>}
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

          {/* Supporting Systems */}
          <section ref={rdSupportingRef} data-section="supporting" className="mobile-drawer-section">
            {(() => {
              const supportingInspection = car?.inspections?.find(ins => 
                ins.key === 'supporting_systems' || ins.title?.toLowerCase().includes('supporting')
              );
              
              if (!supportingInspection) {
                return (
                  <>
                    <div className="mobile-drawer-section-head">
                      <div className="mobile-drawer-section-title">Supporting systems</div>
                      <div className="mobile-drawer-section-score">
                        <div className="mobile-pill-score">9.7</div>
                        <div className="mobile-pill-label">Excellent</div>
                      </div>
                    </div>
                    <div className="mobile-drawer-section-sub">Fuel supply, ignition & other systems</div>
                    <ul className="mobile-detail-list">
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
                  <div className="mobile-drawer-section-head">
                    <div className="mobile-drawer-section-title">{supportingInspection.title}</div>
                    <div className="mobile-drawer-section-score">
                      <div className="mobile-pill-score">{score}</div>
                      <div className="mobile-pill-label">{rating}</div>
                    </div>
                  </div>
                  <div className="mobile-drawer-section-sub">
                    {supportingInspection.description || `${supportingInspection.subsections.length} subsystems evaluated`}
                  </div>
                  {supportingInspection.remarks && (
                    <div className="mobile-callout">✅ {supportingInspection.remarks}</div>
                  )}
                  
                  {(supportingInspection.subsections || []).map((subsection, subIdx) => (
                    <div key={subIdx} className="mobile-subsection-card">
                      <div className="mobile-subsection-header">
                        <span className="mobile-subsection-icon">
                          {subsection.status === 'flawless' ? '✅' : subsection.status === 'minor' ? '⚠️' : '❌'}
                        </span>
                        <div className="mobile-subsection-title">{subsection.title}</div>
                      </div>
                      {subsection.remarks && (
                        <div className="mobile-subsection-remarks">{subsection.remarks}</div>
                      )}
                      {(subsection.items || []).length > 0 && (
                        <ul className="mobile-detail-list">
                          {subsection.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <strong>{item.name}</strong> — <span className={`mobile-item-status mobile-item-status-${item.status}`}>
                                {item.status === 'flawless' ? 'Flawless' : item.status === 'minor' ? 'Minor issues' : 'Major issues'}
                              </span>
                              {item.remarks && <span className="mobile-item-remarks">• {item.remarks}</span>}
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

          {/* Interiors & AC */}
          <section ref={rdInteriorsRef} data-section="interiors" className="mobile-drawer-section">
            {(() => {
              const interiorsInspection = car?.inspections?.find(ins => 
                ins.key === 'interiors_ac' || ins.title?.toLowerCase().includes('interior')
              );
              
              if (!interiorsInspection) {
                return (
                  <>
                    <div className="mobile-drawer-section-head">
                      <div className="mobile-drawer-section-title">Interiors & AC</div>
                      <div className="mobile-drawer-section-score">
                        <div className="mobile-pill-score">8.7</div>
                        <div className="mobile-pill-label">Good</div>
                      </div>
                    </div>
                    <div className="mobile-drawer-section-sub">Seats, AC, audio & other features</div>
                    <ul className="mobile-detail-list">
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
                  <div className="mobile-drawer-section-head">
                    <div className="mobile-drawer-section-title">{interiorsInspection.title}</div>
                    <div className="mobile-drawer-section-score">
                      <div className="mobile-pill-score">{score}</div>
                      <div className="mobile-pill-label">{rating}</div>
                    </div>
                  </div>
                  <div className="mobile-drawer-section-sub">
                    {interiorsInspection.description || `${interiorsInspection.subsections.length} subsystems evaluated`}
                  </div>
                  {interiorsInspection.remarks && (
                    <div className="mobile-callout">✅ {interiorsInspection.remarks}</div>
                  )}
                  
                  {(interiorsInspection.subsections || []).map((subsection, subIdx) => (
                    <div key={subIdx} className="mobile-subsection-card">
                      <div className="mobile-subsection-header">
                        <span className="mobile-subsection-icon">
                          {subsection.status === 'flawless' ? '✅' : subsection.status === 'minor' ? '⚠️' : '❌'}
                        </span>
                        <div className="mobile-subsection-title">{subsection.title}</div>
                      </div>
                      {subsection.remarks && (
                        <div className="mobile-subsection-remarks">{subsection.remarks}</div>
                      )}
                      {(subsection.items || []).length > 0 && (
                        <ul className="mobile-detail-list">
                          {subsection.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <strong>{item.name}</strong> — <span className={`mobile-item-status mobile-item-status-${item.status}`}>
                                {item.status === 'flawless' ? 'Flawless' : item.status === 'minor' ? 'Minor issues' : 'Major issues'}
                              </span>
                              {item.remarks && <span className="mobile-item-remarks">• {item.remarks}</span>}
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

          {/* Exteriors & Lights */}
          <section ref={rdExteriorsRef} data-section="exteriors" className="mobile-drawer-section">
            {(() => {
              const exteriorsInspection = car?.inspections?.find(ins => 
                ins.key === 'exteriors_lights' || ins.title?.toLowerCase().includes('exterior')
              );
              
              if (!exteriorsInspection) {
                return (
                  <>
                    <div className="mobile-drawer-section-head">
                      <div className="mobile-drawer-section-title">Exteriors & lights</div>
                      <div className="mobile-drawer-section-score">
                        <div className="mobile-pill-score">7.7</div>
                        <div className="mobile-pill-label">Fair</div>
                      </div>
                    </div>
                    <div className="mobile-drawer-section-sub">Panels, glasses, lights & fixtures</div>
                    <div className="mobile-callout-alt">ℹ️ Imperfections on body panels but no impact on build quality — ₹12,000 lower price tag</div>
                  </>
                );
              }
              
              const allItems = (exteriorsInspection.subsections || []).flatMap(sub => (sub.items || []));
              const statusValues = { flawless: 10, minor: 7, major: 4 };
              const total = allItems.reduce((sum, item) => sum + (statusValues[item.status] || 5), 0);
              const calculatedScore = allItems.length > 0 ? (total / allItems.length).toFixed(1) : 7.7;
              const score = exteriorsInspection.score || parseFloat(calculatedScore);
              const rating = exteriorsInspection.rating ? exteriorsInspection.rating.charAt(0).toUpperCase() + exteriorsInspection.rating.slice(1) : 'Fair';
              
              return (
                <>
                  <div className="mobile-drawer-section-head">
                    <div className="mobile-drawer-section-title">{exteriorsInspection.title}</div>
                    <div className="mobile-drawer-section-score">
                      <div className="mobile-pill-score">{score}</div>
                      <div className="mobile-pill-label">{rating}</div>
                    </div>
                  </div>
                  <div className="mobile-drawer-section-sub">
                    {exteriorsInspection.description || `${exteriorsInspection.subsections.length} subsystems evaluated`}
                  </div>
                  {exteriorsInspection.remarks && (
                    <div className="mobile-callout-alt">ℹ️ {exteriorsInspection.remarks}</div>
                  )}
                  
                  {(exteriorsInspection.subsections || []).map((subsection, subIdx) => (
                    <div key={subIdx} className="mobile-subsection-card">
                      <div className="mobile-subsection-header">
                        <span className="mobile-subsection-icon">
                          {subsection.status === 'flawless' ? '✅' : subsection.status === 'minor' ? '⚠️' : '❌'}
                        </span>
                        <div className="mobile-subsection-title">{subsection.title}</div>
                      </div>
                      {subsection.remarks && (
                        <div className="mobile-subsection-remarks">{subsection.remarks}</div>
                      )}
                      {(subsection.items || []).length > 0 && (
                        <ul className="mobile-detail-list">
                          {subsection.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <strong>{item.name}</strong> — <span className={`mobile-item-status mobile-item-status-${item.status}`}>
                                {item.status === 'flawless' ? 'Flawless' : item.status === 'minor' ? 'Minor issues' : 'Major issues'}
                              </span>
                              {item.remarks && <span className="mobile-item-remarks">• {item.remarks}</span>}
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

          {/* Wear & Tear */}
          <section ref={rdWearRef} data-section="wear" className="mobile-drawer-section">
            {(() => {
              const wearInspection = car?.inspections?.find(ins => 
                ins.key === 'wear_tear_parts' || ins.title?.toLowerCase().includes('wear')
              );
              
              if (!wearInspection) {
                return (
                  <>
                    <div className="mobile-drawer-section-head">
                      <div className="mobile-drawer-section-title">Wear & tear parts</div>
                      <div className="mobile-drawer-section-score">
                        <div className="mobile-pill-score">7.1</div>
                        <div className="mobile-pill-label">Fair</div>
                      </div>
                    </div>
                    <div className="mobile-drawer-section-sub">Tyres, clutch, brakes & more</div>
                    <div className="mobile-callout-alt">ℹ️ Few components have experienced wear and tear — ₹27,000 lower price tag</div>
                  </>
                );
              }
              
              const score = wearInspection.score || 7.1;
              const rating = wearInspection.rating ? wearInspection.rating.charAt(0).toUpperCase() + wearInspection.rating.slice(1) : 'Fair';
              
              return (
                <>
                  <div className="mobile-drawer-section-head">
                    <div className="mobile-drawer-section-title">{wearInspection.title}</div>
                    <div className="mobile-drawer-section-score">
                      <div className="mobile-pill-score">{score}</div>
                      <div className="mobile-pill-label">{rating}</div>
                    </div>
                  </div>
                  <div className="mobile-drawer-section-sub">
                    {wearInspection.description || `${wearInspection.subsections.length} subsystems evaluated`}
                  </div>
                  {wearInspection.remarks && (
                    <div className="mobile-callout-alt">ℹ️ {wearInspection.remarks}</div>
                  )}
                  
                  {(wearInspection.subsections || []).map((subsection, subIdx) => (
                    <div key={subIdx} className="mobile-subsection-card">
                      <div className="mobile-subsection-header">
                        <span className="mobile-subsection-icon">
                          {subsection.status === 'flawless' ? '✅' : subsection.status === 'minor' ? '⚠️' : '❌'}
                        </span>
                        <div className="mobile-subsection-title">{subsection.title}</div>
                      </div>
                      {subsection.remarks && (
                        <div className="mobile-subsection-remarks">{subsection.remarks}</div>
                      )}
                      {subsection.items && subsection.items.length > 0 && (
                        <ul className="mobile-detail-list">
                          {subsection.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <strong>{item.name}</strong> — <span className={`mobile-item-status mobile-item-status-${item.status}`}>
                                {item.status === 'flawless' ? 'Flawless' : item.status === 'minor' ? 'Minor issues' : 'Major issues'}
                              </span>
                              {item.remarks && <span className="mobile-item-remarks">• {item.remarks}</span>}
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
  );
}
