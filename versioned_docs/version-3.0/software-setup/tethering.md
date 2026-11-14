# Tethering to Ground

Connect a QOpenHD or MAVLink client to the Ground unit over an IP network. This connection is separate from the link that carries video and telemetry between Air and Ground.

| Connection | Verify first |
| --- | --- |
| Direct Ethernet | Which endpoint provides addressing and the Ground IP the client should reach |
| LAN or hotspot | Both devices are on the intended network and forwarding is enabled for the destination |
| USB tethering | The USB network interface is present and the client or Ground unit has an address on it |

Open the app’s connection settings and confirm Ground appears before checking Air. If using an external receiver, verify the forwarded codec and port for video and the MAVLink endpoint for telemetry. See [Ethernet](./ethernet-hotspot.md) and [Wi-Fi hotspot](./wifi-hotspot.md).
