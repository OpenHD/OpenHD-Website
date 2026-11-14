# Telemetry and OSD

## Bring up flight-controller telemetry

1. Wire a compatible UART on the flight controller to Air. Check signal levels and ground, then cross TX to RX and RX to TX.
2. Set the same protocol and baud rate on both sides. Follow the guide for [ArduPilot](./ardupilot.md), [INAV](./inav.md), [Betaflight](./betaflight.md), or [PX4](./px4.md).
3. Open **Status** in QOpenHD. Verify Ground, Air, and flight-controller communication in that order. Move a telemetry value you can observe on the bench and confirm it updates.

## Configure the OSD

Use **OSD & Application** and the HUD’s customization controls to adjust layout, visibility, appearance, and warning settings. Link widgets report the Air–Ground transport. Vehicle widgets depend on the configured flight-controller data stream.

Use the [offline map guide](../ground-station-software/offline-maps.md) for maps and [Backup & Restore](../ground-station-software/qopenhd-osd-backup.md) to export the client layout.
