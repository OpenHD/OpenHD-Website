import React from 'react';

interface DocsOGTemplateProps {
  title: string;
  description?: string;
  siteName: string;
  siteUrl: string;
}

export default function DocsOGTemplate({ 
  title, 
  description, 
  siteName, 
  siteUrl 
}: DocsOGTemplateProps) {
  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        background: 'linear-gradient(135deg, #2e8b57 0%, #228b22 100%)',
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
            backgroundColor: 'white',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#2e8b57',
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
          fontSize: '48px',
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '0 0 20px 0',
          lineHeight: '1.2',
          maxWidth: '1000px',
        }}
      >
        {title}
      </h1>

      {/* Description */}
      {description && (
        <p
          style={{
            fontSize: '24px',
            textAlign: 'center',
            margin: '0',
            opacity: 0.9,
            lineHeight: '1.4',
            maxWidth: '800px',
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
          opacity: 0.8,
        }}
      >
        Open Source Digital FPV Ecosystem
      </div>

      {/* Decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
        }}
      />
    </div>
  );
}