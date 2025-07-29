# PX4

## General Information

PX4 is an open-source flight control software designed for drones and other unmanned vehicles. It provides advanced flight control capabilities and is fully compatible with OpenHD through MavLink integration.

## Connecting PX4 to OpenHD

To establish a connection between PX4 and OpenHD, you can use the same methods as described for other flight controllers:

1. **Recommended Method**: Utilize the hardware UART from your air unit (e.g., Raspberry Pi) along with one hardware UART from your flight controller.
2. **Alternative Method**: Use a USB cable on supported flight controllers.

### Enabling UART in OpenHD

By default, UART telemetry may be disabled in older OpenHD versions. To enable it:

1. Navigate to the AIR(TMP) Settings registry using QOpenHD
2. Select serial0 and set the correct baud rate that matches your flight controller
3. In OpenHD 2.5 and higher, telemetry is enabled by default on Serial0

### Configuration

PX4 supports bidirectional MavLink communication, which means:
- Settings can be changed via MavLink
- OpenHD-RC functionality is available
- Full telemetry integration works seamlessly

For specific PX4 configuration steps, please refer to the [PX4 documentation](https://docs.px4.io/) and ensure your flight controller firmware supports MavLink telemetry output.