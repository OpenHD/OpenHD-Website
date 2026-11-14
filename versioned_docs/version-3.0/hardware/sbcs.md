# Boards and images

Choose an exact board, role, and target storage in ImageWriter. Board entries in a configuration catalog and downloadable images are separate.

| Family | Check before writing |
| --- | --- |
| [Raspberry Pi](./raspberry.md) and Compute Module | Exact model, CSI camera stack, SD versus eMMC, and role |
| [Radxa](./radxa.md) | Exact ROCK or Zero board, supported storage, and Ground decoder or Air camera backend |
| [x86](./X86.md) | Boot media, UEFI requirements of the image, Ground client, and hardware decoding |
| [OpenHD hardware](./custom-hardware.md) | X20 or X21 variant, fixed role if applicable, and recovery versus update package |
| Luckfox and other embedded boards | Exact variant, SD versus flash, and whether the images are offered for your model |

The 3.0 build workflow includes Raspberry Pi, separate Radxa and x86 targets, and dedicated images or updates for supported OpenHD and embedded hardware. Check the artifact offered for your hardware before starting [installation](../installation-guide.md).
