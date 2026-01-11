import React from 'react';
import styles from '../styles/Loader.module.css';

const Loader = ({ message = "Loading...", fullScreen = false, size = "medium" }) => {
  return (
    <div className={`${styles.loaderContainer} ${fullScreen ? styles.fullScreen : ''}`}>
      <div className={styles.loaderWrapper}>
        <div className={`${styles.carLoader} ${styles[size]}`}>
          {/* Road */}
          <div className={styles.road}>
            <div className={styles.roadLine}></div>
            <div className={styles.roadLine}></div>
            <div className={styles.roadLine}></div>
          </div>
          
          {/* Moving Car */}
          <div className={styles.carContainer}>
            <svg 
              className={styles.carSvg} 
              viewBox="0 0 200 100" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Car Body */}
              <path 
                d="M30 50 L50 35 L120 35 L140 50 L160 50 L170 60 L170 70 L160 70 L155 75 L145 75 L140 70 L60 70 L55 75 L45 75 L40 70 L30 70 L20 60 Z" 
                fill="#0c213a" 
                stroke="#1a3452" 
                strokeWidth="2"
              />
              {/* Car Window */}
              <path 
                d="M55 50 L55 40 L115 40 L115 50 Z" 
                fill="#1a3452" 
                opacity="0.6"
              />
              {/* Car Window Divider */}
              <line 
                x1="85" 
                y1="40" 
                x2="85" 
                y2="50" 
                stroke="#0c213a" 
                strokeWidth="1.5"
              />
              {/* Front Wheel */}
              <circle 
                cx="50" 
                cy="70" 
                r="8" 
                fill="#2d2d2d" 
                stroke="#1a3452" 
                strokeWidth="2"
              />
              <circle 
                cx="50" 
                cy="70" 
                r="4" 
                fill="#0c213a"
              />
              {/* Back Wheel */}
              <circle 
                cx="150" 
                cy="70" 
                r="8" 
                fill="#2d2d2d" 
                stroke="#1a3452" 
                strokeWidth="2"
              />
              <circle 
                cx="150" 
                cy="70" 
                r="4" 
                fill="#0c213a"
              />
              {/* Headlights */}
              <circle 
                cx="20" 
                cy="55" 
                r="3" 
                fill="#ffffff" 
                opacity="0.9"
              />
            </svg>
            
            {/* Dust particles */}
            <div className={styles.dust}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        {message && (
          <div className={styles.loaderText}>{message}</div>
        )}
      </div>
    </div>
  );
};

export default Loader;
