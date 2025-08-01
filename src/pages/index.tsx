import type {ReactNode} from 'react';
import {useEffect} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import AppDownloadBanner from '@site/src/components/AppDownloadBanner';
import Heading from '@theme/Heading';

// Auto-generated imports by migrate-to-native-ideal-image
import arducamImg from '@site/static/img/arducam.png?formats=avif,webp&w=400,800,1200';
import radxaImg from '@site/static/img/radxa.png?formats=avif,webp&w=400,800,1200';
import veyeImg from '@site/static/img/veye.png?formats=avif,webp&w=400,800,1200';
import sonicmodellImg from '@site/static/img/sonicmodell.png?formats=avif,webp&w=400,800,1200';
import cloudsmithImg from '@site/static/img/cloudsmith.png?formats=avif,webp&w=400,800,1200';
import pcbwayImg from '@site/static/img/pcbway.png?formats=avif,webp&w=400,800,1200';
import digitaloceanImg from '@site/static/img/digitalocean.png?formats=avif,webp&w=400,800,1200';
import stickermuleImg from '@site/static/img/stickermule.png?formats=avif,webp&w=400,800,1200';
import mapleImg from '@site/static/img/maple.png?formats=avif,webp&w=400,800,1200';


import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      {/* Signal Strength Indicator - Right Side */}
      <div className={styles.hudSignal}>
        <div className={styles.hudSignalBar}></div>
        <div className={styles.hudSignalBar}></div>
        <div className={styles.hudSignalBar}></div>
        <div className={styles.hudSignalBar}></div>
        <div className={styles.hudSignalBar}></div>
      </div>
      
      <div className="container">
        <Link to="/introduction" className={styles.heroClickableArea}>
          <Heading as="h1" className="hero__title">
            Digital <span className={styles.heroAccent}>OpenSource</span><br />FPV System
          </Heading>
          <p className="hero__subtitle">
            Experience the freedom of flight with our cutting-edge<br />
            open-source digital FPV ecosystem. Crystal clear video<br />
            transmission, telemetry, and RC control - all in one powerful platform.
          </p>
        </Link>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/introduction">
            <i className="fas fa-rocket" style={{marginRight: '8px'}}></i>
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/downloads">
            <i className="fas fa-download" style={{marginRight: '8px'}}></i>
            Download
          </Link>
          <a
            className="button button--outline button--lg"
            href="https://t.me/OpenHD_User"
            target="_blank"
            rel="noopener noreferrer">
            <i className="fab fa-telegram" style={{marginRight: '8px'}}></i>
            Join Community
          </a>
        </div>
      </div>
      
      {/* Smooth fade to content */}
      <div className={styles.fadeToContent}></div>
    </header>
  );
}

