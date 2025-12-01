// src/pages/BuyPage.jsx
import React, { useMemo, useState } from "react";
import carsData from "../data/cars";
import Filters from "../components/Filters";
import CarCard from "../components/CarCard";
import "../styles/BuyPageweb.css";

export default function BuyPageWeb() {
  // build metadata for filter UIs
  const brands = Array.from(new Set(carsData.map((c) => c.brand))).sort();
  const years = [2023, 2021, 2019, 2017, 2015]; // or derive from data
  const fuels = Array.from(new Set(carsData.map((c) => c.fuel))).sort();
  const bodies = Array.from(new Set(carsData.map((c) => c.body))).sort();

  const [filters, setFilters] = useState({
    q: "",
    priceMin: 0,
    priceMax: 5000000,
    brands: [],
    year: "",
    kms: [],
    fuel: [],
    body: [],
    sortBy: "relevance",
  });

  // filtering logic
  const filtered = useMemo(() => {
    return carsData
      .filter((c) => {
        // text search
        if (filters.q) {
          const q = filters.q.toLowerCase();
          if (!`${c.title} ${c.brand} ${c.model}`.toLowerCase().includes(q)) return false;
        }
        // price
                // price: match if car.price between priceMin and priceMax
        if (c.price < filters.priceMin || c.price > filters.priceMax) return false;


        // brands
        if (filters.brands.length > 0 && !filters.brands.includes(c.brand)) return false;

        // year
        if (filters.year && c.year < Number(filters.year)) return false;

        // kms: any selected means include if less/equal any selected threshold
        if (filters.kms.length > 0) {
          const ok = filters.kms.some((k) => c.km <= k);
          if (!ok) return false;
        }

        // fuel
        if (filters.fuel.length > 0 && !filters.fuel.includes(c.fuel)) return false;

        // body
        if (filters.body.length > 0 && !filters.body.includes(c.body)) return false;

        return true;
      })
      .sort((a, b) => {
        // simple sort options
        if (filters.sortBy === "price-asc") return a.price - b.price;
        if (filters.sortBy === "price-desc") return b.price - a.price;
        if (filters.sortBy === "km-asc") return a.km - b.km;
        return a.id - b.id; // relevance/default
      });
  }, [filters]);

  return (
    <div className="buy-page">
      <Filters
        filters={filters}
        setFilters={setFilters}
        metadata={{ brands, years, fuels, bodies }}
      />

      <main className="results">
        <div className="results-header">
          <div className="breadcrumbs">Home › Used Cars › Used Cars in {localStorage.getItem("selectedCity") || "City"}</div>
          <div className="results-controls">
            <div className="results-count">{filtered.length} results</div>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((s) => ({ ...s, sortBy: e.target.value }))}
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="km-asc">Km: Low to High</option>
            </select>
          </div>
        </div>

        {/* grid */}
        <div className="cars-grid">
          {filtered.map((car) => (
            <CarCard car={car} key={car.id} />
          ))}
        </div>

        {/* empty state */}
        {filtered.length === 0 && (
          <div className="no-results">No cars match your filters. Try resetting filters.</div>
        )}
      </main>
    </div>
  );
}
