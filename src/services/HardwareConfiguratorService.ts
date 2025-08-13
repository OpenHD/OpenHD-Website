/**
 * Hardware Configurator Service
 * Centralized business logic for hardware compatibility and validation
 */

import { 
  HardwareConfiguratorData, 
  HardwareComponent, 
  SBCComponent, 
  CameraComponent, 
  WiFiComponent,
  CompatibilityResult,
  EvaluationContext,
  ValidationRule,
  ConfiguratorStats
} from '../types/hardware-configurator';

export class HardwareConfiguratorService {
  private data: HardwareConfiguratorData | null = null;
  private ruleEvaluator: RuleEvaluator | null = null;

  constructor() {
    this.ruleEvaluator = new RuleEvaluator();
  }

  /**
   * Initialize service with configuration data
   */
  async initialize(data: HardwareConfiguratorData): Promise<void> {
    // Validate data structure first
    this.validateConfigData(data);
    
    this.data = data;
    this.ruleEvaluator?.initialize(data);
  }

  /**
   * Get all components of a specific category
   */
  getComponentsByCategory<T extends HardwareComponent>(category: keyof HardwareConfiguratorData['component_categories']): T[] {
    if (!this.data) throw new Error('Service not initialized');
    
    return (this.data.component_categories[category]?.components || []) as T[];
  }

  /**
   * Get component by ID
   */
  getComponentById<T extends HardwareComponent>(componentId: string): T | null {
    if (!this.data) return null;

    const allCategories = Object.values(this.data.component_categories);
    for (const category of allCategories) {
      const component = category.components.find(c => c.id === componentId);
      if (component) return component as T;
    }
    
    return null;
  }

  /**
   * Check compatibility between SBC and Camera
   */
  checkSBCCameraCompatibility(sbcId: string, cameraId: string): CompatibilityResult {
    const sbc = this.getComponentById<SBCComponent>(sbcId);
    const camera = this.getComponentById<CameraComponent>(cameraId);

    if (!sbc || !camera) {
      return {
        compatible: false,
        errors: ['Component not found'],
        warnings: []
      };
    }

    const context: EvaluationContext = { sbc, camera };
    return this.evaluateCompatibility(context);
  }

  /**
   * Check compatibility between SBC and WiFi adapter
   */
  checkSBCWiFiCompatibility(sbcId: string, wifiId: string): CompatibilityResult {
    const sbc = this.getComponentById<SBCComponent>(sbcId);
    const wifi = this.getComponentById<WiFiComponent>(wifiId);

    if (!sbc || !wifi) {
      return {
        compatible: false,
        errors: ['Component not found'],
        warnings: []
      };
    }

    const context: EvaluationContext = { sbc, wifi };
    return this.evaluateCompatibility(context);
  }

  /**
   * Get all compatible cameras for a given SBC
   */
  getCompatibleCameras(sbcId: string): CameraComponent[] {
    const cameras = this.getComponentsByCategory<CameraComponent>('cameras');
    
    return cameras.filter(camera => {
      const result = this.checkSBCCameraCompatibility(sbcId, camera.id);
      return result.compatible;
    });
  }

  /**
   * Get all compatible WiFi adapters for a given SBC
   */
  getCompatibleWiFi(sbcId: string): WiFiComponent[] {
    const wifiAdapters = this.getComponentsByCategory<WiFiComponent>('wifi_adapters');
    
    return wifiAdapters.filter(wifi => {
      const result = this.checkSBCWiFiCompatibility(sbcId, wifi.id);
      return result.compatible;
    });
  }

  /**
   * Get performance data for SBC/Camera combination
   */
  getPerformanceForCombo(sbcId: string, cameraId: string) {
    if (!this.data) return null;

    const camera = this.getComponentById<CameraComponent>(cameraId);
    if (!camera) return null;

    const performanceEntry = this.data.compatibility_engine.performance_matrix.find(entry => 
      entry.sbc === sbcId && entry.camera_interface === camera.interface
    );

    return performanceEntry?.performance || null;
  }

