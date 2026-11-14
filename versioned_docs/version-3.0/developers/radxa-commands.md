Confirm the command applies to the exact Radxa image, OS base, and role. Check the running kernel and board model before using an image- or device-specific command.

#list all planes:


cat /sys/kernel/debug/dri/0/state | grep "plane\["
