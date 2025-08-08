import React from 'react';
import { createRoot } from 'react-dom/client';
import FundingWidget from '../FundingWidget';

// This function will be called on the client side to render the funding widget in the footer
export function initializeFooterFundingWidgets() {
  if (typeof window === 'undefined') return;
  
  // Initialize only the main funding widget (support section)
  const mainContainer = document.getElementById('footer-funding-widget-main');
  if (mainContainer) {
    // Check if it already has a React widget (look for the funding widget specifically)
    const hasReactWidget = mainContainer.querySelector('[data-react-widget="funding"]') || 
                          mainContainer.querySelector('.fundingWidget');
    
    if (!hasReactWidget) {
      try {
        mainContainer.innerHTML = ''; // Clear any existing content
        const mainRoot = createRoot(mainContainer);
        const widgetElement = React.createElement('div', 
          { 'data-react-widget': 'funding' },
          React.createElement(FundingWidget, { 
            variant: "inline", 
            showDescription: true, 
            showDonateButton: false 
          })
        );
        mainRoot.render(widgetElement);
      } catch (error) {
        console.warn('Failed to initialize footer funding widget:', error);
      }
    }
  }
}

// Legacy function name for compatibility
export const initializeFooterFundingWidget = initializeFooterFundingWidgets;

// Initialize immediately if DOM is ready
if (typeof window !== 'undefined') {
  // Make function globally available
  (window as any).initializeFooterFundingWidgets = initializeFooterFundingWidgets;
  
  const init = () => {
    setTimeout(initializeFooterFundingWidgets, 100);
    setTimeout(initializeFooterFundingWidgets, 500);
    setTimeout(initializeFooterFundingWidgets, 1000);
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Listen for navigation events to re-initialize after page changes
  window.addEventListener('popstate', () => {
    setTimeout(initializeFooterFundingWidgets, 500);
  });
  
  // Listen for Docusaurus route changes  
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    setTimeout(initializeFooterFundingWidgets, 500);
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    setTimeout(initializeFooterFundingWidgets, 500);
  };
}
