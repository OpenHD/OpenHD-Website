import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './changelog.module.css';

const changelogOverview = [
  {
    version: "2.6.0",
    date: "2024-09-20",
    type: "major",
    title: "Major Feature Release",
    sections: {
      newFeatures: [
        "OpenHD custom hardware (X20-VTX) support",
        "New platform support (Radxa Zero 3W, CM3, Rock 5B/5A)",
        "USB audio & thermal camera features"
      ],
      improvements: [
        "Power monitoring on all platforms",
        "Enhanced video streaming performance",
        "Improved Ground Battery widget"
      ],
      bugFixes: [
        "Fixed runaway latency in high RF pollution",
        "Fixed temporary loss of telemetry data"
      ]
    }
  },
  {
    version: "2.5.0",
    date: "2024-06-15",
    type: "major",
    title: "Security & Platform Expansion", 
    sections: {
      newFeatures: [
        "Enhanced telemetry encryption",
        "Betaflight support added",
        "New HUD widgets & performance horizon"
      ],
      improvements: [
        "Improved RF metrics & channel analysis",
        "Better TPI handling for RTL8812AU",
        "Enhanced bandwidth synchronization"
      ],
      bugFixes: [
        "Fixed handling of polluted channels",
        "Improved bitrate overshoot handling"
      ]
    }
  },
  {
    version: "2.4.1",
    date: "2024-03-10",
    type: "patch",
    title: "Critical Bug Fixes & Enhancements",
    sections: {
      newFeatures: [
        "Exposure Value (EV) support in libcamera",
        "GPIO26 control functionality"
      ],
      improvements: [
        "Rock5 custom kernels with 8812au drivers",
        "Improved parameter names in OpenHD"
      ],
      bugFixes: [
        "Fixed libcamera metering crashes",
        "Fixed recordings not displayed in web UI"
      ]
    }
  }
];

function ChangelogTimelineCard({ item, index }) {
  const isEven = index % 2 === 0;
  
  return (
    <div className={`${styles.timelineItem} ${isEven ? styles.left : styles.right}`}>
      <div className={styles.timelineMarker}>
        <div className={`${styles.versionBadge} ${styles[item.type]}`}>
          v{item.version}
        </div>
      </div>
      <div className={styles.timelineContent}>
        <div className={styles.overviewCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <span className={styles.date}>{item.date}</span>
          </div>
          
          {item.sections.newFeatures && item.sections.newFeatures.length > 0 && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>🚀 New Features</h4>
              <ul className={styles.highlightsList}>
                {item.sections.newFeatures.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          {item.sections.improvements && item.sections.improvements.length > 0 && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>⚡ Improvements</h4>
              <ul className={styles.highlightsList}>
                {item.sections.improvements.map((improvement, idx) => (
                  <li key={idx}>{improvement}</li>
                ))}
              </ul>
            </div>
          )}
          
          {item.sections.bugFixes && item.sections.bugFixes.length > 0 && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>🐛 Bug Fixes</h4>
              <ul className={styles.highlightsList}>
                {item.sections.bugFixes.map((fix, idx) => (
                  <li key={idx}>{fix}</li>
                ))}
              </ul>
            </div>
          )}
          
          <Link
            className={styles.detailsButton}
            to={`/changelog-details#v${item.version.replace('.', '-')}`}>
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Changelog() {
  return (
    <Layout
      title="Changelog"
      description="OpenHD Release Overview - Latest updates and improvements">
      <div className={styles.changelogContainer}>
        <div className={styles.hero}>
          <div className="container">
            <h1>Release Overview</h1>
            <p>Quick overview of our latest releases - click for detailed changelogs</p>
          </div>
        </div>
        
        <div className={styles.timelineContainer}>
          <div className="container">
            <div className={styles.timeline}>
              {changelogOverview.map((item, index) => (
                <ChangelogTimelineCard key={item.version} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}