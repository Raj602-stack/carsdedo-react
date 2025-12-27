import React, { useState, useMemo } from "react";

export default function EMICalculatorInline({refi}) {
  const minLoan = 100000;
  const maxLoan = 1387985;

  const [loanAmount, setLoanAmount] = useState(1148000);
  const [downPayment, setDownPayment] = useState(239985);
  const [duration, setDuration] = useState(66);

  const monthlyInterestRate = 0.009;
  const principal = loanAmount - downPayment;

  const emi = useMemo(() => {
    const r = monthlyInterestRate;
    const n = duration;
    const p = principal;
    if (p <= 0) return 0;
    const pow = Math.pow(1 + r, n);
    const emiVal = (p * r * pow) / (pow - 1);
    return Math.round(emiVal);
  }, [principal, duration]);

  const totalInterest = emi * duration - principal;
  const totalPayable = principal + totalInterest;

  const styles = {
    card: {
      display: "flex",
      gap: 28,
      background: "#fff",
      borderRadius: 20,
      padding: 28,
      border: "1px solid #ece8f3",
      boxShadow: "0 8px 22px rgba(20,10,30,0.04)",
      boxSizing: "border-box",
      width: "100%",
      fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      color: "#222",
    },
    left: { flex: 1, display: "flex", flexDirection: "column", gap: 24, paddingRight: 16 },
    right: { width: 420, display: "flex", flexDirection: "column", gap: 16 },
    heading: { color: "#7c7591", fontSize: 16, fontWeight: 500 },
    value: { fontSize: 42, fontWeight: 800, color: "#8a39f0", display: "flex", alignItems: "baseline", gap: 10 },
    semicontainer: { paddingTop: 10 },
    semi: { width: "100%", height: 160, position: "relative" },
    semiBefore: { // simulated by inner element
      width: "70%",
      height: 120,
      background: "#e9f9f0",
      borderRadius: "120px 120px 0 0",
      margin: "0 auto",
    },
    semiFill: {
      position: "absolute",
      top: 40,
      left: "50%",
      transform: "translateX(-50%)",
      height: 120,
      borderRadius: "120px 120px 0 0",
      background: "linear-gradient(90deg,#a9f0d4,#2bc59c)",
      opacity: 0.95,
      width: `${Math.min(100, Math.max(0, (principal / maxLoan) * 100))}%`,
      transition: "width 240ms ease",
    },
    legendRow: { display: "flex", gap: 40, marginTop: 20, alignItems: "center" },
    legendItem: { display: "flex", alignItems: "center", gap: 12 },
    legendBox: { width: 18, height: 18, background: "#dff6ee", borderRadius: 4 },
    legendBoxInterest: { width: 18, height: 18, background: "#3bd09a", borderRadius: 4 },
    legendLabel: { color: "#8b849b", fontSize: 14 },
    legendValue: { fontSize: 18, color: "#2b0f57", fontWeight: 700 },
    totalRow: { borderTop: "1px solid #ece8f3", marginTop: 16, paddingTop: 12, display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#2b0f57", fontSize: 18 },
    fieldRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    label: { color: "#4b3b63", fontWeight: 700, fontSize: 15 },
    sub: { color: "#9b93a7", fontSize: 13 },
    fieldValue: { color: "#6f1e9c", fontWeight: 800, fontSize: 20 },
    range: { width: "100%", height: 6, borderRadius: 6, background: "linear-gradient(90deg,#6f1e9c,#ece4f8)", appearance: "none", outline: "none", marginTop: 8 },
    thumbStyle: { width: 22, height: 22, borderRadius: "50%", background: "#6f1e9c", boxShadow: "0 4px 14px rgba(111,30,156,0.3)" },
    btn: { background: "#6f1e9c", color: "#fff", width: "100%", border: "none", padding: 16, borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: "pointer", marginTop: 12 },
    disclaimer: { marginTop: 8, fontSize: 12, color: "#938da3", borderTop: "1px dashed #ddd", paddingTop: 10, lineHeight: 1.5 },
  };

  // minor helper to allow styled range thumb in inline styles on Webkit we still need CSS, but most browsers will show default; it's fine as fallback
  // Render
  return (
    <div ref={refi}  data-section="finance" style={styles.card}>
      <div style={styles.left}>
        <div style={styles.heading}>EMI starting from</div>
        <div style={styles.value}>
          ₹ {emi.toLocaleString("en-IN")} <span style={{ fontSize: 20, fontWeight: 600 }}>per month</span>
        </div>

        <div style={styles.semicontainer}>
          <div style={styles.semi}>
            <div style={styles.semiBefore}></div>
            <div style={styles.semiFill}></div>
          </div>

          <div style={styles.legendRow}>
            <div style={styles.legendItem}>
              <div style={styles.legendBox} />
              <div>
                <div style={styles.legendLabel}>Principal Loan Amount</div>
                <div style={styles.legendValue}>₹ {principal.toLocaleString("en-IN")}</div>
              </div>
            </div>

            <div style={styles.legendItem}>
              <div style={styles.legendBoxInterest} />
              <div>
                <div style={styles.legendLabel}>Total Interest Payable</div>
                <div style={styles.legendValue}>₹ {totalInterest.toLocaleString("en-IN")}</div>
              </div>
            </div>
          </div>

          <div style={styles.totalRow}>
            <div>Total Amount Payable</div>
            <div>₹ {totalPayable.toLocaleString("en-IN")}</div>
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.fieldRow}>
          <div>
            <div style={styles.label}>Loan Amount</div>
            <div style={styles.sub}>₹ {minLoan.toLocaleString("en-IN")}</div>
          </div>

          <div style={styles.fieldValue}>₹ {loanAmount.toLocaleString("en-IN")}</div>
        </div>

        <input
          type="range"
          min={minLoan}
          max={maxLoan}
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          style={styles.range}
        />

        <div style={{ ...styles.fieldRow, marginTop: 20 }}>
          <div>
            <div style={styles.label}>Down Payment*</div>
            <div style={styles.sub}>₹ 0</div>
          </div>

          <div style={styles.fieldValue}>₹ {downPayment.toLocaleString("en-IN")}</div>
        </div>

        <input
          type="range"
          min={0}
          max={loanAmount}
          value={downPayment}
          onChange={(e) => setDownPayment(Number(e.target.value))}
          style={styles.range}
        />

        <div style={{ ...styles.fieldRow, marginTop: 20 }}>
          <div>
            <div style={styles.label}>Duration of Loan</div>
            <div style={styles.sub}>12 Months</div>
          </div>

          <div style={styles.fieldValue}>{duration} Months</div>
        </div>

        <input
          type="range"
          min={12}
          max={84}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          style={styles.range}
        />

        <button style={styles.btn}>₹ CHECK ELIGIBILITY</button>

        <div style={styles.disclaimer}>
          *Processing fee and other loan charges are not included.
          <br />
          Disclaimer: Rate of interest may vary as per credit profile.
        </div>
      </div>
    </div>
  );
}
