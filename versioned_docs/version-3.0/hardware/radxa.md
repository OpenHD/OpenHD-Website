# Radxa

The Albatross builder lists separate **ROCK 5A**, **ROCK 5B**, **ROCK 3A**, and **Radxa Zero 3W** targets. Choose the matching artifact. Images for different boards carry different boot configuration and drivers.

## Ground

Connect the display and start the Ground client. On builds that include the native Rockchip video path, check that the client reports the intended decoder and that it can display the Air stream. Try the planned resolution and codec before depending on that combination.

## Air

Verify that the image includes a driver and configuration for your sensor and board. Connect one supported sensor and confirm detection and a live picture before changing overlays or adding a second camera. See [Radxa cameras](./cameras/radxa-cameras.md).
