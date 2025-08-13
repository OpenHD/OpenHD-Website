/**
 * Data-driven rule evaluation - rules are defined in JSON, not code
 */

interface EvaluationContext {
  sbc?: any;
  camera?: any;
  wifi?: any;
  selected_role?: string;
  camera_count?: number;
  [key: string]: any;
}

interface StructuredRule {
  rule_id: string;
  type: 'interface_mismatch' | 'role_incompatible' | 'role_support_check' | 
        'status_check' | 'feature_check' | 'feature_interface_check' |
        'count_check' | 'manufacturer_mismatch' | 'manufacturer_compatibility' |
        'chipset_whitelist' | 'platform_interface_restriction' | 'custom';
  severity: 'error' | 'warning' | 'info';
  message: string;
  parameters: Record<string, any>;
}

interface ConfigData {
  supported_chipsets: string[];
  supported_interfaces: string[];
  valid_statuses: string[];
  [key: string]: any;
}

export class DataDrivenRuleEvaluator {
  private static configData: ConfigData | null = null;

  /**
   * Initialize with configuration data from JSON
   */
  static initialize(data: any) {
    this.configData = {
      supported_chipsets: this.extractSupportedChipsets(data),
      supported_interfaces: this.extractSupportedInterfaces(data),
      valid_statuses: this.extractValidStatuses(data),
      manufacturers: this.extractManufacturers(data),
      ...data.compatibility_engine?.configuration
    };
  }

  private static extractSupportedChipsets(data: any): string[] {
    const chipsets = new Set<string>();
    data.component_categories?.wifi_adapters?.components?.forEach((wifi: any) => {
      if (wifi.chipset) chipsets.add(wifi.chipset);
    });
    // Add explicitly supported ones from rules if they exist
    if (data.compatibility_engine?.supported_chipsets) {
      data.compatibility_engine.supported_chipsets.forEach((chipset: string) => 
        chipsets.add(chipset)
      );
    }
    return Array.from(chipsets);
  }

  private static extractSupportedInterfaces(data: any): string[] {
    const interfaces = new Set<string>();
    Object.values(data.component_categories || {}).forEach((category: any) => {
      category.components?.forEach((component: any) => {
        if (component.interface) interfaces.add(component.interface);
        if (component.interfaces) component.interfaces.forEach((iface: string) => 
          interfaces.add(iface)
        );
      });
    });
    return Array.from(interfaces);
  }

  private static extractValidStatuses(data: any): string[] {
    const statuses = new Set<string>();
    Object.values(data.component_categories || {}).forEach((category: any) => {
      category.components?.forEach((component: any) => {
        if (component.status) statuses.add(component.status);
      });
    });
    return Array.from(statuses);
  }

  private static extractManufacturers(data: any): string[] {
    const manufacturers = new Set<string>();
    Object.values(data.component_categories || {}).forEach((category: any) => {
      category.components?.forEach((component: any) => {
        if (component.manufacturer) manufacturers.add(component.manufacturer);
      });
    });
    return Array.from(manufacturers);
  }

  /**
   * Evaluate a structured rule against context
   */
  static evaluateStructuredRule(rule: StructuredRule, context: EvaluationContext): boolean {
    if (!this.configData) {
      console.warn('RuleEvaluator not initialized with config data');
      return false;
    }

    try {
      switch (rule.type) {
        case 'interface_mismatch':
          return this.checkInterfaceMismatch(rule.parameters, context);
        
        case 'role_incompatible':
        case 'role_support_check':
          return this.checkRoleCompatibility(rule.parameters, context);
        
        case 'status_check':
          return this.checkStatus(rule.parameters, context);
        
        case 'feature_check':
        case 'feature_interface_check':
          return this.checkFeatures(rule.parameters, context);
        
        case 'count_check':
          return this.checkCount(rule.parameters, context);
        
        case 'manufacturer_mismatch':
        case 'manufacturer_compatibility':
          return this.checkManufacturer(rule.parameters, context);
        
        case 'chipset_whitelist':
          return this.checkChipsetWhitelist(rule.parameters, context);
        
        case 'platform_interface_restriction':
          return this.checkPlatformRestriction(rule.parameters, context);
        
        default:
          console.warn(`Unknown rule type: ${rule.type}`);
          return false;
      }
    } catch (error) {
      console.warn(`Error evaluating rule ${rule.rule_id}:`, error);
      return false;
    }
  }

