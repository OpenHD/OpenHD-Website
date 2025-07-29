# Antennas

Antenna selection is crucial for optimal OpenHD performance and range.

## Antenna Types

### Omnidirectional Antennas
- **Duck Antennas**: Standard rubber duck antennas for general use
- **Dipole Antennas**: Simple wire antennas for basic setups
- **Cloverleaf/Skew-Planar**: Circular polarized antennas for multipath rejection

### Directional Antennas
- **Yagi Antennas**: High gain directional antennas for long range
- **Panel Antennas**: Flat directional antennas with good gain
- **Patch Antennas**: Compact directional option

## Frequency Bands

### 2.4 GHz Band
- Longer range potential
- Better obstacle penetration
- More crowded frequency band

### 5.8 GHz Band  
- Higher data rates possible
- Less interference from WiFi
- More absorption by obstacles

## Polarization

### Linear Polarization
- Vertical or horizontal orientation
- Must match between TX and RX
- Higher gain possible

### Circular Polarization
- Reduced multipath interference
- Less sensitive to orientation
- Slightly lower gain

## Antenna Gain

Higher gain antennas provide:
- Increased range
- More directional radiation pattern
- Reduced coverage area

:::warning Legal Considerations
Check local regulations for maximum allowed antenna gain and transmission power in your area.
:::

## Connector Types

Common connector types:
- **SMA**: Most common for small WiFi adapters
- **RP-SMA**: Reverse polarity SMA
- **U.FL/IPEX**: Small connectors for internal antennas

:::info
Always ensure impedance matching (typically 50 ohms) between antenna and transmitter.
:::