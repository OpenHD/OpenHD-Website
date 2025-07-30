import React from 'react';
import ModernQRCode from './ModernQRCode';
import styles from './AppDownloadBanner.module.css';

export default function AppDownloadBanner(): JSX.Element {
  return (
    <section className={styles.appBanner}>
      <div className="container">
        <div className={styles.bannerContent}>
          <div className={styles.bannerText}>
            <h2 className={styles.bannerTitle}>
              <i className="fas fa-mobile-alt"></i>
              Get QOpenHD Mobile App
            </h2>
            <p className={styles.bannerDescription}>
              Control your OpenHD system on the go. Monitor telemetry, adjust settings, 
              and view live video streams directly from your mobile device.
            </p>
            <div className={styles.downloadButtons}>
              <a 
                href="https://play.google.com/store/apps/details?id=com.openhd.qopenhd" 
                className={styles.downloadBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-google-play"></i>
                <div>
                  <span className={styles.downloadText}>Get it on</span>
                  <span className={styles.storeName}>Google Play</span>
                </div>
              </a>
              <a 
                href="https://github.com/OpenHD/QOpenHD/releases" 
                className={styles.downloadBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-github"></i>
                <div>
                  <span className={styles.downloadText}>Download from</span>
                  <span className={styles.storeName}>GitHub</span>
                </div>
              </a>
            </div>
          </div>
          
          <div className={styles.qrSection}>
            <ModernQRCode 
              value="https://play.google.com/store/apps/details?id=com.openhd.qopenhd"
              size={160}
              title="Scan to Download"
              subtitle="QOpenHD Mobile App"
            />
          </div>
        </div>
      </div>
    </section>
  );
}