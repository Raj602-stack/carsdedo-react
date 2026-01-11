import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/AccountPage.css";
import BottomNav from "../components/BottomNav";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="account-root">
      <header className="acc-header">
        <button className="acc-hamburger" onClick={() => {/* open menu */}}>☰</button>
        <div className="acc-brand">CarsDedo</div>
        <button className="acc-logout" onClick={handleLogout}>LOGOUT ↪</button>
      </header>

      <main className="acc-main">
        <div className="acc-card">
          <div className="acc-number">{user?.mobile ?? "—"}</div>
          <button className="acc-settings" onClick={() => navigate("/settings")}>Settings</button>
        </div>

        <div className="acc-tabs">
          <button 
            className="tab active"
            onClick={() => navigate("/buy")}
          >
            Buy
          </button>
          <button 
            className="tab"
            onClick={() => navigate("/sell")}
          >
            Sell
          </button>
          <button className="tab">Services</button>
        </div>

        <h3 className="section-title">Your orders</h3>
        <div className="order-card">
          <div className="order-empty">You have no orders yet</div>
          <button className="order-cta" onClick={() => navigate("/buy")}>Buy car ➜</button>
        </div>

        <div className="promo-card">
          <h4>Loan made easier than ever.</h4>
          <p>Finance your future ride today with CarsDedo Capital</p>
          <button className="promo-btn">CHECK ELIGIBILITY</button>
        </div>

        <div className="list-link">FAQs ➜</div>
        <div className="list-link">Terms and privacy ➜</div>
      </main>

      {/* <nav className="acc-bottom-nav">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/buy")}>Buy Car</button>
        <button onClick={() => navigate("/shortlist")}>Shortlists</button>
        <button onClick={() => navigate("/sell")}>Sell Car</button>
        <button className="active" onClick={() => navigate("/account")}>Account</button>
      </nav> */}

      <BottomNav/>
    </div>
  );
}
