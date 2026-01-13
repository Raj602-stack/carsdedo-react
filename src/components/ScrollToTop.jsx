import React from "react";
import { FiChevronUp } from "react-icons/fi";
import styles from "../styles/ScrollToTop.module.css";

export default function ScrollToTop({ scrollThreshold = 100, targetElement = null } = {}) {

  const scrollToTop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    console.log('ScrollToTop clicked');
    
    if (targetElement) {
      // Smooth scroll for container
      const startPosition = targetElement.scrollTop;
      console.log('Container scroll - start:', startPosition);
      if (startPosition === 0) return;
      
      const duration = 600;
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = Math.round(startPosition * (1 - ease));
        
        targetElement.scrollTop = current;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          targetElement.scrollTop = 0;
          console.log('Container scroll complete');
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      // Smooth scroll for window - check all possible scroll positions
      const windowScroll = window.pageYOffset || window.scrollY || 0;
      const docElementScroll = document.documentElement.scrollTop || 0;
      const bodyScroll = document.body.scrollTop || 0;
      
      // Also check for scrollable containers
      const root = document.getElementById('root');
      const rootScroll = root ? root.scrollTop || 0 : 0;
      const main = document.querySelector('main');
      const mainScroll = main ? main.scrollTop || 0 : 0;
      
      const startPosition = Math.max(windowScroll, docElementScroll, bodyScroll, rootScroll, mainScroll);
      
      console.log('Scroll positions:', {
        windowScroll,
        docElementScroll,
        bodyScroll,
        rootScroll,
        mainScroll,
        startPosition
      });
      
      if (startPosition === 0) {
        console.log('Already at top');
        return;
      }
      
      const duration = 600;
      const startTime = performance.now();
      
      // Store references for the animation
      const scrollContainers = [];
      if (windowScroll > 0) scrollContainers.push({ type: 'window', scroll: windowScroll });
      if (docElementScroll > 0) scrollContainers.push({ type: 'documentElement', scroll: docElementScroll });
      if (bodyScroll > 0) scrollContainers.push({ type: 'body', scroll: bodyScroll });
      if (root && rootScroll > 0) scrollContainers.push({ type: 'root', element: root, scroll: rootScroll });
      if (main && mainScroll > 0) scrollContainers.push({ type: 'main', element: main, scroll: mainScroll });
      
      console.log('Scroll containers found:', scrollContainers);
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = Math.round(startPosition * (1 - ease));
        
        // Scroll all detected scrollable containers
        scrollContainers.forEach(container => {
          if (container.type === 'window') {
            window.scrollTo(0, current);
          } else if (container.type === 'documentElement') {
            document.documentElement.scrollTop = current;
          } else if (container.type === 'body') {
            document.body.scrollTop = current;
          } else if (container.element) {
            container.element.scrollTop = current;
          }
        });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Ensure all are at 0
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          if (root) root.scrollTop = 0;
          if (main) main.scrollTop = 0;
          console.log('Window scroll complete');
        }
      };
      
      console.log('Starting animation');
      requestAnimationFrame(animate);
    }
  };

  return (
    <button
      className={styles.scrollToTop}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      type="button"
    >
      <FiChevronUp className={styles.scrollToTopIcon} />
    </button>
  );
}
