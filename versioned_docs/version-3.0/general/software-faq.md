# Software FAQ

## Where do initial settings come from?

ImageWriter can add role, hardware, and supported parameter defaults before first boot. Its controls depend on the selected image. The running firmware reports the controls it actually supports to QOpenHD.

## Where do I change the OSD?

Open QOpenHD **OSD & Application**. The OSD and its layout are properties of the client application. Use [Backup & Restore](../ground-station-software/qopenhd-osd-backup.md) to export them to a file.

## Why do the Link or Camera screens show different choices on two setups?

The connected radio, camera backend, board, and firmware decide which parameters are writable. Wait for both units to connect and compare the status screen and exact build IDs.

## Why does the map disappear away from Wi-Fi?

Online map providers need internet access. Create or install a map for your area and switch to [OpenHD Offline](../ground-station-software/offline-maps.md) before leaving.
