import React from 'react';

interface PageOGTemplateProps {
  title: string;
  description?: string;
  siteName: string;
  siteUrl: string;
}

export default function PageOGTemplate({ 
  title, 
  description, 
  siteName, 
  siteUrl 
}: PageOGTemplateProps) {
  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        padding: '60px',
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '40px',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #2e8b57, #228b22)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '20px',
            boxShadow: '0 8px 32px rgba(46, 139, 87, 0.3)',
          }}
        >
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            HD
          </div>
        </div>
        <div
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          {siteName}
        </div>
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: '56px',
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '0 0 20px 0',
          lineHeight: '1.1',
          maxWidth: '1000px',
          background: 'linear-gradient(135deg, #2e8b57, #32cd32)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {title}
      </h1>

      {/* Description */}
      {description && (
        <p
          style={{
            fontSize: '26px',
            textAlign: 'center',
            margin: '0',
            opacity: 0.8,
            lineHeight: '1.4',
            maxWidth: '800px',
            color: '#e0e0e0',
          }}
        >
          {description}
        </p>
      )}

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          fontSize: '18px',
          opacity: 0.6,
          color: '#a0a0a0',
        }}
      >
        Open Source Digital FPV Ecosystem
      </div>

      {/* Grid pattern background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Accent shapes */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          width: '120px',
          height: '4px',
          background: 'linear-gradient(135deg, #2e8b57, #32cd32)',
          borderRadius: '2px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '120px',
          left: '30px',
          width: '80px',
          height: '4px',
          background: 'linear-gradient(135deg, #2e8b57, #32cd32)',
          borderRadius: '2px',
        }}
      />
    </div>
  );
}