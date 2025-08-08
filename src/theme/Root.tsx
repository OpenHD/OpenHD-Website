import React from 'react';
import GlobalSponsorCorner from '@site/src/components/GlobalSponsorCorner';
import { AppProvider } from '@site/src/contexts/AppContext';

// Client-side React component that renders on all pages
function Root({children}) {
  return (
    <AppProvider>
      {children}
      <GlobalSponsorCorner />
    </AppProvider>
  );
}

export default Root;
