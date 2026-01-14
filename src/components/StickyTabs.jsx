import React from 'react';
import styles from '../styles/CarDetailsWeb.module.css';
import { SECTIONS, TOPBAR_HEIGHT } from '../constants/carDetails';

/**
 * StickyTabs component - Sticky navigation tabs that appear after hero scrolls out
 * Redesigned with smoother transitions and no flickering
 */
const StickyTabs = React.memo(({ 
  showStickyTabs, 
  activeTab, 
  onTabClick, 
  stickyStyle 
}) => {
  return (
    <div
      className={`${styles.cdStickyTabs} ${showStickyTabs ? styles.visible : ""}`}
      style={{
        top: `${TOPBAR_HEIGHT}px`,
        left: `${stickyStyle.left}px`,
        width: `${stickyStyle.width}px`,
        backgroundColor: '#ffffff',
      }}
    >
      <div className={styles.cdStickyInner}>
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`${styles.cdTab} ${activeTab === section.id ? styles.cdTabActive : ""}`}
            onClick={() => onTabClick(section.id)}
            aria-label={`Navigate to ${section.label}`}
            aria-current={activeTab === section.id ? 'page' : undefined}
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  );
});

StickyTabs.displayName = 'StickyTabs';

export default StickyTabs;
