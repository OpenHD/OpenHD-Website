# Updating Package on a Pi

How to update OpenHD packages on Raspberry Pi systems.

## Overview

Package updates allow you to:
- **Install Latest Features**: Get newest functionality
- **Apply Bug Fixes**: Resolve known issues  
- **Security Updates**: Install security patches
- **Performance Improvements**: Benefit from optimizations

## Update Methods

### APT Package Updates
The standard method using the package manager:

```bash
# Update package lists
sudo apt update

# Upgrade OpenHD packages
sudo apt upgrade openhd

# Full system upgrade
sudo apt full-upgrade
```

### Manual Package Installation
Install specific .deb packages:

```bash
# Download package
wget https://github.com/OpenHD/OpenHD/releases/download/v2.6.0/openhd_2.6.0_armhf.deb

# Install package
sudo dpkg -i openhd_2.6.0_armhf.deb

# Fix dependencies if needed
sudo apt-get install -f
```

### Development Package Updates
For development versions:

```bash
# Add development repository
echo "deb [trusted=yes] https://repo.openhd.app/dev /" | sudo tee /etc/apt/sources.list.d/openhd-dev.list

# Update and install
sudo apt update
sudo apt install openhd-dev
```

## Pre-Update Preparation

### Backup Configuration
```bash
# Backup OpenHD configuration
sudo cp -r /boot/openhd/ ~/openhd-config-backup/
sudo cp -r /etc/openhd/ ~/openhd-etc-backup/

# Backup custom settings
cp ~/.config/qopenhd.conf ~/qopenhd-backup.conf
```

### Check System Status
```bash
# Check available space
df -h

# Check running services
sudo systemctl status openhd

# Verify current version
openhd --version
```

### Network Connectivity
```bash
# Test internet connection
ping -c 3 github.com

# Check repository access
sudo apt update
```

## Update Process

### Standard Update Procedure
```bash
# 1. Stop OpenHD services
sudo systemctl stop openhd
sudo systemctl stop openhd-interface

# 2. Update package lists
sudo apt update

# 3. Check for OpenHD updates
apt list --upgradable | grep openhd

# 4. Perform update
sudo apt upgrade openhd

# 5. Restart services
sudo systemctl start openhd
sudo systemctl start openhd-interface
```

### Selective Package Updates
```bash
# Update only OpenHD core
sudo apt install --only-upgrade openhd

# Update QOpenHD
sudo apt install --only-upgrade qopenhd

# Update WFB-ng
sudo apt install --only-upgrade wfb-ng
```

## Handling Update Issues

### Dependency Conflicts
```bash
# Fix broken dependencies
sudo apt --fix-broken install

# Force package configuration
sudo dpkg --configure -a

# Clean package cache
sudo apt clean
sudo apt autoclean
```

### Configuration Conflicts
```bash
# Keep current configuration
# Choose 'N' when prompted about config file replacement

# View configuration differences
sudo dpkg --configure openhd
# Choose 'D' to see differences

# Manually merge configurations
sudo nano /etc/openhd/openhd.conf
```

### Service Restart Issues
```bash
# Check service status
sudo systemctl status openhd

# View service logs
sudo journalctl -u openhd -f

# Manual service restart
sudo systemctl restart openhd

# Reload systemd if needed
sudo systemctl daemon-reload
```

## Post-Update Verification

### System Functionality
```bash
# Verify OpenHD version
openhd --version

# Check service status
sudo systemctl status openhd
sudo systemctl status openhd-interface

# Test video pipeline
gst-launch-1.0 videotestsrc ! autovideosink
```

### Configuration Validation
```bash
# Validate configuration files
openhd --check-config

# Test telemetry connection
mavproxy.py --master=udp:127.0.0.1:14550

# Verify camera detection
v4l2-ctl --list-devices
```

### Network Connectivity
```bash
# Check WiFi interface
iwconfig

# Verify hotspot functionality
sudo systemctl status hostapd

# Test ground station connection
ping 192.168.1.10
```

## Version-Specific Updates

### Major Version Updates
For updates between major versions (e.g., 2.x to 3.x):

```bash
# Review breaking changes
curl -s https://api.github.com/repos/OpenHD/OpenHD/releases/latest | grep "body"

# Backup entire system
sudo dd if=/dev/mmcblk0 of=~/full-backup-$(date +%Y%m%d).img bs=4M

# Perform update with caution
sudo apt dist-upgrade
```

### Beta/Development Updates
```bash
# Add beta repository
echo "deb [trusted=yes] https://repo.openhd.app/beta /" | sudo tee /etc/apt/sources.list.d/openhd-beta.list

# Pin specific versions if needed
sudo apt-mark hold openhd-core

# Install beta version
sudo apt install openhd=2.6.0-beta.1
```

## Rollback Procedures

### Package Rollback
```bash
# List available versions
apt list -a openhd

# Downgrade to specific version
sudo apt install openhd=2.5.2

# Hold version to prevent automatic updates
sudo apt-mark hold openhd
```

### Configuration Rollback
```bash
# Restore configuration backup
sudo rm -rf /boot/openhd/
sudo cp -r ~/openhd-config-backup/ /boot/openhd/

# Restart services
sudo systemctl restart openhd
```

### Full System Rollback
```bash
# Restore from image backup
sudo dd if=~/full-backup-20240115.img of=/dev/mmcblk0 bs=4M

# Or restore from apt snapshot
sudo apt install aptitude
sudo aptitude versions openhd
```

## Automation

### Automatic Updates
```bash
# Enable unattended upgrades
sudo apt install unattended-upgrades

# Configure for OpenHD packages
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

### Update Scripts
```bash
#!/bin/bash
# openhd-update.sh

echo "Starting OpenHD update..."

# Stop services
sudo systemctl stop openhd

# Update packages
sudo apt update
sudo apt upgrade -y openhd

# Restart services
sudo systemctl start openhd

# Verify installation
if systemctl is-active --quiet openhd; then
    echo "Update successful!"
else
    echo "Update failed - check logs"
    sudo journalctl -u openhd --no-pager -l
fi
```

## Monitoring Updates

### Package Status
```bash
# Check package versions
dpkg -l | grep openhd

# View package information
apt show openhd

# Check for security updates
sudo unattended-upgrade --dry-run
```

### System Health
```bash
# Monitor system resources
htop

# Check disk usage
df -h

# Monitor temperature
vcgencmd measure_temp

# Check memory usage
free -h
```

## Remote Updates

### SSH Updates
```bash
# Connect via SSH
ssh pi@192.168.1.10

# Run update remotely
sudo apt update && sudo apt upgrade -y openhd

# Reboot if needed
sudo reboot
```

### Web Interface Updates
- Access OpenHD web interface
- Navigate to System → Updates
- Click "Check for Updates"
- Follow on-screen instructions

:::warning Update Caution
Always backup your configuration before major updates. Test updates on a development system first when possible.
:::

:::tip Scheduled Updates
Consider scheduling updates during maintenance windows to avoid disrupting active operations.
:::