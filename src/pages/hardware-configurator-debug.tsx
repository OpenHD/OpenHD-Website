import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import styles from './hardware-configurator-debug.module.css';
import { hardwareConfiguratorService } from '../services/HardwareConfiguratorService';
import { 
  HardwareConfiguratorData,
  SBCComponent,
  CameraComponent,
  WiFiComponent,
  ValidationRule,
  UseCase,
  ConfiguratorStats,
  ComponentStatus
} from '../types/hardware-configurator';
import CompatibilityMatrix from '../components/debug/CompatibilityMatrix';

export default function HardwareConfiguratorDebug() {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'rules' | 'usecases' | 'compatibility'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('sbcs');
  const [data, setData] = useState<HardwareConfiguratorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ConfiguratorStats | null>(null);

  useEffect(() => {
    const initializeService = async () => {
      try {
        // Load JSON data from static files
        const response = await fetch('/data/hardware-configurator.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonData: HardwareConfiguratorData = await response.json();
        
        // Initialize the service
        await hardwareConfiguratorService.initialize(jsonData);
        
        setData(jsonData);
        setStats(hardwareConfiguratorService.getStats());
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    initializeService();
  }, []);

  if (loading) {
    return (
      <Layout title="Hardware Configurator Debug">
        <div className={styles.debugPage}>
          <div className="container">
            <div className={styles.loading}>
              <h2>Loading configurator data...</h2>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Hardware Configurator Debug">
        <div className={styles.debugPage}>
          <div className="container">
            <div className={styles.error}>
              <h2>Error loading data</h2>
              <p>Could not load hardware configurator data: {error}</p>
              <p>Make sure the JSON file is available at <code>/data/hardware-configurator.json</code></p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return null;
  }

  // Use memoized stats from service
  const displayStats = stats || {
    total_components: 0,
    total_rules: 0,
    total_use_cases: 0,
    categories: 0,
    auto_generated_rules: 0,
    components_by_category: {},
    components_by_status: {} as Record<ComponentStatus, number>
  };

// Status Badge Component - Tag/Büroklammer style with text
const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  if (!status) return null;
  
  const validStatus = ['recommended', 'supported', 'legacy', 'development', 'specialized', 'limited'].includes(status) 
    ? status as ComponentStatus 
    : null;
    
  if (!validStatus) return null;
  
  const getStatusDisplay = (status: ComponentStatus) => {
    switch (status) {
      case 'recommended': return 'RECOMMENDED';
      case 'supported': return 'SUPPORTED';
      case 'legacy': return 'LEGACY';
      case 'development': return 'DEVELOPMENT';
      case 'specialized': return 'SPECIALIZED';
      case 'limited': return 'LIMITED';
      default: return 'N/A';
    }
  };

  const getStatusTitle = (status: ComponentStatus) => {
    switch (status) {
      case 'recommended': return 'Recommended - Best performance and compatibility';
      case 'supported': return 'Supported - Fully functional';
      case 'legacy': return 'Legacy - Older version, basic functionality';
      case 'development': return 'Development - Experimental features';
      case 'specialized': return 'Specialized - For specific use cases';
      case 'limited': return 'Limited - Limited functionality';
      default: return status;
    }
  };

  return (
    <span 
      className={`${styles.statusBadge} ${styles[`status-${validStatus}`]}`}
      title={getStatusTitle(validStatus)}
    >
      {getStatusDisplay(validStatus)}
    </span>
  );
};  const PriceRange = ({ range, price }: { range?: string; price?: number }) => (
    <div className={styles.priceInfo}>
      {price && <span className={styles.price}>${price}</span>}
      {range && <span className={styles.priceRange}>({range})</span>}
    </div>
  );

  const LinksList = ({ links }: { links?: Record<string, string> }) => {
    if (!links) return null;
    
    return (
      <div className={styles.links}>
        {Object.entries(links).map(([key, url]) => (
          <a key={key} href={url} target="_blank" rel="noopener noreferrer" className={styles.link}>
            {key.replace('_', ' ')}
          </a>
        ))}
      </div>
    );
  };

  const ComponentCard = ({ component }: { component: SBCComponent | CameraComponent | WiFiComponent }) => (
    <div className={`${styles.card} ${styles.componentCard}`}>
      <div className={styles.cardHeader}>
        <h4>{component.name}</h4>
        <div className={styles.cardMeta}>
          <StatusBadge status={component.status} />
          <span className={styles.manufacturer}>{component.manufacturer}</span>
        </div>
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.componentDetails}>
          <div><strong>ID:</strong> <code>{component.id}</code></div>
          {'interface' in component && <div><strong>Interface:</strong> {component.interface}</div>}
          {'chipset' in component && <div><strong>Chipset:</strong> {component.chipset}</div>}
          {'sensor' in component && <div><strong>Sensor:</strong> {component.sensor}</div>}
          {'max_resolution' in component && <div><strong>Max Resolution:</strong> {component.max_resolution}</div>}
          {'bands' in component && component.bands && <div><strong>Bands:</strong> {component.bands.join(', ')}</div>}
          {'recommended_band' in component && component.recommended_band && (
            <div><strong>Recommended Band:</strong> 
              <span className={styles.highlight}>{component.recommended_band}</span>
            </div>
          )}
          {'tx_power' in component && <div><strong>TX Power:</strong> {component.tx_power}</div>}
          {'role_support' in component && <div><strong>Roles:</strong> {component.role_support.join(', ')}</div>}
        </div>
        
        <PriceRange range={component.price_range} price={component.price_usd} />
        
        {'features' in component && component.features && component.features.length > 0 && (
          <div className={styles.features}>
            <strong>Features:</strong>
            <div className={styles.featureTags}>
              {component.features.map((feature: string) => (
                <span key={feature} className={styles.featureTag}>{feature}</span>
              ))}
            </div>
          </div>
        )}
        
        {component.notes && (
          <div className={styles.notes}>
            <strong>Notes:</strong> {component.notes}
          </div>
        )}
        
        <LinksList links={component.links} />
      </div>
    </div>
  );

  const RuleCard = ({ rule }: { rule: ValidationRule }) => (
    <div className={`${styles.card} ${styles.ruleCard}`}>
      <div className={styles.cardHeader}>
        <h4>{rule.rule_id}</h4>
        <div className={styles.cardMeta}>
          <span className={`${styles.badge} ${styles[`badge-${rule.severity}`]}`}>
            {rule.severity}
          </span>
          <span className={styles.ruleType}>{rule.type}</span>
          {(rule as StructuredRule).auto_generated && (
            <span className={`${styles.badge} ${styles.badgeAutoGenerated}`}>
              Auto-Generated
            </span>
          )}
          {(rule as ValidationRule).deprecated && (
            <span className={`${styles.badge} ${styles.badgeDeprecated}`}>
              Deprecated
            </span>
          )}
        </div>
      </div>
      
      <div className={styles.cardContent}>
        {/* Legacy condition support */}
        {(rule as ValidationRule).condition && (
          <div><strong>Condition:</strong> <code>{(rule as ValidationRule).condition}</code></div>
        )}
        
        {/* New structured parameters */}
        {(rule as StructuredRule).parameters && (
          <div className={styles.ruleParameters}>
            <strong>Parameters:</strong>
            <pre className={styles.parametersJson}>
              {JSON.stringify((rule as StructuredRule).parameters, null, 2)}
            </pre>
          </div>
        )}
        
        {(rule as ValidationRule).structured_equivalent && (
          <div className={styles.migrationInfo}>
            <strong>⚡ Structured equivalent:</strong> 
            <code>{(rule as ValidationRule).structured_equivalent}</code>
          </div>
        )}
        
        <div><strong>Message:</strong> {rule.message}</div>
      </div>
    </div>
  );

  // This functionality is now handled by the service
  // Keeping this stub for compatibility during migration

  const getCompatibleCameras = (sbcId: string): CameraComponent[] => {
    return hardwareConfiguratorService.getCompatibleCameras(sbcId);
  };

  const getCompatibleSBCs = (cameraId: string): SBCComponent[] => {
    // Implementation would go here if needed for reverse lookups
    return [];
  };

  const getCompatibleWiFi = (sbcId: string): WiFiComponent[] => {
    return hardwareConfiguratorService.getCompatibleWiFi(sbcId);
  };

  const getPerformanceForCombo = (sbcId: string, cameraId: string) => {
    return hardwareConfiguratorService.getPerformanceForCombo(sbcId, cameraId);
  };

  // Legacy functions - now handled by service

  // Legacy component - replaced with optimized CompatibilityMatrix

  const UseCaseCard = ({ usecase }: { usecase: UseCase }) => (
    <div className={`${styles.card} ${styles.usecaseCard}`}>
      <div className={styles.cardHeader}>
        <h4>{usecase.name}</h4>
        <span className={styles.usecaseId}>{usecase.id}</span>
      </div>
      
      <div className={styles.cardContent}>
        <p>{usecase.description}</p>
        
        <div className={styles.priorities}>
          <strong>Priority Weights:</strong>
          <div className={styles.priorityList}>
            {Object.entries(usecase.priority_weights).map(([key, value]) => (
              <div key={key} className={styles.priorityItem}>
                <span>{key}:</span>
                <div className={styles.priorityBar}>
                  <div 
                    className={styles.priorityFill}
                    style={{ width: `${value * 100}%` }}
                  />
                  <span className={styles.priorityValue}>{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.recommendations}>
          <strong>Recommended Components:</strong>
          {Object.entries(usecase.recommended_components).map(([category, components]) => (
            <div key={category} className={styles.recommendationCategory}>
              <span className={styles.categoryName}>{category}:</span>
              <span className={styles.componentIds}>{components.join(', ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Layout
      title="Hardware Configurator Debug"
      description="Debug view for OpenHD Hardware Configurator data"
    >
      <Head>
        <meta property="og:title" content="Hardware Configurator Debug" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.debugPage}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>🔧 Hardware Configurator Debug</h1>
            <p>Debug view for OpenHD Hardware Configurator JSON data</p>
          </div>

          {/* Statistics Overview */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>{String(stats.total_components)}</h3>
              <p>Total Components</p>
            </div>
            <div className={styles.statCard}>
              <h3>{String(stats.categories)}</h3>
              <p>Categories</p>
            </div>
            <div className={styles.statCard}>
              <h3>{String(stats.total_rules)}</h3>
              <p>Validation Rules</p>
            </div>
            <div className={styles.statCard}>
              <h3>{String(stats.total_use_cases)}</h3>
              <p>Use Cases</p>
            </div>
            <div className={styles.statCard}>
              <h3>{String(stats.auto_generated_rules)}</h3>
              <p>Auto-Generated Rules</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className={styles.tabNav}>
            {[
              { id: 'overview', label: '📊 Overview', count: null },
              { id: 'components', label: '🔧 Components', count: stats.total_components },
              { id: 'compatibility', label: '🔗 Compatibility', count: null },
              { id: 'rules', label: '⚠️ Rules', count: stats.total_rules },
              { id: 'usecases', label: '🎯 Use Cases', count: stats.total_use_cases }
            ].map(tab => (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id as any)}
              >
                {tab.label}
                {tab.count && <span className={styles.tabCount}>{tab.count}</span>}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <div className={styles.overview}>
                <div className={styles.section}>
                  <h2>Schema Information</h2>
                  <div className={styles.schemaInfo}>
                    <div><strong>Version:</strong> {data.schema_version}</div>
                    <div><strong>Last Updated:</strong> {data.metadata.last_updated}</div>
                    <div><strong>Created By:</strong> {data.metadata.created_by}</div>
                    <div><strong>Validation Engine:</strong> {data.metadata.validation_engine}</div>
                  </div>
                </div>

                <div className={styles.section}>
                  <h2>Categories</h2>
                  <div className={styles.categoriesGrid}>
                    {Object.entries(data.component_categories).map(([key, category]: [string, any]) => (
                      <div key={key} className={styles.categoryCard}>
                        <h4>{key.toUpperCase()}</h4>
                        <p>{category.components.length} components</p>
                        <div className={styles.componentsList}>
                          {category.components.slice(0, 3).map((comp: any) => (
                            <span key={comp.id} className={styles.componentPreview}>
                              {comp.name}
                            </span>
                          ))}
                          {category.components.length > 3 && (
                            <span className={styles.moreCount}>
                              +{category.components.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'compatibility' && data && (
              <div className={styles.matrixFullWidthWrapper}>
                <CompatibilityMatrix 
                  type="camera"
                  sbcs={data.component_categories.sbcs.components}
                  components={data.component_categories.cameras.components}
                  className={styles.cameraMatrix}
                />
                
                <CompatibilityMatrix 
                  type="wifi"
                  sbcs={data.component_categories.sbcs.components}
                  components={data.component_categories.wifi_adapters.components}
                  className={styles.wifiMatrix}
                />
              </div>
            )}

            {activeTab === 'components' && (
              <div className={styles.components}>
                <div className={styles.categorySelector}>
                  {Object.keys(data.component_categories).map(category => (
                    <button
                      key={category}
                      className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category.toUpperCase()}
                      <span className={styles.count}>
                        ({data.component_categories[category].components.length})
                      </span>
                    </button>
                  ))}
                </div>

                <div className={styles.componentGrid}>
                  {data.component_categories[selectedCategory]?.components.map((component: ComponentData) => (
                    <ComponentCard key={component.id} component={component} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'rules' && (
              <div className={styles.rules}>
                <div className={styles.section}>
                  <h3>Legacy String-Based Rules</h3>
                  <div className={styles.ruleGrid}>
                    {(data.compatibility_engine?.validation_rules || []).map((rule: ValidationRule) => (
                      <RuleCard key={rule.rule_id} rule={rule} />
                    ))}
                  </div>
                </div>

                <div className={styles.section}>
                  <h3>New Structured Rules</h3>
                  <div className={styles.ruleGrid}>
                    {(data.compatibility_engine?.structured_validation_rules || []).map((rule: StructuredRule) => (
                      <RuleCard key={rule.rule_id} rule={rule} />
                    ))}
                  </div>
                </div>

                {data.compatibility_engine?.configuration && (
                  <div className={styles.section}>
                    <h3>Configuration</h3>
                    <div className={styles.configCard}>
                      {data.compatibility_engine.configuration.supported_chipsets && (
                        <div className={styles.configSection}>
                          <h4>Supported Chipsets ({data.compatibility_engine.configuration.supported_chipsets.length})</h4>
                          <div className={styles.chipsetList}>
                            {data.compatibility_engine.configuration.supported_chipsets.map((chipset: string) => (
                              <span key={chipset} className={styles.chipsetTag}>{chipset}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {data.compatibility_engine.configuration.supported_interfaces && (
                        <div className={styles.configSection}>
                          <h4>Supported Interfaces ({data.compatibility_engine.configuration.supported_interfaces.length})</h4>
                          <div className={styles.interfaceList}>
                            {data.compatibility_engine.configuration.supported_interfaces.map((iface: string) => (
                              <span key={iface} className={styles.interfaceTag}>{iface}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {data.compatibility_engine.configuration.valid_statuses && (
                        <div className={styles.configSection}>
                          <h4>Valid Statuses ({data.compatibility_engine.configuration.valid_statuses.length})</h4>
                          <div className={styles.statusList}>
                            {data.compatibility_engine.configuration.valid_statuses.map((status: string) => (
                              <StatusBadge key={status} status={status} />
                            ))}
                          </div>
                        </div>
                      )}

                      {data.metadata?.auto_extracted_data && (
                        <div className={styles.configSection}>
                          <h4>Auto-Extracted Data</h4>
                          <div className={styles.metadataInfo}>
                            <div>Last auto-update: {data.metadata.last_auto_update}</div>
                            <div>Chipsets: {data.metadata.auto_extracted_data.chipsets_count}</div>
                            <div>Interfaces: {data.metadata.auto_extracted_data.interfaces_count}</div>
                            <div>Manufacturers: {data.metadata.auto_extracted_data.manufacturers_count}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'usecases' && (
              <div className={styles.usecases}>
                <div className={styles.usecaseGrid}>
                  {data.use_case_templates.map((usecase: UseCase) => (
                    <UseCaseCard key={usecase.id} usecase={usecase} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}