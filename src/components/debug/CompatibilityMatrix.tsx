/**
 * Optimized Compatibility Matrix Component
 * Uses virtualization for better performance with large datasets
 */

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { 
  SBCComponent, 
  CameraComponent, 
  WiFiComponent, 
  CompatibilityResult 
} from '../../types/hardware-configurator';
import { hardwareConfiguratorService } from '../../services/HardwareConfiguratorService';
import styles from './CompatibilityMatrix.module.css';

interface CompatibilityMatrixProps {
  type: 'camera' | 'wifi';
  sbcs: SBCComponent[];
  components: CameraComponent[] | WiFiComponent[];
  className?: string;
}

interface MatrixData {
  sbcs: SBCComponent[];
  components: (CameraComponent | WiFiComponent)[];
  type: 'camera' | 'wifi';
  compatibilityCache: Map<string, CompatibilityResult>;
}

export const CompatibilityMatrix: React.FC<CompatibilityMatrixProps> = ({
  type,
  sbcs,
  components,
  className
}) => {
  const [selectedCell, setSelectedCell] = useState<{sbc: string, component: string} | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<SBCComponent | CameraComponent | WiFiComponent | null>(null);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [showOnlyCompatible, setShowOnlyCompatible] = useState(false);

  // Track window width for responsive calculations
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    // Set initial width
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Memoized compatibility cache to avoid recalculating
  const compatibilityCache = useMemo(() => {
    const cache = new Map<string, CompatibilityResult>();
    
    sbcs.forEach(sbc => {
      components.forEach(component => {
        const key = `${sbc.id}-${component.id}`;
        const result = type === 'camera' 
          ? hardwareConfiguratorService.checkSBCCameraCompatibility(sbc.id, component.id)
          : hardwareConfiguratorService.checkSBCWiFiCompatibility(sbc.id, component.id);
        cache.set(key, result);
      });
    });
    
    return cache;
  }, [sbcs, components, type]);

  const matrixData: MatrixData = useMemo(() => ({
    sbcs,
    components,
    type,
    compatibilityCache
  }), [sbcs, components, type, compatibilityCache]);

  const handleCellClick = useCallback((sbc: string, component: string) => {
    setSelectedCell({ sbc, component });
  }, []);

  const handleComponentClick = useCallback((component: SBCComponent | CameraComponent | WiFiComponent, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedComponent(component);
  }, []);

  // Filter components based on compatibility if needed
  const filteredComponents = useMemo(() => {
    return components; // For now, show all components
  }, [components]);

  return (
    <div className={`${styles.matrixContainer} ${className || ''}`}>
      <div className={styles.matrixHeader}>
        <h3>
          {type === 'camera' ? '🔗 SBC ↔ Camera' : '📡 SBC ↔ WiFi'} Compatibility Matrix
        </h3>
        <div className={styles.matrixStats}>
          {sbcs.length} SBCs × {components.length} {type === 'camera' ? 'Cameras' : 'WiFi Adapters'}
        </div>
      </div>

      <div className={styles.matrixLegend}>
        <h4>📋 Compatibility Legend</h4>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendSample} ${styles.compatibleCell}`}>
              <span className={styles.statusIcon}>✓</span>
            </div>
            <span>Compatible</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendSample} ${styles.warningCell}`}>
              <span className={styles.statusIcon}>⚠</span>
            </div>
            <span>Compatible with warnings</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendSample} ${styles.incompatibleCell}`}>
              <span className={styles.statusIcon}>✗</span>
            </div>
            <span>Incompatible (subtle stripes for accessibility)</span>
          </div>
        </div>
      </div>

      {/* Desktop: Horizontal scroll table with sticky columns */}
      <div className={styles.desktopTable}>
        <div className={styles.tableContainer}>
          <table className={styles.responsiveTable}>
            <thead>
              <tr>
                <th className={styles.stickyColumn}>
                  <div className={styles.filterControls}>
                    <span>SBC / {type === 'camera' ? 'Camera' : 'WiFi'}</span>
                    <button 
                      className={styles.filterToggle}
                      onClick={() => setShowOnlyCompatible(!showOnlyCompatible)}
                      title="Toggle to show only compatible combinations"
                    >
                      {showOnlyCompatible ? '🔍 All' : '✓ Compatible Only'}
                    </button>
                  </div>
                </th>
                {filteredComponents.map((component) => (
                  <th 
                    key={component.id}
                    className={`${styles.componentHeader} ${styles.clickableHeader}`}
                    title={`${component.name} - Click for details`}
                    onClick={(e) => handleComponentClick(component, e)}
                  >
                    <div className={styles.headerContent}>
                      <div className={styles.componentName}>
                        {getShortName(component.name)}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sbcs.map((sbc) => {
                const hasCompatibleComponents = showOnlyCompatible ? 
                  filteredComponents.some(comp => compatibilityCache.get(`${sbc.id}-${comp.id}`)?.compatible) :
                  true;
                
                if (!hasCompatibleComponents) return null;

                return (
                  <tr key={sbc.id}>
                    <td 
                      className={`${styles.stickyColumn} ${styles.sbcHeader} ${styles.clickableHeader}`}
                      title={`${sbc.name} - Click for details`}
                      onClick={(e) => handleComponentClick(sbc, e)}
                    >
                      <div className={styles.sbcInfo}>
                        <div className={styles.sbcName}>{sbc.name}</div>
                        <div className={styles.sbcMeta}>
                          <span className={styles.interfacesTag}>
                            {sbc.interfaces.slice(0, 2).join(', ')}
                            {sbc.interfaces.length > 2 && '...'}
                          </span>
                          <StatusBadge status={sbc.status} />
                        </div>
                      </div>
                    </td>
                    {filteredComponents.map((component) => {
                      const result = compatibilityCache.get(`${sbc.id}-${component.id}`);
                      const isCompatible = result?.compatible;
                      const hasWarnings = result?.warnings.length > 0;
                      
                      if (showOnlyCompatible && !isCompatible) {
                        return <td key={`${sbc.id}-${component.id}`} className={styles.hiddenCell}></td>;
                      }

                      const compatibilityClass = isCompatible 
                        ? (hasWarnings ? styles.warningCell : styles.compatibleCell)
                        : styles.incompatibleCell;

                      return (
                        <td 
                          key={`${sbc.id}-${component.id}`}
                          className={`${styles.matrixCell} ${compatibilityClass}`}
                          onClick={() => handleCellClick(sbc.id, component.id)}
                          title={isCompatible ? (hasWarnings ? 'Compatible with warnings' : 'Compatible') : result?.errors[0] || 'Incompatible'}
                        >
                          <span className={styles.statusIcon}>
                            {isCompatible ? (hasWarnings ? '⚠' : '✓') : '✗'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: Card-based layout */}
      <div className={styles.mobileCards}>
        <div className={styles.mobileControls}>
          <button 
            className={styles.filterToggle}
            onClick={() => setShowOnlyCompatible(!showOnlyCompatible)}
          >
            {showOnlyCompatible ? '🔍 Show All' : '✓ Compatible Only'}
          </button>
        </div>
        
        {sbcs.map((sbc) => {
          const compatibleComponents = filteredComponents.filter(comp => 
            compatibilityCache.get(`${sbc.id}-${comp.id}`)?.compatible
          );
          
          if (showOnlyCompatible && compatibleComponents.length === 0) return null;

          return (
            <div key={sbc.id} className={styles.sbcCard}>
              <div 
                className={`${styles.sbcCardHeader} ${styles.clickableHeader}`}
                onClick={(e) => handleComponentClick(sbc, e)}
              >
                <h4>{sbc.name}</h4>
                <div className={styles.sbcCardMeta}>
                  <span className={styles.interfacesTag}>
                    {sbc.interfaces.slice(0, 3).join(', ')}
                    {sbc.interfaces.length > 3 && '...'}
                  </span>
                  <StatusBadge status={sbc.status} />
                </div>
              </div>
              
              <div className={styles.compactCompatibilityGrid}>
                {(showOnlyCompatible ? compatibleComponents : filteredComponents).map((component) => {
                  const result = compatibilityCache.get(`${sbc.id}-${component.id}`);
                  const isCompatible = result?.compatible;
                  const hasWarnings = result?.warnings.length > 0;

                  return (
                    <div 
                      key={component.id}
                      className={`${styles.compactItem} ${
                        isCompatible ? (hasWarnings ? styles.compactWarning : styles.compactCompatible) : styles.compactIncompatible
                      }`}
                      onClick={() => handleCellClick(sbc.id, component.id)}
                      title={`${component.name} - ${isCompatible ? (hasWarnings ? 'Compatible with warnings' : 'Compatible') : result?.errors[0] || 'Incompatible'}`}
                    >
                      <div className={styles.compactContent}>
                        <span className={styles.compactIcon}>
                          {isCompatible ? (hasWarnings ? '⚠' : '✓') : '✗'}
                        </span>
                        <span className={styles.compactName}>
                          {getShortName(component.name)}
                        </span>
                        <span 
                          className={styles.compactInfo}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleComponentClick(component, e);
                          }}
                        >
                          ℹ️
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {selectedCell && (
        <CompatibilityDetails
          sbc={sbcs.find(s => s.id === selectedCell.sbc)!}
          component={components.find(c => c.id === selectedCell.component)!}
          result={compatibilityCache.get(`${selectedCell.sbc}-${selectedCell.component}`)!}
          onClose={() => setSelectedCell(null)}
        />
      )}

      {selectedComponent && (
        <ComponentDetails
          component={selectedComponent}
          onClose={() => setSelectedComponent(null)}
        />
      )}
    </div>
  );
};

// Regular table implementation - more performant than virtualization for this use case

// Status badge component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`${styles.statusBadge} ${styles[`status-${status}`]}`}>
    {status.toUpperCase()}
  </span>
);

// Compatibility details modal
interface CompatibilityDetailsProps {
  sbc: SBCComponent;
  component: CameraComponent | WiFiComponent;
  result: CompatibilityResult;
  onClose: () => void;
}

const CompatibilityDetails: React.FC<CompatibilityDetailsProps> = ({
  sbc,
  component,
  result,
  onClose
}) => (
  <div className={styles.detailsModal} onClick={onClose}>
    <div className={styles.detailsContent} onClick={e => e.stopPropagation()}>
      <div className={styles.detailsHeader}>
        <h3>{sbc.name} + {component.name}</h3>
        <button onClick={onClose} className={styles.closeButton}>×</button>
      </div>
      
      <div className={styles.detailsBody}>
        <div className={styles.compatibilityStatus}>
          Status: {result.compatible ? '✅ Compatible' : '❌ Incompatible'}
        </div>

        {result.errors.length > 0 && (
          <div className={styles.errorsList}>
            <h4>Errors:</h4>
            {result.errors.map((error, index) => (
              <div key={index} className={styles.errorItem}>{error}</div>
            ))}
          </div>
        )}

        {result.warnings.length > 0 && (
          <div className={styles.warningsList}>
            <h4>Warnings:</h4>
            {result.warnings.map((warning, index) => (
              <div key={index} className={styles.warningItem}>{warning}</div>
            ))}
          </div>
        )}

        {result.performance && (
          <div className={styles.performanceDetails}>
            <h4>Performance:</h4>
            <div>Resolution: {result.performance.max_resolution}</div>
            <div>FPS: {result.performance.max_fps}</div>
            <div>Latency: {formatLatency(result.performance.latency)}</div>
            <div>Encoding: {result.performance.encoding}</div>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Component details modal
interface ComponentDetailsProps {
  component: SBCComponent | CameraComponent | WiFiComponent;
  onClose: () => void;
}

const ComponentDetails: React.FC<ComponentDetailsProps> = ({
  component,
  onClose
}) => {
  const getComponentIcon = () => {
    if ('role_support' in component) return '💻'; // SBC
    if ('interface' in component && 'sensor' in component) return '📷'; // Camera
    if ('chipset' in component) return '📡'; // WiFi
    return '🔧';
  };

  const getComponentType = () => {
    if ('role_support' in component) return 'Single Board Computer';
    if ('interface' in component && 'sensor' in component) return 'Camera';
    if ('chipset' in component) return 'WiFi Adapter';
    return 'Component';
  };

  return (
    <div className={styles.detailsModal} onClick={onClose}>
      <div className={styles.detailsContent} onClick={e => e.stopPropagation()}>
        <div className={styles.detailsHeader}>
          <h3>{getComponentIcon()} {component.name}</h3>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        
        <div className={styles.detailsBody}>
          <div className={styles.componentOverview}>
            <div className={styles.componentType}>
              <strong>Type:</strong> {getComponentType()}
            </div>
            <div className={styles.componentManufacturer}>
              <strong>Manufacturer:</strong> {component.manufacturer}
            </div>
            <div className={styles.componentStatus}>
              <strong>Status:</strong> <StatusBadge status={component.status} />
            </div>
          </div>

          {/* SBC specific details */}
          {'role_support' in component && (
            <div className={styles.sbcDetails}>
              <h4>📋 SBC Specifications</h4>
              <div><strong>Supported Roles:</strong> {component.role_support.join(', ')}</div>
              <div><strong>Interfaces:</strong> {component.interfaces.join(', ')}</div>
              <div className={styles.performanceInfo}>
                <strong>Performance:</strong>
                <ul>
                  <li>Encoding: {component.performance.encoding.join(', ')}</li>
                  <li>Decoding: {component.performance.decoding.join(', ')}</li>
                  <li>Latency Tier: {component.performance.latency_tier}</li>
                </ul>
              </div>
              {component.power_requirements && (
                <div className={styles.powerInfo}>
                  <strong>Power Requirements:</strong>
                  <ul>
                    <li>Voltage: {component.power_requirements.voltage}</li>
                    <li>Max Current: {component.power_requirements.current_max}</li>
                    <li>Idle Consumption: {component.power_requirements.power_consumption_idle}</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Camera specific details */}
          {'interface' in component && 'sensor' in component && (
            <div className={styles.cameraDetails}>
              <h4>📷 Camera Specifications</h4>
              <div><strong>Interface:</strong> {component.interface}</div>
              {component.sensor && <div><strong>Sensor:</strong> {component.sensor}</div>}
              {component.max_resolution && <div><strong>Max Resolution:</strong> {component.max_resolution}</div>}
              {component.max_fps && <div><strong>Max FPS:</strong> {component.max_fps}</div>}
              {component.features && component.features.length > 0 && (
                <div><strong>Features:</strong> {component.features.join(', ')}</div>
              )}
            </div>
          )}

          {/* WiFi specific details */}
          {'chipset' in component && (
            <div className={styles.wifiDetails}>
              <h4>📡 WiFi Adapter Specifications</h4>
              <div><strong>Chipset:</strong> {component.chipset}</div>
              {component.bands && <div><strong>Bands:</strong> {component.bands.join(', ')}</div>}
              {component.recommended_band && <div><strong>Recommended Band:</strong> {component.recommended_band}</div>}
              {component.tx_power && <div><strong>TX Power:</strong> {component.tx_power}</div>}
            </div>
          )}

          {/* Common details */}
          <div className={styles.additionalInfo}>
            {component.price_range && (
              <div><strong>Price Range:</strong> {component.price_range}</div>
            )}
            {component.price_usd && (
              <div><strong>Price (USD):</strong> ${component.price_usd}</div>
            )}
            {component.notes && (
              <div className={styles.notes}>
                <strong>Notes:</strong> {component.notes}
              </div>
            )}
          </div>

          {/* Links */}
          {component.links && (
            <div className={styles.linksSection}>
              <h4>🔗 Links</h4>
              {component.links.buy_url && (
                <a href={component.links.buy_url} target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
                  🛒 Buy
                </a>
              )}
              {component.links.vendor_page && (
                <a href={component.links.vendor_page} target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
                  🏪 Vendor Page
                </a>
              )}
              {component.documentation_url && (
                <a href={component.documentation_url} target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
                  📖 Documentation
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
const formatLatency = (latency: string): string => {
  const latencyMap = {
    'ultra_low': '~5ms',
    'low': '~8ms', 
    'medium': '~15ms',
    'high': '~25ms'
  };
  return latencyMap[latency as keyof typeof latencyMap] || latency;
};

const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const truncateComponentName = (name: string, maxLength: number): string => {
  // Remove common prefixes to save space
  const cleaned = name
    .replace('Raspberry Pi ', 'RPi ')
    .replace('Arducam ', '')
    .replace('ASUS USB-', 'ASUS ')
    .replace('TP-Link Archer ', 'TP-Link ');
  
  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength)}...` : cleaned;
};

