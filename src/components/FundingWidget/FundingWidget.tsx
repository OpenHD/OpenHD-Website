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

  return (
    <div className={`${styles.fundingWidget} ${styles[variant]}`}>
      {showDescription && (
        <div className={styles.widgetHeader}>
          <span className={styles.widgetTitle}>Monthly Funding</span>
          <span className={styles.widgetAmount}>${stats.monthlyBudget}</span>
        </div>
      )}
      
      <div className={styles.progressContainer}>
        <div className={styles.progressTrack}>
          <div 
            className={styles.progressIndicator}
            style={{ 
              width: `${progressPercentage}%`,
              '--progress-ratio': `${Math.max(0.01, (stats.monthlyBudget || 0) / 240)}`
            } as React.CSSProperties}
          ></div>
          
          {/* Goal markers */}
          <div className={styles.goalMarkers}>
            <div className={styles.goalMarker} style={{ left: '50%' }} title="Basic: $120/month">
              <div className={styles.markerLine}></div>
              {variant === 'inline' && <div className={styles.markerLabel}>$120</div>}
            </div>
            <div className={styles.goalMarker} style={{ left: '75%' }} title="Growth: $180/month">
              <div className={styles.markerLine}></div>
              {variant === 'inline' && <div className={styles.markerLabel}>$180</div>}
            </div>
            <div className={styles.goalMarker} style={{ left: '95%' }} title="Sustainable: $240/month">
              <div className={styles.markerLine}></div>
              {variant === 'inline' && <div className={styles.markerLabel}>$240</div>}
            </div>
          </div>
          
          {/* Current amount indicator */}
          <div 
            className={styles.currentAmount}
            style={{ 
              left: `${Math.min(progressPercentage, 95)}%`
            }}
          >
            ${stats.monthlyBudget}
          </div>
        </div>
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
