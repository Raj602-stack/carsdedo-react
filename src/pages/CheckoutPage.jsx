import { useParams, useNavigate } from "react-router-dom";
import  cars  from "../data/cars";
import { useMemo, useState } from "react";
import styles from "../styles/CheckoutPage.module.css";

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loanInterest, setLoanInterest] = useState(false);

  const car = useMemo(
    () => cars.find(c => c.id === Number(id)),
    [id]
  );

  if (!car) {
    return <div className={styles.loading}>Car not found</div>;
  }

  return (
    <div className={styles.page}>

      {/* Header */}
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.back}>←</button>
        <h3>Checkout</h3>
        <span className={styles.call}>📞</span>
      </header>

      {/* Refund Info */}
      <div className={styles.refund}>
        Booking amount is <strong>100% refundable</strong>
      </div>

      {/* Car Summary */}
      <div className={styles.carCard}>
        <img src={car.image} alt={car.title} />
        <div>
          <h4>{car.title}</h4>
          <p>{car.km} Km • {car.fuel} • {car.transmission}</p>

          <div className={styles.priceRow}>
            <strong>₹ {car.price} Lakh</strong>
            <span>EMI ₹{car.emi}/mo</span>
          </div>
        </div>
      </div>

      {/* Booking Amount */}
      <div className={styles.card}>
        <span>Booking Amount</span>
        <strong>₹10,000</strong>
      </div>

      <p className={styles.note}>
        Reservation will end in 3 days.
      </p>

      {/* Test Drive */}
      <section className={styles.section}>
        <h4>Test drive details</h4>
        <p className={styles.muted}>Test drive not scheduled</p>
        <button className={styles.link}>Find a slot →</button>
      </section>

      {/* Loan */}
      <section className={styles.section}>
        <h4>Interested in car loan?</h4>
        <p className={styles.muted}>
          Get your car financed at attractive interest rates.
        </p>

        <div className={styles.btnRow}>
          <button
            className={!loanInterest ? styles.active : ""}
            onClick={() => setLoanInterest(false)}
          >
            Not Interested
          </button>

          <button
            className={loanInterest ? styles.active : ""}
            onClick={() => setLoanInterest(true)}
          >
            Yes, I’m interested
          </button>
        </div>
      </section>

      {/* Sticky Footer */}
      <footer className={styles.footer}>
        <button className={styles.payBtn}>
          Pay ₹10,000
        </button>
      </footer>
    </div>
  );
}
