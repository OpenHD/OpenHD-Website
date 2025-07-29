# Essentials

Essential concepts and tools for OpenHD development.

## Development Environment

### Required Tools
- **Git**: Version control system
- **CMake**: Cross-platform build system
- **GCC/Clang**: C++ compiler
- **Python**: Scripting and build tools
- **Docker**: Containerized development

### IDE Recommendations
- **Visual Studio Code**: With C++ and CMake extensions
- **CLion**: JetBrains C++ IDE
- **Qt Creator**: For Qt-based development
- **Vim/Neovim**: Terminal-based editing

### System Setup
```bash
# Ubuntu/Debian development setup
sudo apt update && sudo apt install -y \
    git cmake build-essential \
    python3-pip python3-venv \
    pkg-config libssl-dev \
    qt6-base-dev qtmultimedia5-dev \
    gstreamer1.0-dev libgstreamer-plugins-base1.0-dev

# Install development tools
pip3 install --user conan meson ninja
```

## Core Concepts

### OpenHD Architecture
- **Air Unit**: Onboard system (transmitter)
- **Ground Unit**: Ground station (receiver)
- **Communication**: Bidirectional RF link
- **Video Pipeline**: Camera → Encoder → RF → Decoder → Display
- **Telemetry**: Flight controller ↔ Ground station

### Key Technologies
- **WFB-ng**: WiFi Broadcast Next Generation
- **GStreamer**: Media framework
- **MAVLink**: Micro Air Vehicle Link protocol
- **Qt**: Cross-platform application framework
- **libcamera**: Camera framework for Linux

### System Components
```
┌─────────────────┐    ┌─────────────────┐
│   Air Unit      │    │  Ground Unit    │
├─────────────────┤    ├─────────────────┤
│ Camera          │    │ Display         │
│ Video Encoder   │◄──►│ Video Decoder   │
│ RF Transmitter  │    │ RF Receiver     │
│ Telemetry       │    │ Ground Software │
│ Flight Control  │    │ User Interface  │
└─────────────────┘    └─────────────────┘
```

## Project Structure

### Repository Organization
```
OpenHD/
├── src/                    # Source code
│   ├── ohd_common/        # Common utilities
│   ├── ohd_video/         # Video pipeline
│   ├── ohd_telemetry/     # Telemetry handling
│   └── ohd_interface/     # Web interface
├── test/                  # Unit tests
├── docs/                  # Documentation
├── scripts/               # Build and utility scripts
├── cmake/                 # CMake modules
└── CMakeLists.txt         # Main build file
```

### Key Directories
- **src/**: Main source code
- **inc/**: Header files
- **test/**: Unit and integration tests
- **docs/**: Technical documentation
- **scripts/**: Build and deployment scripts

## Development Workflow

### Git Workflow
```bash
# Clone repository
git clone https://github.com/OpenHD/OpenHD.git
cd OpenHD

# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push and create pull request
git push origin feature/new-feature
```

### Build Process
```bash
# Configure build
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Debug

# Build project
make -j$(nproc)

# Run tests
make test

# Install (optional)
sudo make install
```

### Testing Strategy
- **Unit Tests**: Test individual components
- **Integration Tests**: Test component interactions
- **Hardware Tests**: Test on actual hardware
- **Performance Tests**: Latency and throughput

## Coding Standards

### C++ Guidelines
- **C++17 Standard**: Use modern C++ features
- **RAII**: Resource Acquisition Is Initialization
- **Smart Pointers**: Prefer std::unique_ptr, std::shared_ptr
- **Const Correctness**: Use const wherever possible
- **Naming**: CamelCase for classes, snake_case for functions

### Code Style Example
```cpp
#include <memory>
#include <string>

namespace openhd {

class VideoEncoder {
public:
    explicit VideoEncoder(const std::string& device_path);
    ~VideoEncoder() = default;

    bool initialize() noexcept;
    void encode_frame(const Frame& frame);

private:
    std::string device_path_;
    std::unique_ptr<EncoderImpl> impl_;
};

} // namespace openhd
```

### Documentation Standards
```cpp
/**
 * @brief Encodes video frames using hardware acceleration
 * 
 * This class provides a high-level interface for video encoding
 * using platform-specific hardware encoders.
 * 
 * @param device_path Path to the video device
 * @return true if initialization successful
 */
