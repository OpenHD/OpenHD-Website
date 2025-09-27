import React, { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { JSX } from 'react';

interface GitHubStarsData {
  stars: number | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

interface GitHubStarsContextValue {
  data: GitHubStarsData;
  fetchStars: (repo: string) => Promise<void>;
}

const STALE_THRESHOLD_MS = 10 * 60 * 1000;

const GitHubStarsContext = createContext<GitHubStarsContextValue | undefined>(undefined);

// Cache that lives outside of React to survive component unmounts
const globalStarsCache: Record<string, GitHubStarsData> = {};

export function GitHubStarsProvider({ children }: { children: ReactNode }): JSX.Element {
  const [data, setData] = useState<GitHubStarsData>({
    stars: null,
    isLoading: true,
    error: null,
    lastFetched: null,
  });

  const fetchStars = useCallback(async (repo: string) => {
    const now = Date.now();
    const cached = globalStarsCache[repo];

    if (cached && cached.stars !== null) {
      setData(cached);
      if (cached.lastFetched && now - cached.lastFetched < STALE_THRESHOLD_MS) {
        return;
      }
    }

    const CACHE_KEY = `github_stars_${repo}`;
    if (typeof window !== 'undefined') {
      const localCache = window.localStorage.getItem(CACHE_KEY);
      if (localCache) {
        try {
          const parsed = JSON.parse(localCache) as { stars: number; timestamp: number };
          const cacheData: GitHubStarsData = {
            stars: parsed.stars,
            isLoading: false,
            error: null,
            lastFetched: parsed.timestamp,
          };
          globalStarsCache[repo] = cacheData;
          setData(cacheData);
          if (now - parsed.timestamp < STALE_THRESHOLD_MS) {
            return;
          }
        } catch {
          window.localStorage.removeItem(CACHE_KEY);
        }
      }
    }

    try {
      const response = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'OpenHD-Website',
        },
      });

      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          if (cached?.stars !== null) {
            return;
          }
          const errorData: GitHubStarsData = {
            stars: null,
            isLoading: false,
            error: 'rate_limited',
            lastFetched: now,
          };
          globalStarsCache[repo] = errorData;
          setData(errorData);
          return;
        }
        throw new Error(`GitHub API returned ${response.status}`);
      }

      const apiData = await response.json();
      const starCount = apiData.stargazers_count as number | undefined;
      const timestamp = Date.now();

      if (typeof window !== 'undefined' && typeof starCount === 'number') {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify({
          stars: starCount,
          timestamp,
        }));
      }

      const newData: GitHubStarsData = {
        stars: typeof starCount === 'number' ? starCount : null,
        isLoading: false,
        error: null,
        lastFetched: timestamp,
      };

      globalStarsCache[repo] = newData;
      setData(newData);
    } catch (error) {
      console.warn('Failed to fetch GitHub stars:', error);
      if (cached?.stars !== null) {
        return;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      const errorData: GitHubStarsData = {
        stars: null,
        isLoading: false,
        error: message,
        lastFetched: Date.now(),
      };
      globalStarsCache[repo] = errorData;
      setData(errorData);
    }
  }, []);

  const value = useMemo(
    () => ({
      data,
      fetchStars,
    }),
    [data, fetchStars],
  );

  return <GitHubStarsContext.Provider value={value}>{children}</GitHubStarsContext.Provider>;
}

export function useGitHubStars(): GitHubStarsContextValue {
  const context = useContext(GitHubStarsContext);
  if (!context) {
    throw new Error('useGitHubStars must be used within a GitHubStarsProvider');
  }
  return context;
}
