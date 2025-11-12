// components/MobileCards.jsx
import React from "react";
import FindMyCarCard from "./FindMyCarCard";
import ServicesGrid from "./ServicesGrid";
import "../styles/MobileCards.css";

export default function MobileCards() {
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
        onClick={() => console.log("Find my car clicked")}
      />

      <ServicesGrid services={services} onSeeAll={() => console.log("See all services")} />
    </div>
  );
}
