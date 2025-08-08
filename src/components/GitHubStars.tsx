import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import styles from './GitHubStars.module.css';
import { useGitHubStars } from '@site/src/contexts/AppContext';

interface GitHubStarsProps {
  repo: string; // Format: "OpenHD/OpenHD"
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace('.0', '') + 'k';
  }
  return num.toString();
};

export default function GitHubStars({ 
  repo, 
  className = '', 
  showIcon = true, 
  showText = true 
}: GitHubStarsProps): ReactNode {
  const { data, fetchStars } = useGitHubStars();
  const { stars, isLoading } = data;

  useEffect(() => {
    fetchStars(repo);
  }, [repo, fetchStars]);

  const handleClick = () => {
    window.open(`https://github.com/${repo}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <button 
      className={`${styles.githubStars} ${className}`}
      onClick={handleClick}
      aria-label={`Visit ${repo} on GitHub${stars ? ` (${stars} stars)` : ''}`}
      title={`Visit ${repo} on GitHub${stars ? ` - ${stars} stars` : ''}`}
    >
      {showIcon && (
        <i className={`fab fa-github ${styles.githubIcon}`} aria-hidden="true" />
      )}
      
      {showText && (
        <span className={styles.githubText}>GitHub</span>
      )}
      
      {/* Only show star count if we have stars, but always show the button */}
      {isLoading ? (
        <span className={styles.loadingSpinner} aria-label="Loading stars">
          <i className="fas fa-spinner fa-spin" />
        </span>
      ) : stars !== null && stars > 0 ? (
        <span className={styles.starsCount} aria-label={`${stars} stars`}>
          <i className="fas fa-star" aria-hidden="true" />
          {formatNumber(stars)}
        </span>
      ) : null}
      {/* Button always shows, stars only if available */}
    </button>
  );
}