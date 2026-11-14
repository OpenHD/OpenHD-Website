# Ethernet networking

## Ground to a client

Use **forwarding** mode when another device or a LAN already supplies network addressing. Use **hotspot** mode when the Ground unit is to supply DHCP on the wired interface and your build offers this mode. These are alternative modes for the same interface.

1. Connect the cable and verify that both devices have IP addresses on the same network.
2. Confirm you can reach Ground from the client.
3. Open the client connection or configure its forwarding destination. Test video and MAVLink separately.

## Air to Ground over Ethernet

The Ethernet link transports video and telemetry between the two OpenHD units. That transport is separate from client forwarding. On supported builds, inspect the Ethernet link status and metrics in QOpenHD. Verify peer discovery and throughput before testing a separate receiver.

See [Tethering](./tethering.md) for client checks.
