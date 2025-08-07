import React from 'react';
import SponsorBanner from './SponsorBanner';

const GlobalSponsorCorner: React.FC = () => {
  return (
    <SponsorBanner 
      style="corner" 
      position="top-right" 
      global={true}
    />
  );
};

export default GlobalSponsorCorner;
