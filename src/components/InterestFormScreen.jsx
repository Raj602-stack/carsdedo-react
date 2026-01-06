import React, { useState } from 'react';
import '../styles/InterestForm.css';

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

const InterestFormScreen = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    preferredTime: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber') {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: numbers }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTimeSelect = (time) => {
    setFormData(prev => ({ ...prev, preferredTime: time }));
    if (errors.preferredTime) {
      setErrors(prev => ({ ...prev, preferredTime: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (formData.phoneNumber.length !== 10) {
      newErrors.phoneNumber = 'Must be 10 digits';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter valid email';
    }
    
    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Select preferred time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    }
  };

  const timeOptions = [
    { id: 'morning', label: 'Morning (9AM-12PM)' },
    { id: 'afternoon', label: 'Afternoon (12PM-4PM)' },
    { id: 'evening', label: 'Evening (4PM-8PM)' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Share Your Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {isSubmitted ? (
          <div className="success-state">
            <div className="checkmark">✓</div>
            <h3>Thank You!</h3>
            <p>We'll contact you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label><FaUser/>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="field-error">{errors.fullName}</span>}
            </div>

            <div className="form-field">
              <label><FaPhone/> Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter 10-digit number"
                className={errors.phoneNumber ? 'error' : ''}
                maxLength="10"
              />
              {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}
            </div>

            <div className="form-field">
              <label><FaEnvelope/> Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-field">
              <label>Preferred Contact Time</label>
              <div className="time-options">
                {timeOptions.map(option => (
                  <div
                    key={option.id}
                    className={`time-option ${formData.preferredTime === option.id ? 'selected' : ''}`}
                    onClick={() => handleTimeSelect(option.id)}
                  >
                    <div className="radio-dot"></div>
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
              {errors.preferredTime && <span className="field-error">{errors.preferredTime}</span>}
            </div>

            <div className="security-note">
              <span><FaShieldAlt /></span>
              <span>Your information is secure and encrypted</span>
            </div>

            <button type="submit" className="submit-btn">
              Confirm Interest
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default InterestFormScreen;