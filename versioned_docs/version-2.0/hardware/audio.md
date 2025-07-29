# Audio

OpenHD 2.0 supports audio transmission alongside video and telemetry data.

## Audio Support

### Audio Input
- **USB Audio Devices**: USB microphones and audio adapters
- **GPIO Audio**: Direct connection to Raspberry Pi GPIO pins
- **I2S Audio**: Digital audio interface for high quality

### Audio Output
- **HDMI Audio**: Audio output through HDMI connection
- **USB Audio**: USB speakers or headphones
- **GPIO Audio**: Analog audio output via GPIO

## Configuration

Audio configuration is typically done through the QOpen.HD application or configuration files.

### Audio Quality Settings
- **Sample Rate**: Typically 44.1kHz or 48kHz
- **Bit Depth**: 16-bit or 24-bit
- **Compression**: Audio codec selection

## Latency Considerations

Audio latency should be matched with video latency for proper synchronization:
- **Low Latency Mode**: Prioritizes minimal delay
- **Quality Mode**: Better audio quality with slightly higher latency

## Hardware Requirements

### USB Audio Adapters
- Compatible with standard USB audio class drivers
- Low latency USB audio interfaces recommended

### Microphones
- **Electret Microphones**: Simple analog microphones
- **USB Microphones**: Digital microphones with built-in ADC
- **Wireless Microphones**: For pilot communication

:::info Audio Bandwidth
Audio transmission will reduce available bandwidth for video. Consider this when configuring video bitrates.
:::

:::warning Feedback Prevention
When using speakers and microphones in close proximity, implement proper feedback prevention measures.
:::