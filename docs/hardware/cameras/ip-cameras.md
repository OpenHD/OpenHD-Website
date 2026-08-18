# IP cameras

:::warning Important Note
IP camera support has limitations and should be chosen carefully, considering its disadvantages.
:::

IP cameras cannot be automatically detected, as they lack a common protocol like USB cameras. They also require custom scripting for integration and lack support for bitrate adjustments, making them quite bad for long range sytems. They also don't support adjusting the keyframe interval, which can black out your video for several seconds when having any interference.

To implement IP cameras, you can utilize the custom_unmanaged_camera.sh script, which needs to be activated through the [hardware.conf](../hardware.conf.md) configuration.

For advanced users, we have implemented "scripting support," which allows for custom camera pipelines, IP cameras, and general debugging.

Currently, there are several example pipelines available for:

| Camera                |
| --------------------- |
| OpenIPC cameras       |
| General IP cameras    |
| Seek Thermal cameras  |

This feature requires disabling auto-detection and needs manual activation in the `hardware.conf` configuration file.

# OpenHD IP Camera instructions

**Step 1**  
Before setting things in OpenHD, first configure the following things in the IP camera:

Setup static IP for the camera.
Configure a H.264 rtsp stream and test it in a program like VLC or FFplay.

  Streams differ by camera brand and model. Try H264B first, 720p or 1080p with about 2mbs stream. Set the Iframe as low as possible. Disable ANY smartcodec/aicodec features. 
  You will also need to create a user for viewing the stream. That user must be able to authenticate on the webinterface (not an OPENHd requirement but a means to test the login for rtsp)
  Then lookup the format for your IPCAM RTSP Stream from the manufacturer and test with FFPlay, example:
  
  Dahua:```ffplay rtsp://openhduser:openhdpass@192.168.10.202/cam/realmonitor?channel=1```
  
  TPLink:``` ffplay -rtsp_transport tcp -fflags nobuffer -flags low_delay -pix_fmt yuv420p -an rtsp://openhduser:openhdpass@192.168.10.203/stream1```
     
  Some incoming streams need to be reformated or tweaked for use by OpenHD, good luck.
  Ffplay provided by FFMpeg is by far the most forgiving way to diagnose, test and tune your stream. VLC gives limited useful error information these days. 

After that, you are ready to start with OpenHD configuration.

**Step 2** 

To configure the camera, you need to :
  1. Configure a script that starts the network connection to the camera and starts the Gtreamer pipeline. (/boot/openhd/scripts/custom_unmanaged_camera.sh)
  2. Create a service that executes this script when the air sbc is turned on.

To configure the pipeline to the camera you need to modify the script /boot/openhd/custom_unmanaged_camera_old.sh" in air sbc. Copy or Rename it to "custom_unmanaged_camera.sh". 
After that, open the script and you will find different examples of configuration for connection to different cameras.

  a. Modify or Copy "setup_and_stream_ip_cam_siyi_h264" configuration and rename it to your IP Cams prefered name - e.g "setup_and_stream_ipcam_dh()"
  
  b  Now to configure "LOCALIP" and "GATEWAYIP" with the same first 3 numbers as your IP camera IP and with the last number being different in all 3 cases.
  
  c  Then you need to change the stream link in the Gstreamer pipeline command with the correct IP and username/password combo of your camera. (You got this in the ffplay part/web interface of the camera)
  
  The gstreamer configuration should look like this:

custom_unmanaged_camera.sh  .....
```  
setup_and_stream_ip_cam_dh4(){
  # setup networking for your ip camera
  LOCALIP=192.168.10.205
  GATEWAYIP=192.168.10.1
  setup_ethernet_cam_hotspot
  # start streaming, restart in case things go wrong (or the cam might need some time before it is ready)
  while true
  do
    gst-launch-1.0 rtspsrc location='rtsp://openhd:openhduser@192.168.10.202/cam/realmonitor?channel=1' latency=0 ! rtph264depay ! h264parse config-interval=-1 ! rtph264pay mtu=1024 ! udpsink port=5500 host=127.0.0.1
    sleep 5s # don't peg the cpu here, re-launching the pipeline
  done
}
```

**Step 3** 

At the bottom of the script, comment all the configurations and put the name of the new one you have created and save the file. 
```
  # Start the camera pipeline
  setup_and_stream_ip_cam_dh4
  
  echo "Doing nothing"
  sleep 356d
  }
```

Finally, open a terminal and execute the following command:

```bash
sudo chmod +x /boot/openhd/scripts/custom_unmanaged_camera.sh
```

**Step 4** 

To create the service that activates the script you must follow the next steps. 
  Download the following file [custom_unmanaged_camera.service](https://github.com/OpenHD/OpenHD/blob/2.5-evo-rapha/systemd/custom_unmanaged_camera.service) that isn't included in version 2.6.0 of OpenHD. 
  
  You can do it via terminal in the Air unit to your home directory:
  ```cd
    wget https://github.com/OpenHD/OpenHD/blob/2.5-evo-rapha/systemd/custom_unmanaged_camera.service
    sudo cp ./custom_unmanaged_camera.service /etc/systemd/system/*
    sudo systemctl enable custom_unamanaged_camera
    sudo systemctl start custom_unamanaged_camera
  ```
If you choose to download the file and copy it to the SDCard into /etc/systemd/system/ directory while your Air Unit is off then you have to, reinsert the SDCard and turn on air sbc and follow these steps. Connect a monitor and a keyboard to air sbc and exit from kiosk mode using Ctrl+C. After that, activate the new service using "sudo systemctl enable custom_unmanaged_camera" command. Following that, start the service with "sudo systemctl start custom_unmanaged_camera" command.

In either case - to confirm correct operation  "sudo systemctl status custom_unmanaged_camera" command. 

Reboot air sbc with "sudo reboot" and it should be ready.


**Step 5** 

To configure the visualization in QOpenHD go to the menu and setup the camera as DEV=>External, 

# Warning

:::note
The custom unmanaged camera service requires careful testing and doesn't provide automatic functionality right away. It is intended for advanced users and developers who understand its intricacies.
:::

We encourage you to experiment with this feature, but please be aware that it's meant for users with a good understanding of camera pipelines and system integration.



IP-Cameras are not specifically designed for low latency, and many of them have latency upwards of 500ms+, but there are specific cameras available for purchase that have reasonable latency closer to 100-200ms. Remember this latency will be added to the "normal" latency your system has. So most IP-Camera Setups will have 300-600ms latency. It is not recommended to use an IP-Camera as primary camera.
That means the main reason to choose an IP-Camera is to enable some custom features normal Cameras do not support.
