# Change Packet Source on a Pi

Configure packet sources and routing for OpenHD on Raspberry Pi systems.

## Overview

Packet source configuration controls:
- **Data Flow**: How packets are routed through the system
- **Interface Selection**: Which network interfaces handle traffic
- **Protocol Handling**: How different packet types are processed
- **Performance Optimization**: Optimize packet paths for latency

## Packet Sources

### Video Packets
- **Camera Interface**: Direct camera capture
- **Network Stream**: IP camera or network source
- **File Source**: Video file playback
- **Test Pattern**: Generated test video

### Telemetry Packets
- **Serial Interface**: Direct flight controller connection
- **Network Source**: Network-based telemetry
- **UDP Forwarding**: Forwarded telemetry streams
- **MAVLink Proxy**: Proxied MAVLink messages

### Control Packets
- **RC Input**: Radio control signals
- **Network Commands**: Network-based control
- **API Requests**: REST API control packets
- **Emergency Override**: Safety control packets

## Configuration Files

### Main Configuration
```bash
# Edit main OpenHD configuration
sudo nano /boot/openhd/openhd.conf

# Key settings:
VIDEO_SOURCE=camera  # camera, network, file, test
TELEMETRY_SOURCE=serial  # serial, network, udp
RC_SOURCE=network  # network, serial, disabled
```

### Interface Configuration
```bash
# Network interface settings
sudo nano /etc/openhd/interfaces.conf

# Configure specific interfaces:
WIFI_INTERFACE=wlan0
ETHERNET_INTERFACE=eth0
USB_INTERFACE=usb0
```

### Service Configuration
```bash
# OpenHD service configuration
sudo nano /etc/systemd/system/openhd.service

# Environment variables:
Environment="VIDEO_SRC=/dev/video0"
Environment="TELEM_PORT=/dev/ttyS0"
Environment="NETWORK_INTERFACE=wlan0"
```

## Video Source Configuration

### Camera Sources
```bash
# CSI Camera
VIDEO_SOURCE=camera
CAMERA_DEVICE=/dev/video0
CAMERA_FORMAT=h264

# USB Camera
VIDEO_SOURCE=usb
USB_CAMERA_DEVICE=/dev/video1
USB_CAMERA_FORMAT=mjpeg

# Multiple Cameras
PRIMARY_CAMERA=/dev/video0
SECONDARY_CAMERA=/dev/video1
CAMERA_SWITCHING=enabled
```

### Network Sources
```bash
# IP Camera Stream
VIDEO_SOURCE=network
STREAM_URL=rtsp://192.168.1.100:554/stream1
STREAM_USERNAME=admin
STREAM_PASSWORD=password

# UDP Stream
VIDEO_SOURCE=udp
UDP_PORT=5600
UDP_INTERFACE=eth0
```

### File Sources
```bash
# Video File Playback
VIDEO_SOURCE=file
VIDEO_FILE=/home/pi/test_video.mp4
LOOP_PLAYBACK=true
PLAYBACK_RATE=1.0
```

## Telemetry Source Configuration

### Serial Configuration
```bash
# UART/Serial Telemetry
TELEMETRY_SOURCE=serial
SERIAL_DEVICE=/dev/ttyS0
SERIAL_BAUDRATE=57600
SERIAL_PROTOCOL=mavlink

# USB Serial
TELEMETRY_SOURCE=usb_serial
USB_SERIAL_DEVICE=/dev/ttyUSB0
USB_SERIAL_BAUDRATE=115200
```

### Network Configuration
```bash
# UDP Telemetry
TELEMETRY_SOURCE=network
TELEMETRY_PORT=14550
TELEMETRY_PROTOCOL=mavlink
BIND_ADDRESS=0.0.0.0

# TCP Telemetry
TELEMETRY_SOURCE=tcp
TCP_PORT=5760
TCP_HOST=192.168.1.100
```

### Forwarding Configuration
```bash
# Telemetry Forwarding
TELEMETRY_FORWARD=enabled
FORWARD_PORTS=14550,14551,14552
FORWARD_BROADCAST=true
FORWARD_INTERFACES=wlan0,eth0
```

## Control Source Configuration

### RC Control
```bash
# Network RC
RC_SOURCE=network
RC_PORT=14555
RC_PROTOCOL=mavlink

# Serial RC
RC_SOURCE=serial
RC_DEVICE=/dev/ttyAMA0
RC_BAUDRATE=115200
```

### API Control
```bash
# REST API Control
API_CONTROL=enabled
API_PORT=8080
API_AUTHENTICATION=basic
API_USERS_FILE=/etc/openhd/api_users.conf
```

## Advanced Packet Routing

