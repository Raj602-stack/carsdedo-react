// components/MobileCards.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import FindMyCarCard from "./FindMyCarCard";
import ServicesGrid from "./ServicesGrid";
import "../styles/MobileCards.css";

export default function MobileCards() {
  const navigate = useNavigate();

  const services = [
    { id: "s1", title: "Periodic Services", icon: process.env.PUBLIC_URL + "/periodicservice.png" },
    { id: "s2", title: "Car Wash & Detailing", icon: process.env.PUBLIC_URL + "/carwash.png" },
    { id: "s3", title: "Car Scan & Inspect", icon: process.env.PUBLIC_URL + "/checklist.png" },
  ];

  return (
    <div className="mc-stack">
      <FindMyCarCard
        title={"Find the perfect\ncar for you!"}
        desc={"Answer a few questions to find a car that fits your needs."}
        img={process.env.PUBLIC_URL + "/options.jpeg"}
        onClick={() => navigate("/buy")}
      />

      <ServicesGrid services={services} onSeeAll={() => navigate("/buy")} />
    </div>
  );
}
