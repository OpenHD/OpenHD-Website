# Building an Image

How to build custom OpenHD system images from source.

## Overview

Building custom images allows you to:
- **Custom Hardware**: Support new hardware platforms
- **Feature Modifications**: Add or remove specific features
- **Optimization**: Optimize for specific use cases
- **Development**: Create development and testing images

## Build Environment Setup

### System Requirements
- **Linux Distribution**: Ubuntu 20.04 LTS or newer
- **Disk Space**: Minimum 50GB free space
- **RAM**: 8GB RAM recommended
- **CPU**: Multi-core processor for faster builds
- **Network**: Stable internet connection

### Dependencies Installation
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install build dependencies
sudo apt install -y \
    git \
    build-essential \
    cmake \
    ninja-build \
    pkg-config \
    libssl-dev \
    libusb-1.0-0-dev \
    libpcap-dev \
    libsodium-dev \
    python3-pip \
    python3-setuptools \
    curl \
    wget \
    unzip

# Install cross-compilation tools
sudo apt install -y \
    gcc-arm-linux-gnueabihf \
    g++-arm-linux-gnueabihf \
    gcc-aarch64-linux-gnu \
    g++-aarch64-linux-gnu
```

### Docker Setup (Alternative)
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Pull build container
docker pull openhd/builder:latest
```

## Source Code Setup

### Repository Cloning
```bash
# Clone main repositories
git clone https://github.com/OpenHD/OpenHD-ImageBuilder.git
cd OpenHD-ImageBuilder

# Initialize submodules
git submodule update --init --recursive

# Clone additional repositories
git clone https://github.com/OpenHD/OpenHD.git
git clone https://github.com/OpenHD/QOpenHD.git
git clone https://github.com/OpenHD/wfb-ng.git
```

### Build Configuration
```bash
# Configure build for target platform
cd OpenHD-ImageBuilder
cp config/rpi4.conf config/custom.conf

# Edit configuration
nano config/custom.conf
```

## Platform-Specific Builds

### Raspberry Pi 4/5
```bash
# Build for Raspberry Pi 4
./build.sh --platform=rpi4 --version=custom

# Build for Raspberry Pi 5
./build.sh --platform=rpi5 --version=custom

# Build for Pi Zero 2W
./build.sh --platform=rpi-zero2w --version=custom
```

### Radxa Platforms
```bash
# Build for Radxa Zero 3W
./build.sh --platform=radxa-zero3w --version=custom

# Build for Rock 5A
./build.sh --platform=rock5a --version=custom

# Build for Rock 5B
./build.sh --platform=rock5b --version=custom
```

### Generic ARM64
```bash
# Generic ARM64 build
./build.sh --platform=generic-arm64 --version=custom

# Custom kernel configuration
./build.sh --platform=custom --kernel-config=custom.config
```

## Build Process

### Full Image Build
```bash
# Start complete build process
./build.sh --platform=rpi4 --clean --verbose

# Monitor build progress
tail -f build.log

# Build with specific features
./build.sh --platform=rpi4 --enable-feature=thermal-camera
```

### Component-Specific Builds
```bash
# Build only OpenHD core
./build-component.sh openhd

# Build only QOpenHD
./build-component.sh qopenhd

# Build WFB-ng
./build-component.sh wfb-ng

# Build kernel modules
./build-component.sh kernel-modules
```

### Cross-Compilation
```bash
# Set cross-compilation environment
export CC=arm-linux-gnueabihf-gcc
export CXX=arm-linux-gnueabihf-g++
export AR=arm-linux-gnueabihf-ar
export STRIP=arm-linux-gnueabihf-strip

# Build with cross-compilation
mkdir build-arm && cd build-arm
cmake .. -DCMAKE_TOOLCHAIN_FILE=../cmake/arm-linux-gnueabihf.cmake
make -j$(nproc)
```

## Customization Options

### Feature Configuration
```bash
# Edit feature configuration
nano config/features.conf

# Available features:
ENABLE_THERMAL_CAMERA=yes
ENABLE_DUAL_CAMERA=yes
ENABLE_LTE_SUPPORT=yes
ENABLE_AUDIO_SUPPORT=no
ENABLE_RECORDING=yes
ENABLE_STREAMING=yes
```

### Package Selection
```bash
# Customize package list
nano config/packages.list

# Core packages (required):
openhd-core
wfb-ng
libcamera
gstreamer1.0-plugins

# Optional packages:
thermal-camera-support
lte-modem-drivers
additional-codecs
development-tools
```

### Kernel Configuration
```bash
# Custom kernel config
cp kernel/config-rpi4 kernel/config-custom

# Edit kernel configuration
nano kernel/config-custom

# Build with custom kernel
./build.sh --platform=rpi4 --kernel-config=config-custom
```

