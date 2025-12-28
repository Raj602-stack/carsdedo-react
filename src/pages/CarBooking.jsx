import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styles from "../styles/CarBooking.module.css";
import { 
  FaCar, 
  FaHome, 
  FaStore,
  FaShieldAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaCheckCircle,
  FaTimes,
  FaCreditCard,
  FaMapMarkerAlt
} from "react-icons/fa";

const BOOKING_AMOUNT = 50000;

export default function CarBooking() {
  const { id } = useParams();
  const location = useLocation();
  const car = location.state?.car;

  const [loanRequired, setLoanRequired] = useState(false);
  const [testDrive, setTestDrive] = useState(null);
  const [showInterestDrawer, setShowInterestDrawer] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    email: "",
    preferredTime: "morning"
  });

  if (!car) {
    return (
      <div className={styles.loading}>
        Car data not found. Please go back and select a car again.
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitInterest = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setFormSubmitted(true);
    }, 1000);
  };

  const handleReset = () => {
    setShowInterestDrawer(false);
    setFormSubmitted(false);
    setUserDetails({
      name: "",
      phone: "",
      email: "",
      preferredTime: "morning"
    });
  };

  return (
    <div className={styles.page}>
      {/* Progress Bar - Kept from original design */}
      <div className={styles.progressBar}>
        <div className={styles.progressSteps}>
          <div className={`${styles.step} ${styles.active}`}>
            <div className={styles.stepNumber}>1</div>
            <span>Car Details</span>
          </div>
          <div className={styles.stepLine}></div>
          <div className={`${styles.step} ${showInterestDrawer ? styles.active : ""}`}>
            <div className={styles.stepNumber}>2</div>
            <span>Your Details</span>
          </div>
          <div className={styles.stepLine}></div>
          <div className={`${styles.step} ${formSubmitted ? styles.active : ""}`}>
            <div className={styles.stepNumber}>3</div>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      <h1 className={styles.title}>
        Reserve this car for ₹{BOOKING_AMOUNT.toLocaleString("en-IN")}
      </h1>
      <p className={styles.subtitle}>
        and find out if it's your perfect match
      </p>

      <div className={styles.layout}>
        {/* LEFT SECTION - Original design elements */}
        <div className={styles.left}>
          {/* Loan Option Card - Original design */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaCreditCard className={styles.cardIcon} />
              <h3>Financing Options</h3>
            </div>
            <div className={styles.loanOption}>
              <label className={styles.loanRow}>
                <input
                  type="checkbox"
                  checked={loanRequired}
                  onChange={(e) => setLoanRequired(e.target.checked)}
                  className={styles.customCheckbox}
                />
                <div className={styles.loanContent}>
                  <strong>Interested in car loan?</strong>
                  <p>Get attractive interest rates starting from 7.99%</p>
                </div>
              </label>
            </div>
          </div>

          {/* Test Drive Card - Original enhanced design */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaCar className={styles.cardIcon} />
              <h3>Test Drive Preferences</h3>
            </div>
            <p className={styles.cardDescription}>
              Where would you prefer to take the test drive?
            </p>

            <div className={styles.driveOptions}>
              <button
                className={`${styles.driveBtn} ${
                  testDrive === "home" ? styles.active : ""
                }`}
                onClick={() => setTestDrive("home")}
              >
                <FaHome className={styles.driveIcon} />
                <div className={styles.driveContent}>
                  <strong>At Your Location</strong>
                  <p>We come to you within 48 hours</p>
                </div>
              </button>

              <button
                className={`${styles.driveBtn} ${
                  testDrive === "hub" ? styles.active : ""
                }`}
                onClick={() => setTestDrive("hub")}
              >
                <FaStore className={styles.driveIcon} />
                <div className={styles.driveContent}>
                  <strong>At Carsdedo Hub</strong>
                  <p>Visit our nearest experience center</p>
                </div>
              </button>
            </div>

            {testDrive && (
              <div className={styles.locationInput}>
                <FaMapMarkerAlt className={styles.locationIcon} />
                <input 
                  type="text" 
                  placeholder="Enter your location" 
                  className={styles.locationField}
                />
              </div>
            )}
          </div>

          {/* Additional Info Card - Original design */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaShieldAlt className={styles.cardIcon} />
              <h3>Booking Information</h3>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Booking Amount</span>
                <span className={styles.infoValue}>₹{BOOKING_AMOUNT.toLocaleString("en-IN")}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Refund Policy</span>
                <span className={styles.infoValue}>100% Refundable</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Validity</span>
                <span className={styles.infoValue}>7 Days</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Priority Support</span>
                <span className={styles.infoValue}>24/7 Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - Original summary card */}
        <div className={styles.right}>
          <div className={styles.summaryCard}>
            <div className={styles.carImageContainer}>
              <img src={car.image} alt={car.title} className={styles.carImage} />
              <div className={styles.carBadge}>Reserved</div>
            </div>

            <div className={styles.carInfo}>
              <h3 className={styles.carTitle}>{car.title}</h3>
              <p className={styles.carMeta}>
                {car.km?.toLocaleString("en-IN")} km • {car.fuel} • {car.transmission}
              </p>
              
              <div className={styles.priceSection}>
                <div className={styles.price}>
                  ₹{Number(car.price).toLocaleString("en-IN")}
                </div>
                <div className={styles.priceNote}>Ex-showroom price</div>
              </div>
            </div>

            <div className={styles.summaryDetails}>
              <div className={styles.summaryItem}>
                <span>Booking Amount</span>
                <strong>₹{BOOKING_AMOUNT.toLocaleString("en-IN")}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Test Drive</span>
                <span className={testDrive ? styles.driveStatus : styles.notSelected}>
                  {testDrive ? "Selected" : "Not Selected"}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span>Car Loan</span>
                <span className={loanRequired ? styles.loanStatus : styles.notSelected}>
                  {loanRequired ? "Requested" : "Not Requested"}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span>Validity</span>
                <span>7 Days</span>
              </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.totalSection}>
              <div className={styles.totalItem}>
                <span>Total Amount</span>
                <strong>₹{BOOKING_AMOUNT.toLocaleString("en-IN")}</strong>
              </div>
              <div className={styles.refundNote}>
                <FaShieldAlt />
                100% refundable if you change your mind
              </div>
            </div>

            <button
              className={`${styles.interestBtn} ${!testDrive ? styles.disabled : ""}`}
              onClick={() => testDrive && setShowInterestDrawer(true)}
              disabled={!testDrive}
            >
              Show Interest
            </button>

            <p className={styles.assuranceNote}>
              Our executive will contact you within 24 hours
            </p>
          </div>

          {/* Support Card - Original design */}
          <div className={styles.supportCard}>
            <div className={styles.supportHeader}>
              <div className={styles.supportIcon}>?</div>
              <h4>Need Help?</h4>
            </div>
            <p>Our support team is here to help you 24/7</p>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span>Phone:</span>
                <strong>1800-123-4567</strong>
              </div>
              <div className={styles.contactItem}>
                <span>Email:</span>
                <strong>support@carsdedo.com</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interest Form Drawer - Compact version */}
      <div className={`${styles.drawer} ${showInterestDrawer ? styles.active : ""}`}>
        <div className={styles.drawerContent}>
          <div className={styles.drawerHeader}>
            <h3>Share Your Details</h3>
            <button 
              className={styles.closeBtn}
              onClick={handleReset}
            >
              <FaTimes />
            </button>
          </div>

          {!formSubmitted ? (
            <form onSubmit={handleSubmitInterest} className={styles.interestForm}>
              <div className={styles.formGroup}>
                <label>
                  <FaUser /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <FaPhone /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={userDetails.phone}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit mobile number"
                  required
                  pattern="[0-9]{10}"
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <FaEnvelope /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Preferred Contact Time</label>
                <div className={styles.timeOptions}>
                  {["Morning (9AM-12PM)", "Afternoon (12PM-4PM)", "Evening (4PM-8PM)"].map((time) => (
                    <label key={time} className={styles.timeOption}>
                      <input
                        type="radio"
                        name="preferredTime"
                        value={time}
                        checked={userDetails.preferredTime === time}
                        onChange={handleInputChange}
                      />
                      <span>{time}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.securityNote}>
                <FaShieldAlt />
                <span>Your information is secure and encrypted</span>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Confirm Interest
              </button>
            </form>
          ) : (
            <div className={styles.successMessage}>
              <FaCheckCircle className={styles.successIcon} />
              <h4>Interest Registered Successfully!</h4>
              <p>
                Thank you for showing interest in the <strong>{car.title}</strong>. 
                Our executive will reach out to you within 24 hours at your preferred time.
              </p>
              <div className={styles.referenceInfo}>
                <p>Your reference number:</p>
                <strong>REF-{Math.random().toString(36).substr(2, 8).toUpperCase()}</strong>
              </div>
              <button className={styles.doneBtn} onClick={handleReset}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Drawer Overlay */}
      {showInterestDrawer && (
        <div 
          className={styles.overlay}
          onClick={handleReset}
        />
      )}
    </div>
  );
}