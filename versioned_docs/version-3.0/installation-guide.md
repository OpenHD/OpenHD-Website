---
title: Installation and migration
sidebar_label: Installation
slug: /installation
description: Choose and write OpenHD 3.0 Albatross images using ImageWriter.
---

## Prepare an upgrade from Evo

1. Keep your working Evo boot media or make a full copy.
2. Copy Air recordings and export your QOpenHD settings. Record the camera format, radio frequency and width, and flight-controller serial settings separately.
3. Select a 3.0 image for each exact board. Look for `3.0-albatros-beta` in development image names. Confirm the image’s intended role and storage type.
4. Start with a clean 3.0 configuration. Verify the bench setup before restoring settings. Use the [backup guide](./ground-station-software/qopenhd-osd-backup.md) to select what to import.

## Write an image

Use a build of [OpenHD ImageWriter](/downloads) that exposes the image you need. Its current development interface groups images by manufacturer and board. If your build was supplied as a separate file, use the custom image option for that board.

```mermaid
flowchart LR
  Board["Board and 3.0 image"] --> Target["Select target storage"]
  Target --> Options["Review role and initial settings"]
  Options --> Write["Write and verify"]
```

| Target | What to select |
| --- | --- |
| Removable SD or USB media | Choose the actual disk by name and capacity. Writing replaces the contents of that disk. |
| A supported USB recovery device | Put the board into the documented USB recovery mode and select the matching recovery image. |
| X21B update card | Use the update workflow for `.ohd` or `.ohd_base`. Use the complete firmware ZIP for USB recovery. See [OpenHD hardware](./hardware/custom-hardware.md). |

Select **Air** or **Ground** if the image offers a role choice. Fixed-role images already have a role. If you configure a binding phrase, use matching settings on both sides. Choose an explicit camera only when your build requires it. When writing a Ground image, you can also include an [offline map](./ground-station-software/offline-maps.md) if that ImageWriter build offers the option.

Let ImageWriter finish verifying the write, then eject the media. Boot Ground, open its Ground client, then boot Air with the antennas and camera attached. Continue with [first-time setup](./hardware/first-time-setup.md).
