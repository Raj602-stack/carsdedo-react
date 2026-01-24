import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FiX } from "react-icons/fi";

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
  Format filter display values
-------------------------------------------------- */
const formatPriceRange = (min, max) => {
  const format = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${Math.round(val / 100000)} L`;
    return `₹${Math.round(val / 1000)}k`;
  };
  return `${format(min)} - ${format(max)}`;
};

const formatYearRange = (min, max) => {
  if (min && max) return `${min} - ${max}`;
  if (min) return `${min} & above`;
  if (max) return `Up to ${max}`;
  return "";
};

const formatKmRange = (min, max) => {
  if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} km`;
  if (min) return `From ${min.toLocaleString()} km`;
  if (max) return `Up to ${max.toLocaleString()} km`;
  return "";
};

/* --------------------------------------------------
  Buy Page
-------------------------------------------------- */

export default function BuyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialLoad, setInitialLoad] = useState(true);

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // Add refs
  const isInitialHydrate = useRef(true);
  const observer = useRef();
  const lastCarElementRef = useRef();
  const initialLoadDone = useRef(false);
  const [filtersChanged, setFiltersChanged] = useState(false);

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
    Active Filters (derived from filters)
  ---------------------------------------------- */
  const activeFilters = useMemo(() => {
    const filtersList = [];
    
    // Price filter
    if (filters.price_min !== null || filters.price_max !== null) {
      const min = filters.price_min ?? 0;
      const max = filters.price_max ?? 5000000;
      filtersList.push({
        key: 'price',
        label: formatPriceRange(min, max),
        remove: () => {
          setFilters(s => ({ ...s, price_min: null, price_max: null, page: 1 }));
          setFiltersChanged(true);
        }
      });
    }
    
    // Year filter
    if (filters.year_min !== null || filters.year_max !== null) {
      filtersList.push({
        key: 'year',
        label: formatYearRange(filters.year_min, filters.year_max),
        remove: () => {
          setFilters(s => ({ ...s, year_min: null, year_max: null, page: 1 }));
          setFiltersChanged(true);
        }
      });
    }
    
    // KM filter
    if (filters.km_min !== null || filters.km_max !== null) {
      filtersList.push({
        key: 'km',
        label: formatKmRange(filters.km_min, filters.km_max),
        remove: () => {
          setFilters(s => ({ ...s, km_min: null, km_max: null, page: 1 }));
          setFiltersChanged(true);
        }
      });
    }
    
    // Array filters (brand, fuel, body, transmission, color)
    const arrayFilters = [
      { key: 'brand', label: 'Brand' },
      { key: 'fuel', label: 'Fuel' },
      { key: 'body', label: 'Body' },
      { key: 'transmission', label: 'Transmission' },
      { key: 'color', label: 'Color' }
    ];
    
    arrayFilters.forEach(({ key, label }) => {
      const values = filters[key];
      if (Array.isArray(values) && values.length > 0) {
        values.forEach(value => {
          filtersList.push({
            key: `${key}_${value}`,
            label: `${label}: ${value}`,
            remove: () => {
              const newValues = values.filter(v => v !== value);
              setFilters(s => ({ ...s, [key]: newValues, page: 1 }));
              setFiltersChanged(true);
            }
          });
        });
      }
    });
    
    return filtersList;
  }, [filters]);

  /* ----------------------------------------------
    Clear all filters
  ---------------------------------------------- */
  const clearAllFilters = () => {
    setFilters({
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
    setFiltersChanged(true);
  };

  /* ----------------------------------------------
    Custom setFilters to track filter changes
  ---------------------------------------------- */
  const handleSetFilters = useCallback((updater) => {
    setFilters(prev => {
      const newFilters = typeof updater === 'function' ? updater(prev) : updater;
      // Check if filters actually changed (not just page)
      const oldFilters = { ...prev };
      delete oldFilters.page;
      const newFiltersCopy = { ...newFilters };
      delete newFiltersCopy.page;
      
      if (JSON.stringify(oldFilters) !== JSON.stringify(newFiltersCopy)) {
        setFiltersChanged(true);
      }
      
      return newFilters;
    });
  }, []);

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
    Fetch cars function
  ---------------------------------------------- */
  const fetchCars = useCallback(async (url, isLoadMore = false) => {
    const controller = new AbortController();
    
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        // Clear cars immediately when filters change
        if (filtersChanged) {
          setCars([]);
          setHasMore(false);
          setNextPage(null);
          setTotalCount(0);
        }
        setLoading(true);
      }
      setError(null);

      const res = await fetch(url, { signal: controller.signal });

      if (!res.ok) throw new Error("Failed to fetch cars");

      const data = await res.json();
      
      if (isLoadMore) {
        // Append new cars to existing ones
        setCars(prevCars => [...prevCars, ...(data.results || [])]);
      } else {
        // Replace cars on initial load or filter change
        setCars(data.results || []);
      }
      
      setTotalCount(data.count || 0);
      setNextPage(data.next);
      setHasMore(!!data.next);
      initialLoadDone.current = true;
      setFiltersChanged(false);
      setInitialLoad(false); // FIX: Set initial load to false
      
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }

    return controller;
  }, [filtersChanged]);

  /* ----------------------------------------------
    Debounced initial fetch on filter changes
  ---------------------------------------------- */
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      const query = buildQuery(filters);
      fetchCars(`${API_BASE_URL}/api/cars/?${query}`, false);
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [filters, fetchCars]);

  /* ----------------------------------------------
    Infinite scroll observer
  ---------------------------------------------- */
  useEffect(() => {
    // Don't set up observer if we're loading initial data or filters changed
    if (loading || !hasMore || filtersChanged) {
      if (observer.current) {
        observer.current.disconnect();
      }
      return;
    }

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !filtersChanged) {
        fetchCars(nextPage, true);
      }
    }, {
      rootMargin: '100px',
    });

    if (lastCarElementRef.current) {
      observer.current.observe(lastCarElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, loadingMore, hasMore, nextPage, fetchCars, filtersChanged]);

  const carsData = useMemo(() => cars.map(normalizeCar), [cars]);

  /* ----------------------------------------------
    Render
  ---------------------------------------------- */

  if (error) {
    return <div className={styles["error"]}>{error}</div>;
  }

  return (
    <div className={styles["buy-page"]}>
      <Filters filters={filters} setFilters={handleSetFilters} />

      <main className={styles["results"]} role="main">
        <PromotionalCarousel isMobile={false} />

        {/* Active Filters Bar */}
        {activeFilters.length > 0 && (
          <div className={styles["active-filters-container"]}>
            <div className={styles["active-filters-header"]}>
              <span className={styles["active-filters-title"]}>
                Applied Filters ({activeFilters.length})
              </span>
              <button 
                className={styles["clear-all-btn"]}
                onClick={clearAllFilters}
              >
                Clear All
              </button>
            </div>
            
            <div className={styles["active-filters-list"]}>
              {activeFilters.map((filter) => (
                <div key={filter.key} className={styles["active-filter-item"]}>
                  <span className={styles["filter-labell"]}>{filter.label}</span>
                  <button 
                    className={styles["remove-filter-btn"]}
                    onClick={filter.remove}
                    aria-label={`Remove ${filter.label} filter`}
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles["results-header"]}>
          <div className={styles["results-controls"]}>
            <div className={styles["results-count"]}>
              {initialLoad 
                ? "Loading..." 
                : loading && filtersChanged
                  ? "Searching..." 
                  : `${totalCount} cars found`
              }
            </div>

            <div className={styles["sort-container"]}>
              <span className={styles["sort-label"]}>Sort by:</span>
              <select
                className={styles["sort-select"]}
                value={filters.ordering}
                onChange={(e) =>
                  handleSetFilters((s) => ({
                    ...s,
                    ordering: e.target.value,
                    page: 1,
                  }))
                }
                disabled={loading && filtersChanged}
              >
                <option value="-created_at">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="km">Km: Low to High</option>
                <option value="-year">Year: New to Old</option>
                <option value="year">Year: Old to New</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles["cars-grid"]}>
          {/* Show skeletons on initial load OR when filters are changing */}
          {(initialLoad || (loading && filtersChanged)) ? (
            Array.from({ length: 12 }).map((_, i) => (
              <CarCardSkeleton key={`skeleton-${i}`} />
            ))
          ) : (
            // Show actual cars
            carsData.map((car, index) => {
              if (carsData.length === index + 1 && hasMore) {
                return (
                  <div ref={lastCarElementRef} key={car.id}>
                    <CarCard car={car} />
                  </div>
                );
              } else {
                return <CarCard key={car.id} car={car} />;
              }
            })
          )}
          
          {/* Show skeletons while loading more */}
          {loadingMore && 
            Array.from({ length: 8 }).map((_, i) => (
              <CarCardSkeleton key={`loadmore-skeleton-${i}`} />
            ))
          }
        </div>

        {!loading && !loadingMore && carsData.length === 0 && (
          <div className={styles["no-results"]}>
            No cars match your filters.
          </div>
        )}
        
        {/* Loading indicator at bottom */}
        {loadingMore && (
          <div className={styles["loading-more"]}>
            Loading more cars...
          </div>
        )}
        
        {/* End of results message */}
        {!hasMore && carsData.length > 0 && (
          <div className={styles["end-of-results"]}>
            You've reached the end
          </div>
        )}
      </main>

      <ScrollToTop />
    </div>
  );
}