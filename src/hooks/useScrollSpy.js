import { useEffect, useRef, useState, useCallback } from 'react';
import { TOPBAR_HEIGHT } from '../constants/carDetails';

/**
 * Custom hook for scroll spy functionality
 * @param {Array} sections - Array of section objects with { id, ref }
 * @returns {Object} { activeTab, setActiveTab, scrollToRef }
 */
export const useScrollSpy = (sections) => {
  const [activeTab, setActiveTab] = useState("overview");
  const observerRef = useRef(null);
  const ignoreSpyRef = useRef(false);

  // Scroll to a section ref
  const scrollToRef = useCallback((ref) => {
    if (!ref?.current) {
      return;
    }
    
    ignoreSpyRef.current = true;
    
    const element = ref.current;
    const offset = TOPBAR_HEIGHT + 8;
    
    // Get the section ID from data-section attribute
    const sectionId = element.dataset?.section || element.getAttribute('data-section');
    
    // Immediately update active tab for better UX
    if (sectionId) {
      setActiveTab(sectionId);
    }
    
    // Use scrollIntoView with CSS scroll-margin-top for offset
    // This is the most reliable cross-browser method
    element.scrollIntoView({ 
      behavior: "smooth", 
      block: "start",
      inline: "nearest"
    });
    
    // Also manually scroll to ensure offset is correct (fallback for browsers that don't respect scroll-margin-top)
    setTimeout(() => {
      const elementRect = element.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const absoluteElementTop = elementRect.top + scrollY;
      const targetScroll = absoluteElementTop - offset;
      
      // Only adjust if scroll-margin-top didn't work (check if we're close to target)
      const currentScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      if (Math.abs(currentScroll - targetScroll) > 10) {
        window.scrollTo({ 
          top: Math.max(0, targetScroll), 
          behavior: "smooth" 
        });
      }
    }, 100);
    
    // Reset flag after scroll completes
    setTimeout(() => {
      ignoreSpyRef.current = false;
    }, 1000);
  }, [setActiveTab]);

  // IntersectionObserver for scroll spy with fallback
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    
    // Wait for all refs to be available
    const allRefsReady = sections.every(s => s.ref.current);
    if (!allRefsReady) {
      // Retry after a short delay if refs aren't ready
      const timeoutId = setTimeout(() => {
        const retryReady = sections.every(s => s.ref.current);
        if (retryReady) {
          // Force re-render to retry
          setActiveTab(prev => prev);
        }
      }, 200);
      return () => clearTimeout(timeoutId);
    }
    
    const rootMargin = `-${TOPBAR_HEIGHT + 8}px 0px -50% 0px`;
    const io = new IntersectionObserver(
      (entries) => {
        if (ignoreSpyRef.current) return;
        
        // Get all intersecting entries
        const intersecting = entries.filter((e) => e.isIntersecting);
        
        if (intersecting.length > 0) {
          // Find the section with the highest intersection ratio
          let maxRatio = -1;
          let maxEntry = null;
          
          intersecting.forEach(entry => {
            if (entry.intersectionRatio > maxRatio) {
              maxRatio = entry.intersectionRatio;
              maxEntry = entry;
            }
          });
          
          if (maxEntry) {
            const id = maxEntry.target.dataset.section;
            if (id) {
              setActiveTab(prev => {
                return prev === id ? prev : id;
              });
            }
          }
        }
      },
      { 
        threshold: [0.0, 0.1, 0.25, 0.5, 0.75, 1.0], 
        rootMargin 
      }
    );
  
    // Observe all sections
    sections.forEach((s) => {
      if (s.ref.current) {
        // Ensure each element has the data-section attribute
        if (!s.ref.current.dataset.section) {
          s.ref.current.dataset.section = s.id;
        }
        io.observe(s.ref.current);
      }
    });
  
    observerRef.current = io;
    
    // Fallback: Use scroll event with requestAnimationFrame for better detection
    let rafId = null;
    const handleScroll = () => {
      if (ignoreSpyRef.current) return;
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        const threshold = TOPBAR_HEIGHT + 8;
        
        // If at the very top, set overview
        if (scrollY < 200) {
          setActiveTab(prev => prev === "overview" ? prev : "overview");
          rafId = null;
          return;
        }
        
        // Find which section is currently in the viewport
        let activeSection = null;
        let minDistance = Infinity;
        
        sections.forEach((s) => {
          if (!s.ref.current) return;
          const rect = s.ref.current.getBoundingClientRect();
          const elementTop = rect.top + scrollY;
          const elementBottom = elementTop + rect.height;
          
          // Check if section is in viewport near the threshold
          const viewportTop = scrollY + threshold;
          const viewportBottom = scrollY + window.innerHeight;
          
          // Section is active if it's near or past the threshold
          if (elementTop <= viewportTop + 100 && elementBottom > viewportTop - 100) {
            const distance = Math.abs(elementTop - viewportTop);
            if (distance < minDistance) {
              minDistance = distance;
              activeSection = s.id;
            }
          }
        });
        
        if (activeSection) {
          setActiveTab(prev => prev === activeSection ? prev : activeSection);
        }
        
        rafId = null;
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [sections]);

  return { activeTab, setActiveTab, scrollToRef };
};
