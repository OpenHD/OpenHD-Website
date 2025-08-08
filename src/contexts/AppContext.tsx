import React, { createContext, useContext, useState, ReactNode } from 'react';

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
      setGithubData(globalStarsCache[repo]);
      
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
        
        globalStarsCache[repo] = cacheData;
        setGithubData(cacheData);
        
        if (Date.now() - timestamp < 10 * 60 * 1000) {
          return;
        }
      } catch (e) {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    try {
      const response = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'OpenHD-Website'
        }
      });
      
      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          if (globalStarsCache[repo]?.stars !== null) {
            return;
          }
          const errorData = {
            stars: null,
            isLoading: false,
            error: 'rate_limited',
            lastFetched: Date.now()
          };
          globalStarsCache[repo] = errorData;
          setGithubData(errorData);
          return;
        }
        throw new Error(`GitHub API returned ${response.status}`);
      }

      const apiData = await response.json();
      const starCount = apiData.stargazers_count;
      
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
      setGithubData(newData);
      
    } catch (err) {
      console.warn('Failed to fetch GitHub stars:', err);
      
      if (globalStarsCache[repo]?.stars !== null) {
        return;
      }
      
      const errorData = {
        stars: null,
        isLoading: false,
        error: err.message,
        lastFetched: Date.now()
      };
      globalStarsCache[repo] = errorData;
      setGithubData(errorData);
    }
  };

  const fetchFunding = async () => {
    // Check global cache first
    if (globalFundingCache.amount !== null) {
      setFundingData(globalFundingCache);
      
      // Only refetch if data is older than 10 minutes
      const isStale = !globalFundingCache.lastFetched || 
                     Date.now() - globalFundingCache.lastFetched > 10 * 60 * 1000;
      
      if (!isStale) {
        return;
      }
    }

    try {
      const response = await fetch('https://opencollective.com/openhd.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const amount = Math.round(data.balance / 100); // Convert cents to dollars
      
      const newData = {
        amount,
        isLoading: false,
        error: null,
        lastFetched: Date.now()
      };
      
      globalFundingCache = newData;
      setFundingData(newData);
      
    } catch (err) {
      console.warn('Failed to fetch funding data:', err);
      
      const errorData = {
        amount: globalFundingCache.amount, // Keep existing data if available
        isLoading: false,
        error: err.message,
        lastFetched: Date.now()
      };
      globalFundingCache = errorData;
      setFundingData(errorData);
    }
  };

  return (
    <AppContext.Provider value={{ githubData, fundingData, fetchStars, fetchFunding }}>
      {children}
    </AppContext.Provider>
  );
}

export function useGitHubStars() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useGitHubStars must be used within an AppProvider');
  }
  return { data: context.githubData, fetchStars: context.fetchStars };
}

export function useFunding() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useFunding must be used within an AppProvider');
  }
  return { data: context.fundingData, fetchFunding: context.fetchFunding };
}