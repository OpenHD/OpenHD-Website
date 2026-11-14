# Automatic video bitrate

`V_AUTO_BITRATE` enables automatic video bitrate allocation across the links carrying video. When disabled, OpenHD restores the saved per-camera manual bitrates.

The allocator reserves capacity for fixed streams and essential traffic before dividing the adjustable pool between cameras. `V_PRIMARY_PERC` sets the primary camera’s share. Encoder limits still apply. If identical video is sent over multiple transports, the lowest available budget constrains it.

## Check the result in QOpenHD

1. Open the active link and inspect its usage and reported capacity.
2. Check the target bitrate and received picture for each camera.
3. If a camera supplies a fixed stream, change its own encoder settings to reduce the load. If you use manual bitrate, leave headroom for overhead and other traffic.

Wi-Fi broadcast estimates capacity from link settings including MCS and FEC. Ethernet and other transports use their own measurements or estimates.
