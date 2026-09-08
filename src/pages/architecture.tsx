import React, {useMemo, useState, type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './architecture.module.css';

type Role = 'all' | 'air' | 'ground' | 'client';
type ComponentKind = Exclude<Role, 'all'> | 'shared';

type ComponentInfo = {
  id: string;
  name: string;
  label: string;
  kind: ComponentKind;
  icon: string;
  summary: string;
  detail: string;
  inputs: string[];
  outputs: string[];
  tech: string[];
  source: string;
};

const components: ComponentInfo[] = [
  {
    id: 'video',
    name: 'OHDVideoLib',
    label: 'Capture & encode',
    kind: 'air',
    icon: 'fa-video',
    summary: 'Turns camera output into a low-latency stream built for the radio link.',
    detail: 'Discovers the configured camera, builds the platform-specific capture pipeline, controls encoding and recording, and adapts stream bitrate when the link asks for it.',
    inputs: ['CSI / USB / IP camera', 'Camera settings', 'Link feedback'],
    outputs: ['Encoded RTP video', 'Air recordings', 'Stream statistics'],
    tech: ['GStreamer', 'libcamera-openhd', 'V4L2', 'libusb'],
    source: 'https://github.com/OpenHD/OpenHD/tree/2.7-evo/OpenHD/ohd_video',
  },
  {
    id: 'interface',
    name: 'OHDInterfaceLib',
    label: 'Transport & RF',
    kind: 'shared',
    icon: 'fa-tower-broadcast',
    summary: 'Owns the physical link: discovery, monitor mode, FEC transport and network forwarding.',
    detail: 'Finds supported adapters, configures the active link, moves video and telemetry over broadcast Wi-Fi, and exposes Ethernet or hotspot paths for external clients.',
    inputs: ['Encoded video', 'MAVLink packets', 'RF settings'],
    outputs: ['Broadcast frames', 'Received streams', 'Link statistics'],
    tech: ['wifibroadcast', 'libpcap', 'libsodium', 'libnl', 'Linux drivers'],
    source: 'https://github.com/OpenHD/OpenHD/tree/2.7-evo/OpenHD/ohd_interface',
  },
  {
    id: 'telemetry',
    name: 'OHDTelemetryLib',
    label: 'Telemetry fabric',
    kind: 'shared',
    icon: 'fa-route',
    summary: 'Routes MAVLink between the flight controller, both units and connected applications.',
    detail: 'Handles the bidirectional telemetry path, OpenHD settings messages, local log forwarding, joystick RC data and serial, UDP or TCP endpoints.',
    inputs: ['Flight-controller MAVLink', 'App commands', 'Core status'],
    outputs: ['Bidirectional telemetry', 'Live settings', 'RC control'],
    tech: ['MAVLink', 'UART', 'UDP / TCP', 'Poco'],
    source: 'https://github.com/OpenHD/OpenHD/tree/2.7-evo/OpenHD/ohd_telemetry',
  },
  {
    id: 'common',
    name: 'OHDCommonLib',
    label: 'Shared foundation',
    kind: 'shared',
    icon: 'fa-cubes-stacked',
    summary: 'The common language used by every core module.',
    detail: 'Provides platform and profile discovery, persistent JSON settings, logging, filesystem helpers, action callbacks and the shared types that bind the core together.',
    inputs: ['Platform manifest', 'Persistent settings', 'Runtime state'],
    outputs: ['Profiles', 'Structured logs', 'Shared actions'],
    tech: ['C++17', 'JSON', 'spdlog', 'Filesystem'],
    source: 'https://github.com/OpenHD/OpenHD/tree/2.7-evo/OpenHD/ohd_common',
  },
  {
    id: 'sysutils',
    name: 'openhd_sys_utils',
    label: 'System integration',
    kind: 'shared',
    icon: 'fa-sliders',
    summary: 'A separate privileged service that makes the Linux image hardware-aware.',
    detail: 'Takes care of first boot, platform detection, hostname, partitions, LEDs, Wi-Fi, updates, camera and video utilities, then exposes system state to the core over a local socket.',
    inputs: ['Board & OS state', 'Configuration requests'],
    outputs: ['System operations', 'Status & settings socket'],
    tech: ['C++17', 'systemd', 'Unix socket', 'Linux utilities'],
    source: 'https://github.com/OpenHD/OpenHD-SysUtils',
  },
  {
    id: 'qopenhd',
    name: 'QOpenHD',
    label: 'Pilot experience',
    kind: 'client',
    icon: 'fa-display',
    summary: 'The default companion app for video, OSD and live control of OpenHD settings.',
    detail: 'Receives primary and secondary video streams independently of the core, decodes them, renders a configurable HUD and uses MAVLink to observe and configure air and ground units.',
    inputs: ['RTP video', 'MAVLink telemetry'],
    outputs: ['Decoded video + OSD', 'Settings commands', 'Joystick RC'],
    tech: ['Qt 5.15', 'QML', 'FFmpeg / avcodec', 'GStreamer'],
    source: 'https://github.com/OpenHD/QOpenHD',
  },
  {
    id: 'webui',
    name: 'OpenHD Web UI',
    label: 'Browser control',
    kind: 'client',
    icon: 'fa-window-maximize',
    summary: 'A browser-accessible surface for managing OpenHD and downloaded recordings.',
    detail: 'Complements QOpenHD with a network-native management experience, including unit configuration, status and access to recorded video files.',
    inputs: ['OpenHD network services', 'Recorded files'],
    outputs: ['Browser UI', 'Management actions'],
    tech: ['.NET', 'Angular', 'HTTP', 'Web video'],
    source: 'https://github.com/OpenHD/OpenHD-WebUI',
  },
];

const buildTracks = {
  core: {
    title: 'Build the core',
    eyebrow: 'openhd · C++17 · CMake',
    steps: [
      {n: '01', title: 'Clone with modules', command: 'git clone --recursive https://github.com/OpenHD/OpenHD.git'},
      {n: '02', title: 'Install target dependencies', command: 'sudo ./install_build_dep.sh ubuntu-x86'},
      {n: '03', title: 'Configure & compile', command: 'cd OpenHD && ./build_cmake.sh'},
    ],
    note: 'Use rpi or rock5 instead of ubuntu-x86 for the matching target environment.',
  },
  app: {
    title: 'Build the cockpit',
    eyebrow: 'QOpenHD · Qt/QML · qmake',
    steps: [
      {n: '01', title: 'Clone with modules', command: 'git clone --recurse-submodules https://github.com/OpenHD/QOpenHD.git'},
      {n: '02', title: 'Install dependencies', command: 'bash install_build_dependencies.sh X86'},
      {n: '03', title: 'Build the release', command: './build_qmake.sh'},
    ],
    note: 'The produced desktop binary is placed below build/releases/QOpenHD.',
  },
  image: {
    title: 'Compose an image',
    eyebrow: 'ImageBuilder · staged Linux image',
    steps: [
      {n: '01', title: 'Clone the builder', command: 'git clone https://github.com/OpenHD/OpenHD-ImageBuilder.git'},
      {n: '02', title: 'Enter the workspace', command: 'cd OpenHD-ImageBuilder && sudo -s'},
      {n: '03', title: 'Select a target', command: './build.sh rock5b'},
    ],
    note: 'The builder starts from a base OS, installs packages and services, applies platform changes, then emits a flashable image.',
  },
};

function SectionHeading({kicker, title, body}: {kicker: string; title: string; body: string}) {
  return <div className={styles.sectionHeading}>
    <span>{kicker}</span>
    <h2>{title}</h2>
    <p>{body}</p>
  </div>;
}

function ArchitectureHero() {
  return <header className={styles.hero}>
    <div className={styles.heroGrid} aria-hidden="true" />
    <div className={styles.orbitA} aria-hidden="true" />
    <div className={styles.orbitB} aria-hidden="true" />
    <div className={styles.shell}>
      <div className={styles.heroCopy}>
        <div className={styles.livePill}><i /> Open architecture · 2.7 EVO</div>
        <h1>One link.<br/><em>Every layer visible.</em></h1>
        <p>From photons at the camera to pixels in the pilot’s display—explore the software, protocols and open-source building blocks behind OpenHD.</p>
        <div className={styles.heroActions}>
          <a href="#explore" className={styles.primaryCta}>Explore the stack <i className="fas fa-arrow-down" /></a>
          <a href="https://github.com/OpenHD/OpenHD" target="_blank" rel="noreferrer" className={styles.textCta}><i className="fab fa-github" /> View source</a>
        </div>
        <div className={styles.proofStrip}>
          <div><strong>1</strong><span>core binary</span></div>
          <div><strong>4</strong><span>internal modules</span></div>
          <div><strong>2-way</strong><span>video + data link</span></div>
          <div><strong>GPL</strong><span>open source</span></div>
        </div>
      </div>
      <div className={styles.heroVisual} aria-label="OpenHD air to ground signal overview">
        <div className={styles.scopeCorner}>LIVE STACK / 01</div>
        <div className={styles.aircraftMark}><i className="fas fa-plane" /><span>AIR</span></div>
        <div className={styles.signalCore}>
          <div className={styles.signalPulse} />
          <i className="fas fa-tower-broadcast" />
          <strong>OPENHD</strong>
          <small>BROADCAST LINK</small>
        </div>
        <div className={styles.groundMark}><i className="fas fa-display" /><span>GROUND</span></div>
        <div className={styles.streamReadout}><span>VIDEO</span><b>RTP / H.264 · H.265</b><i /></div>
        <div className={styles.streamReadout}><span>CONTROL</span><b>MAVLink · bidirectional</b><i /></div>
      </div>
    </div>
  </header>;
}

function SignalJourney() {
  const stages = [
    {no: '01', icon: 'fa-camera', title: 'See', meta: 'CAMERA → ENCODER', text: 'A platform-specific pipeline captures CSI, USB or IP video and encodes it close to the sensor.'},
    {no: '02', icon: 'fa-wifi', title: 'Transmit', meta: 'PACKETS → RF', text: 'Video and MAVLink become resilient broadcast traffic with encryption and forward-error correction.'},
    {no: '03', icon: 'fa-satellite-dish', title: 'Receive', meta: 'RF → NETWORK', text: 'The ground unit rebuilds streams, publishes link health and forwards data to connected clients.'},
    {no: '04', icon: 'fa-display', title: 'Experience', meta: 'DECODE → OSD', text: 'QOpenHD decodes video, layers live telemetry over it and turns settings into MAVLink commands.'},
  ];
  return <section className={clsx(styles.journey, 'architecture-journey')} data-architecture-section="journey">
    <div className={styles.shell}>
      <SectionHeading kicker="The signal journey" title="Built as a pipeline. Felt as one system." body="The responsibilities stay modular even when the pilot experience feels immediate." />
      <div className={clsx(styles.journeyTrack, 'architecture-journey-track')} data-journey-track="true">
        {stages.map((stage, i) => <article className={clsx(styles.journeyStage, 'architecture-journey-stage')} data-stage={stage.no} key={stage.no}>
          <div className={styles.stageTop}><span>{stage.no}</span><i className={`fas ${stage.icon}`} /></div>
          <div className={styles.stageLine}>{i < stages.length - 1 && <i />}</div>
          <small>{stage.meta}</small>
          <h3>{stage.title}</h3>
          <p>{stage.text}</p>
        </article>)}
      </div>
    </div>
  </section>;
}

function ComponentExplorer() {
  const [role, setRole] = useState<Role>('all');
  const [activeId, setActiveId] = useState('interface');
  const visible = useMemo(() => components.filter(component => role === 'all' || component.kind === role || component.kind === 'shared' && (role === 'air' || role === 'ground')), [role]);
  const active = components.find(component => component.id === activeId) ?? components[1];

  return <section className={styles.explorer} id="explore">
    <div className={styles.shell}>
      <div className={styles.explorerIntro}>
        <SectionHeading kicker="Inside the stack" title="Pick a layer. See its responsibility." body="Not a maze of services: a deliberately small core, supported by focused system and user-facing applications." />
        <div className={styles.roleSwitch} role="group" aria-label="Filter components by location">
          {(['all', 'air', 'ground', 'client'] as Role[]).map(item => <button key={item} className={role === item ? styles.activeRole : ''} onClick={() => setRole(item)}>{item === 'all' ? 'Full stack' : item}</button>)}
        </div>
      </div>
      <div className={styles.explorerLayout}>
        <div className={styles.componentList}>
          {visible.map(component => <button key={component.id} onClick={() => setActiveId(component.id)} className={clsx(styles.componentButton, active.id === component.id && styles.activeComponent)}>
            <span className={styles.componentIcon}><i className={`fas ${component.icon}`} /></span>
            <span><small>{component.label}</small><strong>{component.name}</strong></span>
            <i className="fas fa-arrow-right" />
          </button>)}
        </div>
        <article className={styles.componentDetail} key={active.id}>
          <div className={styles.detailHeader}>
            <div><span className={styles.detailKind}>{active.kind}</span><h3>{active.name}</h3></div>
            <i className={`fas ${active.icon}`} />
          </div>
          <p className={styles.detailLead}>{active.summary}</p>
          <p>{active.detail}</p>
          <div className={styles.ioGrid}>
            <div><small>Accepts</small>{active.inputs.map(item => <span key={item}><i className="fas fa-arrow-right-to-bracket" />{item}</span>)}</div>
            <div><small>Delivers</small>{active.outputs.map(item => <span key={item}><i className="fas fa-arrow-right-from-bracket" />{item}</span>)}</div>
          </div>
          <div className={styles.techRow}>{active.tech.map(item => <span key={item}>{item}</span>)}</div>
          <a href={active.source} target="_blank" rel="noreferrer" className={styles.sourceLink}>Inspect the source <i className="fas fa-arrow-up-right-from-square" /></a>
        </article>
      </div>
      <div className={styles.coreTruth}>
        <i className="fas fa-circle-info" />
        <p><strong>A useful distinction.</strong> OHDCommonLib, OHDInterfaceLib, OHDTelemetryLib and OHDVideoLib are linked into a single <code>openhd</code> executable. SysUtils, QOpenHD and the Web UI are separate executables around that core.</p>
      </div>
    </div>
  </section>;
}

function RuntimeSection() {
  const columns = [
    {className: styles.airRuntime, eyebrow: 'At altitude', title: 'Air unit', command: 'openhd --air', icon: 'fa-plane-up', items: ['Discovers camera + encoder', 'Reads flight-controller MAVLink', 'Broadcasts video and telemetry', 'Receives settings and RC uplink']},
    {className: styles.groundRuntime, eyebrow: 'On the ground', title: 'Ground unit', command: 'openhd --ground', icon: 'fa-satellite-dish', items: ['Discovers receiving adapters', 'Reconstructs video + data', 'Publishes link statistics', 'Forwards to network clients']},
    {className: styles.clientRuntime, eyebrow: 'In the pilot’s hands', title: 'Clients', command: 'QOpenHD / Web UI', icon: 'fa-gamepad', items: ['Decodes and displays video', 'Renders configurable OSD', 'Changes settings via MAVLink', 'Connects locally or over IP']},
  ];
  return <section className={styles.runtime}>
    <div className={styles.shell}>
      <SectionHeading kicker="Runtime roles" title="Same core. Different mission profile." body="The role is selected at startup; shared code behaves differently at each end of the link." />
      <div className={styles.runtimeGrid}>
        {columns.map(column => <article key={column.title} className={column.className}>
          <div className={styles.runtimeGlow} />
          <i className={`fas ${column.icon} ${styles.runtimeIcon}`} />
          <small>{column.eyebrow}</small>
          <h3>{column.title}</h3>
          <code>{column.command}</code>
          <ul>{column.items.map(item => <li key={item}><i className="fas fa-check" />{item}</li>)}</ul>
        </article>)}
      </div>
    </div>
  </section>;
}

function DependencySection() {
  const groups = [
    {title: 'Media', color: 'cyan', icon: 'fa-circle-play', libs: [['GStreamer', 'Pipeline + RTP media'], ['libcamera-openhd', 'Raspberry Pi camera stack'], ['V4L2 / libusb', 'USB camera access']]},
    {title: 'Radio & network', color: 'violet', icon: 'fa-signal', libs: [['libpcap', 'Raw packet access'], ['libnl', 'Linux Wi-Fi control'], ['libsodium', 'Link cryptography']]},
    {title: 'Application', color: 'amber', icon: 'fa-code', libs: [['Poco', 'Networking + utilities'], ['MAVLink', 'Telemetry protocol'], ['SDL2', 'Input and platform support']]},
  ];
  return <section className={styles.dependencies}>
    <div className={styles.shell}>
      <SectionHeading kicker="Open foundations" title="Proven libraries. Purpose-built glue." body="OpenHD invests engineering effort where generic Linux components stop: deterministic media, broadcast radio and flight-aware control." />
      <div className={styles.dependencyGrid}>
        {groups.map(group => <article key={group.title} className={styles[`dep_${group.color}`]}>
          <div className={styles.depTitle}><i className={`fas ${group.icon}`} /><h3>{group.title}</h3></div>
          {group.libs.map(([name, description]) => <div className={styles.libRow} key={name}><strong>{name}</strong><span>{description}</span></div>)}
        </article>)}
      </div>
      <p className={styles.dependencyNote}><i className="fas fa-terminal" /> Build-time packages also include CMake, a C++ toolchain, autotools and packaging tools. Platform images add patched drivers, codecs and board-specific camera packages as needed.</p>
    </div>
  </section>;
}

function BuildSection() {
  const [track, setTrack] = useState<keyof typeof buildTracks>('core');
  const selected = buildTracks[track];
  return <section className={styles.build} id="build">
    <div className={styles.shell}>
      <div className={styles.buildHeader}>
        <SectionHeading kicker="From source to sky" title="Choose what you want to build." body="Each repository remains independently buildable, while release images bring the complete system together." />
        <div className={styles.buildTabs}>
          <button className={track === 'core' ? styles.activeBuild : ''} onClick={() => setTrack('core')}>Core</button>
          <button className={track === 'app' ? styles.activeBuild : ''} onClick={() => setTrack('app')}>QOpenHD</button>
          <button className={track === 'image' ? styles.activeBuild : ''} onClick={() => setTrack('image')}>Full image</button>
        </div>
      </div>
      <div className={styles.terminal}>
        <div className={styles.terminalBar}><div><i/><i/><i/></div><span>OPENHD / BUILD CONSOLE</span><b>READY</b></div>
        <div className={styles.terminalBody}>
          <div className={styles.buildSummary}><small>{selected.eyebrow}</small><h3>{selected.title}</h3></div>
          <div className={styles.buildSteps}>{selected.steps.map(step => <div className={styles.buildStep} key={step.n}>
            <span>{step.n}</span><div><small>{step.title}</small><code><i>$</i> {step.command}</code></div>
          </div>)}</div>
          <div className={styles.buildNote}><i className="fas fa-lightbulb" />{selected.note}</div>
        </div>
      </div>
    </div>
  </section>;
}

function ClosingSection() {
  return <section className={styles.closing}>
    <div className={styles.closingGrid} aria-hidden="true" />
    <div className={styles.shell}>
      <span>BUILD IT · FLY IT · IMPROVE IT</span>
      <h2>The entire link is yours.</h2>
      <p>Inspect every layer, tune it for your hardware, and contribute the result back to a worldwide open-source FPV community.</p>
      <div>
        <a href="https://github.com/OpenHD/OpenHD" target="_blank" rel="noreferrer" className={styles.primaryCta}><i className="fab fa-github" /> Start with the core</a>
        <Link to="/general/contributing" className={styles.textCta}>Contribution guide <i className="fas fa-arrow-right" /></Link>
      </div>
    </div>
  </section>;
}

export default function Architecture(): ReactNode {
  return <Layout title="Architecture" description="Explore the binaries, libraries and build system behind OpenHD.">
    <Head><meta name="robots" content="noindex, nofollow" /></Head>
    <main className={styles.page}>
      <ArchitectureHero />
      <SignalJourney />
      <ComponentExplorer />
      <RuntimeSection />
      <DependencySection />
      <BuildSection />
      <ClosingSection />
    </main>
  </Layout>;
}
