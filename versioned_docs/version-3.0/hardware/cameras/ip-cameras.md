# IP cameras

1. Connect the camera to Air’s local network and verify its address and video stream on that network.
2. Select the IP camera input in the Air build when available. Configure the camera address and input pipeline supported by that build.
3. Start with one camera and a codec that Ground can decode. Check Air video and Ground display separately.
4. Set bitrate, resolution, and frame rate at the camera when OpenHD forwards the camera’s encoded stream.

Some existing installations use an unmanaged RTP input on UDP 5500. Use that input only when configured on your Air build. Check the camera preset or managed pipeline first on current images.
