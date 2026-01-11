import { useParams, useNavigate } from "react-router-dom";
// import cars from "../data/cars";
import { useCars } from "../context/CarsContext";

import { useMemo, useState } from "react";
import styles from "../styles/CheckoutPage.module.css";
import InterestFormScreen from "../components/InterestFormScreen";

export default function CheckoutPage() {
    const { cars, loading } = useCars();

    const [showForm, setShowForm] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loanInterest, setLoanInterest] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("9664573074");

//   const car = useMemo(
//     () => cars.find(c => c.id === Number(id)),
//     [id]
//   );

const car = useMemo(() => {
    return cars.find((c) => String(c.id) === String(id)) || null;
  }, [cars, id]);
  console.log(car);

  const images = useMemo(() => {
    if (!car?.images) return [];

    const exterior = car.images.exterior || [];
    const interior = car.images.interior || [];

    return [...exterior, ...interior]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((img) => `http://localhost:8000${img.image}`);
  }, [car]);


  if (!car) {
    return <div className={styles.loading}>Car not found</div>;
  }

  const handlePayment = () => {
    if (!agreeTerms) {
      alert("Please agree to Terms & Conditions");
      return;
    }
    // Handle payment logic
    alert(`Payment initiated for ${car.title}`);
  };

  return (
    <div className={styles.page}>

      {/* Header */}
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.back}>
          <span className={styles.backIcon}>←</span>
          <span className={styles.backText}>Back</span>
        </button>
        <h1 className={styles.title}>Checkout</h1>
        <button className={styles.supportBtn}>
          <span className={styles.callIcon}>📞</span>
          <span className={styles.callText}>Support</span>
        </button>
      </header>

      {/* Refund Banner */}
      <div className={styles.refundBanner}>
        <div className={styles.refundIcon}>💸</div>
        <div className={styles.refundText}>
          Booking amount is <span className={styles.highlight}>100% refundable</span>
        </div>
      </div>

      {/* Car Summary */}
      <div className={styles.carCard}>
        <div className={styles.carImageWrapper}>
          {/* <img src={car.images[0]} alt={car.title} className={styles.carImage} /> */}

          <img
  src={images[0]}
  alt={car.title}
  className={styles.carImage}
  onError={(e) => {
    e.target.src = "/placeholder-car.png";
  }}
/>

        </div>
        <div className={styles.carInfo}>
          <h2 className={styles.carTitle}>{car.title}</h2>
          <p className={styles.carDetails}>{car.km} Km • {car.fuel} • {car.transmission}</p>
          <div className={styles.priceSection}>
            <div className={styles.priceTag}>
              <span className={styles.pinIcon}>📌</span>
              <span className={styles.price}>₹{car.price} Lakh</span>
            </div>
            <span className={styles.emi}>EMI ₹{car.emi}/mo</span>
          </div>
        </div>
      </div>

      {/* Booking Amount Card */}
      <div className={styles.amountCard}>
        <div className={styles.amountHeader}>
          <h3 className={styles.cardTitle}>Booking Amount</h3>
          <div className={styles.amountValue}>₹10,000</div>
        </div>
        <p className={styles.amountNote}>
          Reservation will end in <span className={styles.highlight}>3 days</span>. 
          <button className={styles.learnMoreBtn}>Learn more</button> 😊
        </p>
      </div>

      {/* Divider */}
      <div className={styles.divider}></div>

      {/* Test Drive Section */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Test drive details</h3>
        <div className={styles.testDriveCard}>
          <div className={styles.testDriveStatus}>
            <span className={styles.statusIcon}>🍟</span>
            <span className={styles.statusText}>Test drive not scheduled</span>
          </div>
          <p className={styles.testDriveNote}>
            Changed your mind? 
            <button className={styles.findSlotBtn}>Find a slot ►</button>
          </p>
        </div>
      </section>

      {/* Loan Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Interested in car loan?</h3>
          <button className={styles.infoBtn}>ℹ️</button>
        </div>
        <p className={styles.sectionSubtitle}>
          Get your car financed at attractive interest rates. 
          <button className={styles.learnMoreBtn}>Learn more</button>
        </p>
        
        <div className={styles.loanOptions}>
          <button
            className={`${styles.loanOption} ${!loanInterest ? styles.loanActive : ''}`}
            onClick={() => setLoanInterest(false)}
          >
            <span className={styles.optionIcon}>{!loanInterest && '✓'}</span>
            Not Interested
          </button>
          
          <button
            className={`${styles.loanOption} ${loanInterest ? styles.loanActive : ''}`}
            onClick={() => setLoanInterest(true)}
          >
            <span className={styles.optionIcon}>{loanInterest && '✓'}</span>
            Yes, I'm interested
          </button>
        </div>
      </section>

      <div className={styles.testDriveSection}>
  <h3 className={styles.sectionTitle}>Test Drive Preferences</h3>
  <p className={styles.sectionDescription}>
    Where would you prefer to take the test drive?
  </p>
  
  <div className={styles.optionsContainer}>
    <label className={styles.optionCard}>
      <input
        type="radio"
        name="testDriveLocation"
        value="your-location"
        className={styles.radioInput}
      />
      <div className={styles.optionContent}>
        <div className={styles.optionHeader}>
          <div className={styles.radioCustom}></div>
          <div className={styles.optionTitle}>At Your Location</div>
        </div>
        <p className={styles.optionDescription}>
          We come to you within 48 hours
        </p>
      </div>
    </label>
    
    <label className={styles.optionCard}>
      <input
        type="radio"
        name="testDriveLocation"
        value="hub"
        className={styles.radioInput}
      />
      <div className={styles.optionContent}>
        <div className={styles.optionHeader}>
          <div className={styles.radioCustom}></div>
          <div className={styles.optionTitle}>At Carsdedo Hub</div>
        </div>
        <p className={styles.optionDescription}>
          Visit our nearest experience center
        </p>
      </div>
    </label>
  </div>
</div>

      {/* Extended Warranty */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Extended Warranty</h3>
          <button className={styles.infoBtn}>ℹ️</button>
        </div>
        <p className={styles.sectionSubtitle}>
          Get up to 3 years of extra protection and total peace of mind.
        </p>
        <button className={styles.viewDetailsBtn}>View details ►</button>
      </section>

      {/* Booking Contact */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Booking Contact</h3>
        <div className={styles.contactCard}>
          <p className={styles.contactText}>
            This car will be booked on <span className={styles.phoneNumber}>{phoneNumber}</span>
          </p>
          <button 
            className={styles.editPhoneBtn}
            onClick={() => {
              const newPhone = prompt("Enter new phone number:", phoneNumber);
              if (newPhone) setPhoneNumber(newPhone);
            }}
          >
            Edit
          </button>
        </div>
      </section>



      {/* Support Info */}
      <div className={styles.supportCard}>
        <p className={styles.supportText}>
          Need help? Call us at <a href="tel:18001234567" className={styles.supportLink}>1800-123-4567</a>
        </p>
        <p className={styles.supportNote}>Our team is available 24/7 to assist you</p>
      </div>

      {/* Sticky Footer */}
      <footer className={styles.footer}>
      
        <button 
          className={`${styles.payBtn}`}
         
          onClick={() => setShowForm(true)}
         
        >
         
          <span className={styles.payText}>show Interest</span>
        </button>
      </footer>

      {showForm && <InterestFormScreen onClose={() => setShowForm(false)} />}
    </div>
  );
}