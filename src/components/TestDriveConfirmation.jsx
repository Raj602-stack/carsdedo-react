import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/TestDriveConfirmation.module.css";
import cars from "../data/cars";
import {
    FaTimes,
    FaRegClock
  } from "react-icons/fa";
  


export default function TestDriveConfirmation() {
  const { carId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const car = cars.find(c => c.id === Number(carId));

  if (!car || !state) {
    return <p style={{ padding: 20 }}>Invalid test drive</p>;
  }

  const { date, slot, locationType } = state;

  return (
    <div className={styles.page}>
      {/* <h1>Time and location</h1> */}

      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>←</button>
        <h1>Confirmed</h1>
      </header>

      <div className={styles.card}>
        <h3>{date} · {slot}</h3>

        <p>
          Grand Trunk Rd, Near Multani Chaap Murthal, Murthal,
          Sonipat, Haryana 131039
        </p>

        <button className={styles.link}>
          📍 Get Directions
        </button>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.cancel}
          onClick={() => navigate(-1)}
        >
          <FaTimes/> Cancel
        </button>

        <button
          className={styles.reschedule}
          onClick={() => navigate(`/test-drive/${carId}`)}
        >
          <FaRegClock/>&nbsp;Reschedule
        </button>
      </div>

      <p className={styles.note}>
        If you're unavailable for the test drive, please cancel/reschedule it.
      </p>

      <h2>Car scheduled for test drive</h2>

      {/* <div className={styles.carCard}>
        <img src={car.image} alt={car.title} />
        <div>
          <h3>{car.title}</h3>
          <p>{car.km} Kms · {car.fuel} · {car.transmission}</p>
          <strong>₹ {car.price}</strong>
          <span>From ₹{car.emi}/mo</span>
        </div>
      </div> */}

<section className={styles.carCard}>
        <img src={car.image} alt="car" />
        <div>
          <h3>2015 Hyundai Grand i10 Sportz 1.2</h3>
          <p>36K Km · Petrol · Manual</p>
          <strong>₹ 3.53 Lakh</strong>
          <span>EMI ₹7,576 /mo</span>
        </div>
      </section>
    </div>
  );
}
