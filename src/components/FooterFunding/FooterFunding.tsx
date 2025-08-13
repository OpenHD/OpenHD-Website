import React from 'react';
import { createRoot } from 'react-dom/client';
import FundingWidget from '../FundingWidget';

// This function will be called on the client side to render the funding widget in the footer
export function initializeFooterFundingWidgets() {
  if (typeof window === 'undefined') return; // Skip on server side
  
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
        // Silent error handling
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
    setTimeout(initializeFooterFundingWidgets, 1000);
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Disable automatic route checking to prevent API spam
  // Only listen for manual popstate events (back/forward navigation)
  window.addEventListener('popstate', () => {
    setTimeout(initializeFooterFundingWidgets, 1000);
  });
}
