import React from 'react';

export default function FooterButtons() {
  const handleSupportOptionsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use Docusaurus router for SPA navigation
    if (window.location.pathname !== '/help-us') {
      window.history.pushState({}, '', '/help-us');
      // Trigger Docusaurus navigation
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '180px'}}>
      <a 
        href="/help-us"
        onClick={handleSupportOptionsClick}
        style={{
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '8px',
          background: 'linear-gradient(135deg, #2e8b57, #228b22)', 
          color: 'white', 
          padding: '12px 20px',
          borderRadius: '8px', 
          textDecoration: 'none', 
          fontWeight: '600',
          transition: 'all 0.3s ease', 
          boxShadow: '0 3px 12px rgba(46, 139, 87, 0.3)',
          transform: 'translateY(0px)', 
          fontSize: '0.95rem', 
          whiteSpace: 'nowrap'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(46, 139, 87, 0.4)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #32a05f, #2e8b57)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.boxShadow = '0 3px 12px rgba(46, 139, 87, 0.3)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #2e8b57, #228b22)';
        }}
      >
        <i className="fas fa-cog"></i>
        <span>Support Options</span>
      </a>
      
      <a 
        href="https://opencollective.com/openhd" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '8px',
          background: 'linear-gradient(135deg, #00a6f2, #0095d9)', 
          color: 'white', 
          padding: '12px 20px',
          borderRadius: '8px', 
          textDecoration: 'none', 
          fontWeight: '600',
          transition: 'all 0.3s ease', 
          boxShadow: '0 3px 12px rgba(0, 166, 242, 0.3)',
          transform: 'translateY(0px)', 
          fontSize: '0.95rem', 
          whiteSpace: 'nowrap'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 166, 242, 0.4)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #0095d9, #0085c9)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.boxShadow = '0 3px 12px rgba(0, 166, 242, 0.3)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #00a6f2, #0095d9)';
        }}
      >
        <i className="fas fa-heart"></i>
        <span>Donate</span>
      </a>
    </div>
  );
}