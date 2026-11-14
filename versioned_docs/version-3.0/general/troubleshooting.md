# Troubleshooting

## Establish which path is failing

| Symptom | Check in order |
| --- | --- |
| Ground missing | Board power and boot media, local QOpenHD process, client network path if remote |
| Ground visible, Air missing | Air power and boot, antennas and radios, binding settings, link frequency and width |
| Air visible, blank video | Camera connection and detection, Air encoder output, Ground decoding and video routing |
| Video visible, flight controller missing | Serial port selection, TX/RX and ground wiring, protocol, baud, heartbeat |
| Flight controller visible, RC mapping inactive | Source channel values, assigned function and PWM ranges, flight-controller input and failsafe |
| Air recording unavailable | Selected recording destination and free space, camera recording mode, arming status for automatic mode |

Start with the [first-time setup](../hardware/first-time-setup.md) using one camera and a consistent pair of Air/Ground builds. Reproduce the issue on the bench and change one control at a time. Record exact image names and export the logs from both units when reporting the issue. See [Support](../support.md).
