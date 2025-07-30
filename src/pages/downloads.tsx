import type {ReactNode} from 'react';
import {useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './downloads.module.css';

interface ImageWriterDownload {
  platform: string;
  version: string;
  downloadUrl: string;
  status: 'available' | 'paused';
  icon: string;
}

interface ImageDownload {
  platform: string;
  downloadUrl: string;
  icon: string;
}

interface AppDownload {
  platform: string;
  downloadUrl: string;
  status: 'available' | 'paused';
  icon: string;
}

const imageWriterDownloads: ImageWriterDownload[] = [
  {
    platform: 'Windows',
    version: 'v2.0.4',
    downloadUrl: 'https://github.com/OpenHD/OpenHD-ImageWriter/releases/download/v2.0.4/OpenHD-ImageWriter-2.0.4.exe',
    status: 'available',
    icon: 'fab fa-windows'
  },
  {
    platform: 'Mac',
    version: 'v2.0.4',
    downloadUrl: '#',
    status: 'paused',
    icon: 'fab fa-apple'
  },
  {
    platform: 'Ubuntu Jammy',
    version: 'v2.0.4',
    downloadUrl: 'https://github.com/OpenHD/OpenHD-ImageWriter/releases/download/v2.0.4/openhdimagewriter_2.0.4_amd64_jammy.deb',
    status: 'available',
    icon: 'fab fa-ubuntu'
  },
  {
    platform: 'Ubuntu Lunar',
    version: 'v2.0.4',
    downloadUrl: 'https://github.com/OpenHD/OpenHD-ImageWriter/releases/download/v2.0.4/openhdimagewriter_2.0.4_amd64_lunar.deb',
    status: 'available',
    icon: 'fab fa-ubuntu'
  },
  {
    platform: 'Ubuntu Noble',
    version: 'v2.0.4',
    downloadUrl: 'https://github.com/OpenHD/OpenHD-ImageWriter/releases/download/v2.0.4/openhdimagewriter_2.0.4_amd64_noble.deb',
    status: 'available',
    icon: 'fab fa-ubuntu'
  }
];

const imageDownloads: ImageDownload[] = [
  {
    platform: 'Raspberry Pi',
    downloadUrl: 'http://fra1.digitaloceanspaces.com/openhd-images/Downloader/release/2.6.4/OpenHD-image-pi-bullseye-2.6.4-release.img.xz',
    icon: 'fas fa-microchip'
  },
  {
    platform: 'Radxa Zero 3',
    downloadUrl: 'http://fra1.digitaloceanspaces.com/openhd-images/Downloader/release/2.6.4/OpenHD-image-radxa-zero3w-2.6.4-release.img.xz',
    icon: 'fas fa-microchip'
  },
  {
    platform: 'Radxa CM 3',
    downloadUrl: 'http://fra1.digitaloceanspaces.com/openhd-images/Downloader/release/2.6.4/OpenHD-image-radxa-cm3-2.6.4-release.img.xz',
    icon: 'fas fa-microchip'
  },
  {
    platform: 'Radxa Rock5A',
    downloadUrl: 'http://fra1.digitaloceanspaces.com/openhd-images/Downloader/release/2.6.4/OpenHD-image-rock5a-2.6.4-release.img.xz',
    icon: 'fas fa-microchip'
  },
  {
    platform: 'Radxa Rock5B',
    downloadUrl: 'http://fra1.digitaloceanspaces.com/openhd-images/Downloader/release/2.6.4/OpenHD-image-rock5b-2.6.4-release.img.xz',
    icon: 'fas fa-microchip'
  },
  {
    platform: 'X86 Full',
    downloadUrl: 'http://fra1.digitaloceanspaces.com/openhd-images/Downloader/release/2.6.4/OpenHD-image-x86-noble-2.6.4-release.img.xz',
    icon: 'fas fa-desktop'
  },
  {
    platform: 'X86 Minimal',
    downloadUrl: 'http://fra1.digitaloceanspaces.com/openhd-images/Downloader/release/2.6.4/OpenHD-image-x86-minimal-2.6.4-release.img.xz',
    icon: 'fas fa-desktop'
  },
  {
    platform: 'OpenHD X20 VTX',
    downloadUrl: 'http://fra1.digitaloceanspaces.com/openhd-images/Downloader/release/2.6.4/OpenHD-image-x20-2.6.4-release.img.xz',
    icon: 'fas fa-broadcast-tower'
  }
];

const appDownloads: AppDownload[] = [
  {
    platform: 'Android ARM v7',
    downloadUrl: 'https://openhd-images.fra1.cdn.digitaloceanspaces.com/Downloader/release/2.6/QOpenHD-2.6-armv7.apk',
    status: 'available',
    icon: 'fab fa-android'
  },
  {
    platform: 'Android ARM v8',
    downloadUrl: 'https://openhd-images.fra1.cdn.digitaloceanspaces.com/Downloader/release/2.6/QOpenHD-2.6-armv8.apk',
    status: 'available',
    icon: 'fab fa-android'
  },
  {
    platform: 'iOS',
    downloadUrl: '#',
    status: 'paused',
    icon: 'fab fa-apple'
  },
  {
    platform: 'Windows',
    downloadUrl: '#',
    status: 'paused',
    icon: 'fab fa-windows'
  },
  {
    platform: 'Mac',
    downloadUrl: '#',
    status: 'paused',
    icon: 'fab fa-apple'
  }
];

// Developer Modal Component
function DeveloperModal({ isOpen, onClose, platform }: { isOpen: boolean; onClose: () => void; platform: string }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>
            <i className="fas fa-code"></i>
            Developer Needed
          </h3>
          <p>{platform} Support</p>
        </div>
        <div className={styles.modalBody}>
          <p>
            We're currently seeking a passionate developer to help maintain and improve OpenHD support for <strong>{platform}</strong>.
          </p>
          <p>
            This is a great opportunity to contribute to an open-source project that's making digital FPV accessible to everyone worldwide.
          </p>
          <div className={styles.telegramSection}>
            <h4>
              <i className="fab fa-telegram"></i>
              Join Our Community
            </h4>
            <p>Connect with our development team and community on Telegram to get started or ask questions.</p>
            <a 
              href="https://t.me/OpenHD_User" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.telegramButton}
            >
              <i className="fab fa-telegram"></i>
              Join Telegram Group
            </a>
          </div>
          <p>
            <strong>What we're looking for:</strong><br/>
            • Experience with {platform.includes('Mac') || platform.includes('iOS') ? 'macOS/iOS' : platform.includes('Windows') ? 'Windows' : 'cross-platform'} development<br/>
            • Passion for open-source projects<br/>
            • Interest in FPV and drone technology
          </p>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ImageWriter Card Component
function ImageWriterCard({ onOpenModal }: { onOpenModal: (platform: string) => void }) {
  const handlePausedDownload = (platform: string) => {
    onOpenModal(platform);
  };

  return (
    <div className={styles.downloadCard}>
      <div className={styles.cardHeader}>
        <i className="fas fa-magic"></i>
        <h3>OpenHD ImageWriter</h3>
      </div>
      <p className={styles.cardDescription}>
        The OpenHD ImageWriter is a software tool that makes it easy to install and configure OpenHD. 
        It lets you choose and download all Images within itself, configure OpenHD, and write everything to a SD or USB-Stick.
      </p>
      <div className={styles.downloadList}>
        {imageWriterDownloads.map((item, index) => (
          <div key={index} className={`${styles.downloadItem} ${item.status === 'paused' ? styles.paused : ''}`}>
            {item.status === 'available' ? (
              <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadItemLink}>
                <div className={styles.itemIcon}>
                  <i className="far fa-check-circle"></i>
                </div>
                <div className={styles.itemContent}>
                  <i className={item.icon}></i>
                  <span>{item.platform}</span>
                </div>
              </a>
            ) : (
              <div className={styles.downloadItemLink} onClick={() => handlePausedDownload(item.platform)} style={{cursor: 'pointer'}}>
                <div className={styles.itemIcon}>
                  <i className="far fa-pause-circle"></i>
                </div>
                <div className={styles.itemContent}>
                  <i className={item.icon}></i>
                  <span>{item.platform}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Images Card Component
function ImagesCard() {
  return (
    <div className={styles.downloadCard}>
      <div className={styles.cardHeader}>
        <i className="fas fa-compact-disc"></i>
        <h3>Images</h3>
      </div>
      <p className={styles.cardDescription}>
        Here you can find all our latest Images for manual flashing.
      </p>
      <div className={styles.downloadList}>
        {imageDownloads.map((item, index) => (
          <div key={index} className={styles.downloadItem}>
            <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadItemLink}>
              <div className={styles.itemIcon}>
                <i className="far fa-check-circle"></i>
              </div>
              <div className={styles.itemContent}>
                <i className={item.icon}></i>
                <span>{item.platform}</span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

// Apps Card Component
function AppsCard({ onOpenModal }: { onOpenModal: (platform: string) => void }) {
  const handlePausedDownload = (platform: string) => {
    onOpenModal(platform);
  };

  return (
    <div className={styles.downloadCard}>
      <div className={styles.cardHeader}>
        <i className="fas fa-mobile-alt"></i>
        <h3>OpenHD Apps</h3>
      </div>
      <p className={styles.cardDescription}>
        OpenHD comes with a few companion apps, which show the primary video and expose settings. 
        OpenHD additionally allows the usage of third party apps like MissionPlanner, Tower, QGroundControl and FPV_VR_OS.
      </p>
      <div className={styles.downloadList}>
        {appDownloads.map((item, index) => (
          <div key={index} className={`${styles.downloadItem} ${item.status === 'paused' ? styles.paused : ''}`}>
            {item.status === 'available' ? (
              <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadItemLink}>
                <div className={styles.itemIcon}>
                  <i className="far fa-check-circle"></i>
                </div>
                <div className={styles.itemContent}>
                  <i className={item.icon}></i>
                  <span>{item.platform}</span>
                </div>
              </a>
            ) : (
              <div className={styles.downloadItemLink} onClick={() => handlePausedDownload(item.platform)} style={{cursor: 'pointer'}}>
                <div className={styles.itemIcon}>
                  <i className="far fa-pause-circle"></i>
                </div>
                <div className={styles.itemContent}>
                  <i className={item.icon}></i>
                  <span>{item.platform}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Downloads(): ReactNode {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const openDeveloperModal = (platform: string) => {
    setSelectedPlatform(platform);
    setModalOpen(true);
  };

  return (
    <Layout
      title="Downloads"
      description="Download OpenHD ImageWriter, images, and companion apps for various platforms">
      <div className={styles.downloadsPage}>
        <div className="container">
          <div className={styles.header}>
            <h1>Downloads</h1>
            <p>
              Here you can find the most important OpenHD Downloads. We recommend just downloading the OpenHD ImageWriter, 
              which can internally download all the listed files here, and let's you easily configure OpenHD.
            </p>
          </div>
          
          <div className={styles.downloadGrid}>
            <ImageWriterCard onOpenModal={openDeveloperModal} />
            <ImagesCard />
            <AppsCard onOpenModal={openDeveloperModal} />
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
              <div className="col col--4">
                <h3>System Requirements</h3>
                <ul>
                  <li>Raspberry Pi 4B or newer (recommended)</li>
                  <li>Compatible WiFi adapter</li>
                  <li>MicroSD card (32GB or larger)</li>
                  <li>Camera module or USB camera</li>
                </ul>
              </div>
              <div className="col col--4">
                <h3>What's Included</h3>
                <ul>
                  <li>OpenHD core system</li>
                  <li>QOpenHD ground station</li>
                  <li>Camera and telemetry support</li>
                  <li>Web-based configuration interface</li>
                </ul>
              </div>
              <div className="col col--4">
                <h3>Third-Party Apps</h3>
                <ul>
                  <li>MissionPlanner support</li>
                  <li>QGroundControl integration</li>
                  <li>Tower compatibility</li>
                  <li>FPV_VR_OS support</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className={styles.versionInfo}>
            <div className={styles.versionCard}>
              <h3>Current Version: 2.6.4-evo</h3>
              <p>Latest stable release with improved performance and new features.</p>
              <div className={styles.versionLinks}>
                <Link 
                  className="button button--outline button--primary"
                  href="https://github.com/OpenHD/OpenHD/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-github"></i> View on GitHub
                </Link>
                <Link 
                  className="button button--outline button--primary"
                  to="/changelog"
                >
                  <i className="fas fa-list"></i> Changelog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeveloperModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        platform={selectedPlatform} 
      />
    </Layout>
  );
}