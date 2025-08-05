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
    <div className={`${styles.downloadCard} ${styles.recommendedCard}`}>
      <div className={styles.cardHeader}>
        <i className="fas fa-magic"></i>
        <h3>OpenHD ImageWriter</h3>
      </div>
      <p className={styles.cardDescription}>
        The easiest way to install and configure OpenHD. 
        Automatically downloads images, handles configuration, and writes everything to your SD card or USB stick.
      </p>
      <div className={styles.benefitsList}>
        <div className={styles.benefit}>
          <i className="fas fa-check-circle"></i>
          <span>Automatic download of all images</span>
        </div>
        <div className={styles.benefit}>
          <i className="fas fa-check-circle"></i>
          <span>Simple configuration</span>
        </div>
        <div className={styles.benefit}>
          <i className="fas fa-check-circle"></i>
          <span>Direct writing to SD card</span>
        </div>
      </div>
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
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className={`${styles.downloadCard} ${styles.advancedCard}`}>
      <div className={styles.cardHeader}>
        <i className="fas fa-compact-disc"></i>
        <h3>Manual Images (Advanced)</h3>
      </div>
      <p className={styles.cardDescription}>
        Raw images for advanced users with specific requirements. 
        Only use if the ImageWriter doesn't meet your needs.
      </p>
      <div className={styles.advancedWarning}>
        <i className="fas fa-info-circle"></i>
        <span>Manual configuration and flashing required</span>
      </div>
      <button 
        className={styles.showAdvancedButton}
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? 'Hide manual downloads' : 'Show manual downloads'}
        <i className={`fas ${showAdvanced ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
      </button>
      {showAdvanced && (
        <div className={styles.downloadList}>
          {imageDownloads.map((item, index) => (
            <div key={index} className={`${styles.downloadItem} ${styles.advancedDownloadItem}`}>
              <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadItemLink}>
                <div className={styles.itemIcon}>
                  <i className="fas fa-download"></i>
                </div>
                <div className={styles.itemContent}>
                  <i className={item.icon}></i>
                  <span>{item.platform}</span>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
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
              Get OpenHD up and running on your system with our tools and images.
            </p>
          </div>
          
          <div className={styles.downloadGrid}>
            <ImageWriterCard onOpenModal={openDeveloperModal} />
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
                  <li><Link to="/hardware/raspberry">Raspberry Pi 4B</Link> or <Link to="/hardware/sbcs">compatible SBC</Link></li>
                  <li><Link to="/hardware/wifi-adapters">Compatible WiFi adapter</Link></li>
                  <li>MicroSD card (32GB or larger)</li>
                  <li><Link to="/hardware/cameras">Camera module</Link> or USB camera</li>
                </ul>
              </div>
              <div className="col col--4">
                <h3>What's Included</h3>
                <ul>
                  <li>OpenHD core system</li>
                  <li><Link to="/ground-station-software/qopenhd-osd-backup">QOpenHD ground station</Link></li>
                  <li><Link to="/hardware/cameras">Camera</Link> and <Link to="/software-setup/telemetry-and-osd">telemetry support</Link></li>
                  <li>Web-based configuration interface</li>
                </ul>
              </div>
              <div className="col col--4">
                <h3>Third-Party Apps</h3>
                <ul>
                  <li><Link to="/ground-station-software/mission-planner">MissionPlanner</Link> support</li>
                  <li><Link to="/ground-station-software/qgroundcontrol">QGroundControl</Link> integration</li>
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
          
          <div className={styles.advancedSection}>
            <ImagesCard />
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