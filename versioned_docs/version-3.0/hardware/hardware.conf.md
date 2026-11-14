# Hardware configuration

Use ImageWriter to seed the role, hardware selection, and initial parameter defaults offered by the selected image. Then use QOpenHD or the device’s configuration interface to inspect the live controls.

- **Platform and role** affect which camera, link, and other device settings the image can expose.
- **Initial settings** seed persistent settings on a new installation. Existing persistent settings take precedence when the firmware reopens the same storage.
- **Runtime capabilities** come from the backend and can vary between boards that use the same software version.
- **Application settings** such as HUD layout belong to QOpenHD and can be exported using [Backup & Restore](../ground-station-software/qopenhd-osd-backup.md).

Use the image’s documented configuration path if you need manual overrides. See the [Evo hardware.conf reference](/hardware/hardware.conf) for the older file and keys used by Evo installations.
