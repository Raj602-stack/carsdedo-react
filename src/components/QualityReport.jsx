import React, { useState, forwardRef } from "react";
import "../styles/QualityReport.css";

const QualityReport = forwardRef(({ car, onViewFullReport }, ref) => {
  const [showFullReport, setShowFullReport] = useState(false);

  // Helper to calculate score from inspection items
  const calculateScore = (items) => {
    if (!items || items.length === 0) return 0;
    const statusValues = { flawless: 10, minor: 7, major: 4 };
    const total = items.reduce((sum, item) => sum + (statusValues[item.status] || 5), 0);
    return (total / items.length).toFixed(1);
  };

  // Helper to get rating label
  const getRating = (score) => {
    const num = parseFloat(score);
    if (num >= 9) return "Excellent";
    if (num >= 7) return "Good";
    if (num >= 5) return "Average";
    return "Fair";
  };

  // Helper to get color
  const getColor = (score) => {
    const num = parseFloat(score);
    if (num >= 9) return "#10b981"; // green
    if (num >= 7) return "#3b82f6"; // blue
    if (num >= 5) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  // Get systems from car inspections - use API score if available, otherwise calculate
  const systems = car?.inspections?.length > 0
    ? car.inspections.map((inspection) => {
        // Use API score if available, otherwise calculate from items
        const apiScore = inspection.score;
        const allItems = (inspection.subsections || []).flatMap(sub => (sub.items || []));
        const calculatedScore = allItems.length > 0 ? calculateScore(allItems) : (apiScore || 0);
        const finalScore = apiScore || parseFloat(calculatedScore);
        const apiRating = inspection.rating ? inspection.rating.charAt(0).toUpperCase() + inspection.rating.slice(1) : null;
        return {
          category: inspection.title,
          description: inspection.description || inspection.subsections?.[0]?.title || "",
          score: finalScore,
          rating: apiRating || getRating(finalScore.toString()),
          color: getColor(finalScore),
          key: inspection.key,
          inspection: inspection,
        };
      })
    : [];

  // Extract positive findings from inspections (flawless items)
  const findings = car?.inspections
    ? car.inspections
        .flatMap(inspection => 
          (inspection.subsections || []).flatMap(sub => 
            (sub.items || [])
              .filter(item => item.status === 'flawless')
              .slice(0, 3)
              .map(item => ({
      icon: "✅",
                text: item.name,
      type: "positive"
              }))
          )
        )
        .slice(0, 3)
    : [];

  // Extract issues from inspections (minor/major items with remarks)
  const issues = car?.inspections
    ? car.inspections
        .flatMap(inspection => 
          (inspection.subsections || []).flatMap(sub => 
            (sub.items || [])
              .filter(item => (item.status === 'minor' || item.status === 'major') && item.remarks)
              .map(item => ({
                title: item.name,
                description: item.remarks,
                impact: item.remarks.includes('price') ? item.remarks : `Comes with lower price tag because of it`,
                icon: item.status === 'major' ? "⚠️" : "🔍",
                status: item.status
              }))
          )
        )
        .slice(0, 2)
    : [];

  // Calculate total parts evaluated
  const totalParts = car?.inspections 
    ? car.inspections.reduce((total, insp) => 
        total + (insp.subsections || []).reduce((subTotal, sub) => subTotal + (sub.items || []).length, 0), 0
      )
    : 0;

  if (systems.length === 0) {
    return null;
  }

  // Get appropriate icon based on system key
  const getIcon = (key) => {
    if (key?.includes('core')) return '🛠️';
    if (key?.includes('supporting')) return '🎧';
    if (key?.includes('interior')) return '⚙️';
    if (key?.includes('exterior')) return '⚙️';
    if (key?.includes('wear')) return '⚙️';
    return '⚙️';
  };

  return (
    <div className="quality-report" ref={ref}>
      <div className="quality-header">
        <h2 className="quality-title">Quality Report</h2>
        <div className="quality-subtitle">
          <span className="parts-count">{totalParts} parts</span> evaluated by automotive experts
        </div>
      </div>

      <div className="quality-report-card">
        {/* Positive Findings Badges */}
        {findings.length > 0 && (
          <div className="findings-badges">
            {findings.map((item, index) => (
              <span key={index} className="finding-badge">✓ {item.text}</span>
            ))}
          </div>
        )}

        {/* System List */}
        <div className="quality-systems-list">
          {systems.map((system, index) => (
            <div key={index} className="quality-system-item">
              <div className="quality-system-icon">
                {getIcon(system.key)}
              </div>
              <div className="quality-system-text">
                <div className="quality-system-title">{system.category}</div>
                <div className="quality-system-description">{system.description}</div>
              </div>
              <div className="quality-system-score">
                <div className="quality-score-pill">
                  <div className="quality-score-number">{system.score}</div>
                  <div className="quality-score-label">{system.rating}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="quality-cta-section">
          <div className="quality-service-message">
            No immediate servicing required
          </div>
          <button 
            className="quality-view-report-btn"
            onClick={() => {
              if (onViewFullReport) {
                onViewFullReport();
              } else {
                setShowFullReport(!showFullReport);
              }
            }}
          >
            View full report
          </button>
        </div>

        {/* Additional Findings (Conditional) */}
        {showFullReport && issues.length > 0 && (
          <div className="additional-findings">
            <div className="section-divider">
              <div className="divider-line"></div>
              <div className="divider-label">Additional Findings</div>
              <div className="divider-line"></div>
            </div>

            <div className="issues-list">
              {issues.map((issue, index) => (
                <div key={index} className="issue-card">
                  <div className="issue-icon">{issue.icon}</div>
                  <div className="issue-content">
                    <h5 className="issue-title">{issue.title}</h5>
                    <p className="issue-description">{issue.description}</p>
                    <div className="issue-impact">
                      <span className="impact-badge">Price Impact</span>
                      <span className="impact-text">{issue.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default QualityReport;
