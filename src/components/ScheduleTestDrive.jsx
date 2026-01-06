import React, { useState,useMemo , useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/ScheduleTestDrive.module.css";
import cars from "../data/cars";

// const DATES = [
//   { label: "2 Jan", sub: "Today" },
//   { label: "3 Jan", sub: "Tomorrow" },
//   { label: "4 Jan", sub: "Sun" },
// ];

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

function getNextDates(count = 3) {
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

  
  

export default function ScheduleTestDrive() {

const dates = useMemo(() => getNextDates(4), []);

const [date, setDate] = useState(dates[0].label);
const [slot, setSlot] = useState(SLOTS[0]);



  const { carId } = useParams();
  const navigate = useNavigate();

  const [locationType, setLocationType] = useState("hub");
 

//   const car = useMemo(
//     () => cars.find(c => c.id === Number(carId)),
//     [carId]
//   );

useEffect(() => {
    console.log("Dates:", dates);
    console.log("Current date:", date);
  }, [dates, date]);



  const car = useMemo(
    () => cars.find(c => c.id === Number(carId)),
    [carId, cars]
  );
  
  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>←</button>
        <h1>Schedule Free Test Drive</h1>
      </header>

      {/* Car Card */}
      <section className={styles.carCard}>
        <img src={car.image} alt="car" />
        <div>
          <h3>2015 Hyundai Grand i10 Sportz 1.2</h3>
          <p>36K Km · Petrol · Manual</p>
          <strong>₹ 3.53 Lakh</strong>
          <span>EMI ₹7,576 /mo</span>
        </div>
      </section>

      {/* Location */}
      <section className={styles.section}>
        <h2>Select location</h2>
        <div className={styles.toggleGroup}>
          <button
            className={locationType === "hub" ? styles.active : ""}
            onClick={() => setLocationType("hub")}
          >
            CarsDedo HUB
          </button>
          <button
            className={locationType === "home" ? styles.active : ""}
            onClick={() => setLocationType("home")}
          >
            MY LOCATION
          </button>
        </div>
      </section>

      {/* Hub Address */}
      {locationType === "hub" && (
        <section className={styles.section}>
          <h2>carsDedo hub location</h2>
          <div className={styles.addressCard}>
            Metro Walk Mall, Adventure Island, Parking Lane No-8…
            <button>Read More</button>
          </div>
        </section>
      )}

      {/* Date */}
      {/* <section className={styles.section}>
        <h2>Select date</h2>
        <div className={styles.dateRow}>
          {DATES.map((d) => (
            <button
            key={d.key}
            className={date === d.label ? styles.activeDate : ""}
            onClick={() => {
              setDate(d.label);
              setSlot(SLOTS[0]); // auto reselect first slot
            }}
          >
          
              <span>{d.label}</span>
              <small>{d.sub}</small>
            </button>
          ))}
          <a className={styles.link}>See all dates</a>
        </div>
      </section> */}

<section className={styles.section}>
  <h2>Select date</h2>
  <div className={styles.dateRow}>
    {dates.map((d) => (
      <button
        key={d.key}
        className={`${styles.dateBtn} ${
            date === d.label ? styles.activeDate : ""
          }`}
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
        <h2>Select time slot</h2>
        <div className={styles.slotGrid}>
          {SLOTS.map((s) => (
            <button
              key={s}
              className={slot === s ? styles.activeSlot : ""}
              onClick={() => setSlot(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <button  onClick={() =>
      navigate(`/test-drive/confirmation/${carId}`, {
        state: {
          date,
          slot,
          locationType,
        },
      })
    }
   disabled={!slot}>
          Schedule Test Drive
          <span>carsDedo Hub on {date}</span>
        </button>
      </footer>
    </div>
  );
}
