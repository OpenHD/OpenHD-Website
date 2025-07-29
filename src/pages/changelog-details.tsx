import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './changelog-details.module.css';

const detailedChangelog = [
  {
    version: "2.6.0",
    date: "2024-09-20",
    type: "major",
    title: "Major Feature Release",
    description: "We are thrilled to announce a new release of OpenHD, packed with exciting new features, improvements, and bug fixes! OpenHD continues to evolve thanks to the contributions and feedback from our amazing community.",
    newFeatures: [
      "Added support for OpenHD custom hardware (X20-VTX) AIR",
      "Added support for Radxa Zero 3W GND",
      "Added support for Radxa CM3 GND", 
      "Added support for Radxa Rock 5B GND",
      "Added support for Radxa Rock 5A GND",
      "Added Infiray thermal camera color palette",
      "Added (USB) audio support (beta)",
      "Added minimal X86 image and updated support for Ubuntu Noble",
      "Added support for Zero 3W Hotspot",
      "Added support for Power Monitoring on all Platforms"
    ],
    improvements: [
      "Enhanced handling of intra and non-intra streams",
      "Improved platform integration of cameras",
      "Improved handling on 88x2BU Realtek cards",
      "Improved Ethernet and WiFi forwarding",
      "Simplified WiFi card discovery",
      "Enabled low latency video playback on Rock platforms with simultaneous QOpenHD usage",
      "Improved Ground Battery widget",
      "Added Sidebar menu for fast settings switching (including joystick support)"
    ],
    bugFixes: [
      "Fixed runaway latency in high RF pollution scenarios",
      "Disabled video streaming briefly during critical operations to free up bandwidth and resources",
      "Fixed bug causing temporary loss of telemetry data during session changes",
      "Automatically limited TPI to 50 on 40MHz on Asus devices"
    ],
    miscellaneous: [
      "Enabled frequency change using air unit only",
      "Added initial support for enterprise Hardware (including Microhard support)"
    ]
  },
  {
    version: "2.5.0",
    date: "2024-06-15",
    type: "major",
    title: "Security & Platform Expansion",
    description: "This release focuses on enhanced security features, platform expansion, and significant improvements to the user experience.",
    newFeatures: [
      "Selectable bind phrase in the OpenHD Image Writer - Now you can easily customize the bind phrase during image writing, providing you with increased flexibility and convenience",
      "Enhanced telemetry security - Telemetry is now always encrypted, ensuring the utmost security. Additionally, video encryption is made optional, granting users more control over their system",
      "Betaflight support - OpenHD now includes support for Betaflight, expanding compatibility and functionality",
      "Improved RF Metrics with Foreign PPS tracking, Channel analysis enhancements, and improved handling of polluted channels and bitrate overshoot by cameras (Throttle)",
      "Refined frequency selection with a shift to the standard FPV range, making DJI/Walksnail and analog antennas more usable",
      "New HUD widgets and features - Introduction of multiple HUD widgets, including performance horizon and rate quick select. New features like auto-hiding of the mouse pointer for a cleaner interface",
      "Platform expansion - Initial support for new platforms, including Radxa CM3, Radxa Zero 3W, OpenHD X20, and more"
    ],
    improvements: [
      "Improved Inav Mavlink support with enhanced Mavlink sysid handling",
      "Better handling of TPI (TX power index) for RTL8812AU, optimizing wireless performance",
      "Enhanced bandwidth synchronization (20MHz / 40MHz) for improved performance",
      "Simplified STBC / LDPC Selection - Streamlined selection processes for STBC (Space-Time Block Coding) and LDPC (Low-Density Parity-Check) to enhance the user experience",
      "Build system and dependency improvements - Optimized build system using CMake and reduced dependencies, contributing to a more efficient and lightweight application",
      "Air recordings naming enhancement - Improved naming conventions for air recordings for better organization and clarity",
      "UI enhancements - Improved layouting for a more intuitive user interface. Clearer and more understandable names for various functions. Scaling fixes for a seamless experience across different devices"
    ],
    bugFixes: [
      "Fixed handling of polluted channels",
      "Improved bitrate overshoot handling",
      "Better Mavlink sysid handling"
    ]
  },
  {
    version: "2.4.1",
    date: "2024-03-10",
    type: "patch",
    title: "Critical Bug Fixes & Enhancements",
    description: "This patch release addresses critical bugs and introduces several enhancements to improve system stability and functionality.",
    newFeatures: [
      "Added Exposure Value (EV) support in libcamera, which can significantly improve image quality",
      "Introduced GPIO26 control functionality",
      "Included Rock5 custom kernels with 8812au/Bu drivers"
    ],
    improvements: [
      "Improved some parameter names in OpenHD. Requires updating both air and ground components",
      "Modified QOpenHD to always show MCS (Modulation and Coding Scheme) information",
      "Added a warning log when automatic video recording on arm/disarm is disabled"
    ],
    bugFixes: [
      "Fixed a bug where selecting custom metering caused a crash in libcamera",
      "Resolved a bug where accidental deletion of recordings could occur during transcoding, and they were not displayed in the web user interface"
    ]
  }
];

function DetailedChangelogSection({ item }) {
  return (
    <section className={styles.changelogSection} id={`v${item.version.replace('.', '-')}`}>
      <div className={styles.sectionHeader}>
        <div className={styles.versionInfo}>
          <div className={`${styles.versionBadge} ${styles[item.type]}`}>
            v{item.version}
          </div>
          <span className={styles.date}>{item.date}</span>
        </div>
        <h2 className={styles.sectionTitle}>{item.title}</h2>
        {item.description && (
          <p className={styles.description}>{item.description}</p>
        )}
      </div>

      <div className={styles.changelogContent}>
        {item.newFeatures && (
          <div className={styles.section}>
            <h3 className={styles.sectionHeading}>🚀 New Features</h3>
            <ul className={styles.featureList}>
              {item.newFeatures.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {item.improvements && (
          <div className={styles.section}>
            <h3 className={styles.sectionHeading}>⚡ Improvements</h3>
            <ul className={styles.featureList}>
              {item.improvements.map((improvement, idx) => (
                <li key={idx}>{improvement}</li>
              ))}
            </ul>
          </div>
        )}

        {item.bugFixes && (
          <div className={styles.section}>
            <h3 className={styles.sectionHeading}>🐛 Bug Fixes</h3>
            <ul className={styles.featureList}>
              {item.bugFixes.map((fix, idx) => (
                <li key={idx}>{fix}</li>
              ))}
            </ul>
          </div>
        )}

        {item.miscellaneous && (
          <div className={styles.section}>
            <h3 className={styles.sectionHeading}>🔧 Miscellaneous</h3>
            <ul className={styles.featureList}>
              {item.miscellaneous.map((misc, idx) => (
                <li key={idx}>{misc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default function ChangelogDetails() {
  return (
    <Layout
      title="Detailed Changelog"
      description="Comprehensive OpenHD release notes and changelog">
      <div className={styles.changelogContainer}>
        <div className={styles.hero}>
          <div className="container">
            <h1>Detailed Changelog</h1>
            <p>Comprehensive release notes for all OpenHD versions</p>
            <Link className={styles.backButton} to="/changelog">
              ← Back to Overview
            </Link>
          </div>
        </div>

        <div className={styles.contentContainer}>
          <div className="container">
            {detailedChangelog.map((item) => (
              <DetailedChangelogSection key={item.version} item={item} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}