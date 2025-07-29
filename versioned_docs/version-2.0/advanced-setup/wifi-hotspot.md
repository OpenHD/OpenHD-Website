# WiFi Hotspot

The WiFi Hotspot feature allows wireless connection of mobile devices and computers to the OpenHD ground station.

## Overview

WiFi Hotspot provides:
- **Wireless Video Access**: Stream video to mobile devices
- **Telemetry Sharing**: Access flight data wirelessly
- **Multiple Device Support**: Connect several devices simultaneously
- **Ground Control Access**: Wireless connection for GCS software

## Default Configuration

### Network Settings
- **SSID**: `Open.HD`
- **Password**: `wifiopenhd`
- **IP Range**: 192.168.1.x
- **Gateway**: 192.168.1.1
- **Channel**: Auto-selected

### Security
- **WPA2-PSK**: Standard WiFi security
- **Custom Password**: Can be changed in settings

## Setup and Configuration

### Enable WiFi Hotspot
1. Access QOpen.HD settings
2. Navigate to Network settings
3. Enable \"WiFi Hotspot\"
4. Configure SSID and password
5. Save and restart system

### Advanced Settings
- **Channel Selection**: Manual channel selection
- **Bandwidth**: 20MHz or 40MHz channel width
- **Power Level**: Adjust transmission power
- **Client Limit**: Maximum connected devices

## Device Connection

### Mobile Devices
1. Search for `Open.HD` WiFi network
2. Connect using password `wifiopenhd`
3. Launch QOpen.HD app
4. Video should stream automatically

### Computers
1. Connect to `Open.HD` WiFi network
2. Configure IP address (automatic or manual)
3. Launch ground control software
4. Connect to ground station IP (192.168.1.1)

## Performance Considerations

### Range Limitations
- **Indoor Range**: 10-30 meters typical
- **Outdoor Range**: 50-100 meters depending on obstacles
- **Interference**: 2.4GHz band subject to WiFi interference

### Bandwidth Sharing
- **Video Quality**: May be reduced with multiple clients
- **Latency**: Additional latency introduced for wireless clients
- **Connection Stability**: Depends on WiFi signal strength

## Troubleshooting

### Connection Issues
- **Wrong Password**: Verify password matches configuration
- **IP Conflicts**: Check for IP address conflicts
- **Range Issues**: Move closer to ground station
- **Interference**: Try different WiFi channels

### Performance Issues
- **Slow Video**: Reduce connected device count
- **High Latency**: Check WiFi signal strength
- **Dropouts**: Minimize interference sources

## Security Considerations

### Password Security
- **Change Default Password**: Use strong, unique password
- **Regular Updates**: Update password periodically
- **Access Control**: Monitor connected devices

### Network Isolation
- **Isolated Network**: Hotspot creates separate network
- **No Internet Access**: Hotspot does not provide internet
- **Local Communication**: Only for OpenHD communication

:::warning Interference
WiFi Hotspot operates on 2.4GHz band and may interfere with OpenHD transmission if using the same frequency. Consider using 5.8GHz for OpenHD when using WiFi hotspot.
:::

:::info Battery Impact
WiFi Hotspot increases power consumption. Monitor battery levels during extended use.
:::