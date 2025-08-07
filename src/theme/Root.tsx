import React from 'react';
import GlobalSponsorCorner from '@site/src/components/GlobalSponsorCorner';
import { useNavbarGitHubStars } from '@site/src/hooks/useNavbarGitHubStars';

// Client-side React component that renders on all pages
function Root({children}) {
  // Initialize GitHub Stars integration
  useNavbarGitHubStars();

  return (
    <>
      {children}
      <GlobalSponsorCorner />
    </>
  );
}

export default Root;
