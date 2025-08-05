import React, { useState, useEffect } from 'react';

interface ProtectedEmailProps {
  user: string;
  domain: string;
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export default function ProtectedEmail({ 
  user, 
  domain, 
  className = '', 
  children, 
  showIcon = true 
}: ProtectedEmailProps): JSX.Element {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Decode email on client side to prevent bot scraping
    const decodedEmail = `${user}@${domain}`;
    setEmail(decodedEmail);
  }, [user, domain]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  if (!email) {
    return (
      <span className={className}>
        {showIcon && <i className="fas fa-envelope"></i>}
        {children || `${user}[at]${domain.replace('.', '[dot]')}`}
      </span>
    );
  }

  return (
    <a 
      href={`mailto:${email}`} 
      className={className}
      onClick={handleClick}
      title={`Send email to ${email}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: showIcon ? '0.5rem' : '0' }}
    >
      {showIcon && <i className="fas fa-envelope"></i>}
      <span style={{ display: 'inline', margin: 0, padding: 0 }}>
        {children || email}
      </span>
    </a>
  );
}