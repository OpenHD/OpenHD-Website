// Client-side module to inject GitHub Stars component into navbar
import { createRoot } from 'react-dom/client';
import React from 'react';
import GitHubStars from './GitHubStars';

function injectGitHubStars() {
  const targetElement = document.getElementById('github-stars-navbar');
  
  if (targetElement && !targetElement.hasChildNodes()) {
    const isMobile = window.innerWidth <= 768;
    
    const root = createRoot(targetElement);
    root.render(
      React.createElement(GitHubStars, {
        repo: 'OpenHD/OpenHD',
        className: 'navbar-github-stars',
        showIcon: true,
        showText: !isMobile // Hide text on mobile to save space
      })
    );
  }
}

// Run when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectGitHubStars);
  } else {
    injectGitHubStars();
  }
  
  // Also run on route changes (SPA navigation)
  let currentPath = location.pathname;
  const observer = new MutationObserver(() => {
    if (currentPath !== location.pathname) {
      currentPath = location.pathname;
      setTimeout(injectGitHubStars, 100); // Small delay for DOM update
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}