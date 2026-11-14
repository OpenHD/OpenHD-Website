---
title: OpenHD 3.0 Albatross
sidebar_label: Introduction
slug: /
description: Start with the OpenHD 3.0 Albatross manual for Air, Ground, and QOpenHD.
---

![OpenHD 3.0 Albatross startup artwork](./img/startup.webp)

OpenHD carries live video, telemetry, and optionally RC control between an **Air** unit and a **Ground** unit. Air captures and encodes the video. Ground receives the stream and passes it to the display and any configured clients.

| If you are… | Start here |
| --- | --- |
| Moving from Evo or preparing a new unit | [Installation and migration](./installation-guide.md) |
| Selecting a board, camera, or radio | [Boards and images](./hardware/sbcs.md), [cameras](./hardware/cameras.md), and [Wi-Fi adapters](./hardware/wifi-adapters.md) |
| Checking the link for the first time | [First-time setup](./hardware/first-time-setup.md) |
| Configuring a Ground station | [QOpenHD](./ground-station-software/qopenhd.md) and [offline maps](./ground-station-software/offline-maps.md) |

### About the beta

Albatross is the OpenHD 3.0 beta series. Capabilities depend on the image, board, radio, and camera. Use matching builds for Air and Ground when first setting up the link. The manual shows current workflows and calls out older hardware references where they remain useful.
