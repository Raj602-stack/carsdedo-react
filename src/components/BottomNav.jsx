import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faHouse,
  faCar,
  faHeart,
  faKey,
  faUser
} from "@fortawesome/free-solid-svg-icons";

import "../styles/BottomNav.css";

export default function BottomNav() {
  // Generic item
  const Item = ({ to, label, icon }) => (
    <NavLink
      to={to}
      className={({ isActive }) => `bn-item ${isActive ? "active" : ""}`}
    >
      <span className="bn-icon">
        <FontAwesomeIcon icon={icon} />
      </span>
      <span className="bn-label">{label}</span>
    </NavLink>
  );

  return (
    <nav className="bn-root" role="navigation" aria-label="Bottom Navigation">
      <div className="bn-inner">
        <Item to="/" label="Home" icon={faHouse} />
        <Item to="/cars" label="Buy Car" icon={faCar} />
        <Item to="/shortlists" label="Shortlists" icon={faHeart} />
        <Item to="/sell" label="Sell Car" icon={faKey} />
        <Item to="/account" label="Account" icon={faUser} />
      </div>
    </nav>
  );
}
