# Ground Recording

Ground Recording allows automatic recording of video and telemetry data on the ground station.

## Overview

Ground Recording provides:
- **Automatic Video Recording**: Record incoming video streams
- **Telemetry Logging**: Save flight data and telemetry
- **Screenshot Capture**: Automatic screenshot functionality
- **USB Storage**: Save recordings to USB storage devices

## Storage Requirements

### USB Storage Device
- **USB Flash Drive**: High-speed USB 3.0 recommended
- **External HDD/SSD**: For longer recording sessions
- **Format**: FAT32 or exFAT for cross-platform compatibility
- **Capacity**: Minimum 8GB, 32GB+ recommended

### File Formats
- **Video**: AVI format with H.264 compression
- **Telemetry**: CSV or binary log format
- **Screenshots**: PNG format
- **Timestamps**: UTC timestamps for synchronization

## Configuration

### Enable Recording
1. Insert USB storage device
2. Access QOpen.HD settings
3. Navigate to Recording settings
4. Enable \"Ground Recording\"
5. Configure recording parameters

### Recording Settings
- **Video Quality**: Bitrate and resolution settings
- **Auto-start**: Begin recording automatically
- **Split Files**: Create new files at intervals
- **Storage Location**: Select USB device

## Recording Features

### Automatic Operation
- **Flight Detection**: Start recording when flight begins
- **Storage Management**: Automatic cleanup of old files
- **Error Handling**: Continue recording despite minor errors
- **Status Indication**: Visual recording status display

### Manual Control
- **Start/Stop Recording**: Manual recording control
- **Screenshot Capture**: Instant screenshot function
- **Bookmark Events**: Mark important moments
- **Quick Access**: Easy recording controls in OSD

## File Organization

### Directory Structure
```
/USB_DRIVE/
├── recordings/
│   ├── 2023-12-01/
│   │   ├── flight_001.avi
│   │   ├── flight_001.csv
│   │   └── screenshots/
│   └── 2023-12-02/
└── logs/
```

### File Naming
- **Date-based**: YYYY-MM-DD format
- **Sequential**: Automatic flight numbering
- **Descriptive**: Include time and duration
- **Synchronized**: Matching names for video/telemetry

## Playback and Analysis

### Video Playback
- **Standard Players**: Compatible with VLC, Windows Media Player
- **Synchronization**: Telemetry overlay during playback
- **Quality**: Original video quality preserved
- **Metadata**: Embedded flight information

### Telemetry Analysis
- **CSV Import**: Import into Excel, MATLAB, etc.
- **Flight Analysis Tools**: Use with Mission Planner, APM Planner
- **Custom Scripts**: Process data with custom tools
- **Visualization**: Create flight path visualizations

## Storage Management

### Space Monitoring
- **Available Space**: Monitor remaining storage
- **Auto-cleanup**: Remove old recordings when space low
- **Warning System**: Alert when storage nearly full
- **Priority System**: Keep recent/important recordings

### Performance Optimization
- **High-speed Storage**: Use fast USB devices
- **Regular Maintenance**: Defragment storage devices
- **Backup Strategy**: Regular backup to permanent storage
- **Storage Health**: Monitor USB device health

## Troubleshooting

### Recording Issues
- **No Recording**: Check USB device connection
- **Corrupted Files**: Verify storage device integrity
- **Missing Audio**: Check audio configuration
- **Sync Issues**: Verify timestamp accuracy

### Storage Problems
- **Full Storage**: Enable auto-cleanup or larger device
- **Slow Performance**: Use faster USB device
- **File System Errors**: Check and repair file system
- **Compatibility**: Ensure proper file system format

:::warning Storage Reliability
Use high-quality USB storage devices for reliable recording. Low-quality devices may fail during important flights.
:::

:::tip Backup Strategy
Regularly backup recordings to permanent storage. USB devices can fail or be lost.
:::