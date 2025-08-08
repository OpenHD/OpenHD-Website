import React from 'react';
import { createRoot } from 'react-dom/client';
import FooterButtons from '../FooterButtons';

export function initializeFooterButtons() {
  if (typeof window === 'undefined') return;
  
  const buttonContainer = document.getElementById('footer-buttons-container');
  if (buttonContainer) {
    // Check if already has React content
    const hasReactContent = buttonContainer.querySelector('[data-react-component="footer-buttons"]');
    
    if (!hasReactContent) {
      try {
        buttonContainer.innerHTML = ''; // Clear any existing content
        const root = createRoot(buttonContainer);
        const wrappedComponent = React.createElement('div', 
          { 'data-react-component': 'footer-buttons' },
          React.createElement(FooterButtons)
        );
        root.render(wrappedComponent);
        console.log('Footer buttons initialized successfully');
      } catch (error) {
        console.warn('Failed to initialize footer buttons:', error);
      }
    }
  } else {
    console.warn('Footer buttons container not found');
  }
}

// Initialize on load
if (typeof window !== 'undefined') {
  (window as any).initializeFooterButtons = initializeFooterButtons;
  
  const init = () => {
    setTimeout(initializeFooterButtons, 100);
    setTimeout(initializeFooterButtons, 500);
    setTimeout(initializeFooterButtons, 1000);
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Listen for navigation events to re-initialize after page changes
  window.addEventListener('popstate', () => {
    setTimeout(initializeFooterButtons, 500);
  });
  
  // Listen for Docusaurus route changes  
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    setTimeout(initializeFooterButtons, 500);
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    setTimeout(initializeFooterButtons, 500);
  };
}