const getShortName = (name: string): string => {
  // Create very short names for grid headers
  if (name.includes('Raspberry Pi')) {
    if (name.includes('CM4')) return 'CM4';
    if (name.includes('4B')) return 'Pi4B';
    if (name.includes('3B+')) return 'Pi3B+';
    if (name.includes('3B mini')) return 'Pi3Bm';
    if (name.includes('3B')) return 'Pi3B';
    if (name.includes('3A+')) return 'Pi3A+';
    if (name.includes('3A')) return 'Pi3A';
    if (name.includes('CM3+')) return 'CM3+';
    if (name.includes('2B')) return 'Pi2B';
    if (name.includes('Zero 2')) return 'Zero2';
    if (name.includes('Camera V2')) return 'PiCamV2';
    if (name.includes('Camera HQ')) return 'PiCamHQ';
    if (name.includes('Camera V1')) return 'PiCamV1';
  }
  
  if (name.includes('Arducam')) {
    if (name.includes('IMX708')) return 'IMX708';
    if (name.includes('IMX519')) return 'IMX519';
    if (name.includes('IMX477')) return 'IMX477';
    if (name.includes('IMX462')) return 'IMX462';
    if (name.includes('IMX290')) return 'IMX290';
    if (name.includes('IMX327')) return 'IMX327';
    if (name.includes('IMX415')) return 'IMX415';
  }
  
  if (name.includes('Radxa')) {
    if (name.includes('Rock5B')) return 'R5B';
    if (name.includes('Rock5A')) return 'R5A';
    if (name.includes('CM3')) return 'RCM3';
    if (name.includes('Core3566')) return 'C3566';
    if (name.includes('Zero3W')) return 'RZ3W';
  }
  
  if (name.includes('ASUS')) return 'AC56';
  if (name.includes('ALFA')) {
    if (name.includes('036ACH')) return 'ACH';
    if (name.includes('1900')) return 'A1900';
  }
  if (name.includes('BLM8812EU')) return 'BLM';
  if (name.includes('Taobao')) return 'TB8812';
  if (name.includes('T3U Plus')) return 'T3U+';
  if (name.includes('T3U')) return 'T3U';
  if (name.includes('Tenda')) return 'U12';
  if (name.includes('Cudy')) return 'C1300';
  if (name.includes('Aigital')) return 'A1200';
  if (name.includes('COMFAST')) return 'CF1300';
  if (name.includes('D-Link')) return 'DWA182';
  if (name.includes('Netgear')) return 'A6100';
  
  if (name.includes('FLIR Boson')) return name.includes('640') ? 'B640' : 'B320';
  if (name.includes('Hti-')) return name.includes('301') ? 'H301' : 'H201';
  if (name.includes('Infiray')) return 'T2';
  if (name.includes('VEYE')) return name.includes('327E') ? 'V327E' : 'V307';
  if (name.includes('Waveshare')) return 'HC100F';
  if (name.includes('Geekworm')) return name.includes('C790') ? 'C790' : 'C779';
  
  if (name.includes('X86')) return 'X86';
  if (name.includes('OpenHD')) return 'OHD';
  
  // Fallback: take first 6 chars
  return name.slice(0, 6);
};

export default CompatibilityMatrix;