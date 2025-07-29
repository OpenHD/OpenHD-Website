# Using Only an IP Camera

This guide covers OpenHD configuration using IP cameras as the primary video source.

## Overview

IP camera setups provide:
- **Network Flexibility**: Connect cameras via Ethernet or WiFi
- **High Quality**: Often better image quality than USB cameras
- **Remote Positioning**: Camera can be positioned remotely
- **Advanced Features**: Many IP cameras have built-in features

## Supported IP Cameras

### H.264/H.265 IP Cameras
- **Hikvision**: Professional surveillance cameras
- **Dahua**: Industrial IP cameras
- **Axis**: High-quality network cameras
- **Generic**: ONVIF-compatible IP cameras

### Streaming Protocols
- **RTSP**: Real-Time Streaming Protocol
- **HTTP**: Direct HTTP streaming
- **UDP**: Low-latency UDP streaming
- **RTP**: Real-time Transport Protocol

## Network Configuration

### IP Camera Setup
1. Configure camera IP address
2. Set video encoding parameters
3. Enable streaming protocol (RTSP recommended)
4. Configure authentication if required
5. Test stream accessibility

### OpenHD Configuration
1. Configure IP camera input in OpenHD
2. Set camera stream URL
3. Configure authentication credentials
4. Set video parameters
5. Test video reception

## Connection Methods

### Ethernet Connection
- **Direct Connection**: Camera directly to air unit Ethernet
- **Network Switch**: Multiple devices via switch
- **Power over Ethernet**: PoE for power and data
- **Cable Length**: Consider Ethernet cable limitations

### WiFi Connection
- **Built-in WiFi**: Cameras with integrated WiFi
- **WiFi Bridge**: Convert Ethernet to WiFi
- **Access Point**: Create dedicated network
- **Security**: WPA2/WPA3 encryption recommended

## Stream Configuration

### Video Parameters
- **Resolution**: 1080p, 720p, or custom
- **Frame Rate**: 30fps, 60fps based on requirements
- **Bitrate**: Adjust for network bandwidth
- **GOP Size**: Keyframe interval for latency

### Network Settings
- **Stream URL**: RTSP or HTTP stream address
- **Port Configuration**: Default or custom ports
- **Authentication**: Username/password if required
- **Timeout Settings**: Network timeout parameters

## Quality and Performance

### Advantages
- **High Quality**: Professional camera sensors
- **Low Noise**: Better low-light performance
- **Stability**: Network protocol reliability
- **Features**: Zoom, focus, exposure control

### Limitations
- **Latency**: Network protocols add latency
- **Bandwidth**: High-quality streams require more bandwidth
- **Complexity**: More complex configuration
- **Power**: Requires separate power source

## Power Considerations

### Power over Ethernet (PoE)
- **PoE Standard**: 802.3af, 802.3at, or 802.3bt
- **Power Budget**: Calculate total power requirements
- **PoE Injector**: Add PoE to non-PoE switches
- **Cable Quality**: Use proper PoE-rated cables

### Separate Power Supply
- **DC Power**: 12V or 24V DC power supplies
- **AC Power**: Direct AC power connection
- **Battery Power**: Portable battery solutions
- **Power Management**: Monitor power consumption

## Advanced Features

### Camera Control
- **PTZ Control**: Pan, tilt, zoom functionality
- **Focus Control**: Remote focus adjustment
- **Exposure Control**: Automatic or manual exposure
- **Image Enhancement**: Built-in image processing

### Streaming Options
- **Multiple Streams**: Different quality streams
- **Adaptive Bitrate**: Dynamic quality adjustment
- **Recording**: Built-in recording capabilities
- **Motion Detection**: Trigger recording on motion

## Troubleshooting

### Connection Issues
- **Network Connectivity**: Verify IP configuration
- **Firewall**: Check firewall settings
- **Stream URL**: Verify correct stream address
- **Authentication**: Check credentials

### Performance Problems
- **High Latency**: Optimize stream settings
- **Poor Quality**: Adjust bitrate and resolution
- **Dropped Frames**: Check network bandwidth
- **Freezing**: Verify network stability

## Example Configurations

### Basic RTSP Setup
```
Camera IP: 192.168.1.100
Stream URL: rtsp://192.168.1.100:554/stream1
Username: admin
Password: password123
Resolution: 1920x1080
Bitrate: 5000 kbps
```

### HTTP Streaming
```
Camera IP: 192.168.1.101
Stream URL: http://192.168.1.101/video.cgi
Authentication: Basic
Resolution: 1280x720
Frame Rate: 30fps
```

## Use Cases

### Professional Applications
- **Broadcast**: Professional broadcast cameras
- **Surveillance**: Security and monitoring
- **Industrial**: Equipment monitoring
- **Scientific**: Research applications

### Specialized Imaging
- **Thermal**: Network thermal cameras
- **Multispectral**: Scientific imaging
- **High-speed**: High frame rate cameras
- **360 Degree**: Panoramic cameras

:::warning Network Security
IP cameras can be security vulnerabilities. Use strong passwords and keep firmware updated.
:::

:::info Bandwidth Requirements
High-quality IP camera streams require significant bandwidth. Plan network capacity accordingly.
:::