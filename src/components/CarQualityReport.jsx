import React, { useMemo } from 'react';
import styles from '../styles/CarDetailsWeb.module.css';

/**
 * CarQualityReport component - Displays quality report summary
 */
const CarQualityReport = React.memo(({ car, onViewFullReport }) => {
  const { totalParts, systems, findings } = useMemo(() => {
    if (!car?.inspections || car.inspections.length === 0) {
      return { totalParts: 0, systems: [], findings: [] };
    }

    // Calculate total parts
    const parts = car.inspections.reduce(
      (total, insp) =>
        total +
        (insp.subsections || []).reduce(
          (subTotal, sub) => subTotal + (sub.items || []).length,
          0
        ),
      0
    );

    // Helper to calculate score
    const calculateScore = (items) => {
      if (!items || items.length === 0) return 0;
      const statusValues = { flawless: 10, minor: 7, major: 4 };
      const total = items.reduce(
        (sum, item) => sum + (statusValues[item.status] || 5),
        0
      );
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
    const sys = car.inspections.map((inspection) => {
      const apiScore = inspection.score;
      const allItems = (inspection.subsections || []).flatMap(
        (sub) => sub.items || []
      );
      const calculatedScore =
        allItems.length > 0 ? calculateScore(allItems) : apiScore || 0;
      const finalScore = apiScore || parseFloat(calculatedScore);
      const apiRating = inspection.rating
        ? inspection.rating.charAt(0).toUpperCase() +
          inspection.rating.slice(1)
        : null;
      return {
        category: inspection.title,
        description:
          inspection.description ||
          inspection.subsections?.[0]?.title ||
          "",
        score: finalScore,
        rating: apiRating || getRating(finalScore.toString()),
        key: inspection.key,
      };
    });

    // Extract positive findings
    const finds = car.inspections
      .flatMap((inspection) =>
        (inspection.subsections || []).flatMap((sub) =>
          (sub.items || [])
            .filter((item) => item.status === "flawless")
            .slice(0, 3)
            .map((item) => item.name)
        )
      )
      .slice(0, 3);

    return { totalParts: parts, systems: sys, findings: finds };
  }, [car?.inspections]);

  // Get appropriate icon based on system key
  const getIcon = (key) => {
    if (key?.includes("core")) return "🛠️";
    if (key?.includes("supporting")) return "🎧";
    if (key?.includes("interior")) return "⚙️";
    if (key?.includes("exterior")) return "⚙️";
    if (key?.includes("wear")) return "⚙️";
    return "⚙️";
  };

  if (!car?.inspections || car.inspections.length === 0 || systems.length === 0) {
    return null;
  }

  return (
    <section
      id="report"
      data-section="report"
      className={`${styles.cdSection} ${styles.reportSection}`}
    >
      <h2 className={styles.cdSectionTitle}>Quality Report</h2>
      <p className={styles.meta}>
        {totalParts} parts evaluated by automotive experts
      </p>

      <div className={styles.reportSummaryCard}>
        {/* top badges */}
        {findings.length > 0 && (
          <div className={styles.badgesRow}>
            {findings.map((finding, idx) => (
              <span key={idx} className={styles.badge}>
                ✓ {finding}
              </span>
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
                  {getIcon(system.key)}
                </div>
                <div className={styles.reportLeftText}>
                  <div className={styles.reportLeftTitle}>{system.category}</div>
                  <div className={styles.reportLeftSub}>
                    {system.description}
                  </div>
                </div>

                {/* rating */}
                <div className={styles.itemRatingWrap}>
                  <div className={styles.scorePillLarge}>
                    <div className={styles.scoreNumLarge}>{system.score}</div>
                    <div className={styles.scoreLabelSmall}>
                      {system.rating}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: CTA */}
          <div className={styles.reportRightCol}>
            <div className={styles.reportRightBottom}>
              <div className={styles.nextServiceWithExtra}>
                <div className={styles.nextServiceText}>
                  No immediate servicing required
                </div>
              </div>

              <button
                type="button"
                className={styles.viewReportBtn}
                onClick={onViewFullReport}
              >
                View full report
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

CarQualityReport.displayName = 'CarQualityReport';

export default CarQualityReport;
