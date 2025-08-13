/**
 * Hardware Configurator Type Definitions
 * Centralized type system for better maintainability
 */

export type ComponentStatus = 'recommended' | 'supported' | 'legacy' | 'development' | 'specialized' | 'limited';
export type ComponentInterface = 'csi' | 'usb' | 'usb2' | 'usb3' | 'hdmi' | 'hdmi_in' | 'hdmi_out' | 'ethernet' | 'gpio' | 'ip';
export type SeverityLevel = 'error' | 'warning' | 'info';
export type PriceRange = 'low' | 'medium' | 'high';
export type OpenHDVersion = '2.0' | '2.1' | '2.2-evo' | '2.3-evo' | '2.4-evo' | '2.5-evo' | '2.6-evo' | '2.7-evo';

// Version-specific compatibility information
export interface VersionCompatibility {
  min_version: OpenHDVersion;
  max_version?: OpenHDVersion;
  recommended_versions: OpenHDVersion[];
  status_per_version?: Partial<Record<OpenHDVersion, ComponentStatus>>;
  notes_per_version?: Partial<Record<OpenHDVersion, string>>;
  deprecated_in?: OpenHDVersion;
  added_in?: OpenHDVersion;
}

// Base component interface
export interface BaseComponent {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  status: ComponentStatus;
  price_range?: PriceRange;
  price_usd?: number;
  notes?: string;
  documentation_url?: string;
  version_compatibility?: VersionCompatibility;
  links?: {
    buy_url?: string;
    vendor_page?: string;
    fcc_info?: string;
  };
}

// SBC specific interface
export interface SBCComponent extends BaseComponent {
  category: 'sbc';
  role_support: ('air' | 'ground' | 'both')[];
  interfaces: ComponentInterface[];
  performance: {
    encoding: string[];
    decoding: string[];
    latency_tier: 'ultra_low' | 'low' | 'medium' | 'high';
  };
  power_requirements?: {
    voltage: string;
    current_max: string;
    power_consumption_idle: string;
  };
}

// Camera specific interface
export interface CameraComponent extends BaseComponent {
  category: 'camera';
  interface: ComponentInterface;
  sensor?: string;
  max_resolution?: string;
  max_fps?: number;
  features?: string[];
  compatible_sbcs?: string[];
}

// WiFi adapter interface
export interface WiFiComponent extends BaseComponent {
  category: 'wifi';
  chipset: string;
  bands?: string[];
  recommended_band?: string;
  tx_power?: string;
}

// Union type for all components
export type HardwareComponent = SBCComponent | CameraComponent | WiFiComponent;

// Modern structured validation rules
export interface ValidationRule {
  rule_id: string;
  type: RuleType;
  severity: SeverityLevel;
  message: string;
  parameters: RuleParameters;
}

export type RuleType = 
  | 'interface_compatibility'
  | 'manufacturer_compatibility' 
  | 'status_check'
  | 'feature_check'
  | 'count_check'
  | 'chipset_whitelist'
  | 'role_compatibility';

export interface RuleParameters {
  // Common parameters
  component_types?: ('sbc' | 'camera' | 'wifi')[];
  
  // Version-specific parameters
  version_filter?: {
    applies_to_versions?: OpenHDVersion[];
    min_version?: OpenHDVersion;
    max_version?: OpenHDVersion;
  };
  
  // Interface rules
  required_interfaces?: string[];
  
  // Manufacturer rules (completely flexible)
  manufacturer_filter?: {
    component: 'sbc' | 'camera' | 'wifi';
    must_be?: string[];              // Component must be from these manufacturers
    cannot_be?: string[];            // Component cannot be from these manufacturers  
    cross_check?: {                  // Check against another component
      component: 'sbc' | 'camera' | 'wifi';
      operator: 'same' | 'different';   // Relationship requirement
      must_exist?: boolean;            // Whether the other component must exist
    };
  };
  
  // Status rules
  status_filter?: {
    component: 'sbc' | 'camera' | 'wifi';
    allowed_statuses: ComponentStatus[];
    forbidden_statuses?: ComponentStatus[];
  };
  
  // Feature rules
  feature_requirements?: {
    component: 'sbc' | 'camera' | 'wifi';
    required_features?: string[];
    forbidden_features?: string[];
    interface_constraints?: string[];
  };
  
  // Count rules
  count_limits?: {
    field: string;
    min?: number;
    max?: number;
  };
  
  // Chipset rules
  chipset_whitelist?: string[];
  
  // Role rules
  role_requirements?: {
    required_roles?: string[];
    fallback_roles?: string[];
  };
}

// Performance matrix entry
export interface PerformanceEntry {
  sbc: string;
  camera_interface: ComponentInterface;
  performance: {
    max_resolution: string;
    max_fps: string;
    latency: 'ultra_low' | 'low' | 'medium' | 'high';
    encoding: string;
  };
}

// Use case template
export interface UseCase {
  id: string;
  name: string;
  description: string;
  priority_weights: Record<string, number>;
  recommended_components: Record<string, string[]>;
}

// Component categories structure
export interface ComponentCategories {
  sbcs: {
    components: SBCComponent[];
  };
  cameras: {
    components: CameraComponent[];
  };
  wifi_adapters: {
    components: WiFiComponent[];
  };
}

// Version metadata for the configurator
export interface VersionMetadata {
  version: OpenHDVersion;
  release_date: string;
  status: 'current' | 'supported' | 'legacy' | 'deprecated';
  description: string;
  breaking_changes?: string[];
  new_features?: string[];
}

// Main configuration data structure
export interface HardwareConfiguratorData {
  schema_version: string;
  metadata: {
    created_by: string;
    last_updated: string;
    validation_engine: string;
    description: string;
  };
  version_support: {
    current_version: OpenHDVersion;
    supported_versions: VersionMetadata[];
    version_compatibility_matrix: boolean;
  };
  compatibility_engine: {
    configuration: {
      supported_chipsets: string[];
      supported_interfaces: ComponentInterface[];
      valid_statuses: ComponentStatus[];
      auto_update_lists: boolean;
    };
    structured_validation_rules: ValidationRule[];
    validation_rules: ValidationRule[]; // Legacy
    performance_matrix: PerformanceEntry[];
  };
  component_categories: ComponentCategories;
  use_case_templates: UseCase[];
  configuration_workflow: {
    steps: Array<{
      step: string;
      title: string;
      type: string;
      category: string;
      real_time_validation?: boolean;
      affects?: string;
    }>;
  };
  export_options: Array<{
    format: string;
    description: string;
  }>;
}

// Evaluation context for rules
export interface EvaluationContext {
  sbc?: SBCComponent;
  camera?: CameraComponent;
  wifi?: WiFiComponent;
  selected_role?: string;
  camera_count?: number;
  [key: string]: any;
}

// Compatibility result
export interface CompatibilityResult {
  compatible: boolean;
  warnings: string[];
  errors: string[];
  performance?: PerformanceEntry['performance'];
}

// Statistics interface
export interface ConfiguratorStats {
  total_components: number;
  total_rules: number;
  total_use_cases: number;
  categories: number;
  auto_generated_rules: number;
  components_by_category: Record<string, number>;
  components_by_status: Record<ComponentStatus, number>;
}