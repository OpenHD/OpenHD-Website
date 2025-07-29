# Using an IP or USB Camera as Second Camera

Configure secondary cameras for dual-camera OpenHD setups.

## Overview

Secondary camera setups enable:
- **Picture-in-Picture**: Display both cameras simultaneously
- **Camera Switching**: Switch between cameras during flight
- **Different Views**: Wide angle and zoom cameras
- **Specialized Imaging**: Thermal and visible light combination

## Dual Camera Benefits

### Multiple Perspectives
- **Forward and Down**: Navigation and inspection views
- **Wide and Telephoto**: Different field of view options
- **Visible and Thermal**: Combined thermal/visible imaging
- **Pilot and Passenger**: Multiple viewing angles

### Operational Flexibility
- **In-flight Switching**: Change cameras without landing
- **Recording Options**: Record from multiple cameras
- **Redundancy**: Backup camera if primary fails
- **Specialized Tasks**: Different cameras for different missions

## Configuration

### Primary Camera Setup
1. Configure main camera (typically CSI)
2. Set primary video parameters
3. Test primary camera functionality
4. Optimize settings for primary use

### Secondary Camera Configuration
1. Connect USB or IP camera as secondary
2. Configure secondary camera parameters
3. Set switching controls
4. Test dual camera operation

## Hardware Considerations

### Power Requirements
- **Additional Power**: Secondary camera increases power draw
- **Power Distribution**: Ensure adequate power for both cameras
- **Power Management**: Monitor total power consumption
- **Battery Planning**: Account for reduced flight time

### Processing Load
- **CPU Usage**: Dual cameras increase processing requirements
- **Bandwidth**: Monitor total video bandwidth
- **Memory Usage**: Additional camera streams use more RAM
- **Heat Generation**: Increased processing generates more heat

## Camera Switching

### Manual Switching
- **OSD Controls**: Switch cameras via on-screen display
- **RC Channel**: Assign camera switching to RC channel
- **Ground Control**: Switch cameras from ground station
- **Physical Switch**: Hardware switch for camera selection

### Automatic Switching
- **Flight Mode**: Switch based on flight mode
- **Altitude**: Change cameras based on altitude
- **GPS Position**: Location-based camera switching
- **Timer**: Automatic switching at intervals

## Display Options

### Picture-in-Picture (PiP)
- **Main + Inset**: Large main view with small secondary
- **Side-by-Side**: Equal size displays
- **Overlay**: Secondary camera as overlay
- **Custom Layout**: User-defined display arrangement

### Full Screen Switching
- **Seamless Transition**: Quick switching between cameras
- **Fade Effect**: Smooth transitions
- **No Interruption**: Maintain video stream during switch
- **Status Indication**: Show active camera

## Use Cases

### Search and Rescue
- **Thermal + Visible**: Combine thermal and visible cameras
- **Wide + Zoom**: Overview and detail cameras
- **Down + Forward**: Navigation and search cameras
- **Recording**: Record both streams for analysis

### Inspection Tasks
- **Detail + Overview**: Close-up and wide shots
- **Different Angles**: Multiple viewing perspectives  
- **Documentation**: Comprehensive visual documentation
- **Comparison**: Before/after comparisons

### Cinematic Applications
- **Multiple Angles**: Different camera angles for editing
- **Backup Recording**: Redundant recording capability
- **Creative Shots**: Artistic camera combinations
- **Live Switching**: Real-time camera direction

## Technical Limitations

### Bandwidth Constraints
- **Total Bandwidth**: Limited by radio link capacity
- **Quality Trade-offs**: May need reduced quality for dual streams
- **Compression**: Increased compression may be necessary
- **Prioritization**: Primary camera may get priority

### Processing Limitations
- **CPU Capacity**: Dual cameras stress processing capability
- **Frame Rate**: May need reduced frame rates
- **Resolution**: Possible resolution limitations
- **Latency**: Additional processing may increase latency

## Configuration Examples

### Thermal + Visible Setup
```
Primary Camera: CSI (Visible Light)
- Resolution: 1920x1080
- Frame Rate: 30fps
- Bitrate: 8000 kbps

Secondary Camera: USB Thermal
- Resolution: 640x480  
- Frame Rate: 15fps
- Bitrate: 2000 kbps
```

### Wide + Zoom Configuration
```
Primary Camera: CSI Wide Angle
- Resolution: 1280x720
- Frame Rate: 60fps
- Bitrate: 6000 kbps

Secondary Camera: IP Zoom Camera
- Resolution: 1920x1080
- Frame Rate: 30fps
- Bitrate: 4000 kbps
```

## Troubleshooting

### Performance Issues
- **Slow Switching**: Reduce camera resolution/bitrate
- **High Latency**: Optimize processing settings
- **Dropped Frames**: Check total bandwidth usage
- **System Overload**: Monitor CPU and memory usage

### Configuration Problems
- **Camera Not Detected**: Verify connections and compatibility
- **Poor Image Quality**: Adjust compression settings
- **Switching Failures**: Check control channel configuration
- **Sync Issues**: Verify timestamp synchronization

:::warning Resource Usage
Dual cameras significantly increase system resource usage. Monitor performance carefully and adjust settings as needed.
:::

:::info Testing Required
Always test dual camera configurations thoroughly before important flights. Performance may vary with different camera combinations.
:::