# Making a Release

Guidelines for creating and managing OpenHD releases.

## Release Process Overview

The OpenHD release process ensures quality and consistency:
- **Code Freeze**: Stop feature development
- **Testing Phase**: Comprehensive testing
- **Documentation**: Update documentation
- **Release Creation**: Tag and package release
- **Distribution**: Deploy to users

## Pre-Release Checklist

### Code Quality
- [ ] All unit tests passing
- [ ] Integration tests completed
- [ ] Static analysis clean
- [ ] Code review completed
- [ ] Security audit performed

### Documentation
- [ ] User documentation updated
- [ ] API documentation current
- [ ] Changelog prepared
- [ ] Release notes written
- [ ] Migration guide created (if needed)

### Testing Requirements
- [ ] Hardware compatibility verified
- [ ] Performance benchmarks met
- [ ] Regression testing completed
- [ ] Edge case testing performed
- [ ] User acceptance testing done

## Version Numbering

### Semantic Versioning
OpenHD follows semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Incompatible API changes
- **MINOR**: Backward-compatible functionality additions
- **PATCH**: Backward-compatible bug fixes

### Version Examples
```
2.5.1 → 2.5.2 (patch release)
2.5.2 → 2.6.0 (minor release)
2.6.0 → 3.0.0 (major release)
```

### Pre-release Versions
- **Alpha**: 2.6.0-alpha.1 (early development)
- **Beta**: 2.6.0-beta.1 (feature complete, testing)
- **RC**: 2.6.0-rc.1 (release candidate)

## Release Types

### Patch Releases
- **Bug Fixes**: Critical bug corrections
- **Security Updates**: Security vulnerability fixes
- **Documentation**: Minor documentation updates
- **Compatibility**: Hardware compatibility fixes

### Minor Releases
- **New Features**: Backward-compatible new functionality
- **Improvements**: Performance and usability enhancements
- **Hardware Support**: New hardware platform support
- **API Extensions**: New API endpoints or parameters

### Major Releases
- **Breaking Changes**: API or configuration incompatibilities
- **Architecture Changes**: Significant system redesign
- **Protocol Updates**: Communication protocol changes
- **Major Features**: Substantial new functionality

## Build and Packaging

### Image Building
```bash
# Build system images
cd OpenHD-ImageBuilder
./build.sh --platform=rpi --version=2.6.0

# Create image variants
./build.sh --platform=rpi-zero
./build.sh --platform=radxa-zero3w
./build.sh --platform=rock5a
```

### Package Creation
```bash
# Build Debian packages
cd OpenHD
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make package

# Create source packages
make package_source
```

### Quality Assurance
- **Image Testing**: Boot test on all platforms
- **Package Validation**: Install and functionality testing
- **Checksum Generation**: SHA256 checksums for all files
- **Digital Signing**: GPG signatures for security

## Release Documentation

### Changelog Format
```markdown
# OpenHD v2.6.0 - 2024-01-15

## New Features
- Added support for H.265 encoding
- Implemented automatic frequency switching
- Added mobile app dark mode

## Improvements
- Reduced video latency by 15ms
- Improved WiFi stability
- Enhanced OSD customization

## Bug Fixes
- Fixed camera detection on Pi Zero 2W
- Resolved telemetry timeout issues
- Fixed OSD overlay artifacts

## Breaking Changes
- Configuration file format updated
- API endpoint URLs changed
- Minimum kernel version now 5.15

## Known Issues
- USB cameras may have occasional frame drops
- Some Android devices experience connection delays
```

### Release Notes Template
```markdown
# OpenHD v2.6.0 Release Notes

## Overview
This release focuses on performance improvements and new hardware support.

## Installation
[Installation instructions specific to this release]

## Upgrade Path
[Instructions for upgrading from previous versions]

## New Features
[Detailed description of new features]

## Compatibility
[Hardware and software compatibility information]

## Known Issues
[List of known issues and workarounds]

## Migration Guide
[Steps for migrating configurations or data]
```

## GitHub Release Process

### Creating the Release
1. **Prepare Repository**
   ```bash
   git checkout main
   git pull origin main
   git tag -a v2.6.0 -m "Release v2.6.0"
   git push origin v2.6.0
   ```

2. **Create GitHub Release**
   - Navigate to GitHub repository
   - Click "Releases" → "Create a new release"
   - Select tag version
   - Add release title and description
   - Upload release assets

3. **Release Assets**
   - System images (.img files)
   - Debian packages (.deb files)
   - Source code archives
   - Checksums and signatures

### Asset Organization
```
OpenHD-v2.6.0/
├── images/
│   ├── openhd-2.6.0-rpi.img.gz
│   ├── openhd-2.6.0-rpi-zero.img.gz
│   └── openhd-2.6.0-radxa.img.gz
├── packages/
│   ├── openhd_2.6.0_armhf.deb
│   └── qopenhd_2.6.0_amd64.deb
├── checksums/
│   └── SHA256SUMS
└── signatures/
    └── SHA256SUMS.sig
```

## Testing and Validation

### Pre-Release Testing
- **Automated Tests**: CI/CD pipeline validation
- **Hardware Testing**: Test on representative hardware
- **User Testing**: Beta tester feedback
- **Performance Testing**: Latency and throughput validation

### Post-Release Monitoring
- **User Feedback**: Monitor issue reports
- **Performance Metrics**: Track system performance
- **Crash Reports**: Monitor for stability issues
- **Usage Analytics**: Understand feature adoption

## Communication

### Announcement Channels
- **GitHub Release**: Official release announcement
- **Discord**: Community notification
- **Forum Posts**: Detailed discussions
- **Social Media**: Public announcements

### Communication Timeline
- **T-7 days**: Pre-release announcement
- **T-3 days**: Release candidate available
- **T-0**: Official release
- **T+1 day**: Post-release monitoring
- **T+7 days**: Release retrospective

## Hotfix Process

### Critical Issues
For critical bugs requiring immediate fixes:

1. **Create Hotfix Branch**
   ```bash
   git checkout -b hotfix/v2.6.1 v2.6.0
   ```

2. **Apply Fix**
   ```bash
   # Make necessary changes
   git commit -m "Fix critical camera initialization bug"
   ```

3. **Release Hotfix**
   ```bash
   git tag -a v2.6.1 -m "Hotfix v2.6.1"
   git push origin v2.6.1
   ```

### Hotfix Criteria
- **Security vulnerabilities**
- **System stability issues**
- **Data corruption bugs**
- **Hardware compatibility problems**

## Rollback Procedures

### Release Rollback
If a release has critical issues:

1. **Immediate Actions**
   - Remove download links
   - Post warning notifications
   - Provide rollback instructions

2. **User Communication**
   - Clear explanation of issues
   - Rollback instructions
   - Timeline for fix

3. **Technical Rollback**
   - Previous version re-release
   - Configuration migration tools
   - Support documentation

:::warning Release Responsibility
Creating releases requires careful testing and validation. Always follow the complete process to ensure quality.
:::

:::info Automation
Many release steps can be automated using GitHub Actions and CI/CD pipelines to reduce manual errors.
:::