### Packet Filtering
```bash
# Configure packet filters
sudo nano /etc/openhd/packet_filter.conf

# Filter rules:
ALLOW_MAVLINK=true
BLOCK_HTTP=false
RATE_LIMIT_VIDEO=10Mbps
PRIORITY_TELEMETRY=high
```

### Quality of Service (QoS)
```bash
# QoS Configuration
sudo nano /etc/openhd/qos.conf

# Traffic classes:
VIDEO_CLASS=streaming
TELEMETRY_CLASS=interactive
RC_CLASS=realtime
BACKGROUND_CLASS=bulk
```

### Load Balancing
```bash
# Multi-interface load balancing
LOAD_BALANCE=enabled
PRIMARY_INTERFACE=wlan0
SECONDARY_INTERFACE=eth0
FAILOVER_TIMEOUT=5000
```

## Interface Management

### Network Interface Configuration
```bash
# Configure WiFi interface
sudo nano /etc/dhcpcd.conf

# Static IP configuration:
interface wlan0
static ip_address=192.168.1.10/24
static routers=192.168.1.1
static domain_name_servers=8.8.8.8
```

### Interface Bonding
```bash
# Create bonded interface
sudo nano /etc/systemd/network/bond0.netdev

[NetDev]
Name=bond0
Kind=bond

[Bond]
Mode=active-backup
MIIMonitorSec=1s
```

### VLAN Configuration
```bash
# VLAN interface setup
sudo nano /etc/systemd/network/vlan10.netdev

[NetDev]
Name=vlan10
Kind=vlan

[VLAN]
Id=10
```

## Monitoring and Debugging

### Packet Flow Analysis
```bash
# Monitor packet flow
sudo tcpdump -i wlan0 -n

# Monitor specific ports
sudo tcpdump -i any port 14550

# Monitor video streams
sudo tcpdump -i wlan0 -n udp port 5600
```

### Interface Status
```bash
# Check interface status
ip addr show
iwconfig
ifconfig

# Monitor interface statistics
cat /proc/net/dev
netstat -i
```

### Performance Monitoring
```bash
# Network performance
iftop -i wlan0
nload wlan0

# Packet loss analysis
ping -c 100 192.168.1.10
mtr 192.168.1.10
```

## Troubleshooting

### Common Issues

#### No Video Packets
```bash
# Check video source
ls -la /dev/video*
v4l2-ctl --list-devices

# Verify camera permissions
sudo usermod -a -G video openhd

# Test camera directly
gst-launch-1.0 v4l2src device=/dev/video0 ! autovideosink
```

#### Telemetry Connection Issues
```bash
# Check serial connections
ls -la /dev/tty*
sudo minicom -D /dev/ttyS0 -b 57600

# Test UDP telemetry
nc -u -l 14550
netstat -una | grep 14550
```

#### Interface Problems
```bash
# Reset network interfaces
sudo ifdown wlan0 && sudo ifup wlan0

# Restart networking
sudo systemctl restart networking

# Check driver status
lsmod | grep wifi
dmesg | grep wlan
```

### Diagnostic Commands
```bash
# OpenHD status
sudo systemctl status openhd
sudo journalctl -u openhd -f

# Network diagnostics
sudo netstat -tulpn
sudo ss -tulpn

# Process monitoring
ps aux | grep openhd
htop
```

## Configuration Examples

### Complete Air Unit Setup
```bash
# /boot/openhd/openhd.conf
MODE=air
VIDEO_SOURCE=camera
CAMERA_DEVICE=/dev/video0
TELEMETRY_SOURCE=serial
SERIAL_DEVICE=/dev/ttyS0
SERIAL_BAUDRATE=57600
WIFI_INTERFACE=wlan0
FREQUENCY=2412
```

### Ground Station Configuration
```bash
# /boot/openhd/openhd.conf
MODE=ground
VIDEO_SINK=display
DISPLAY_DEVICE=/dev/fb0
TELEMETRY_FORWARD=enabled
FORWARD_PORTS=14550,14551
WIFI_INTERFACE=wlan0
FREQUENCY=2412
```

### Dual Interface Setup
```bash
# Primary interface for video
VIDEO_INTERFACE=wlan0
VIDEO_FREQUENCY=5745

# Secondary interface for telemetry
TELEMETRY_INTERFACE=wlan1
TELEMETRY_FREQUENCY=2412

# Failover configuration
INTERFACE_FAILOVER=enabled
FAILOVER_THRESHOLD=50
```

:::warning Configuration Changes
Always backup your configuration before making changes. Incorrect packet source configuration can disable system functionality.
:::

:::info Testing Required
Test packet source changes thoroughly in a safe environment before deploying to operational systems.
:::