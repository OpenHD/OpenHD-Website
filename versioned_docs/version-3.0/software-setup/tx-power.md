# TX Power

Change transmit power in the active link’s settings. Hardware capabilities and units depend on the adapter and driver. Recheck displayed power and link health after changing antenna, band, or radio.

**NOTE**: When adjusting the TX (transmit) power settings, it is your responsibility to adhere to the rules and regulations of your country.

## Set the power for the active radio

1. In QOpenHD, open the active **Link** settings and find the transmit power controls for Air or Ground.
2. Select the adapter if the build lists more than one. The device may expose transmit power in milliwatts or as a driver-specific power index.
3. If separate armed and disarmed controls are available, set both and check the values reported by the unit. Use the radio vendor’s limits and confirm that the supply and cooling are adequate.

Historical measurements below are specific to the tested adapter and firmware.

### ASUS (Measured) Power Table
Please note that the following power values apply only to ASUS AC56-USB Wi-Fi cards and may not be applicable to other cards:

- TX Power Index 19: 10-12 mW
- TX Power Index 25: 25-30 mW
- TX Power Index 30: 45-50 mW
- TX Power Index 35: 70-80 mW
- TX Power Index 37: 100-110 mW
- TX Power Index 40: 120-140 mW
- TX Power Index 45: 200-230 mW
- TX Power Index 50: 280-320 mW
- TX Power Index 55: 380-400 mW
- TX Power Index 58: 420-450 mW

### Custom Aliexpress Cards

Please note that the AC180 Cards from aliexpress behave very strange/different:

- TX Power Index 20: low(ish power)
- TX Power Index 22: medium(ish power)
- TX Power Index 26: high power
- TX Power Index 30: maximum(dangerous power)

**NOTE**: It is not possible to use these cards legally in most of the countries, so be cautious

## Other Wi-Fi Cards