// Information section component with original Jekyll content (OpenSource, Flexible Hardware, etc)
function InformationSection() {
  return (
    <section className={styles.information}>
      <div className="container">
        <div className="row text--center">
          <div className="col col--3">
            <div className={styles.infoCard}>
              <i className={`fas fa-lock-open ${styles.infoIcon}`}></i>
              <h4 className={styles.infoTitle}>OpenSource</h4>
              <p className={styles.infoDescription}>
                Everything about the OpenHD software stack is open source and freely available
                on GitHub. Want to change something? Do it.
              </p>
            </div>
          </div>
          <div className="col col--3">
            <div className={styles.infoCard}>
              <i className={`fas fa-cogs ${styles.infoIcon}`}></i>
              <h4 className={styles.infoTitle}>Flexible Hardware</h4>
              <p className={styles.infoDescription}>
                OpenHD works with a wide range of hardware. Check out the wiki to learn what's
                needed to get started.
              </p>
            </div>
          </div>
          <div className="col col--3">
            <div className={styles.infoCard}>
              <i className={`fas fa-signal ${styles.infoIcon}`}></i>
              <h4 className={styles.infoTitle}>Long Range</h4>
              <p className={styles.infoDescription}>
                OpenHD uses standard 2.4GHz, 5.8GHz and 6GHz(soon) WiFi adapters in a special
                broadcast mode. This makes ranges of more than 50km possible.
              </p>
            </div>
          </div>
          <div className="col col--3">
            <div className={styles.infoCard}>
              <i className={`fas fa-desktop ${styles.infoIcon}`}></i>
              <h4 className={styles.infoTitle}>Advanced OSD</h4>
              <p className={styles.infoDescription}>
                OpenHD features one of the most powerful graphical on screen displays
                available for FPV applications. Give it a try yourself!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features section component with original Jekyll content
function OpenHDFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center" style={{paddingBottom: '2rem'}}>
          <p className={styles.sectionLabel}>What Makes OpenHD so great</p>
          <h2 style={{paddingTop: '0.5rem', paddingBottom: '0.5rem'}}>Explore unlimited possibilities</h2>
          <p className={styles.aboutText}>
            OpenHD is an exceptionally versatile system, adaptable to a wide array of platforms and diverse hardware configurations. 
            Tailored with a strong focus on the FPV hobbyist community, OpenHD remains responsive to valuable feedback from its 
            extensive user base. Its remarkable modularity and user-friendly design render OpenHD an invaluable software solution 
            across various applications, including education, research, and the everyday use of FPV enthusiasts.
          </p>
        </div>
        <div className="row">
          <div className="col col--4">
            <div className={styles.featureCard}>
              <i className={`fas fa-plane-departure ${styles.featureCardIcon}`}></i>
              <h4 className={styles.featureCardTitle}>Long Range</h4>
              <p className={styles.featureCardDescription}>
                OpenHD's groundbreaking transmission system empowers users to achieve remarkable signal ranges. 
                Distances exceeding 50 kilometers are readily attainable with well-optimized configurations.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.featureCard}>
              <i className={`fas fa-camera ${styles.featureCardIcon}`}></i>
              <h4 className={styles.featureCardTitle}>Cameras</h4>
              <p className={styles.featureCardDescription}>
                OpenHD offers extensive support for a variety of cameras and image sensors, creating intriguing 
                opportunities for exploration in areas such as low-light sensitivity, HDR capabilities, and the 
                integration of thermal and global shutter sensors.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.featureCard}>
              <i className={`fas fa-microchip ${styles.featureCardIcon}`}></i>
              <h4 className={styles.featureCardTitle}>Custom Hardware</h4>
              <p className={styles.featureCardDescription}>
                With its dedicated hardware team, OpenHD presents an exclusive avenue for crafting tailored hardware 
                solutions that cater to the specific requirements of FPV enthusiasts, such as the upcoming X20 VTX, 
                which will soon be released.
              </p>
            </div>
          </div>
        </div>
        <div className="row" style={{marginTop: '2rem'}}>
          <div className="col col--4">
            <div className={styles.featureCard}>
              <i className={`fas fa-retweet ${styles.featureCardIcon}`}></i>
              <h4 className={styles.featureCardTitle}>Dynamic Settings</h4>
              <p className={styles.featureCardDescription}>
                OpenHD's distinctive approach to settings management enables seamless adjustments without the need 
                for system reboots. This flexibility empowers users to manually set exposure as the sun sets and 
                dynamically fine-tune the balance between range and quality. And much more.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.featureCard}>
              <i className={`fas fa-laptop-code ${styles.featureCardIcon}`}></i>
              <h4 className={styles.featureCardTitle}>Custom Drivers</h4>
              <p className={styles.featureCardDescription}>
                In pursuit of optimal hardware utilization, OpenHD pioneers custom drivers and kernels, unlocking 
                capabilities beyond standard drivers. This includes enabling all available channels, integrating new 
                cameras, showing exact channel usage and reducing decode latency.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.featureCard}>
              <i className={`fas fa-handshake ${styles.featureCardIcon}`}></i>
              <h4 className={styles.featureCardTitle}>Business Partners</h4>
              <p className={styles.featureCardDescription}>
                Our diverse business partnerships enable developers to pre-test hardware for usability and advantages, 
                benefiting our user community. These collaborations also drive the creation of custom cameras and 
                carrier boards and much more, tailored to community needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// About section component  
