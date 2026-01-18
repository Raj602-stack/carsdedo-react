// src/components/SellCarForm.jsx
import React, { useState } from "react";
import styles from "../styles/SellCarForm.module.css";

export default function SellCarForm({ prefillData }) {
  const [form, setForm] = useState({
    registrationNumber: prefillData?.registrationNumber || "",
    brand: prefillData?.brand || "",
    rto: "",
    year: "",
    model: "",
    fuel: "Petrol",
    transmission: "Manual",
    owner: "1st Owner",
    kms: "",
    sellDate: "",
    address: "",
    mobile: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("FORM DATA:", form);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Get your car price</h2>
      <p className={styles.subtitle}>
        Quick form — free evaluation & instant quote
      </p>

      <input
        name="registrationNumber"
        placeholder="Registration number"
        value={form.registrationNumber}
        onChange={handleChange}
      />

      <input
        name="brand"
        placeholder="Brand"
        value={form.brand}
        onChange={handleChange}
      />

      <input
        name="rto"
        placeholder="RTO city or code"
        onChange={handleChange}
      />

      <div className={styles.row}>
        <input name="year" placeholder="Manufacturing year" onChange={handleChange} />
        <input name="model" placeholder="Model" onChange={handleChange} />
      </div>

      <div className={styles.row}>
        <select name="fuel" onChange={handleChange}>
          <option>Petrol</option>
          <option>Diesel</option>
          <option>CNG</option>
          <option>Electric</option>
        </select>

        <select name="transmission" onChange={handleChange}>
          <option>Manual</option>
          <option>Automatic</option>
        </select>
      </div>

      <div className={styles.row}>
        <select name="owner" onChange={handleChange}>
          <option>1st Owner</option>
          <option>2nd Owner</option>
          <option>3rd Owner</option>
        </select>

        <input
          name="kms"
          placeholder="Kms driven"
          onChange={handleChange}
        />
      </div>

      <input
        type="date"
        name="sellDate"
        onChange={handleChange}
      />

      <textarea
        name="address"
        placeholder="Address for evaluation"
        onChange={handleChange}
      />

      <input
        name="mobile"
        placeholder="10 digit mobile number"
        onChange={handleChange}
      />

      <button type="submit" className={styles.submitBtn}>
        Submit for free evaluation
      </button>
    </form>
  );
}
