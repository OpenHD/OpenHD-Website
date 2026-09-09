import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './architecture.module.css';

const GitHubIcon = () => <i className="fab fa-github" aria-hidden="true" />;

export default function Architecture(): ReactNode {
  return (
    <Layout title="OpenHD Ecosystem" description="See how OpenHD software, video and hardware work together.">
      <Head><meta name="robots" content="noindex, nofollow" /></Head>
      <main className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.grid} aria-hidden="true" />
          <div className={styles.heroInner}>
            <div className={styles.eyebrow}><span /> Open-source digital FPV</div>
            <h1>One ecosystem.<br /><em>Built for the whole link.</em></h1>
            <p>OpenHD connects cameras, aircraft, radio hardware and pilot displays—without locking the system to one board, one camera or one application.</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="#ecosystem">Meet the ecosystem <i className="fas fa-arrow-down" /></a>
              <a className={styles.secondaryButton} href="https://github.com/OpenHD" target="_blank" rel="noreferrer"><GitHubIcon /> OpenHD on GitHub</a>
            </div>
            <div className={styles.heroFacts}>
              <span><b>H.264 · H.265 · MJPEG</b> video</span>
              <span><b>MAVLink</b> telemetry</span>
              <span><b>Wi-Fi broadcast</b> transport</span>
            </div>
          </div>
        </div>

        <div className={styles.linkSection}>
          <div className={styles.container}>
            <div className={styles.sectionIntro}>
              <small>How the link works</small>
              <h2>Camera to pilot. Nothing unnecessary in between.</h2>
              <p>Video travels one way with minimum delay. Telemetry, settings and RC control travel both ways on the same radio link.</p>
            </div>
            <div className={styles.linkFlow}>
              <div className={styles.flowCard}><span>01</span><i className="fas fa-camera" /><strong>Camera</strong><small>Raw or already encoded</small></div>
              <div className={styles.flowLine}><b>VIDEO</b><i /><i /><i /></div>
              <div className={`${styles.flowCard} ${styles.flowCore}`}><span>02</span><i className="fas fa-plane-up" /><strong>OpenHD Air</strong><small>Prepare + transmit</small></div>
              <div className={`${styles.flowLine} ${styles.radioLine}`}><b>RF + FEC</b><i /><i /><i /></div>
              <div className={`${styles.flowCard} ${styles.flowCore}`}><span>03</span><i className="fas fa-satellite-dish" /><strong>OpenHD Ground</strong><small>Receive + forward</small></div>
              <div className={styles.flowLine}><b>RTP</b><i /><i /><i /></div>
              <div className={styles.flowCard}><span>04</span><i className="fas fa-display" /><strong>Pilot display</strong><small>Decode + OSD</small></div>
            </div>
            <div className={styles.returnPath}><i className="fas fa-arrow-left-long" /><span>MAVLink telemetry · settings · RC control</span><i className="fas fa-arrow-left-long" /></div>
          </div>
        </div>

        <div className={styles.ecosystem} id="ecosystem">
          <div className={styles.container}>
            <div className={styles.sectionIntro}>
              <small>The software</small>
              <h2>Six focused parts. One OpenHD experience.</h2>
              <p>Use the complete system or choose the pieces that fit your hardware and display.</p>
            </div>
            <div className={styles.productGrid}>
              <a className={`${styles.product} ${styles.productPrimary}`} href="https://github.com/OpenHD/OpenHD" target="_blank" rel="noreferrer">
                <div className={styles.productTop}><i className="fas fa-tower-broadcast" /><span>THE CORE</span></div>
                <h3>OpenHD</h3>
                <p>Runs on the air and ground units. It captures video, manages the radio link and moves video, MAVLink telemetry and RC control between both ends.</p>
                <div className={styles.tags}><span>Air</span><span>Ground</span><span>Link</span></div>
                <b>View source <i className="fas fa-arrow-up-right-from-square" /></b>
              </a>
              <a className={styles.product} href="https://github.com/OpenHD/QOpenHD" target="_blank" rel="noreferrer">
                <div className={styles.productTop}><i className="fas fa-gauge-high" /><span>FULL PILOT APP</span></div>
                <h3>QOpenHD</h3>
                <p>The complete cockpit: low-latency video, configurable OSD, maps, telemetry, settings and joystick control across supported platforms.</p>
                <div className={styles.tags}><span>Qt / QML</span><span>OSD</span></div>
                <b>View source <i className="fas fa-arrow-up-right-from-square" /></b>
              </a>
              <a className={styles.product} href="https://github.com/OpenHD/openhd-glide" target="_blank" rel="noreferrer">
                <div className={styles.productTop}><i className="fas fa-layer-group" /><span>NEXT-GEN DISPLAY</span></div>
                <h3>OpenHD Glide</h3>
                <p>A lightweight display stack that separates video, OpenGL ES OSD and LVGL UI for direct, hardware-aware rendering on embedded ground stations.</p>
                <div className={styles.tags}><span>DRM / KMS</span><span>GLES</span><span>LVGL</span></div>
                <b>View source <i className="fas fa-arrow-up-right-from-square" /></b>
              </a>
              <a className={styles.product} href="https://github.com/OpenHD/FPVue_RK3566" target="_blank" rel="noreferrer">
                <div className={styles.productTop}><i className="fas fa-bolt" /><span>MINIMAL VIEWER</span></div>
                <h3>FPVue</h3>
                <p>A focused RTP video viewer for Rockchip ground stations, using the MPP hardware decoder with a small link-statistics OSD.</p>
                <div className={styles.tags}><span>RK3566 / RK3588</span><span>MPP</span></div>
                <b>View source <i className="fas fa-arrow-up-right-from-square" /></b>
              </a>
              <a className={styles.product} href="https://github.com/OpenHD/OpenHD-WebUI" target="_blank" rel="noreferrer">
                <div className={styles.productTop}><i className="fas fa-window-maximize" /><span>IN THE BROWSER</span></div>
                <h3>OpenHD Web UI</h3>
                <p>Manage an OpenHD unit from a browser and access recordings without installing the full pilot application.</p>
                <div className={styles.tags}><span>Web</span><span>Management</span></div>
                <b>View source <i className="fas fa-arrow-up-right-from-square" /></b>
              </a>
              <a className={styles.product} href="https://github.com/OpenHD/OpenHD-SysUtils" target="_blank" rel="noreferrer">
                <div className={styles.productTop}><i className="fas fa-gears" /><span>BELOW THE CORE</span></div>
                <h3>OpenHD SysUtils</h3>
                <p>Connects OpenHD to Linux and the board: first boot, platform detection, updates, partitions, LEDs, Wi-Fi and system configuration.</p>
                <div className={styles.tags}><span>Linux</span><span>Hardware</span></div>
                <b>View source <i className="fas fa-arrow-up-right-from-square" /></b>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.mediaSection}>
          <div className={styles.container}>
            <div className={styles.sectionIntro}>
              <small>The video path</small>
              <h2>Encode only when the source needs it.</h2>
              <p>OpenHD keeps the camera path practical: use a suitable encoded stream directly, or encode raw frames with the best available hardware path.</p>
            </div>
            <div className={styles.mediaChoice}>
              <div className={styles.mediaCard}>
                <div className={styles.mediaIcon}><i className="fas fa-file-video" /></div>
                <small>ALREADY H.264 / H.265 / MJPEG</small>
                <h3>Use the stream</h3>
                <p>When a USB, IP or specialist camera already delivers a usable low-latency stream, OpenHD avoids a pointless decode-and-reencode cycle.</p>
                <div className={styles.path}><span>CAMERA ENCODER</span><i className="fas fa-arrow-right" /><span>RTP + LINK</span></div>
              </div>
              <div className={styles.or}>OR</div>
              <div className={styles.mediaCard}>
                <div className={styles.mediaIcon}><i className="fas fa-microchip" /></div>
                <small>RAW CAMERA FRAMES</small>
                <h3>Encode efficiently</h3>
                <p>For CSI and raw USB sources, OpenHD builds a platform-specific pipeline and uses hardware encoding where the board makes it available.</p>
                <div className={styles.path}><span>RAW SENSOR</span><i className="fas fa-arrow-right" /><span>HW ENCODER</span></div>
              </div>
            </div>
            <div className={styles.techStrip}>
              <div><strong>GStreamer</strong><span>capture, pipelines, RTP and portable media integration</span></div>
              <div><strong>Rockchip MPP</strong><span>native low-latency hardware decoding on supported Rockchip viewers</span></div>
              <div><strong>DRM / KMS</strong><span>direct display planes for embedded ground-station rendering</span></div>
            </div>
          </div>
        </div>

        <div className={styles.cameraSection}>
          <div className={styles.container}>
            <div className={styles.cameraHeader}>
              <div className={styles.sectionIntro}>
                <small>Bring your camera</small>
                <h2>From tiny CSI sensors to thermal payloads.</h2>
                <p>Support is shaped around real aircraft: low light, fixed focus, dual feeds, specialist sensors and cameras that encode for themselves.</p>
              </div>
              <Link className={styles.cameraLink} to="/hardware/cameras">Camera compatibility <i className="fas fa-arrow-right" /></Link>
            </div>
            <div className={styles.cameraGrid}>
              <div><i className="fas fa-camera-retro" /><strong>CSI cameras</strong><span>Raspberry Pi, Arducam, VEYE and board-specific MIPI sensors</span></div>
              <div><i className="fab fa-usb" /><strong>USB cameras</strong><span>Raw UVC and cameras with onboard H.264, H.265 or MJPEG encoding</span></div>
              <div><i className="fas fa-clapperboard" /><strong>HDMI sources</strong><span>Action and specialist cameras connected through supported HDMI-to-CSI bridges</span></div>
              <div><i className="fas fa-temperature-half" /><strong>Thermal + special</strong><span>USB thermal imagers, secondary feeds and custom unmanaged pipelines</span></div>
            </div>
          </div>
        </div>

        <div className={styles.buildSection}>
          <div className={styles.container}>
            <div className={styles.buildCallout}>
              <div><small>Open from image to interface</small><h2>Flash it, extend it, or build every part.</h2><p>Ready-to-use images bring the stack together. Every major software component remains available as source and as independently built packages.</p></div>
              <div className={styles.buildActions}>
                <Link className={styles.primaryButton} to="/downloads">Get OpenHD <i className="fas fa-download" /></Link>
                <a className={styles.secondaryButton} href="https://github.com/OpenHD" target="_blank" rel="noreferrer"><GitHubIcon /> Browse all projects</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
