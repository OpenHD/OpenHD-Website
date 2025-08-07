import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import React from 'react';
import GitHubStars from '@site/src/components/GitHubStars';

let hasInjected = false;

export function useNavbarGitHubStars() {
  useEffect(() => {
    const injectGitHubStars = () => {
      const targetElement = document.getElementById('github-stars-navbar');
      
      if (targetElement && !hasInjected) {
        const isMobile = window.innerWidth <= 768;
        
        // Clear any existing content first
        targetElement.innerHTML = '';
        
        const root = createRoot(targetElement);
        root.render(
          React.createElement(GitHubStars, {
            repo: 'OpenHD/OpenHD',
            className: 'navbar-github-stars',
            showIcon: true,
            showText: !isMobile
          })
        );
        
        hasInjected = true;
      }
    };

    // Try multiple times with increasing delays to ensure navbar is ready
    const tryInject = (attempt = 0) => {
      const maxAttempts = 10;
      const delay = Math.min(100 * Math.pow(1.5, attempt), 1000); // Exponential backoff
      
      if (attempt >= maxAttempts) {
        console.warn('GitHubStars: Could not find navbar element after', maxAttempts, 'attempts');
        return;
      }
      
      const targetElement = document.getElementById('github-stars-navbar');
      if (targetElement && !hasInjected) {
        injectGitHubStars();
      } else if (!hasInjected) {
        setTimeout(() => tryInject(attempt + 1), delay);
      }
    };

    tryInject();

    // Handle window resize for responsive text
    const handleResize = () => {
      if (hasInjected) {
        hasInjected = false; // Allow re-injection with new settings
        setTimeout(injectGitHubStars, 100);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array - only run once per component mount

  // Reset injection flag on route changes
  useEffect(() => {
    const handleRouteChange = () => {
      // Small delay to allow navigation to complete
      setTimeout(() => {
        hasInjected = false;
      }, 50);
    };

    // Listen for route changes in SPA
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
}