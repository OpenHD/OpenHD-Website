---
title: Install Albatross
sidebar_label: Installation
description: Select, write, and boot OpenHD 3.0 Albatross images for Air and Ground.
---

## Choose your images

Use [OpenHD ImageWriter](/downloads) on your computer. In the image selector, choose the hardware family and exact board for each unit. Look for **OpenHD 3.0** in the release name. Image labels may use the spelling `3.0-albatros-beta…`.

Choose the appropriate **Air** or **Ground** image when the catalog lists the roles separately. If the image supports both roles and ImageWriter asks you to configure one, select **Air** for the camera side and **Ground** for the receiver.

:::tip
If the Albatross build for your board is distributed separately, use ImageWriter's custom image option with the board-specific image. Follow the matching recovery or installation instructions for hardware with internal storage.
:::

## Write the boot media

1. Back up the target media. Writing an image erases its contents.
2. Select the storage device and confirm its capacity and identity before writing.
3. Apply any role or camera options offered for the selected image. If you set a binding phrase, use the same phrase on both sides.
4. Write and verify the image, then eject the device. Repeat for the other unit and label both boot media so you can identify Air and Ground later.

```mermaid
flowchart LR
  A["Select board and Albatross build"] --> B["Confirm Air or Ground role"]
  B --> C["Select target storage"]
  C --> D["Write and verify"]
```

## First boot

Insert the written media into each matching board. Boot the Ground unit and open QOpenHD on a compatible display or client, then boot the Air unit with its camera and antennas attached. Allow the first boot to finish before running the [bench checks](./first-link.md).
