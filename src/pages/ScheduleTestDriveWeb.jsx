import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import styles from "../styles/ScheduleTestDriveWeb.module.css";
import { useCars } from "../context/CarsContext";
import Loader from "../components/Loader";

const SLOTS = [
  "10am - 11am",
  "11am - 12pm",
  "12pm - 1pm",
  "1pm - 2pm",
  "2pm - 3pm",
  "3pm - 4pm",
  "4pm - 5pm",
  "5pm - 6pm",
  "6pm - 7pm",
  "7pm - 8pm",
];

function getNextDates(count = 7) {
  const today = new Date();

  return Array.from({ length: count }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1); // start from tomorrow

    return {
      key: d.toISOString(),
      label: d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      sub: d.toLocaleDateString("en-IN", {
        weekday: "short",
      }),
    };
  });
}

export default function ScheduleTestDriveWeb() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { cars, loading } = useCars();

  const dates = useMemo(() => getNextDates(7), []);
  const [date, setDate] = useState(dates[0]?.label || "");
  const [slot, setSlot] = useState(SLOTS[0]);
  const [locationType, setLocationType] = useState("hub");

  const car = useMemo(() => {
    return cars.find((c) => String(c.id) === String(carId)) || null;
  }, [cars, carId]);

  const images = useMemo(() => {
    if (!car?.images) return [];
    const exterior = car.images.exterior || [];
    const interior = car.images.interior || [];
    return [...exterior, ...interior]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((img) => `https://api.carsdedo.com${img.image}`);
  }, [car]);

  useEffect(() => {
    if (dates.length > 0 && !date) {
      setDate(dates[0].label);
    }
  }, [dates, date]);

  if (loading) {
    return <Loader message="Loading..." fullScreen={true} />;
  }

  if (!car) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>Car not found</div>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          Go Back
        </button>
      </div>
    );
  }

  const handleSchedule = () => {
    navigate(`/test-drive/confirmation/${carId}`, {
      state: {
        date,
        slot,
        locationType,
      },
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Compact Header */}
        <div className={styles.pageHeader}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ←
          </button>
          <h1>Schedule Free Test Drive</h1>
        </div>
        {/* Left Column - Form */}
        <div className={styles.leftColumn}>
          {/* Car Card */}
          <section className={styles.carCard}>
            <div className={styles.carImageWrapper}>
              <img 
                src={images[0] || car.image || process.env.PUBLIC_URL + "/placeholder-car.png"} 
                alt={car.title}
                onError={(e) => {
                  if (!e.target.src.includes('placeholder-car.png')) {
                    e.target.src = process.env.PUBLIC_URL + "/placeholder-car.png";
                  }
                }}
              />
            </div>
            <div className={styles.carInfo}>
              <h3>{car.title}</h3>
              <p>{car.km?.toLocaleString("en-IN")} Km · {car.fuel} · {car.transmission}</p>
              <div className={styles.priceInfo}>
                <strong>₹{(car.price / 100000).toFixed(2)} Lakh</strong>
                <span>EMI ₹{Math.round(car.price / 60).toLocaleString("en-IN")}/mo</span>
              </div>
            </div>
          </section>

          {/* Location Selection */}
          <section className={styles.section}>
            <h2>Select Location</h2>
            <div className={styles.toggleGroup}>
              <button
                className={`${styles.toggleBtn} ${locationType === "hub" ? styles.active : ""}`}
                onClick={() => setLocationType("hub")}
              >
                <span className={styles.toggleIcon}>🏢</span>
                <div className={styles.toggleContent}>
                  <strong>CarsDedo HUB</strong>
                  <p>Visit our nearest experience center</p>
                </div>
              </button>
              <button
                className={`${styles.toggleBtn} ${locationType === "home" ? styles.active : ""}`}
                onClick={() => setLocationType("home")}
              >
                <span className={styles.toggleIcon}><FiHome /></span>
                <div className={styles.toggleContent}>
                  <strong>MY LOCATION</strong>
                  <p>We come to you within 48 hours</p>
                </div>
              </button>
            </div>
          </section>

          {/* Hub Address */}
          {locationType === "hub" && (
            <section className={styles.section}>
              <h2>CarsDedo Hub Location</h2>
              <div className={styles.addressCard}>
                <p>Metro Walk Mall, Adventure Island, Parking Lane No-8, Rohini Sector 10, New Delhi, Delhi 110085</p>
                <button className={styles.readMoreBtn}>Read More</button>
              </div>
            </section>
          )}

          {/* Date Selection */}
          <section className={styles.section}>
            <h2>Select Date</h2>
            <div className={styles.dateRow}>
              {dates.map((d) => (
                <button
                  key={d.key}
                  className={`${styles.dateBtn} ${date === d.label ? styles.activeDate : ""}`}
                  onClick={() => {
                    setDate(d.label);
                    setSlot(SLOTS[0]);
                  }}
                >
                  <span>{d.label}</span>
                  <small>{d.sub}</small>
                </button>
              ))}
            </div>
          </section>

          {/* Time Slots */}
          <section className={styles.section}>
            <h2>Select Time Slot</h2>
            <div className={styles.slotGrid}>
              {SLOTS.map((s) => (
                <button
                  key={s}
                  className={`${styles.slotBtn} ${slot === s ? styles.activeSlot : ""}`}
                  onClick={() => setSlot(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Summary */}
        <div className={styles.rightColumn}>
          <div className={styles.summaryCard}>
            <h3>Test Drive Summary</h3>
            
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Car</span>
              <span className={styles.summaryValue}>{car.title}</span>
            </div>

            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Location</span>
              <span className={styles.summaryValue}>
                {locationType === "hub" ? "CarsDedo Hub" : "Your Location"}
              </span>
            </div>

            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Date</span>
              <span className={styles.summaryValue}>{date}</span>
            </div>

            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Time</span>
              <span className={styles.summaryValue}>{slot}</span>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.note}>
              <span className={styles.noteIcon}>ℹ️</span>
              <p>Our executive will contact you within 24 hours to confirm your test drive.</p>
            </div>

            <button
              className={styles.scheduleBtn}
              onClick={handleSchedule}
              disabled={!slot || !date}
            >
              Schedule Test Drive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