  private static checkInterfaceMismatch(params: any, context: EvaluationContext): boolean {
    const requiredInterface = params.required_interface;
    const componentType = params.component_type; // 'camera', 'sbc', etc.
    const targetType = params.target_type;

    const component = context[componentType];
    const target = context[targetType];

    if (!component || !target) return false;

    const componentInterface = component.interface;
    const targetInterfaces = target.interfaces || [];

    return componentInterface === requiredInterface && !targetInterfaces.includes(requiredInterface);
  }

  private static checkRoleCompatibility(params: any, context: EvaluationContext): boolean {
    const selectedRole = context.selected_role;
    const sbc = context.sbc;

    if (!selectedRole || !sbc) return false;

    const supportedRoles = sbc.role_support || [];
    return !supportedRoles.includes(selectedRole) && !supportedRoles.includes('both');
  }

  private static checkStatus(params: any, context: EvaluationContext): boolean {
    const componentType = params.component_type;
    const statusToCheck = params.status;
    const operator = params.operator || 'equals'; // 'equals', 'not_equals', 'in', 'not_in'

    const component = context[componentType];
    if (!component) return false;

    const componentStatus = component.status;

    switch (operator) {
      case 'equals':
        return componentStatus === statusToCheck;
      case 'not_equals':
        return componentStatus !== statusToCheck;
      case 'in':
        return Array.isArray(statusToCheck) && statusToCheck.includes(componentStatus);
      case 'not_in':
        return Array.isArray(statusToCheck) && !statusToCheck.includes(componentStatus);
      default:
        return false;
    }
  }

  private static checkFeatures(params: any, context: EvaluationContext): boolean {
    const componentType = params.component_type;
    const requiredFeatures = params.required_features || [];
    const forbiddenFeatures = params.forbidden_features || [];
    const operator = params.operator || 'and'; // 'and', 'or'

    // New feature_interface_check parameters
    const featuresField = params.features_field || 'features';
    const requiredFeature = params.required_feature;
    const interfaceField = params.interface_field || 'interface';
    const interfaceValue = params.interface_value;

    const component = context[componentType];
    if (!component) return false;

    // Handle feature_interface_check type
    if (requiredFeature && interfaceValue) {
      const componentFeatures = component[featuresField] || [];
      const componentInterface = component[interfaceField];
      
      return componentFeatures.includes(requiredFeature) && componentInterface === interfaceValue;
    }

    // Original feature_check logic
    const componentFeatures = component.features || [];

    // Check required features
    if (requiredFeatures.length > 0) {
      const hasRequired = operator === 'and' 
        ? requiredFeatures.every((feature: string) => componentFeatures.includes(feature))
        : requiredFeatures.some((feature: string) => componentFeatures.includes(feature));
      
      if (!hasRequired) return false;
    }

    // Check forbidden features
    if (forbiddenFeatures.length > 0) {
      const hasForbidden = forbiddenFeatures.some((feature: string) => 
        componentFeatures.includes(feature)
      );
      if (hasForbidden) return true; // Rule triggers if forbidden feature found
    }

    return requiredFeatures.length > 0; // Only trigger if we were checking for required features
  }

  private static checkCount(params: any, context: EvaluationContext): boolean {
    const countField = params.count_field;
    const operator = params.operator; // 'gt', 'gte', 'lt', 'lte', 'eq', 'neq'
    const threshold = params.threshold;

    const currentCount = context[countField] || 0;

    switch (operator) {
      case 'gt': return currentCount > threshold;
      case 'gte': return currentCount >= threshold;
      case 'lt': return currentCount < threshold;
      case 'lte': return currentCount <= threshold;
      case 'eq': return currentCount === threshold;
      case 'neq': return currentCount !== threshold;
      default: return false;
    }
  }

