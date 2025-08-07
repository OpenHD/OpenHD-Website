import React from 'react';

/**
 * Simple Sponsor Corner Component
 * This component can be used to display sponsor information or banners
 */
const SimpleSponsorCorner = ({ sponsors = [], className = '' }) => {
  if (!sponsors || sponsors.length === 0) {
    return null;
  }

  return (
    <div className={`simple-sponsor-corner ${className}`}>
      <div className="sponsor-items">
        {sponsors.map((sponsor, index) => (
          <div key={index} className="sponsor-item">
            {sponsor.logo && (
              <img 
                src={sponsor.logo} 
                alt={sponsor.name} 
                className="sponsor-logo"
              />
            )}
            {sponsor.name && (
              <span className="sponsor-name">{sponsor.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleSponsorCorner;
