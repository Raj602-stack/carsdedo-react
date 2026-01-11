// src/pages/BuyPage.jsx
import React, { useMemo, useState , useEffect} from "react";

import { useLocation } from "react-router-dom";
import Filters from "../components/Filters";
import CarCard from "../components/CarCard";
import styles from  "../styles/BuyPageweb.module.css";

import { useCars } from "../context/CarsContext";



function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const normalizeCar = (car) => {
  return {
    id: car.id,
    title: car.title,
    brand: car.brand,
    model: car.model,
    year: car.year,
    price: Number(car.discount_price || car.price || 0),
    originalPrice: Number(car.price || 0),
    km: car.km,
    fuel: car.fuel,
    transmission: car.transmission,
    body: car.body,
    city: car.city,
    colorKey: car.colorKey,
    tags: car.tags || [],

    // ✅ OLD image compatibility
    image:
      car.images?.exterior?.[0]?.image
        ? `http://localhost:8000${car.images.exterior[0].image}`
        : "/placeholder-car.png",

    images: {
      exterior:
        car.images?.exterior?.map((i) =>
          `${process.env.REACT_APP_BACKEND_URL}${i.image}`
        ) || [],
      interior:
        car.images?.interior?.map((i) =>
          `${process.env.REACT_APP_BACKEND_URL}${i.image}`
        ) || [],
      engine: [],
      tyres: [],
      overview: [],
    },

    // ✅ OLD features array compatibility
   

    owner: car.owner_count === 1 ? "First Owner" : `${car.owner_count} Owners`,
    reasonsToBuy: (car.reasons_to_buy || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((r) => ({
      title: r.title,
      description: r.description,
    })),

  /* =========================
     SPECS (FLATTENED)
  ========================== */
  specs: Object.entries(car.specs || {}).flatMap(
    ([category, items]) =>
      items.map((i) => ({
        category,
        label: i.label,
        value: i.value,
      }))
  ),

  /* =========================
     FEATURES
  ========================== */

  // UI-friendly (grouped)
  featuresByCategory: Object.entries(car.features || {}).map(
    ([category, items]) => ({
      category,
      items: items.map((f) => f.name),
    })
  ),

  // Logic-friendly (flat)
  features: Object.values(car.features || {})
    .flat()
    .map((f) => f.name),

  /* =========================
     QUALITY REPORT
  ========================== */
  inspections: (car.inspections || []).map((section) => ({
    key: section.key,
    title: section.title,
    subsections: section.subsections.map((sub) => ({
      title: sub.title,
      items: sub.items.map((item) => ({
        name: item.name,
        status: item.status, // flawless | minor | major
        remarks: item.remarks,
      })),
    })),
  })),


  };
};



export default function BuyPage() {
  const location = useLocation();
  const { cars, loading, error } = useCars();

 
  

const carsData = useMemo(() => {
  return cars.map(normalizeCar);
}, [cars]);
console.log(carsData);


  // metadata for UI controls
  // const brands = Array.from(new Set(carsData.map((c) => c.brand))).sort();
  const brands = Array.from(new Set(carsData.map((c) => c.brand))).sort();

  // derive years from data (unique sorted descending)
  const yearsSet = Array.from(new Set(carsData.map((c) => c.year)));
  const years = [...yearsSet].sort((a, b) => b - a).filter(Boolean);
  const fuels = Array.from(new Set(carsData.map((c) => c.fuel))).sort();
  const bodies = Array.from(new Set(carsData.map((c) => c.body))).sort();

  

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const q = params.get("q");

  if (q) {
    setFilters((prev) => ({
      ...prev,
      q: q,
    }));
  }
}, [location.search]);


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    console.log(params.get("body"));
  
    setFilters((prev) => {
      const next = { ...prev };
  
      // PRICE
      const price = params.get("price");
      if (price === "under-5") {
        next.priceMin = 0;
        next.priceMax = 500000;
      }
      if (price === "5-10") {
        next.priceMin = 500000;
        next.priceMax = 1000000;
      }
      if (price === "10-20") {
        next.priceMin = 1000000;
        next.priceMax = 2000000;
      }
      if (price === "20+") {
        next.priceMin = 2000000;
        next.priceMax = 5000000;
      }
  
      // FUEL
      const fuel = params.get("fuel");
      if (fuel) {
        next.fuel = [capitalize(fuel)];
      }
  
      // BODY
      const body = params.get("body");
      if (body) {
        next.body = [body];
        console.log(params.get("body")+" added");
        console.log(filters);
      }
  
      // TRANSMISSION
      const transmission = params.get("transmission");
      if (transmission) {
        next.transmission = [capitalize(transmission)];
      }
  
      // MAKE / BRAND
      const make = params.get("make");
      if (make) {
        next.brands = [capitalize(make)];
      }
  
      // YEAR
      const year = params.get("year");
      if (year) {
        next.year = year.split("-")[0]; // "2020-2023" → 2020
      }
  
      // KM
      const km = params.get("km");
      if (km === "under-25") next.kms = [25000];
      if (km === "25-50") next.kms = [50000];
      if (km === "50-100") next.kms = [100000];
      if (km === "100+") next.kms = [999999];
  
      return next;
    });
  }, [location.search]);
  

  // initial filters: include all keys used by Filters.jsx
  const [filters, setFilters] = useState({
    q: "",
    priceMin: 0,
    priceMax: 5000000,
    brands: [],
    year: "",
    kms: [],
    fuel: [],
    body: [],
    colors: [],

    // newly added sets
    transmission: [],
    category: [],
    features: [],
    seats: [],
    rto: [],
    owner: [],
    hubs: [],

    sortBy: "relevance",
  });

  // helper: check if array filter intersects / contains
  const anyMatch = (selected = [], value) => {
    if (!selected || selected.length === 0) return true;
    return selected.includes(value);
  };

  // helper: when selected is array of options (like colors), return true if car matches any
  const matchesAny = (selected = [], value) => {
    if (!selected || selected.length === 0) return true;
    return selected.includes(value);
  };

  // helper: require all selected features to be present in car.features
  const featuresMatchAll = (selected = [], carFeatures = []) => {
    if (!selected || selected.length === 0) return true;
    if (!Array.isArray(carFeatures)) return false;
    return selected.every((s) => carFeatures.includes(s));
  };

  // compute filtered results (memoized)
  const filtered = useMemo(() => {
    const result = carsData
      .filter((c) => {
        // text search
        if (filters.q && filters.q.trim() !== "") {
          const q = filters.q.toLowerCase();
          const hay = `${c.title || ""} ${c.brand || ""} ${c.model || ""}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }

        // price range
        if (typeof c.price === "number") {
          if (c.price < filters.priceMin || c.price > filters.priceMax) return false;
        } else {
          // if car has no price, exclude when price filter active
          if (filters.priceMin > 0 || filters.priceMax < 5000000) return false;
        }

        // colors
        if (filters.colors && filters.colors.length > 0) {
          // car.colorKey should match one of selected color keys
          if (!c.colorKey) return false;
          if (!matchesAny(filters.colors, c.colorKey)) return false;
        }

        // brands
        if (filters.brands && filters.brands.length > 0) {
          if (!matchesAny(filters.brands, c.brand)) return false;
        }

        // year (year filter means "selectedYear & above")
        if (filters.year) {
          const num = Number(filters.year);
          if (!Number.isNaN(num) && c.year < num) return false;
        }

        // kms: if any kms thresholds selected, car must be <= any of them
        if (filters.kms && filters.kms.length > 0) {
          const ok = filters.kms.some((k) => c.km <= k);
          if (!ok) return false;
        }

        // fuel
        if (filters.fuel && filters.fuel.length > 0) {
          if (!matchesAny(filters.fuel, c.fuel)) return false;
        }

        // body
        if (filters.body && filters.body.length > 0) {
          const carBody = (c.body || "").toLowerCase();
          const selectedBodies = filters.body.map(b => b.toLowerCase());
        
          if (!selectedBodies.includes(carBody)) return false;
        }
        

        // transmission
        if (filters.transmission && filters.transmission.length > 0) {
          if (!c.transmission) return false;
          if (!matchesAny(filters.transmission, c.transmission)) return false;
        }

        // category (car.category field may exist)
        if (filters.category && filters.category.length > 0) {
          // car may have body/category mapping; we'll check both
          const catMatch =
            (c.category && matchesAny(filters.category, c.category)) ||
            matchesAny(filters.category, c.body);
          if (!catMatch) return false;
        }

        // features (require all selected features to be present)
        if (filters.features && filters.features.length > 0) {
          if (!featuresMatchAll(filters.features, c.features || [])) return false;
        }

        // seats
        if (filters.seats && filters.seats.length > 0) {
          // car.seats may be a number or string
          const carSeats = c.seats ? String(c.seats) : "";
          // allow "8+" selection: treat as >=8
          const seatOk = filters.seats.some((s) => {
            if (s.endsWith("+")) {
              const min = Number(s.replace("+", ""));
              return Number(c.seats || 0) >= min;
            }
            return carSeats === String(s);
          });
          if (!seatOk) return false;
        }

        // rto: match if car.rto (prefix) matches any selected RTOs
        if (filters.rto && filters.rto.length > 0) {
          if (!c.rto) return false;
          const ok = filters.rto.some((r) => (c.rto || "").startsWith(r));
          if (!ok) return false;
        }

        // owner
        if (filters.owner && filters.owner.length > 0) {
          // car.owner may be "First owner" etc.
          if (!c.owner) return false;
          if (!matchesAny(filters.owner, c.owner)) return false;
        }

        // hubs
        if (filters.hubs && filters.hubs.length > 0) {
          if (!c.hub) return false;
          if (!matchesAny(filters.hubs, c.hub)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
        if (filters.sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
        if (filters.sortBy === "km-asc") return (a.km || 0) - (b.km || 0);
        // default: keep original order
        return a.id - b.id;
      });

    return result;
  }, [filters,carsData]);

  // readable header text for selected city
  const selectedCity = localStorage.getItem("selectedCity") || "City";

  

  return (
    <div className={styles["buy-page"]}>
      <Filters
        filters={filters}
        setFilters={setFilters}
        metadata={{ brands, years, fuels, bodies }}
      />
    
      <main className={styles["results"]} role="main">
        <div className={styles["results-header"]}>
          <div className={styles["breadcrumbs"]}>
            Home › Used Cars › Used Cars in {selectedCity}
          </div>
    
          <div className={styles["results-controls"]}>
            <div className={styles["results-count"]}>
              {filtered.length} results
            </div>
    
            <select
              className={styles["sort-select"]}
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((s) => ({ ...s, sortBy: e.target.value }))
              }
              aria-label="Sort results"
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="km-asc">Km: Low to High</option>
            </select>
          </div>
        </div>
    
        <div className={styles["cars-grid"]} aria-live="polite">
          {filtered.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
    
        {filtered.length === 0 && (
          <div className={styles["no-results"]}>
            No cars match your filters. Try resetting filters.
          </div>
        )}
      </main>
    </div>
    
  );
}
