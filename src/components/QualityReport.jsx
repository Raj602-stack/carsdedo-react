import React, { useState, forwardRef } from "react";
import "../styles/QualityReport.css";

const QualityReport = forwardRef(({ car }, ref) => {
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

  // Get systems from car inspections
  const systems = car?.inspections?.length > 0
    ? car.inspections.map((inspection) => {
        const allItems = inspection.subsections.flatMap(sub => sub.items);
        const score = calculateScore(allItems);
        return {
          category: inspection.title,
          description: inspection.subsections[0]?.title || "",
          score: parseFloat(score),
          rating: getRating(score),
          color: getColor(score),
          key: inspection.key,
          inspection: inspection,
        };
      })
    : [];

  // Extract positive findings from inspections (flawless items)
  const findings = car?.inspections
    ? car.inspections
        .flatMap(inspection => 
          inspection.subsections.flatMap(sub => 
            sub.items
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
          inspection.subsections.flatMap(sub => 
            sub.items
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
        total + insp.subsections.reduce((subTotal, sub) => subTotal + sub.items.length, 0), 0
      )
    : 0;

  if (systems.length === 0) {
    return null;
  }

  return (
    <div className="quality-report" ref={ref}>
      <div className="quality-header">
        <h2 className="quality-title">Quality Report</h2>
        <div className="quality-subtitle">
          <span className="parts-count">{totalParts} parts</span> evaluated by automotive experts
        </div>
      </div>

      {/* Positive Findings */}
      {findings.length > 0 && (
        <div className="findings-container">
          <div className="findings-grid">
            {findings.map((item, index) => (
              <div key={index} className="finding-item">
                <span className="finding-icon">{item.icon}</span>
                <span className="finding-text">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="section-divider">
        <div className="divider-line"></div>
        <div className="divider-label">System Ratings</div>
        <div className="divider-line"></div>
      </div>

      {/* System Ratings */}
      <div className="systems-grid">
        {systems.map((system, index) => (
          <div key={index} className="system-card">
            <div className="system-header">
              <h4 className="system-category">{system.category}</h4>
              <div className="system-description">{system.description}</div>
            </div>
            
            <div className="system-rating">
              <div className="score-circle" style={{ '--score-color': system.color }}>
                <span className="score-value">{system.score}</span>
              </div>
              <span className="rating-label">{system.rating}</span>
            </div>
          </div>
        ))}
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

      {/* View More/Less Button */}
      {issues.length > 0 && (
        <div className="report-footer">
          <button 
            className="view-report-btn"
            onClick={() => setShowFullReport(!showFullReport)}
          >
            {showFullReport ? "Show less" : "View full report"}
            <span className="btn-icon">{showFullReport ? "↑" : "↓"}</span>
          </button>
        </div>
      )}
    </div>
  );
});

export default QualityReport;
