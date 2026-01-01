import React, { useState, forwardRef } from "react";
import "../styles/QualityReport.css";

const QualityReport = forwardRef((props, ref) => {
  const [showFullReport, setShowFullReport] = useState(false);

  const systems = [
    {
      category: "Core systems",
      description: "Engine, transmission & chassis",
      score: 7.6,
      rating: "Excellent",
      color: "var(--score-excellent)"
    },
    {
      category: "Supporting systems",
      description: "Fuel supply, ignition & other systems",
      score: 8.7,
      rating: "Good",
      color: "var(--score-good)"
    },
    {
      category: "Interiors & AC",
      description: "Seats, AC, audio & other features",
      score: 9.2,
      rating: "Excellent",
      color: "var(--score-excellent)"
    },
    {
      category: "Exteriors & lights",
      description: "Panels, glasses, lights & fixtures",
      score: 6.7,
      rating: "Average",
      color: "var(--score-average)"
    }
  ];

  const findings = [
    {
      icon: "✅",
      text: "Meter not tampered",
      type: "positive"
    },
    {
      icon: "✅",
      text: "Non-flooded",
      type: "positive"
    },
    {
      icon: "✅",
      text: "Core structure intact",
      type: "positive"
    }
  ];

  const issues = [
    {
      title: "Imperfections on glasses & mirrors",
      description: "No impact on visibility",
      impact: "Comes with ₹12,000 lower price tag because of it",
      icon: "🔍"
    },
    {
      title: "Wear & tear parts",
      description: "Few components have experienced wear and tear",
      impact: "Comes with ₹16,000 lower price tag because of it",
      icon: "🔧"
    }
  ];

  return (
    <div className="quality-report" ref={ref}>
      <div className="quality-header">
        <h2 className="quality-title">Quality report</h2>
        <div className="quality-subtitle">
          <span className="parts-count">1571 parts</span> evaluated by 5 automotive experts
        </div>
      </div>

      {/* Positive Findings */}
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
      {showFullReport && (
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
      <div className="report-footer">
        <button 
          className="view-report-btn"
          onClick={() => setShowFullReport(!showFullReport)}
        >
          {showFullReport ? "Show less" : "View full report"}
          <span className="btn-icon">{showFullReport ? "↑" : "↓"}</span>
        </button>
        
        <div className="report-summary">
          <span className="summary-text">Overall assessment: </span>
          <span className="summary-rating">Good Condition</span>
        </div>
      </div>
    </div>
  );
});

export default QualityReport;