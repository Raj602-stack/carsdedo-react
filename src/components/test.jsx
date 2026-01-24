import React, { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import Filters from "../components/Filters";
import CarCard from "../components/CarCard";
import PromotionalCarousel from "../components/PromotionalCarousel";
import Loader from "../components/Loader";
import ScrollToTop from "../components/ScrollToTop";

import styles from "../styles/BuyPageweb.module.css";
import { API_BASE_URL } from "../config/api";
import CarCardSkeleton from "../components/CarCardSkeleton";

/* --------------------------------------------------
  Helpers
-------------------------------------------------- */

const buildQuery = (filters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const cleaned = value.filter(v => v && v !== "");
      if (cleaned.length > 0) {
        params.set(key, cleaned.join(","));
      }
    } else if (
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      params.set(key, value);
    }
  });

  return params.toString();
};

const normalizeCar = (car) => {
  // ✅ Flatten specs object → array
  const specsArray = car.specs
    ? Object.values(car.specs).flat()
    : [];

  // ✅ Helper to extract spec values safely
  const extractSpec = (keywords = []) => {
    const spec = specsArray.find((s) =>
      keywords.some((k) =>
        s.label?.toLowerCase().includes(k.toLowerCase())
      )
    );
    return spec?.value || null;
  };

  // ✅ Extract commonly used specs
  const mileage =
    extractSpec(["mileage", "kmpl", "km/l"]) || null;

  const power =
    extractSpec(["max power", "bhp", "hp"]) || null;

  const seats =
    car.seats ||
    extractSpec(["seat", "seating"]) ||
    null;

  const hasDiscount =
    car.discount_price &&
    Number(car.discount_price) < Number(car.price) &&
    Number(car.discount_price) > 0;

  return {
    id: car.id,
    title: car.title,
    brand: car.brand,
    model: car.model,
    year: car.year,

    price: Number(car.discount_price || car.price || 0),
    originalPrice: Number(car.price || 0),
    hasDiscount,

    km: car.km,
    fuel: car.fuel,
    transmission: car.transmission,
    body: car.body,
    seats,
    city: car.city,
    rto: car.rto,
    colorKey: car.colorKey,

    mileage,
    power,

    owner:
      car.owner_count === 1
        ? "First Owner"
        : `${car.owner_count} Owners`,

    tags: car.tags || [],

    image:
      car.images?.exterior?.[0]?.image
        ? `${API_BASE_URL}${car.images.exterior[0].image}`
        : process.env.PUBLIC_URL + "/placeholder-car.png",
  };
};

/* --------------------------------------------------
  Buy Page
-------------------------------------------------- */

export default function BuyPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Add a ref to track initial hydration
  const isInitialHydrate = useRef(true);

  /* ----------------------------------------------
    Filters (BACKEND ALIGNED)
  ---------------------------------------------- */
  const [filters, setFilters] = useState({
    search: "",
    price_min: null,
    price_max: null,
    year_min: null,
    year_max: null,
    km_min: null,
    km_max: null,

    brand: [],
    color: [],
    fuel: [],
    body: [],
    transmission: [],

    ordering: "-created_at",
    page: 1,
  });

  /* ----------------------------------------------
    Hydrate filters from URL on load (runs once)
  ---------------------------------------------- */
  useEffect(() => {
    const next = { ...filters };

    searchParams.forEach((value, key) => {
      if (key in next) {
        if (Array.isArray(next[key])) {
          next[key] = value.split(",");
        } else {
          next[key] = value;
        }
      }
    });

    setFilters(next);
    
    // Mark that initial hydration is done
    isInitialHydrate.current = false;
    // eslint-disable-next-line
  }, []);

  /* ----------------------------------------------
    Sync filters to URL (without triggering API call)
  ---------------------------------------------- */
  useEffect(() => {
    // Don't update URL on initial hydration
    if (isInitialHydrate.current) return;
    
    const query = buildQuery(filters);
    setSearchParams(query, { replace: true });
  }, [filters, setSearchParams]);

  /* ----------------------------------------------
    Debounced backend fetch (only for API calls)
  ---------------------------------------------- */
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const query = buildQuery(filters);

        const res = await fetch(
          `${API_BASE_URL}/api/cars/?${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Failed to fetch cars");

        const data = await res.json();
        setCars(data.results || data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    },1); // ✅ debounce

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [filters]); // Remove setSearchParams from dependencies

  const carsData = useMemo(() => cars.map(normalizeCar), [cars]);

  /* ----------------------------------------------
    Render
  ---------------------------------------------- */

  if (error) {
    return <div className={styles["error"]}>{error}</div>;
  }

  return (
    <div className={styles["buy-page"]}>
      <Filters filters={filters} setFilters={setFilters} />

      <main className={styles["results"]} role="main">
        <PromotionalCarousel isMobile={false} />

        <div className={styles["results-header"]}>
          <div className={styles["results-controls"]}>
            <div className={styles["results-count"]}>
              {loading ? "Loading..." : `${carsData.length} results`}
            </div>

            <select
              className={styles["sort-select"]}
              value={filters.ordering}
              onChange={(e) =>
                setFilters((s) => ({
                  ...s,
                  ordering: e.target.value,
                  page: 1,
                }))
              }
            >
              <option value="-created_at">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="km">Km: Low to High</option>
            </select>
          </div>
        </div>

        <div className={styles["cars-grid"]}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <CarCardSkeleton key={i} />
              ))
            : carsData.map((car) => (
                <CarCard key={car.id} normalizeCar={car} car={car} />
              ))
          }
        </div>

        {carsData.length === 0 && !loading && (
          <div className={styles["no-results"]}>
            No cars match your filters.
          </div>
        )}
      </main>

      <ScrollToTop />
    </div>
  );
}