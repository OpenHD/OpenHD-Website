# Telemetry and OSD

OpenHD provides comprehensive telemetry and on-screen display (OSD) functionality to monitor your flight parameters in real-time.

## OSD Elements

The OSD displays various flight information including:

- **RSSI**: Signal strength between air and ground units
- **Packet Loss**: Percentage of lost data packets
- **Video Bitrate**: Current video transmission rate
- **Flight Controller Data**: When connected via MAVLink
  - Altitude
  - Speed
  - Battery voltage
  - GPS coordinates
  - Flight mode

## Telemetry Setup

OpenHD uses MAVLink protocol for telemetry communication with flight controllers. Most modern flight controller firmware supports MAVLink including:

- ArduPilot
- PX4
- Betaflight
- iNav
- Cleanflight

## Configuration

Telemetry settings can be configured through QOpenHD interface:

1. Connect your flight controller to the air unit via UART
2. Configure the baud rate (typically 57600 or 115200)
3. Enable MAVLink output on your flight controller
4. The OSD will automatically display telemetry data when properly connected

## OSD Customization

The OpenHD OSD is fully customizable and high-resolution. You can adjust:

- Position of telemetry elements
- Visibility of specific data fields
- OSD transparency and colors
- Warning thresholds

For detailed configuration steps, refer to your specific flight controller documentation for MAVLink setup.