function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <div className="container">
        <div className="row">
          <div className="col col--7">
            <h2>We are OpenHD</h2>
            <p>
              OpenHD is a suite of software designed for long-range video transmission,
              telemetry, and RC control. While we originally designed it with hobbyist drones in mind, it can
              be adapted to a wide range of other applications as well.
            </p>
            <p>
              We are an open-source project that has been collaboratively developed by
              a dedicated group of passionate developers who generously contribute their time and expertise.
              It also benefits from a large and supportive community of contributors.
            </p>
            <Link className="button button--primary" to="/general/team">
              Learn More
            </Link>
          </div>
          <div className="col col--5">
            <div className={styles.videoContainer}>
              <iframe 
                width="100%" 
                height="295" 
                src="https://www.youtube.com/embed/5Ht9P3uv5N4" 
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Partners section component
function PartnersSection() {
  const partners = [
    { name: 'Arducam', logo: arducamImg.src, url: 'https://www.arducam.com/openhd/', description: 'Specializes in developing cameras, crafting drivers for new image sensors, and enhancing the FPV experience for all.' },
    { name: 'Radxa', logo: radxaImg.src, url: 'https://radxa.com/', description: 'Known for producing single-board computers and related hardware products. They help us with Hardware support.' },
    { name: 'Veye Imaging', logo: veyeImg.src, url: 'https://www.veye.cc/', description: 'Specializes in developing high quality cameras. They made the first cameras fitted to outdoor usage on the RaspberryPi.' },
    { name: 'SonicModell', logo: sonicmodellImg.src, url: 'http://www.sonicmodell.com/', description: 'Very reputable manufacturer for model planes, they provided us with a testing Platform for OpenHD (AR Wing Pro).' },
    { name: 'Cloudsmith', logo: cloudsmithImg.src, url: 'https://www.cloudsmith.io/', description: 'Platform for securely storing and sharing software packages. It hosts all OpenHD binaries and makes our updating possible.' },
    { name: 'PCBWay', logo: pcbwayImg.src, url: 'https://www.pcbway.com/', description: 'Reliable manufacturing partner, streamlines OpenHD custom hardware prototype production, which helped us with the X20 VTX.' },
    { name: 'DigitalOcean', logo: digitaloceanImg.src, url: 'https://www.digitalocean.com/', description: 'Reliable Webserver provider, hosts OpenHD Websites, Forum and our Images, for worldwide availability.' },
    { name: 'StickerMule', logo: stickermuleImg.src, url: 'https://www.stickermule.com/eu/custom-stickers', description: 'Specializes in high-quality custom printing, particularly custom stickers and labels, helps us with promotional Material.' },
    { name: 'Maple Wireless', logo: mapleImg.src, url: 'https://www.maple-wireless.com/', description: 'Long time Partner and Developer of the Sword Antenna, helps out with great antennas.' },
    { name: 'Linux Automation', logo: useBaseUrl('/img/linuxauto.svg'), url: 'https://www.linux-automation.com/', description: 'Sponsors hardware to allow us to make very precise latency Measurements.' }
  ];

  return (
    <section className={styles.partners}>
      <div className="container">
        <div className="text--center">
          <h2>Our Partners</h2>
          <p>At OpenHD, we are proud to be a non-profit organization dedicated to making FPV accessible to everyone. Our mission is made possible through strategic partnerships with reputable companies.</p>
        </div>
        <div className={styles.partnerGrid}>
          {partners.map((partner, idx) => (
            <div key={idx} className={styles.partnerCard}>
              <a href={partner.url} target="_blank" rel="noopener noreferrer">
                <img src={partner.logo} alt={partner.name} className={styles.partnerLogo} />
              </a>
              <p>{partner.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  
  
  return (
    <Layout
      title="OpenHD - Digital FPV"
      description="Open source digital FPV ecosystem - The ultimate OpenSource Digital Video solution, which doesn't require a doctors degree.">
      <HomepageHeader />
      <main>
        <InformationSection />
        <AppDownloadBanner />
        <OpenHDFeatures />
        <AboutSection />
        <PartnersSection />
        <SocialLinksSection />
      </main>
    </Layout>
  );
}

// Social Links section component (like original Location section)
function SocialLinksSection() {
  const socialLinks = [
    { name: 'Telegram', icon: 'fab fa-telegram', url: 'https://t.me/OpenHD_User' },
    { name: 'Discord', icon: 'fab fa-discord', url: 'https://discord.gg/P9kXs9N2RP' },
    { name: 'Wiki', icon: 'fab fa-wikipedia-w', url: '/introduction' },
    { name: 'Facebook', icon: 'fab fa-facebook', url: 'https://www.facebook.com/groups/openhd' }
  ];

  return (
    <section className={styles.socialSection}>
      <div className="container">
        <div className="row">
          {socialLinks.map((social, idx) => (
            <div key={idx} className="col col--3">
              <div className={styles.socialItem}>
                <div className={styles.socialIcon}>
                  <i className={social.icon}></i>
                </div>
                <div className={styles.socialContent}>
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    <h6>{social.name}</h6>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Professional Footer component
function ProfessionalFooter() {
  return (
    <footer className={styles.professionalFooter}>
      <div className="container">
        <div className="row">
          {/* About Column */}
          <div className="col col--3">
            <div className={styles.footerColumn}>
              <h4>OpenHD</h4>
              <p className={styles.footerDescription}>
                Open source digital FPV ecosystem - The ultimate OpenSource Digital Video solution, 
                which doesn't require a doctors degree.
              </p>
              <div className={styles.footerSocial}>
                <a href="https://www.youtube.com/@OpenHD-Official" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="https://github.com/OpenHD" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>
          </div>

          {/* About Us Links */}
          <div className="col col--3">
            <div className={styles.footerColumn}>
              <h4>About Us</h4>
              <div className={styles.footerLinks}>
                <a href="#features"><i className="fas fa-caret-right"></i> Features</a>
                <a href="/downloads"><i className="fas fa-caret-right"></i> Downloads</a>
                <a href="/general/team"><i className="fas fa-caret-right"></i> Team</a>
                <a href="#partners"><i className="fas fa-caret-right"></i> Partners</a>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div className="col col--3">
            <div className={styles.footerColumn}>
              <h4>Useful Links</h4>
              <div className={styles.footerLinks}>
                <a href="/introduction"><i className="fas fa-caret-right"></i> Documentation</a>
                <a href="/general/faq"><i className="fas fa-caret-right"></i> FAQ</a>
                <a href="/hardware/first-time-setup"><i className="fas fa-caret-right"></i> First Time Setup</a>
                <a href="/changelog"><i className="fas fa-caret-right"></i> Changelog</a>
              </div>
            </div>
          </div>

          {/* Contact Column */}
          <div className="col col--3">
            <div className={styles.footerColumn}>
              <h4>Send us a Message</h4>
              <p className={styles.footerDescription}>
                For partnership or business inquiries, simply reach out to us here.
              </p>
              <a href="mailto:openhd@openhdfpv.org" className={styles.emailButton}>
                <i className="fas fa-envelope"></i> openhd@openhdfpv.org
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
