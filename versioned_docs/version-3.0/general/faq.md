# Albatross FAQ

## Is there a 3.0 image for my hardware?

Use the exact board and role in [ImageWriter](../installation-guide.md). The catalog also contains board entries for configuration purposes. Check that there is a downloadable 3.0 image and that it supports your camera and radio.

## Can I reuse my Evo setup?

Keep your Evo media for rollback and start Air and Ground with matching 3.0 builds. Back up recordings and settings before writing. Establish a working video link on 3.0 before selectively restoring settings.

## Why do Air and Ground show up but there is no video?

The radio link and the video pipeline have separate status. Check Air camera detection and the selected codec and format. If Air shows encoder activity, verify that the Ground client supports the codec. Start with one camera.

## Why are 10 MHz and other controls missing?

The controls depend on the active transport, radio, and device firmware. Use **Link** to see the working options and **Find Air Unit** to scan with the corresponding width.

## How do I set up a second display?

Connect the client to Ground, then configure [tethering](../software-setup/tethering.md) and the receiving application. Verify IP reachability, video, and telemetry separately.