  /**
   * Get configurator statistics
   */
  getStats(): ConfiguratorStats {
    if (!this.data) {
      return {
        total_components: 0,
        total_rules: 0,
        total_use_cases: 0,
        categories: 0,
        auto_generated_rules: 0,
        components_by_category: {},
        components_by_status: {} as any
      };
    }

    const componentsByCategory = Object.entries(this.data.component_categories).reduce((acc, [key, category]) => {
      acc[key] = category.components.length;
      return acc;
    }, {} as Record<string, number>);

    const componentsByStatus = this.getAllComponents().reduce((acc, component) => {
      acc[component.status] = (acc[component.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total_components: this.getAllComponents().length,
      total_rules: (this.data.compatibility_engine?.validation_rules?.length || 0) + 
                   (this.data.compatibility_engine?.structured_validation_rules?.length || 0),
      total_use_cases: this.data.use_case_templates?.length || 0,
      categories: Object.keys(this.data.component_categories).length,
      auto_generated_rules: (this.data.compatibility_engine?.structured_validation_rules || [])
        .filter((rule: any) => rule.auto_generated).length,
      components_by_category: componentsByCategory,
      components_by_status: componentsByStatus as any
    };
  }

  /**
   * Private helper methods
   */
  private getAllComponents(): HardwareComponent[] {
    if (!this.data) return [];

    return Object.values(this.data.component_categories)
      .flatMap(category => category.components);
  }

  private evaluateCompatibility(context: EvaluationContext): CompatibilityResult {
    if (!this.data || !this.ruleEvaluator) {
      return { compatible: false, errors: ['Service not initialized'], warnings: [] };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Only use structured validation rules (legacy rules removed)
    const allRules = this.data.compatibility_engine.structured_validation_rules || [];

    for (const rule of allRules) {
      try {
        const ruleTriggered = this.ruleEvaluator.evaluateRule(rule, context);
        
        if (ruleTriggered) {
          const message = this.formatRuleMessage(rule.message, context);
          
          // Debug logging for interface issues
          if (rule.rule_id === 'interface_compatibility') {
            console.debug('🚨 Interface compatibility rule triggered:', {
              rule_id: rule.rule_id,
              rule_type: rule.type,
              condition: rule.condition,
              parameters: rule.parameters,
              sbc_name: context.sbc?.name,
              sbc_interfaces: context.sbc?.interfaces,
              camera_name: context.camera?.name,
              camera_interface: context.camera?.interface,
              message
            });
          }
          
          if (rule.severity === 'error') {
            errors.push(message);
          } else if (rule.severity === 'warning') {
            warnings.push(message);
          }
        }
      } catch (error) {
        console.warn(`Error evaluating rule ${rule.rule_id}:`, error);
      }
    }

    // Get performance data if compatible
    let performance = undefined;
    if (errors.length === 0 && context.sbc && context.camera) {
      performance = this.getPerformanceForCombo(context.sbc.id, context.camera.id) || undefined;
    }

    return {
      compatible: errors.length === 0,
      errors,
      warnings,
      performance
    };
  }

  private formatRuleMessage(template: string, context: EvaluationContext): string {
    let message = template;

    // Replace template variables
    if (context.sbc) {
      message = message.replace(/{sbc\.name}/g, context.sbc.name);
      message = message.replace(/{sbc\.id}/g, context.sbc.id);
    }
    
    if (context.camera) {
      message = message.replace(/{camera\.name}/g, context.camera.name);
      message = message.replace(/{camera\.interface}/g, context.camera.interface);
    }
    
    if (context.wifi) {
      message = message.replace(/{wifi\.name}/g, context.wifi.name);
      message = message.replace(/{wifi\.chipset}/g, context.wifi.chipset);
    }

    return message;
  }

  private validateConfigData(data: any): void {
    if (!data) {
      throw new Error('Configuration data is required');
    }

    if (!data.component_categories) {
      throw new Error('component_categories is required');
    }

    if (!data.compatibility_engine) {
      throw new Error('compatibility_engine is required');
    }

    // Additional validation can be added here
  }
}

/**
 * Rule Evaluator - handles both legacy and structured rules
 */
class RuleEvaluator {
  private configData: any = null;

  initialize(data: HardwareConfiguratorData): void {
    this.configData = data.compatibility_engine?.configuration;
  }

  evaluateRule(rule: ValidationRule, context: EvaluationContext): boolean {
    try {
      return this.evaluateStructuredRule(rule, context);
    } catch (error) {
      console.warn(`Failed to evaluate rule ${rule.rule_id}:`, error);
      return false;
    }
  }

  private evaluateStructuredRule(rule: ValidationRule, context: EvaluationContext): boolean {
    const { type, parameters } = rule;

    // Map old rule types to new ones for backward compatibility
    let mappedType = type;
    switch (type) {
      case 'interface_mismatch':
        mappedType = 'interface_compatibility';
        break;
      case 'role_incompatible':
        mappedType = 'role_compatibility'; 
        break;
      case 'manufacturer_mismatch':
        mappedType = 'manufacturer_compatibility';
        break;
    }

    switch (mappedType) {
      case 'interface_compatibility':
        return this.checkInterfaceCompatibility(parameters, context);
      
      case 'role_compatibility':
        return this.checkRoleCompatibility(parameters, context);
      
      case 'status_check':
        return this.checkStatusRequirements(parameters, context);
      
      case 'feature_check':
        return this.checkFeatureRequirements(parameters, context);
      
      case 'count_check':
        return this.checkCountLimits(parameters, context);
      
      case 'manufacturer_compatibility':
        return this.checkManufacturerCompatibility(parameters, context);
      
      case 'chipset_whitelist':
        return this.checkChipsetWhitelist(parameters, context);

      default:
        console.warn(`Unknown rule type: ${type} (mapped: ${mappedType})`);
        return false;
    }
  }


  // Modern structured rule evaluation methods
  private checkInterfaceCompatibility(params: any, context: EvaluationContext): boolean {
    if (!context.camera || !context.sbc) return false;
    
    const cameraInterface = context.camera.interface;
    const sbcInterfaces = context.sbc.interfaces;
    
    // Handle old parameter structure with required_interface
    if (params.required_interface) {
      const requiredInterface = params.required_interface;
      return cameraInterface === requiredInterface && !this.isInterfaceSupported(requiredInterface, sbcInterfaces);
    }
    
    // Default: Camera requires an interface that SBC doesn't have
    return !this.isInterfaceSupported(cameraInterface, sbcInterfaces);
  }

  private isInterfaceSupported(requiredInterface: string, availableInterfaces: string[]): boolean {
    // Direct match
    if (availableInterfaces.includes(requiredInterface)) {
      return true;
    }
    
    // Handle generic interface mapping
    const interfaceMapping: Record<string, string[]> = {
      'usb': ['usb', 'usb2', 'usb3'],
      'hdmi': ['hdmi', 'hdmi_in', 'hdmi_out'],
      'csi': ['csi', 'mipi_csi']
    };
    
    // Check if the required interface has compatible variants
    const compatibleInterfaces = interfaceMapping[requiredInterface];
    if (compatibleInterfaces) {
      return compatibleInterfaces.some(intf => availableInterfaces.includes(intf));
    }
    
    // Check reverse mapping (e.g., if camera needs usb2, check if SBC supports generic usb)
    for (const [generic, specifics] of Object.entries(interfaceMapping)) {
      if (specifics.includes(requiredInterface)) {
        if (availableInterfaces.includes(generic) || 
            specifics.some(intf => availableInterfaces.includes(intf))) {
          return true;
        }
      }
    }
    
    return false;
  }

  private checkRoleCompatibility(params: any, context: EvaluationContext): boolean {
    if (!context.selected_role || !context.sbc) return false;
    
    const supportedRoles = context.sbc.role_support;
    const requiredRole = context.selected_role;
    
    // SBC doesn't support the required role and doesn't support 'both'
    return !supportedRoles.includes(requiredRole as any) && !supportedRoles.includes('both');
  }

  private checkStatusRequirements(params: any, context: EvaluationContext): boolean {
    // Handle new parameter structure
    if (params.status_filter) {
      const statusFilter = params.status_filter;
      const component = context[statusFilter.component];
      if (!component) return false;
      
      // Check forbidden statuses
      if (statusFilter.forbidden_statuses?.includes(component.status)) {
        return true; // Rule triggered - status is forbidden
      }
      
      // Check allowed statuses
      if (statusFilter.allowed_statuses && !statusFilter.allowed_statuses.includes(component.status)) {
        return true; // Rule triggered - status not allowed
      }
      
      return false;
    }
    
    // Handle old parameter structure
    if (params.component_type && params.status) {
      const component = context[params.component_type];
      if (!component) return false;
      
      return params.operator === 'equals' ? 
        component.status === params.status : 
        component.status !== params.status;
    }
    
    return false;
  }

  private checkFeatureRequirements(params: any, context: EvaluationContext): boolean {
    // Handle new parameter structure
    if (params.feature_requirements) {
      const featureReq = params.feature_requirements;
      const component = context[featureReq.component];
      if (!component) return false;
      
      const componentFeatures = component.features || [];
      
      // Check if required features are present
      if (featureReq.required_features) {
        const hasAllRequired = featureReq.required_features.every((feature: string) => 
          componentFeatures.includes(feature)
        );
        if (!hasAllRequired) return false; // Don't trigger if missing required features
      }
      
      // Check interface constraints for features
      if (featureReq.interface_constraints && component.interface) {
        const hasConstraintViolation = featureReq.required_features?.some((feature: string) => 
          componentFeatures.includes(feature) && 
          !featureReq.interface_constraints.includes(component.interface)
        );
        if (hasConstraintViolation) return true; // Rule triggered - constraint violated
      }
      
      return false;
    }
    
    // Handle old parameter structure
    if (params.component_type && params.required_features) {
      const component = context[params.component_type];
      if (!component || !component.features) return false;
      
      if (params.operator === 'and') {
        return params.required_features.every((feature: string) => component.features.includes(feature));
      } else {
        return params.required_features.some((feature: string) => component.features.includes(feature));
      }
    }
    
    return false;
  }

  private checkCountLimits(params: any, context: EvaluationContext): boolean {
    // Handle new parameter structure
    if (params.count_limits) {
      const countLimits = params.count_limits;
      const value = context[countLimits.field];
      if (typeof value !== 'number') return false;
      
      // Check minimum limit
      if (countLimits.min !== undefined && value < countLimits.min) {
        return true; // Rule triggered - below minimum
      }
      
      // Check maximum limit  
      if (countLimits.max !== undefined && value > countLimits.max) {
        return true; // Rule triggered - above maximum
      }
      
      return false;
    }
    
    // Handle old parameter structure
    if (params.count_field && params.threshold && params.operator) {
      const value = context[params.count_field];
      if (typeof value !== 'number') return false;
      
      switch (params.operator) {
        case 'gt': return value > params.threshold;
        case 'gte': return value >= params.threshold;
        case 'lt': return value < params.threshold;
        case 'lte': return value <= params.threshold;
        case 'eq': return value === params.threshold;
        default: return false;
      }
    }
    
    return false;
  }

  private checkManufacturerCompatibility(params: any, context: EvaluationContext): boolean {
    // Handle new parameter structure
    if (params.manufacturer_filter) {
      return this.checkManufacturerCompatibilityNew(params, context);
    }
    
    // Handle old parameter structure (backward compatibility)
    if (params.component1_type && params.component2_type) {
      return this.checkManufacturerCompatibilityLegacy(params, context);
    }
    
    return false;
  }
  
  private checkManufacturerCompatibilityNew(params: any, context: EvaluationContext): boolean {
    const manufacturerFilter = params.manufacturer_filter;
    
    // Get target component
    const targetComponent = context[manufacturerFilter.component];
    if (!targetComponent) return false;
    
    const targetManufacturer = targetComponent.manufacturer;
    
    // Check must_be constraints
    if (manufacturerFilter.must_be) {
      const matchesRequired = manufacturerFilter.must_be.includes(targetManufacturer);
      
      // If this component must be one of the specified manufacturers but isn't
      if (!matchesRequired) {
        return false; // Don't trigger - this rule doesn't apply
      }
      
      // If we need to check cross-component compatibility
      if (manufacturerFilter.cross_check) {
        const otherComponent = context[manufacturerFilter.cross_check.component];
        
        // Check if other component must exist but doesn't
        if (manufacturerFilter.cross_check.must_exist && !otherComponent) {
          return false; // Rule doesn't apply if required component is missing
        }
        
        if (!otherComponent) return false;
        
        const otherManufacturer = otherComponent.manufacturer;
        
        // Apply the cross-check operator
        switch (manufacturerFilter.cross_check.operator) {
          case 'different':
            return targetManufacturer !== otherManufacturer;
          case 'same':
            return targetManufacturer === otherManufacturer;
          default:
            return false;
        }
      } else {
        // If there's no cross-check, trigger the rule for all matching manufacturers
        return true;
      }
    }
    
    // Check cannot_be constraints
    if (manufacturerFilter.cannot_be) {
      if (manufacturerFilter.cannot_be.includes(targetManufacturer)) {
        return true; // Rule triggered - manufacturer in forbidden list
      }
    }
    
    return false;
  }
  
  private checkManufacturerCompatibilityLegacy(params: any, context: EvaluationContext): boolean {
    const component1Type = params.component1_type;
    const component2Type = params.component2_type;
    const component1 = context[component1Type];
    const component2 = context[component2Type];
    
    if (!component1 || !component2) return false;
    
    const result = params.operator === 'different' ? 
      component1.manufacturer !== component2.manufacturer :
      component1.manufacturer === component2.manufacturer;
    
    return result;
  }

  private checkChipsetWhitelist(params: any, context: EvaluationContext): boolean {
    // Handle new parameter structure
    if (params.chipset_whitelist) {
      const whitelist = params.chipset_whitelist;
      const wifiComponent = context.wifi;
      if (!wifiComponent || !wifiComponent.chipset) return false;
      
      // Rule triggers if chipset is NOT in whitelist
      return !whitelist.includes(wifiComponent.chipset);
    }
    
    // Handle old parameter structure
    if (params.component_type || params.use_global_whitelist) {
      const componentType = params.component_type || 'wifi';
      const component = context[componentType];
      
      if (!component || !component.chipset) return false;
      
      const whitelist = params.use_global_whitelist ? 
        this.configData?.supported_chipsets || [] :
        params.whitelist || [];
      
      return !whitelist.includes(component.chipset);
    }
    
    return false;
  }

}

// Export singleton instance
export const hardwareConfiguratorService = new HardwareConfiguratorService();