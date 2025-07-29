# Bidirectional Telemetry

OpenHD 2.0 supports full bidirectional telemetry communication with flight controllers.

## Overview

Bidirectional telemetry allows:
- **Downlink**: Flight controller data to ground station
- **Uplink**: Commands from ground station to flight controller
- **Real-time Parameter Changes**: Modify flight controller settings remotely
- **Mission Planning**: Upload waypoints and missions

## Supported Protocols

### MAVLink
- **MAVLink v1**: Legacy support
- **MAVLink v2**: Recommended protocol with enhanced features
- **Parameter Management**: Read and write flight controller parameters
- **Mission Protocol**: Upload and download missions

### Other Protocols
- **MSP**: MultiWii Serial Protocol support
- **LTM**: Lightweight Telemetry
- **FrSky**: FrSky telemetry protocol

## Configuration

### Flight Controller Setup
Configure your flight controller for telemetry output:
- **ArduPilot**: Set SERIAL ports for MAVLink
- **Betaflight/INAV**: Configure MSP or LTM output
- **PX4**: Enable MAVLink on appropriate UART

### OpenHD Configuration
Configure telemetry settings in QOpen.HD:
- **Protocol Selection**: Choose appropriate telemetry protocol
- **Baud Rate**: Match flight controller settings
- **Port Configuration**: Select correct UART port

## Wiring

### UART Connection
Connect flight controller to Raspberry Pi UART:
- **TX (FC)** → **RX (Pi GPIO 10)**
- **RX (FC)** → **TX (Pi GPIO 8)**
- **GND** → **GND**

:::warning Voltage Levels
Ensure voltage compatibility between flight controller (typically 3.3V) and Raspberry Pi (3.3V). Some older flight controllers use 5V signaling.
:::

## Ground Control Station Integration

### QGroundControl
- Full parameter management
- Mission planning
- Real-time telemetry display

### Mission Planner
- ArduPilot parameter tuning
- Advanced mission planning
- Log analysis

### QOpen.HD
- Built-in telemetry display
- Basic parameter access
- Custom OSD elements

:::info Bandwidth Considerations
Bidirectional telemetry uses uplink bandwidth. High-frequency parameter requests may impact RC control responsiveness.
:::