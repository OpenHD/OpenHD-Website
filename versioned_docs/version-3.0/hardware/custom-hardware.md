# OpenHD hardware

Select the exact X20 or X21 variant in ImageWriter. Some OpenHD hardware images already have a fixed Air role. Check the board revision, camera and intended recovery mode before selecting an artifact.

## X21B updates and recovery

| File | Use |
| --- | --- |
| `.ohd` | Application-only update. |
| `.ohd_base` | Full system update, including the kernel and applications. Use it for camera driver or kernel changes. |
| `firmware-*.zip` | Complete USB recovery image for Loader or MaskROM mode. |

Use ImageWriter’s update flow to place the selected update on a card with enough capacity. The full system update is installed to the inactive slot by the device updater. Use the model-specific USB recovery flow for the firmware ZIP. After an update, confirm the unit’s version, camera detection and link on the bench.
