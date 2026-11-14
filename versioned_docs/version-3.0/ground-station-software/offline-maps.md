# Offline maps

QOpenHD and OpenHD Glide can read `.glidemap` map packages. Select **OpenHD Offline** as the map provider in QOpenHD. This provider serves tiles from installed map packages and needs coverage for the area and zoom you want to use.

## Create a map in QOpenHD

1. Open **OSD & Application → Map → Create offline map** while connected to the internet.
2. Find the region or navigate to it on the preview. Choose **Circle** and a radius, or **Rectangle** and drag the desired area. The package covers the rectangle around the selection.
3. Select the detail and start creation. Larger areas and higher detail take longer and use more storage. Start with the area where you actually fly.
4. After saving, select the installed map and use **Jump to map** to confirm its bounds. Try it before going offline.

## Include a map on a Ground image

On an ImageWriter build with an **Offline maps** entry, open a compatible Shortbread MBTiles extract, select your area and detail, and create a package. In the Ground image’s review step, confirm the package is selected and will fit in the target’s configuration storage. After boot, open QOpenHD and check the map provider and package list.
