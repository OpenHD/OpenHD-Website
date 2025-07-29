import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './downloads.module.css';

interface DownloadItem {
  title: string;
  description: string;
  version: string;
  downloadUrl: string;
  platform: string;
  icon: string;
}

const downloads: DownloadItem[] = [
  {
    title: 'Raspberry Pi Images',
    description: 'Pre-built OpenHD images for Raspberry Pi boards',
    version: '2.6-evo',
    downloadUrl: 'https://github.com/OpenHD/OpenHD/releases',
    platform: 'Raspberry Pi',
    icon: '🥧'
  },
  {
    title: 'Radxa Images',
    description: 'OpenHD images optimized for Radxa single-board computers',
    version: '2.6-evo',
    downloadUrl: 'https://github.com/OpenHD/OpenHD/releases',
    platform: 'Radxa',
    icon: '💻'
  },
  {
    title: 'X86/PC Images',
    description: 'OpenHD for standard PC hardware and Intel NUCs',
    version: '2.6-evo',
    downloadUrl: 'https://github.com/OpenHD/OpenHD/releases',
    platform: 'x86/PC',
    icon: '🖥️'
  },
  {
    title: 'QOpenHD Ground Station',
    description: 'Cross-platform ground station software for Windows, Mac, and Linux',
    version: 'Latest',
    downloadUrl: 'https://github.com/OpenHD/QOpenHD/releases',
    platform: 'Windows/Mac/Linux',
    icon: '📱'
  }
];

function DownloadCard({item}: {item: DownloadItem}) {
  return (
    <div className={styles.downloadCard}>
      <div className={styles.cardIcon}>{item.icon}</div>
      <h3>{item.title}</h3>
      <p className={styles.cardDescription}>{item.description}</p>
      <div className={styles.cardDetails}>
        <span className={styles.version}>Version: {item.version}</span>
        <span className={styles.platform}>{item.platform}</span>
      </div>
      <Link 
        className="button button--primary button--block"
        href={item.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Download
      </Link>
    </div>
  );
}

export default function Downloads(): ReactNode {
  return (
    <Layout
      title="Downloads"
      description="Download OpenHD images and ground station software for various platforms">
      <div className={styles.downloadsPage}>
        <div className="container">
          <div className={styles.header}>
            <h1>Downloads</h1>
            <p>
              Get the latest OpenHD releases for your hardware platform. All downloads are free and open source.
            </p>
          </div>
          
          <div className={styles.downloadGrid}>
            {downloads.map((item, index) => (
              <DownloadCard key={index} item={item} />
            ))}
          </div>
          
          <div className={styles.installationHelp}>
            <h2>Need Help Installing?</h2>
            <p>
              Check out our comprehensive installation guide to get OpenHD up and running on your system.
            </p>
            <Link 
              className="button button--secondary button--lg"
              to="/installation-guide"
            >
              Installation Guide
            </Link>
          </div>
          
          <div className={styles.additionalInfo}>
            <div className="row">
              <div className="col col--6">
                <h3>System Requirements</h3>
                <ul>
                  <li>Raspberry Pi 4B or newer (recommended)</li>
                  <li>Compatible WiFi adapter</li>
                  <li>MicroSD card (32GB or larger)</li>
                  <li>Camera module or USB camera</li>
                </ul>
              </div>
              <div className="col col--6">
                <h3>What's Included</h3>
                <ul>
                  <li>OpenHD core system</li>
                  <li>Ground station software</li>
                  <li>Camera and telemetry support</li>
                  <li>Web-based configuration interface</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}