import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GitHubStarsData {
  stars: number | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

interface FundingData {
  amount: number | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

interface AppContextType {
  githubData: GitHubStarsData;
  fundingData: FundingData;
  fetchStars: (repo: string) => Promise<void>;
  fetchFunding: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

// Global cache outside of React to persist across re-renders
let globalStarsCache: { [repo: string]: GitHubStarsData } = {};
let globalFundingCache: FundingData = {
  amount: null,
  isLoading: true,
  error: null,
  lastFetched: null
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [githubData, setGithubData] = useState<GitHubStarsData>({
    stars: null,
    isLoading: true,
    error: null,
    lastFetched: null
  });

  const [fundingData, setFundingData] = useState<FundingData>({
    amount: null,
    isLoading: true,
    error: null,
    lastFetched: null
  });

  const fetchStars = async (repo: string) => {
    // Check global cache first
    if (globalStarsCache[repo] && globalStarsCache[repo].stars !== null) {
      setData(globalStarsCache[repo]);
      
      // Only refetch if data is older than 10 minutes
      const isStale = !globalStarsCache[repo].lastFetched || 
                     Date.now() - globalStarsCache[repo].lastFetched! > 10 * 60 * 1000;
      
      if (!isStale) {
        return;
      }
    }

    // Check localStorage cache
    const CACHE_KEY = `github_stars_${repo}`;
    const cached = localStorage.getItem(CACHE_KEY);
    
    if (cached) {
      try {
        const { stars, timestamp } = JSON.parse(cached);
        const cacheData = {
          stars,
          isLoading: false,
          error: null,
          lastFetched: timestamp
        };
        
        // Update both global cache and state
        globalStarsCache[repo] = cacheData;
        setData(cacheData);
        
        // If cache is fresh, don't make API call
        if (Date.now() - timestamp < 10 * 60 * 1000) {
          return;
        }
      } catch (e) {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    // Make API call only if needed
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'OpenHD-Website'
        }
      });
      
      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          // Rate limited - keep existing data if we have it
          if (globalStarsCache[repo]?.stars !== null) {
            return;
          }
          // Otherwise hide stars
          const errorData = {
            stars: null,
            isLoading: false,
            error: 'rate_limited',
            lastFetched: Date.now()
          };
          globalStarsCache[repo] = errorData;
          setData(errorData);
          return;
        }
        throw new Error(`GitHub API returned ${response.status}`);
      }

      const apiData = await response.json();
      const starCount = apiData.stargazers_count;
      
      // Cache the result
      const timestamp = Date.now();
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        stars: starCount,
        timestamp
      }));
      
      const newData = {
        stars: starCount,
        isLoading: false,
        error: null,
        lastFetched: timestamp
      };
      
      globalStarsCache[repo] = newData;
      setData(newData);
      
    } catch (err) {
      console.warn('Failed to fetch GitHub stars:', err);
      
      // Keep existing cached data if available
      if (globalStarsCache[repo]?.stars !== null) {
        return;
      }
      
      // Final fallback
      const errorData = {
        stars: null,
        isLoading: false,
        error: err.message,
        lastFetched: Date.now()
      };
      globalStarsCache[repo] = errorData;
      setData(errorData);
    }
  };

  return (
    <GitHubStarsContext.Provider value={{ data, fetchStars }}>
      {children}
    </GitHubStarsContext.Provider>
  );
}

export function useGitHubStars() {
  const context = useContext(GitHubStarsContext);
  if (!context) {
    throw new Error('useGitHubStars must be used within a GitHubStarsProvider');
  }
  return context;
}