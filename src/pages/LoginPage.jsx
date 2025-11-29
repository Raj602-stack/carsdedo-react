import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/LoginPage.css";
import BottomNav from "../components/BottomNav";

export default function LoginPage({ logo = process.env.PUBLIC_URL + "/carsdedo-background.png" }) {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  function validateNumber(num) {
    return /^\d{10}$/.test(num);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const cleaned = mobile.replace(/\D/g, "");
    if (!validateNumber(cleaned)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    // fake login
    login({ mobile: cleaned });
    // go to account (or previous)
    navigate("/account", { replace: true });
  }

  return (
    <div className="login-root">
      <header className="login-header" role="banner">
        <button className="login-back" aria-label="Go back" onClick={() => navigate(-1)}>←</button>
        <div className="login-logo-wrap">
          <img src={logo} alt="Brand" className="login-logo" />
        </div>
        <div className="login-header-actions" aria-hidden />
      </header>

      <main className="login-main">
        <h1 className="login-title">Login to view your account</h1>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="mobile" className="visually-hidden">Mobile number</label>
          <div className="input-wrap">
            <input
              id="mobile"
              name="mobile"
              inputMode="numeric"
              pattern="\d*"
              autoComplete="tel"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className={`mobile-input ${error ? "has-error" : ""}`}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "mobile-error" : undefined}
            />
          </div>

          {error && <div id="mobile-error" className="field-error" role="alert">{error}</div>}

          <p className="tos">
            By proceeding, you agree to our{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer">terms</a> and{" "}
            <a href="/conditions" target="_blank" rel="noopener noreferrer">conditions</a>
          </p>

          <button type="submit" className="verify-btn">Verify your number</button>
        </form>
      </main>
      {/* <BottomNav/> */}
    </div>
  );
}
