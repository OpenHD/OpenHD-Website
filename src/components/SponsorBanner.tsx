import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import styles from './SponsorBanner.module.css';

interface SponsorBannerProps {
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  style?: 'corner' | 'banner' | 'floating';
  compact?: boolean;
  global?: boolean;
}

const SponsorBanner: React.FC<SponsorBannerProps> = ({ 
  position = 'top-right', 
  style = 'corner',
  compact = false,
  global = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (style === 'corner' && global) {
    return (
      <Link 
        to="/help-us"
        className={`${styles.globalSponsorCorner} ${styles[position.replace('-', '')]}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Love OpenHD? Support us!"
      >
        <div className={`${styles.globalCornerContent} ${isHovered ? styles.expanded : ''}`}>
          <i className="fas fa-heart" />
        </div>
        <span className={`${styles.sponsorText} ${isHovered ? styles.visible : ''}`}>
          Love OpenHD?
        </span>
      </Link>
    );
  }

  if (style === 'corner') {
    return (
      <Link 
        to="/help-us"
        className={`${styles.sponsorCorner} ${styles[position.replace('-', '')]} ${compact ? styles.compact : ''}`}
        aria-label="Support OpenHD"
      >
        <div className={styles.cornerContent}>
          <i className="fas fa-heart" />
          <span>Support</span>
        </div>
      </Link>
    );
  }

  if (style === 'floating') {
    return (
      <Link 
        to="/help-us"
        className={`${styles.sponsorFloating} ${styles[position.replace('-', '')]}`}
        aria-label="Support OpenHD"
      >
        <div className={styles.floatingIcon}>
          <i className="fas fa-heart" />
        </div>
        <div className={styles.floatingText}>
          Support OpenHD
        </div>
      </Link>
    );
  }

  // Banner style
  return (
    <div className={`${styles.sponsorBanner} ${compact ? styles.compact : ''}`}>
      <div className={styles.bannerContent}>
        <div className={styles.bannerIcon}>
          <i className="fas fa-heart" />
        </div>
        <div className={styles.bannerText}>
          <span className={styles.bannerTitle}>Love OpenHD?</span>
          <span className={styles.bannerSubtitle}>Support our development</span>
        </div>
        <Link 
          to="/help-us"
          className={styles.bannerButton}
          aria-label="Support OpenHD"
        >
          <i className="fas fa-heart" />
          Support
        </Link>
      </div>
    </div>
  );
};

export default SponsorBanner;