class VideoEncoder {
    // Implementation
};
```

## Build System

### CMake Configuration
```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.16)
project(OpenHD VERSION 2.6.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find dependencies
find_package(PkgConfig REQUIRED)
pkg_check_modules(GSTREAMER REQUIRED gstreamer-1.0)

# Add executable
add_executable(openhd
    src/main.cpp
    src/video_pipeline.cpp
    src/telemetry_handler.cpp
)

target_link_libraries(openhd
    ${GSTREAMER_LIBRARIES}
    pthread
)
```

### Cross-Compilation
```bash
# ARM cross-compilation
mkdir build-arm && cd build-arm
cmake .. \
    -DCMAKE_TOOLCHAIN_FILE=../cmake/arm-linux-gnueabihf.cmake \
    -DCMAKE_BUILD_TYPE=Release

make -j$(nproc)
```

## Debugging Tools

### GDB Debugging
```bash
# Compile with debug symbols
cmake .. -DCMAKE_BUILD_TYPE=Debug

# Run with GDB
gdb ./openhd
(gdb) set args --config /etc/openhd/openhd.conf
(gdb) run
(gdb) bt  # backtrace on crash

# Remote debugging
gdbserver :2345 ./openhd
# On host: gdb-multiarch, target remote 192.168.1.10:2345
```

### Valgrind Analysis
```bash
# Memory leak detection
valgrind --leak-check=full ./openhd

# Thread analysis
valgrind --tool=helgrind ./openhd

# Performance profiling
valgrind --tool=callgrind ./openhd
kcachegrind callgrind.out.*
```

### System Debugging
```bash
# Monitor system calls
strace -f ./openhd

# Monitor file operations
inotifywait -m -r /etc/openhd/

# Network debugging
tcpdump -i wlan0 -w capture.pcap
wireshark capture.pcap
```

## Performance Optimization

### Profiling Tools
```bash
# CPU profiling with perf
perf record -g ./openhd
perf report

# GPU profiling (Raspberry Pi)
vcgencmd measure_temp
vcgencmd get_throttled

# Memory profiling
/usr/bin/time -v ./openhd
```

### Optimization Techniques
- **Compiler Flags**: -O3, -march=native
- **Link Time Optimization**: -flto
- **Profile Guided Optimization**: -fprofile-generate/-fprofile-use
- **Memory Alignment**: Align data structures
- **Cache Optimization**: Data locality improvements

### Performance Monitoring
```cpp
#include <chrono>

class PerformanceTimer {
public:
    void start() {
        start_time_ = std::chrono::high_resolution_clock::now();
    }
    
    double elapsed_ms() const {
        auto end = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::microseconds>(
            end - start_time_);
        return duration.count() / 1000.0;
    }

private:
    std::chrono::high_resolution_clock::time_point start_time_;
};
```

## Documentation

### Code Documentation
- **Doxygen**: API documentation generation
- **Markdown**: User documentation
- **Architecture Diagrams**: System design documentation
- **Examples**: Working code examples

### Documentation Generation
```bash
# Generate API documentation
doxygen Doxyfile

# Build user documentation
cd docs && make html

# Serve documentation locally
python3 -m http.server 8000
```

## Continuous Integration

### GitHub Actions
```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Install dependencies
      run: |
        sudo apt update
        sudo apt install -y cmake build-essential
        
    - name: Build
      run: |
        mkdir build && cd build
        cmake .. -DCMAKE_BUILD_TYPE=Release
        make -j$(nproc)
        
    - name: Test
      run: |
        cd build && make test
```

### Code Quality
```bash
# Static analysis with clang-tidy
clang-tidy src/*.cpp -- -I include

# Code formatting with clang-format
clang-format -i src/*.cpp src/*.h

# Security analysis
cppcheck --enable=all src/
```

## Contributing Guidelines

### Pull Request Process
1. **Fork Repository**: Create personal fork
2. **Feature Branch**: Create feature branch
3. **Implement**: Make changes with tests
4. **Test**: Ensure all tests pass
5. **Documentation**: Update documentation
6. **Pull Request**: Submit for review

### Code Review Checklist
- [ ] Follows coding standards
- [ ] Includes appropriate tests
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Performance impact considered

:::info Learning Resources
- OpenHD GitHub repositories
- GStreamer documentation
- MAVLink protocol specification
- Qt documentation
- ARM architecture guides
:::

:::tip Development Tips
Start with small changes and gradually work on larger features. Use the existing codebase as reference for patterns and conventions.
:::