  private static checkManufacturer(params: any, context: EvaluationContext): boolean {
    const component1Type = params.component1_type;
    const component2Type = params.component2_type;
    const operator = params.operator; // 'same', 'different'

    // New manufacturer_compatibility parameters  
    const sbcManufacturer = params.sbc_manufacturer;
    const cameraManufacturer = params.camera_manufacturer;
    const checkType = params.check_type;

    // Handle new manufacturer_compatibility format
    if (checkType === 'different_manufacturer') {
      const sbc = context.sbc;
      const camera = context.camera;
      
      if (!sbc || !camera) return false;
      
      return sbc.manufacturer === sbcManufacturer && 
             cameraManufacturer === 'not_Radxa' ? camera.manufacturer !== 'Radxa' : camera.manufacturer !== cameraManufacturer;
    }

    // Original manufacturer_mismatch logic
    const component1 = context[component1Type];
    const component2 = context[component2Type];

    if (!component1 || !component2) return false;

    const manufacturer1 = component1.manufacturer;
    const manufacturer2 = component2.manufacturer;

    switch (operator) {
      case 'same':
        return manufacturer1 === manufacturer2;
      case 'different':
        return manufacturer1 !== manufacturer2;
      default:
        return false;
    }
  }

  private static checkChipsetWhitelist(params: any, context: EvaluationContext): boolean {
    const componentType = params.component_type;
    const useGlobalWhitelist = params.use_global_whitelist !== false;
    const customWhitelist = params.whitelist || [];
    const checkType = params.check_type || 'whitelist_validation';
    const field = params.field || 'chipset';

    const component = context[componentType];
    if (!component || !component[field]) return false;

    const whitelist = useGlobalWhitelist 
      ? this.configData!.supported_chipsets 
      : customWhitelist;

    if (checkType === 'whitelist_validation') {
      // Rule triggers if chipset is NOT in whitelist (incompatible)
      return !whitelist.includes(component[field]);
    }

    return !whitelist.includes(component[field]);
  }

  /**
   * Get formatted error message with context substitution
   */
  static formatMessage(rule: StructuredRule, context: EvaluationContext): string {
    return rule.message
      .replace('{sbc.name}', context.sbc?.name || 'Unknown SBC')
      .replace('{camera.name}', context.camera?.name || 'Unknown Camera')
      .replace('{camera.interface}', context.camera?.interface || 'Unknown Interface')
      .replace('{wifi.name}', context.wifi?.name || 'Unknown WiFi')
      .replace('{wifi.chipset}', context.wifi?.chipset || 'Unknown Chipset')
      .replace('{selected_role}', context.selected_role || 'Unknown Role');
  }

  /**
   * Convert legacy string-based rule to structured rule for migration
   */
  static convertLegacyRule(legacyRule: any): StructuredRule | null {
    const condition = legacyRule.condition?.trim();
    
    if (!condition) return null;

    // Convert common patterns to structured rules
    if (condition.includes("camera.interface == 'csi' && !sbc.interfaces.includes('csi')")) {
      return {
        rule_id: legacyRule.rule_id,
        type: 'interface_mismatch',
        severity: legacyRule.severity,
        message: legacyRule.message,
        parameters: {
          required_interface: 'csi',
          component_type: 'camera',
          target_type: 'sbc'
        }
      };
    }

    if (condition.includes("selected_role && !sbc.role_support.includes(selected_role)")) {
      return {
        rule_id: legacyRule.rule_id,
        type: 'role_incompatible',
        severity: legacyRule.severity,
        message: legacyRule.message,
        parameters: {}
      };
    }

    if (condition.includes("camera.status == 'legacy'")) {
      return {
        rule_id: legacyRule.rule_id,
        type: 'status_check',
        severity: legacyRule.severity,
        message: legacyRule.message,
        parameters: {
          component_type: 'camera',
          status: 'legacy',
          operator: 'equals'
        }
      };
    }

    if (condition.includes("wifi.chipset && !['RTL8812AU'")) {
      return {
        rule_id: legacyRule.rule_id,
        type: 'chipset_whitelist',
        severity: legacyRule.severity,
        message: legacyRule.message,
        parameters: {
          component_type: 'wifi',
          use_global_whitelist: true
        }
      };
    }

    // Return null for unrecognized patterns - they need manual conversion
    console.warn(`Could not convert legacy rule: ${legacyRule.rule_id}`);
    return null;
  }

  private static checkPlatformRestriction(params: any, context: EvaluationContext): boolean {
    const sbcId = params.sbc_id;
    const cameraInterface = params.camera_interface;
    
    const sbc = context.sbc;
    const camera = context.camera;

    if (!sbc || !camera) return false;

    // Check if this SBC ID matches and camera has the restricted interface
    return sbc.id === sbcId && camera.interface === cameraInterface;
  }
}
