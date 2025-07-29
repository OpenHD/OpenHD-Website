# Ethernet Hotspot

Ethernet Hotspot provides wired network access to OpenHD video and telemetry data.

## Overview

Ethernet Hotspot enables:
- **Wired Connection**: Stable network connection via Ethernet
- **Higher Bandwidth**: Better performance than WiFi
- **Multiple Device Support**: Connect switches/hubs for multiple devices
- **Reliable Connection**: Less interference than wireless

## Hardware Requirements

### Ethernet Adapter
- **USB-to-Ethernet Adapter**: For Raspberry Pi models without built-in Ethernet
- **Built-in Ethernet**: Pi 3B+, Pi 4 have built-in Gigabit Ethernet
- **Powered Hub**: For multiple device connections

### Cables and Switches
- **Ethernet Cables**: Cat5e or Cat6 recommended
- **Network Switch**: For connecting multiple devices
- **Power Considerations**: Ensure adequate power for all devices

## Configuration

### Network Settings
- **IP Range**: 192.168.2.x
- **Gateway**: 192.168.2.1  
- **DHCP Server**: Automatic IP assignment
- **Subnet Mask**: 255.255.255.0

### Enable Ethernet Hotspot
1. Connect Ethernet adapter/cable
2. Access OpenHD network settings
3. Enable \"Ethernet Hotspot\"
4. Configure IP range if needed
5. Save and restart networking

## Device Connection

### Direct Connection
1. Connect device directly via Ethernet cable
2. Configure network settings (automatic or manual)
3. Access OpenHD services at gateway IP
4. Launch appropriate software

### Through Network Switch
1. Connect OpenHD and devices to network switch
2. Ensure all devices in same IP range
3. Configure device network settings
4. Access OpenHD services

## Ground Control Integration

### Computer Connection
1. Connect computer via Ethernet
2. Launch ground control software
3. Connect to OpenHD IP address (192.168.2.1)
4. Configure MAVLink connection if needed

### Streaming Devices
1. Connect streaming device via Ethernet
2. Configure video input source
3. Set input to OpenHD IP stream
4. Configure resolution and quality settings

## Performance Benefits

### Stability
- **No Wireless Interference**: Immune to RF interference
- **Reliable Connection**: Stable wired connection
- **Consistent Latency**: Predictable network performance

### Bandwidth
- **Higher Throughput**: Better than WiFi in many conditions
- **Full Duplex**: Simultaneous send/receive capability
- **Multiple Streams**: Support for multiple concurrent connections

## Troubleshooting

### Connection Issues
- **Cable Problems**: Check Ethernet cable integrity
- **IP Conflicts**: Verify IP address configuration
- **Adapter Issues**: Test USB-Ethernet adapter functionality
- **Power Problems**: Ensure adequate power supply

### Performance Issues
- **Slow Transfer**: Check cable category and condition
- **High Latency**: Verify network configuration
- **Intermittent Connection**: Check all cable connections

## Use Cases

### Field Operations
- **Ground Control Station**: Stable connection for GCS
- **Video Recording**: Direct connection to recording devices
- **Telemetry Logging**: Reliable data logging setup

### Development and Testing
- **Debug Access**: Direct access for development
- **Performance Testing**: Stable connection for testing
- **Multiple Monitors**: Connect multiple display devices

:::info Power Requirements
Ethernet adapters and connected devices increase power consumption. Plan power budget accordingly.
:::

:::tip Performance Optimization
Use Gigabit Ethernet adapters and Cat6 cables for best performance, especially with high-resolution video streams.
:::