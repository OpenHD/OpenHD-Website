import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'introduction',
    'installation-guide',
    {
      type: 'category',
      label: 'General',
      items: [
        'general/features',
        'general/troubleshooting',
        'general/faq',
        'general/software-faq',
        'general/contributing',
        'general/team',
        'general/OpenHD-vs-Alternatives',
      ],
    },
    {
      type: 'category',
      label: 'Hardware',
      items: [
        'hardware/first-time-setup',
        {
          type: 'category',
          label: 'SBCs',
          items: [
            'hardware/sbcs',
            'hardware/raspberry',
            'hardware/ochin',
            'hardware/ochinv2',
            'hardware/X86',
            'hardware/radxa',
            'hardware/custom-hardware',
            {
              type: 'category',
              label: 'Discontinued Hardware',
              items: [
                'hardware/discontinued',
                'hardware/jetson',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Cameras',
          items: [
            'hardware/cameras',
            'hardware/cameras/raspberry-cameras',
            'hardware/cameras/radxa-cameras',
            'hardware/cameras/usb-camera',
            {
              type: 'category',
              label: 'HDMI Cameras',
              items: [
                'hardware/cameras/rpi-hdmi-to-csi',
                'hardware/cameras/hdmi-cameras-rpi',
              ],
            },
            'hardware/cameras/ip-cameras',
            'hardware/cameras/special-camera',
            'hardware/cameras/custom-cameras',
            'hardware/cameras/custom-unmanaged-camera',
            'hardware/cameras/libcamera',
            'hardware/cameras/raspicamsrc',
            'hardware/cameras/v4l2',
          ],
        },
        'hardware/wifi-adapters',
        'hardware/antennas',
        'hardware/flightControllers',
        'hardware/wiring',
        'hardware/displays',
        'hardware/hardware.conf',
        'hardware/TheAnswer',
      ],
    },
    {
      type: 'category',
      label: 'Software Setup',
      items: [
        'software-setup/inav',
        'software-setup/ardupilot',
        'software-setup/betaflight',
        'software-setup/px4',
        'software-setup/recording',
        'software-setup/tx-power',
        'software-setup/mcs-via-rc',
        'software-setup/joystick-rc',
        'software-setup/camera-settings',
        {
          type: 'category',
          label: 'Tethering',
          items: [
            'software-setup/tethering',
            'software-setup/ethernet-hotspot',
            'software-setup/wifi-hotspot',
          ],
        },
        'software-setup/variable-bitrate',
        'software-setup/telemetry-and-osd',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Setup',
      items: [
        'advanced-setup/air-recording',
        'advanced-setup/dual-camera',
        'advanced-setup/ground-power-monitoring',
        'advanced-setup/Joystick',
      ],
    },
    {
      type: 'category',
      label: 'Ground Station Software',
      items: [
        'ground-station-software/qopenhd-osd-backup',
        'ground-station-software/qgroundcontrol',
        'ground-station-software/mission-planner',
        'ground-station-software/tower',
        'ground-station-software/fpv_vr',
        'ground-station-software/gstreamer',
        'ground-station-software/raspberrypi-camera-viewer',
      ],
    },
    {
      type: 'category',
      label: 'Developers Corner',
      items: [
        'developers/porting',
        'developers/radxa-commands',
        'developers/wifi-adresses',
      ],
    },
  ],
};

export default sidebars;
