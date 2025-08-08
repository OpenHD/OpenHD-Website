import React, {type ReactNode, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/NotFound/Content';
import styles from './NotFoundContent.module.css';
import SnakeGame from '../../../components/SnakeGame';

export default function NotFoundContent({className}: Props): ReactNode {
  console.log('🔥 OpenHD Custom 404 Content Loading!');

  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <main className={clsx('container margin-vert--xl', className, styles.main)}>
      <div className={styles.hero}>
        <div className={styles.logoContainer}>
          <img 
            src="/img/OpenHD-Logo.png" 
            alt="OpenHD Logo" 
            className={styles.logo}
          />
        </div>
        
        <h1 className={styles.title}>
          404 - Page Not Found
        </h1>
        
        <p className={styles.subtitle}>
          The page you're looking for seems to have taken off on its own flight mission.
          <br />
          Maybe it's exploring the skies with an OpenHD-powered drone? 🚁
        </p>

        <div className={styles.actions}>
          <Link
            className="button button--primary button--lg"
            to="/"
          >
            <i className="fas fa-home" style={{marginRight: '8px'}}></i>
            Return to Base Station
          </Link>
          
          <Link
            className="button button--secondary button--lg"
            to="/general/faq"
            style={{marginLeft: '1rem'}}
          >
            <i className="fas fa-question-circle" style={{marginRight: '8px'}}></i>
            Check FAQ
          </Link>
        </div>

        <div className={styles.gameArea}>
          <h3>🐍 Classic Snake Game</h3>
          <p>While you wait, why not play some retro Snake? Use arrow keys or touch controls!</p>
          
          <SnakeGame />
        </div>
      </div>
    </main>
  );
}
