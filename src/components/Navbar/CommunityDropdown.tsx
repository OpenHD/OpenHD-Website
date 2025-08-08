import React, { useState, useRef, useEffect } from 'react';
import { useWindowSize } from '@docusaurus/theme-common';
import styles from './CommunityDropdown.module.css';

interface CommunityLink {
  href: string;
  label: string;
  icon: string;
}

const communityLinks: CommunityLink[] = [
  {
    href: 'https://t.me/OpenHD_User',
    label: 'Telegram',
    icon: 'fab fa-telegram',
  },
  {
    href: 'https://discord.gg/P9kXs9N2RP',
    label: 'Discord',
    icon: 'fab fa-discord',
  },
  {
    href: 'https://www.youtube.com/@OpenHD-Official',
    label: 'YouTube',
    icon: 'fab fa-youtube',
  },
  {
    href: 'https://www.facebook.com/groups/openhd',
    label: 'Facebook',
    icon: 'fab fa-facebook',
  },
  {
    href: 'https://github.com/OpenHD',
    label: 'GitHub',
    icon: 'fab fa-github',
  },
];

/**
 * Community Dropdown Component
 * Responsive dropdown with FontAwesome icons and proper accessibility
 */
export default function CommunityDropdown(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();
  const isCompact = windowSize !== 'desktop';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        className={`${styles.dropdownToggle} ${isCompact ? styles.compact : ''}`}
        onClick={toggleDropdown}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Community links"
      >
        <i className="fas fa-users" aria-hidden="true" />
        {!isCompact && <span className={styles.dropdownLabel}>Community</span>}
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu} role="menu">
          {communityLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.dropdownItem}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsOpen(false);
                }
              }}
            >
              <i className={link.icon} aria-hidden="true" />
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}