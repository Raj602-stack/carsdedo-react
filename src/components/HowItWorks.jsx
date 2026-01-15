import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/howitworks.css";

export default function HowItWorks() {
  const navigate = useNavigate();
  return (
    <section className="howitworks">
      <h2>How CarsDedo Works</h2>
      <p className="subtitle">
        You won’t just love our cars, you’ll love the way you buy or sell them.
      </p>

      <div className="steps">
        {/* Step 1 */}
        <div className="step">
          <img src={process.env.PUBLIC_URL + "/firstspin.png"} alt="Choose best car" className="step-img" />
          <h3>Choose from the best pre-owned cars</h3>
          <p>20,000+ fully inspected cars online</p>
        </div>

        {/* Step 2 */}
        <div className="step">
          <img src={process.env.PUBLIC_URL + "/secondspin.png"} alt="Test Drive" className="step-img" />
          <h3>Take a test drive at your home or CarsDedo Hub</h3>
          <p>Sanitized cars for every test drive</p>
        </div>

        {/* Step 3 - Custom Image */}
        <div className="step">
          {/* 👇 Replace with your own image path */}
          <img src={process.env.PUBLIC_URL + "/thirdspinnn.png"}  alt="Your custom image" className="step-img " />
          <h3>Online Payment. Doorstep Delivery.</h3>
          <p>Experience instant online payment & 5-day money-back guarantee</p>
        </div>
      </div>

      <div className="actions">
        <button className="primary-btn" onClick={() => window.open('https://www.youtube.com', '_blank')}>Watch how it works ▶</button>
        <a href="#" className="learn-more" onClick={(e) => { e.preventDefault(); navigate("/buy"); }}>Learn more</a>
      </div>
    </section>
  );
}
