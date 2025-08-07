import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import styles from './GitHubStars.module.css';

interface GitHubStarsProps {
  repo: string; // Format: "OpenHD/OpenHD"
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}

interface GitHubApiResponse {
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  html_url: string;
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
  const [stars, setStars] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        // Use CORS proxy for client-side requests to avoid CORS issues
        const response = await fetch(`https://api.github.com/repos/${repo}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch GitHub data');
        }

        const data: GitHubApiResponse = await response.json();
        setStars(data.stargazers_count);
        setIsLoading(false);
      } catch (err) {
        console.warn('Failed to fetch GitHub stars:', err);
        setError('Failed to load');
        setIsLoading(false);
      }
    };

    fetchGitHubStats();
  }, [repo]);

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
      
      {isLoading ? (
        <span className={styles.loadingSpinner} aria-label="Loading stars">
          <i className="fas fa-spinner fa-spin" />
        </span>
      ) : error ? (
        <span className={styles.errorText} aria-label="Could not load stars">
          <i className="fas fa-exclamation-triangle" />
        </span>
      ) : stars !== null ? (
        <span className={styles.starsCount} aria-label={`${stars} stars`}>
          <i className="fas fa-star" aria-hidden="true" />
          {formatNumber(stars)}
        </span>
      ) : null}
    </button>
  );
}