# Using Only a USB Camera

This guide covers configuration for OpenHD setups using only USB cameras instead of CSI cameras.

## Overview

USB-only camera setups offer:
- **Plug and Play**: Easy connection without CSI cables
- **Camera Flexibility**: Use various USB camera types
- **Multiple Cameras**: Connect multiple USB cameras
- **Thermal Cameras**: Support for USB thermal imaging

## Supported USB Cameras

### Standard USB Cameras
- **Logitech C920**: Popular choice with H.264 encoding
- **Generic UVC Cameras**: USB Video Class compatible
- **Action Cameras**: Some action cameras with USB output
- **IP Camera Adapters**: USB to IP camera interfaces

### Specialized Cameras
- **Thermal Cameras**: FLIR, Seek Thermal USB cameras
- **High-resolution Cameras**: 4K USB cameras
- **Low-light Cameras**: Specialized night vision USB cameras
- **Multi-spectral Cameras**: Scientific USB cameras

## Configuration

### Camera Detection
1. Connect USB camera to air unit
2. Power on OpenHD system
3. Camera should be auto-detected
4. Verify detection in QOpen.HD settings

### Camera Settings
- **Resolution**: Select appropriate resolution
- **Frame Rate**: Configure FPS for latency/quality balance
- **Encoding**: H.264 hardware encoding preferred
- **Bitrate**: Adjust for range/quality requirements

## Hardware Considerations

### Power Requirements
- **USB Power**: Ensure adequate power supply
- **Power Isolation**: May need powered USB hub
- **Voltage Stability**: USB cameras sensitive to power fluctuations
- **Current Capacity**: Check camera power consumption

### Mounting and Protection
- **Secure Mounting**: USB connectors can be fragile
- **Cable Management**: Secure USB cables properly
- **Environmental Protection**: Weatherproof connections if needed
- **Vibration Isolation**: Protect from flight vibrations

## Performance Characteristics

### Latency
- **Higher Latency**: USB cameras typically have higher latency than CSI
- **Encoding Delays**: Software encoding increases latency
- **USB Overhead**: USB protocol adds processing time
- **Optimization**: Choose cameras with hardware H.264 encoding

### Quality
- **Variable Quality**: Depends on camera and encoding
- **Compression**: USB bandwidth limits may require compression
- **Format Support**: Not all cameras support optimal formats
- **Auto-adjustment**: Some cameras have auto-exposure/focus

## Setup Process

### Air Unit Configuration
1. Connect USB camera to air unit
2. Configure camera settings in OpenHD
3. Set appropriate resolution and bitrate
4. Test video transmission
5. Optimize settings for your application

### Ground Station Setup
1. Ensure ground station can receive video
2. Configure display settings
3. Test video quality and latency
4. Adjust settings as needed

## Troubleshooting

### Common Issues
- **Camera Not Detected**: Check USB connection and compatibility
- **Poor Video Quality**: Adjust resolution and bitrate settings
- **High Latency**: Use cameras with hardware encoding
- **Power Issues**: Ensure adequate power supply

### USB-Specific Problems
- **Connection Stability**: Secure USB connections properly
- **Bandwidth Limitations**: Monitor USB bandwidth usage
- **Driver Issues**: Ensure proper camera drivers
- **Heat Issues**: Monitor camera temperature

## Multi-Camera Setup

### Multiple USB Cameras
- **Dual Camera**: Connect two USB cameras for different views
- **Camera Switching**: Switch between cameras during flight
- **Picture-in-Picture**: Display multiple camera feeds
- **Recording**: Record from multiple cameras simultaneously

### Configuration
1. Connect multiple USB cameras
2. Configure each camera separately
3. Set switching controls
4. Test all camera feeds
5. Optimize bandwidth allocation

## Use Cases

### Thermal Imaging
- **Search and Rescue**: Thermal imaging for SAR operations
- **Industrial Inspection**: Equipment monitoring
- **Wildlife Observation**: Non-intrusive wildlife study
- **Agricultural Monitoring**: Crop health assessment

### High-Resolution Video
- **Cinematic Recording**: High-quality video recording
- **Surveying**: Detailed aerial surveying
- **Real Estate**: Property photography/videography
- **Documentation**: Scientific documentation

:::warning Power Consumption
USB cameras typically consume more power than CSI cameras. Plan battery capacity accordingly.
:::

:::info Compatibility
Not all USB cameras are compatible with OpenHD. Test compatibility before final installation.
:::