## Advanced Build Options

### Multi-Stage Build
```bash
# Stage 1: Base system
./build.sh --stage=base --platform=rpi4

# Stage 2: OpenHD installation
./build.sh --stage=openhd --platform=rpi4

# Stage 3: Optimization and cleanup
./build.sh --stage=optimize --platform=rpi4

# Complete build
./build.sh --stage=all --platform=rpi4
```

### Incremental Builds
```bash
# Build only changed components
./build.sh --incremental --platform=rpi4

# Force rebuild of specific component
./build.sh --rebuild=openhd --platform=rpi4

# Clean specific component
./build.sh --clean-component=qopenhd --platform=rpi4
```

### Debug Builds
```bash
# Build with debug symbols
./build.sh --debug --platform=rpi4

# Build with additional logging
./build.sh --verbose --log-level=debug --platform=rpi4

# Build with development tools
./build.sh --development --platform=rpi4
```

## Build Optimization

### Parallel Builds
```bash
# Use all CPU cores
export MAKEFLAGS="-j$(nproc)"

# Limit parallel jobs
export MAKEFLAGS="-j4"

# Ninja build system
./build.sh --generator=ninja --platform=rpi4
```

### Cache Configuration
```bash
# Enable build cache
export CCACHE_DIR=/home/builder/.ccache
export PATH="/usr/lib/ccache:$PATH"

# Configure cache size
ccache -M 20G

# Show cache statistics
ccache -s
```

### Resource Optimization
```bash
# Optimize for build speed
./build.sh --optimize=speed --platform=rpi4

# Optimize for image size
./build.sh --optimize=size --platform=rpi4

# Balance optimization
./build.sh --optimize=balanced --platform=rpi4
```

## Testing Built Images

### QEMU Emulation
```bash
# Install QEMU
sudo apt install qemu-system-arm qemu-user-static

# Emulate ARM image
qemu-system-arm \
  -M versatilepb \
  -cpu arm1176 \
  -m 512 \
  -kernel kernel.img \
  -dtb bcm2708-rpi-b.dtb \
  -sd openhd-custom.img \
  -append "root=/dev/mmcblk0p2 rw"
```

### Hardware Testing
```bash
# Flash image to SD card
sudo dd if=openhd-custom.img of=/dev/sdX bs=4M status=progress

# Verify image integrity
sudo dd if=/dev/sdX bs=4M count=1000 | md5sum
```

### Automated Testing
```bash
# Run test suite
./test/run-tests.sh --image=openhd-custom.img

# Hardware-in-the-loop testing
./test/hil-test.sh --platform=rpi4 --image=openhd-custom.img
```

## Continuous Integration

### GitHub Actions
```yaml
# .github/workflows/build.yml
name: Build OpenHD Images

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        platform: [rpi4, rpi5, radxa-zero3w]
    
    steps:
    - uses: actions/checkout@v3
    - name: Setup build environment
      run: ./scripts/setup-ci.sh
    - name: Build image
      run: ./build.sh --platform=${{ matrix.platform }}
    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: openhd-${{ matrix.platform }}.img
        path: images/openhd-${{ matrix.platform }}.img
```

### Local CI
```bash
# Set up local CI
./scripts/setup-local-ci.sh

# Run CI pipeline locally
./scripts/run-ci-locally.sh --platform=all
```

## Troubleshooting

### Common Build Issues
```bash
# Out of disk space
df -h
sudo apt clean
docker system prune -a

# Permission issues
sudo chown -R $USER:$USER build/
chmod +x build.sh

# Missing dependencies
./scripts/check-dependencies.sh
sudo apt install -f
```

### Debug Failed Builds
```bash
# Check build logs
less build.log
grep -i error build.log

# Verbose build output
./build.sh --verbose --debug --platform=rpi4

# Interactive debugging
./build.sh --interactive --platform=rpi4
```

### Memory Issues
```bash
# Monitor memory usage
watch free -h

# Increase swap space
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## Distribution

### Image Compression
```bash
# Compress final image
gzip -9 openhd-custom.img

# Create torrent file
mktorrent -a udp://tracker.openhd.app:8080 openhd-custom.img.gz
```

### Checksums and Signatures
```bash
# Generate checksums
sha256sum openhd-custom.img.gz > openhd-custom.img.gz.sha256

# Sign with GPG
gpg --armor --detach-sign openhd-custom.img.gz
```

:::warning Build Time
Full image builds can take 2-6 hours depending on hardware. Plan accordingly and use incremental builds when possible.
:::

:::info Storage Requirements
Building images requires significant disk space. Ensure you have at least 50GB free space before starting.
:::