# Raspberry Pi

Select the exact Raspberry Pi board and role in ImageWriter. Check the camera and radio against the image before writing it. The Raspberry Pi build pipeline produces a shared Bullseye image artifact. Confirm the board options exposed for the build you select.

| Role | Check |
| --- | --- |
| Air | The CSI sensor or USB camera is detected and the board can encode the selected mode. |
| Ground | The display works and QOpenHD decodes the selected Air codec and resolution. |
| Compute Module | Select the matching carrier configuration and SD or eMMC flashing workflow. Check the carrier’s camera ports, cable, and power. |

Start with one camera. Use the [Raspberry Pi camera guide](./cameras/raspberry-cameras.md) to identify the backend. For supported CM4 carrier hardware see [Ochin](./ochin.md) and [Ochin v2](./ochinv2.md).
