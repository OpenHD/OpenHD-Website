import React, { useState, useEffect } from 'react';
import styles from './FundingWidget.module.css';

interface FundingStats {
  monthlyBudget: number;
  currency: string;
}

interface FundingWidgetProps {
  variant?: 'footer' | 'inline';
  showDescription?: boolean;
  showDonateButton?: boolean;
}

// Global cache to prevent multiple API calls
let globalFundingCache: {
  data: FundingStats | null;
  lastFetch: number;
  promise: Promise<FundingStats> | null;
} = {
  data: null,
  lastFetch: 0,
  promise: null
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchFundingData(): Promise<FundingStats> {
  const now = Date.now();
  
  // Return cached data if it's still fresh
  if (globalFundingCache.data && (now - globalFundingCache.lastFetch) < CACHE_DURATION) {
    return globalFundingCache.data;
  }
  
  // If there's already a request in progress, wait for it
  if (globalFundingCache.promise) {
    return globalFundingCache.promise;
  }
  
  // Create a new request promise
  globalFundingCache.promise = (async () => {
    try {
      const query = `
        query {
          collective(slug: "openhd") {
            currency
            members(role: BACKER, limit: 50, orderBy: { field: CREATED_AT, direction: DESC }) {
              nodes {
                isActive
                totalDonations {
                  valueInCents
                }
                tier {
                  frequency
                }
              }
            }
          }
        }
      `;

      const response = await fetch('https://api.opencollective.com/graphql/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          if (globalFundingCache.data) {
            return globalFundingCache.data;
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.data?.collective) {
        const collective = data.data.collective;
        
        // Calculate monthly budget from active monthly supporters
        const monthlyDonors = collective.members.nodes
          .filter((member: any) => member.tier?.frequency === 'MONTHLY' && member.isActive);
        
        const monthlyTotal = monthlyDonors.reduce((sum: number, contributor: any) => 
          sum + (contributor.totalDonations.valueInCents / 100), 0);
        
        const estimatedMonthlyBudget = monthlyTotal > 0 ? Math.round(monthlyTotal / 12) : 0;

        const result = {
          monthlyBudget: estimatedMonthlyBudget,
          currency: collective.currency
        };
        
        // Update cache
        globalFundingCache.data = result;
        globalFundingCache.lastFetch = now;
        globalFundingCache.promise = null;
        
        return result;
      }
      
      throw new Error('No collective data received');
    } catch (error) {
      globalFundingCache.promise = null;
      
      // Return cached data if available, even if stale
      if (globalFundingCache.data) {
        return globalFundingCache.data;
      }
      
      // Fallback data
      return {
        monthlyBudget: 0,
        currency: 'USD'
      };
    }
  })();
  
  return globalFundingCache.promise;
}

export default function FundingWidget({ variant = 'inline', showDescription = true, showDonateButton = false }: FundingWidgetProps) {
  const [stats, setStats] = useState<FundingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFundingData()
      .then(setStats)
      .catch(error => {
        setStats({
          monthlyBudget: 0,
          currency: 'USD'
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className={`${styles.fundingWidget} ${styles[variant]}`}>
        <div className={styles.loading}>Loading funding status...</div>
      </div>
    );
  }

  const progressPercentage = Math.min(((stats.monthlyBudget || 0) / 240) * 100, 100);
  
  // Determine funding status and message
  const getFundingStatus = (amount: number) => {
    if (amount < 80) return { level: 'critical', message: 'At Risk - Minimal support', color: '#ff6b6b' };
    if (amount < 140) return { level: 'basic', message: 'Surviving - Essential costs covered', color: '#ffd700' };
    if (amount < 200) return { level: 'stable', message: 'Growing - Active development', color: '#51cf66' };
    return { level: 'thriving', message: 'Thriving - Full potential', color: '#00a6f2' };
  };

  const status = getFundingStatus(stats.monthlyBudget || 0);

  return (
    <div className={`${styles.fundingWidget} ${styles[variant]}`}>
      {showDescription && (
        <div className={styles.widgetHeader}>
          <span className={styles.widgetTitle}>Monthly Funding</span>
          <div className={styles.statusContainer}>
            <span className={styles.widgetAmount}>${stats.monthlyBudget}</span>
            <span className={`${styles.statusBadge} ${styles[`status${status.level.charAt(0).toUpperCase() + status.level.slice(1)}`]}`}>
              {status.level.toUpperCase()}
            </span>
          </div>
        </div>
      )}
      
      <div className={styles.progressContainer}>
        <div className={styles.progressTrack}>
          <div 
            className={styles.progressIndicator}
            style={{ 
              width: `${progressPercentage}%`,
              '--progress-ratio': `${Math.max(0.01, (stats.monthlyBudget || 0) / 240)}`,
              '--status-color': status.color
            } as React.CSSProperties}
          ></div>
          
          {/* Goal markers with meaningful labels */}
          <div className={styles.goalMarkers}>
            <div className={styles.goalMarker} style={{ left: '33%' }} title="At risk threshold: $80/month">
              <div className={styles.markerLine}></div>
              {variant === 'inline' && (
                <div className={styles.markerLabel}>
                  <span className={styles.labelText}>At Risk</span>
                  <span className={styles.labelAmount}>$80</span>
                </div>
              )}
            </div>
            <div className={styles.goalMarker} style={{ left: '58%' }} title="Surviving: $140/month">
              <div className={styles.markerLine}></div>
              {variant === 'inline' && (
                <div className={styles.markerLabel}>
                  <span className={styles.labelText}>Surviving</span>
                  <span className={styles.labelAmount}>$140</span>
                </div>
              )}
            </div>
            <div className={styles.goalMarker} style={{ left: '83%' }} title="Growing: $200/month">
              <div className={styles.markerLine}></div>
              {variant === 'inline' && (
                <div className={styles.markerLabel}>
                  <span className={styles.labelText}>Growing</span>
                  <span className={styles.labelAmount}>$200</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Current amount and status */}
          <div 
            className={styles.currentAmount}
            style={{ 
              left: `${Math.min(progressPercentage, 95)}%`
            }}
          >
            ${stats.monthlyBudget}
          </div>
        </div>
        
        {/* Status message */}
        {showDescription && (
          <div className={styles.statusMessage} style={{ color: status.color }}>
            {status.message}
          </div>
        )}
      </div>

      {showDonateButton && (
        <div className={styles.actionContainer}>
          <a 
            href="https://opencollective.com/openhd" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.donateButton}
          >
            <i className="fas fa-heart"></i>
            <span>Support OpenHD</span>
          </a>
        </div>
      )}
    </div>
  );
}
