# USB Tethering

USB Tethering allows sharing the OpenHD video and telemetry connection with external devices.

## Overview

USB Tethering enables:
- **Smartphone/Tablet Connection**: View video on mobile devices
- **Laptop Integration**: Connect computers for ground control
- **Multiple Display Support**: Extend video to additional screens
- **Internet Sharing**: Provide internet access to connected devices

## Setup Requirements

### Hardware
- **USB Cable**: USB-A to USB-C/Micro-USB (device dependent)
- **Compatible Device**: Smartphone, tablet, or computer with USB tethering support
- **Sufficient Power**: Ensure adequate power supply for additional devices

### Software
- **QOpen.HD App**: For mobile devices
- **Ground Control Software**: For computers (QGroundControl, Mission Planner)

## Configuration

### Enable USB Tethering
1. Connect device via USB cable
2. Enable USB tethering in OpenHD settings
3. Configure network settings on connected device
4. Launch appropriate software (QOpen.HD app or GCS)

### Network Configuration
Default network settings:
- **IP Range**: 192.168.42.x
- **Gateway**: 192.168.42.1
- **DHCP**: Automatic IP assignment

## Mobile Device Setup

### Android Devices
1. Connect via USB cable
2. Enable \"USB Tethering\" in device settings
3. Install and launch QOpen.HD app
4. Video should appear automatically

### iOS Devices
1. Connect via USB cable
2. Trust the connected device
3. Install QOpen.HD app (if available)
4. Configure network settings manually if needed

## Computer Integration

### Windows
1. Connect via USB cable
2. Install any required drivers
3. Configure network adapter settings
4. Launch ground control software
5. Connect to OpenHD IP address

### Linux
1. Connect via USB cable
2. Configure USB network interface
3. Set appropriate IP address in range
4. Launch ground control software

### macOS
1. Connect via USB cable
2. Configure USB Ethernet adapter
3. Set network configuration
4. Launch ground control software

## Troubleshooting

### Common Issues
- **No Network Connection**: Check USB cable and device compatibility
- **IP Conflicts**: Ensure unique IP addresses
- **Driver Issues**: Install appropriate USB drivers
- **Power Issues**: Use powered USB hub if needed

### Performance Optimization
- **USB 3.0**: Use USB 3.0 ports for better performance
- **Cable Quality**: Use high-quality USB cables
- **Power Management**: Disable USB power saving

:::info Bandwidth Sharing
USB tethering shares the same video stream as the main display. Multiple connections do not increase bandwidth requirements.
:::

:::warning Power Consumption
Additional connected devices increase power consumption. Monitor battery levels during extended use.
:::