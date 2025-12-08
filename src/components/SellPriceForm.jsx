// src/components/SellPriceForm.jsx
import React, { useState, useEffect } from "react";
import styles from "../styles/SellPriceForm.module.css";

export default function SellPriceForm({ open, onClose, onSubmit, initialBrand }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    brand: initialBrand || "",
    rtoLocation: "",
    manufacturingYear: "",
    model: "",
    fuelType: "petrol",
    transmission: "manual",
    ownerships: "1",
    kmsDriven: "",
    sellWhen: "",
    address: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      // reset when closed
      setStep(1);
      setSubmitting(false);
      setSuccess(false);
      setForm((f) => ({ ...f, brand: initialBrand || "" }));
      setErrors({});
    }
  }, [open, initialBrand]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: null }));
  }

  function validate() {
    const err = {};
    // required fields
    const required = ["rtoLocation", "manufacturingYear", "model", "fuelType", "transmission", "ownerships", "kmsDriven", "sellWhen", "address", "mobile"];
    required.forEach((k) => {
      if (!form[k] || form[k].toString().trim() === "") err[k] = "Required";
    });
    // mobile simple check
    if (form.mobile && !/^\d{10}$/.test(form.mobile)) err.mobile = "Enter 10 digit mobile";
    // kms numeric
    if (form.kmsDriven && isNaN(Number(form.kmsDriven))) err.kmsDriven = "Enter a number";
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      setStep(1);
      return;
    }
    setSubmitting(true);
    try {
      // Replace this with your real API call
      const payload = { ...form };
      console.log("Submitting price form", payload);
      // fake wait
      await new Promise((r) => setTimeout(r, 700));
      setSuccess(true);
      onSubmit && onSubmit(payload);
      // after success keep visible for a moment then close automatically
      setTimeout(() => {
        setSubmitting(false);
        onClose();
      }, 900);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      setErrors({ form: "Something went wrong. Try again." });
    }
  }

  if (!open) return null;

  // helper: build years (1990..current)
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 1990; y--) years.push(y);

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      <aside className={styles.panel} role="dialog" aria-modal="true" aria-label="Get your car price">
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Get your car price</h3>
            <div className={styles.subtitle}>Quick form — free evaluation & instant quote</div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Step 1: car basics */}
          <div className={styles.formSection}>
            <label className={styles.label}>Brand</label>
            <input className={styles.input} name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Maruti Suzuki" />

            <label className={styles.label}>RTO Location</label>
            <input className={styles.input} name="rtoLocation" value={form.rtoLocation} onChange={handleChange} placeholder="RTO city or code (eg. DL01 / Delhi)" />

            <div className={styles.row}>
              <div style={{ flex: 1, marginRight: 10 }}>
                <label className={styles.label}>Manufacturing year</label>
                <select name="manufacturingYear" value={form.manufacturingYear} onChange={handleChange} className={styles.select}>
                  <option value="">Select year</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label className={styles.label}>Model</label>
                <input className={styles.input} name="model" value={form.model} onChange={handleChange} placeholder="e.g. Baleno VXI" />
              </div>
            </div>

            <div className={styles.row}>
              <div style={{ flex: 1, marginRight: 10 }}>
                <label className={styles.label}>Fuel type</label>
                <select name="fuelType" value={form.fuelType} onChange={handleChange} className={styles.select}>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="cng">CNG</option>
                  <option value="lpg">LPG</option>
                  <option value="ev">Electric</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label className={styles.label}>Transmission</label>
                <select name="transmission" value={form.transmission} onChange={handleChange} className={styles.select}>
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div style={{ flex: 1, marginRight: 10 }}>
                <label className={styles.label}>Ownership history</label>
                <select name="ownerships" value={form.ownerships} onChange={handleChange} className={styles.select}>
                  <option value="1">1st Owner</option>
                  <option value="2">2nd Owner</option>
                  <option value="3">3rd Owner</option>
                  <option value="4">4+ Owners</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label className={styles.label}>Kms driven</label>
                <input className={styles.input} name="kmsDriven" value={form.kmsDriven} onChange={handleChange} placeholder="e.g. 45,000" />
              </div>
            </div>

            <label className={styles.label}>When do you want to sell your car?</label>
            <input type="date" name="sellWhen" value={form.sellWhen} onChange={handleChange} className={styles.input} />
          </div>

          {/* Step 2: contact */}
          <div className={styles.formSection}>
            <label className={styles.label}>Address (for evaluation)</label>
            <textarea className={styles.textarea} name="address" value={form.address} onChange={handleChange} placeholder="House no, street, city, pincode" rows={3} />

            <label className={styles.label}>Mobile number</label>
            <input className={styles.input} name="mobile" value={form.mobile} onChange={handleChange} placeholder="10 digit mobile number" />

            {errors.form && <div className={styles.error}>{errors.form}</div>}
            {Object.keys(errors).length > 0 && (
              <div className={styles.errorList}>
                {Object.entries(errors).map(([k, v]) => v && <div key={k}>{k}: {v}</div>)}
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.btnGhost}>Cancel</button>
            <button type="submit" className={styles.btnPrimary} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit for free evaluation"}
            </button>
          </div>

          {success && <div className={styles.success}>Thanks! We'll contact you soon for a free evaluation.</div>}
        </form>
      </aside>
    </div>
  );
}
