import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import carsData from "../data/cars";
import styles from "../styles/CarFilterMobile.module.css";

const PRICE_PRESETS = [
  { label: "Under 5 Lakh", min: 0, max: 500000 },
  { label: "5 – 10 Lakh", min: 500000, max: 1000000 },
  { label: "10 – 20 Lakh", min: 1000000, max: 2000000 },
];

const POPULAR_CARS = [
  { name: "Swift", brand: "Maruti Suzuki", model: "Swift", img: process.env.PUBLIC_URL + "/baleno.avif" },
  { name: "Verna", brand: "Ford", model: "Figo", img: process.env.PUBLIC_URL + "/baleno.avif" },
  { name: "Baleno", brand: "Maruti Suzuki", model: "Baleno", img: process.env.PUBLIC_URL + "/baleno.avif" },
  { name: "i20", brand: "Hyundai", model: "i20", img: process.env.PUBLIC_URL + "/baleno.avif" },
  { name: "City", brand: "Honda", model: "City", img: process.env.PUBLIC_URL + "/baleno.avif" },
  { name: "Wagon R", brand: "Maruti Suzuki", model: "Wagon R", img: process.env.PUBLIC_URL + "/baleno.avif"},
  { name: "Nexon", brand: "Tata", model: "Nexon", img:process.env.PUBLIC_URL + "/baleno.avif" },
  { name: "Kwid", brand: "Renault", model: "Kwid", img:process.env.PUBLIC_URL + "/baleno.avif" },
  { name: "Amaze", brand: "Honda", model: "Amaze", img: process.env.PUBLIC_URL + "/baleno.avif" },
];


export default function CarFilterMobile() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  /* -----------------------------
     SEARCH LOGIC (same as desktop)
  ----------------------------- */
  function handleSearch(val) {
    setSearch(val);

    if (!val.trim()) {
      setSuggestions([]);
      return;
    }

    const q = val.toLowerCase();

    const matches = carsData
      .filter((c) =>
        `${c.title} ${c.brand} ${c.model} ${c.fuel} ${c.body}`
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 6);

    setSuggestions(matches);
  }

  function go(params) {
    const qs = new URLSearchParams(params).toString();
    navigate(`/buy?${qs}`);
  }

  return (
    <div className={styles.container}>

<div className={styles.header}>
    <button
      className={styles.backBtn}
      onClick={() => {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate("/");
        }
      }}
      aria-label="Go back"
    >
      ←
    </button>

    <div className={styles.headerTitle}>Search Cars</div>
  </div>
      {/* 🔍 SEARCH */}
      <div className={styles.searchWrap}>
        <input
          className={styles.searchInput}
          placeholder="Search cars, brands, models…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {suggestions.length > 0 && (
          <div className={styles.suggestions}>
           {suggestions.map((car) => (
  <div
    key={car.id}
    className={styles.suggestionItem}
    onClick={() => {
      navigate(
        `/buy?brand=${encodeURIComponent(car.brand)}&model=${encodeURIComponent(car.model)}`
      );
      setSuggestions([]);
      setSearch("");
    }}
  >
    <strong>{car.brand}</strong> {car.model}
    <div className={styles.meta}>
      {car.body} · {car.fuel} · {car.city}
    </div>
  </div>
))}

          </div>
        )}
      </div>

      {/* 💰 PRICE RANGE */}
      <section className={styles.section}>
        <h3 className={styles.title}>PRICE RANGE</h3>
        <div className={styles.grid}>
          {PRICE_PRESETS.map((p) => (
            <button
              key={p.label}
              className={styles.chip}
              onClick={() =>
                go({
                  priceMin: p.min,
                  priceMax: p.max,
                })
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* 🚗 POPULAR CARS */}
<section className={styles.section}>
  <h3 className={styles.title}>POPULAR CARS</h3>

  <div className={styles.popularGrid}>
    {POPULAR_CARS.map((car) => (
      <div
        key={car.name}
        className={styles.popularCard}
        onClick={() =>
          navigate(
            `/buy?brand=${encodeURIComponent(car.brand)}&model=${encodeURIComponent(car.model)}`
          )
        }
      >
        <div className={styles.popularImgWrap}>
          <img
            src={car.img}
            alt={car.name}
            loading="lazy"
            onError={(e) => {
              e.target.src = "/cars/default-car.png";
            }}
          />
        </div>

        <div className={styles.popularName}>{car.name}</div>
      </div>
    ))}
  </div>
</section>

    </div>
  );
}
