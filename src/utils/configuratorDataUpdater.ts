/**
 * Auto-updater for configurator data - extracts new chipsets, interfaces etc.
 */

export class ConfiguratorDataUpdater {
  /**
   * Update configuration lists from component data automatically
   */
  static updateConfiguration(data: any): any {
    const updatedData = JSON.parse(JSON.stringify(data)); // Deep clone

    if (!updatedData.compatibility_engine) {
      updatedData.compatibility_engine = { configuration: {} };
    }

    if (!updatedData.compatibility_engine.configuration) {
      updatedData.compatibility_engine.configuration = {};
    }

    const config = updatedData.compatibility_engine.configuration;

    // Auto-update supported chipsets - check if enabled or not explicitly disabled
    const shouldAutoUpdate = config.auto_update_lists !== false;
    
    if (shouldAutoUpdate) {
      config.supported_chipsets = this.extractAllChipsets(updatedData);
      config.supported_interfaces = this.extractAllInterfaces(updatedData);
      config.valid_statuses = this.extractAllStatuses(updatedData);
      config.manufacturers = this.extractAllManufacturers(updatedData);
    }

    // Ensure dynamic_rules object exists
    if (!updatedData.compatibility_engine.dynamic_rules) {
      updatedData.compatibility_engine.dynamic_rules = {
        auto_generate_interface_rules: false,
        auto_generate_chipset_rules: false,
        auto_generate_manufacturer_warnings: false
      };
    }

    // Auto-generate basic rules if enabled
    if (updatedData.compatibility_engine.dynamic_rules.auto_generate_interface_rules) {
      this.generateInterfaceRules(updatedData);
    }

    if (updatedData.compatibility_engine.dynamic_rules.auto_generate_chipset_rules) {
      this.generateChipsetRules(updatedData);
    }

    // Add metadata about auto-generation
    if (!updatedData.metadata) {
      updatedData.metadata = {};
    }
    
    updatedData.metadata.last_auto_update = new Date().toISOString();
    updatedData.metadata.auto_extracted_data = {
      chipsets_count: config.supported_chipsets?.length || 0,
      interfaces_count: config.supported_interfaces?.length || 0,
      manufacturers_count: config.manufacturers?.length || 0
    };

    return updatedData;
  }

  private static extractAllChipsets(data: any): string[] {
    const chipsets = new Set<string>();
    
    // Extract from wifi adapters
    data.component_categories?.wifi_adapters?.components?.forEach((wifi: any) => {
      if (wifi.chipset) {
        chipsets.add(wifi.chipset);
      }
    });

    // Extract from any other components that might have chipsets
    Object.values(data.component_categories || {}).forEach((category: any) => {
      category.components?.forEach((component: any) => {
        if (component.chipset) {
          chipsets.add(component.chipset);
        }
      });
    });

    return Array.from(chipsets).sort();
  }

  private static extractAllInterfaces(data: any): string[] {
    const interfaces = new Set<string>();
    
    Object.values(data.component_categories || {}).forEach((category: any) => {
      category.components?.forEach((component: any) => {
        // Single interface
        if (component.interface) {
          interfaces.add(component.interface);
        }
        // Multiple interfaces
        if (Array.isArray(component.interfaces)) {
          component.interfaces.forEach((iface: string) => interfaces.add(iface));
        }
      });
    });

    return Array.from(interfaces).sort();
  }

  private static extractAllStatuses(data: any): string[] {
    const statuses = new Set<string>();
    
    Object.values(data.component_categories || {}).forEach((category: any) => {
      category.components?.forEach((component: any) => {
        if (component.status) {
          statuses.add(component.status);
        }
      });
    });

    return Array.from(statuses).sort();
  }

  private static extractAllManufacturers(data: any): string[] {
    const manufacturers = new Set<string>();
    
    Object.values(data.component_categories || {}).forEach((category: any) => {
      category.components?.forEach((component: any) => {
        if (component.manufacturer) {
          manufacturers.add(component.manufacturer);
        }
      });
    });

    return Array.from(manufacturers).sort();
  }

  private static generateInterfaceRules(data: any) {
    const interfaces = this.extractAllInterfaces(data);
    
    // Ensure structured_validation_rules exists
    if (!data.compatibility_engine.structured_validation_rules) {
      data.compatibility_engine.structured_validation_rules = [];
    }
    
    const rules = data.compatibility_engine.structured_validation_rules;

    // Generate interface compatibility rules for each interface
    interfaces.forEach(interfaceType => {
      const ruleExists = rules.some((rule: any) => 
        rule.type === 'interface_mismatch' && 
        rule.parameters?.required_interface === interfaceType
      );

      if (!ruleExists) {
        rules.push({
          rule_id: `auto_interface_${interfaceType}_compatibility`,
          type: 'interface_mismatch',
          severity: 'error',
          message: `Component requires ${interfaceType} interface but target doesn't support ${interfaceType}`,
          parameters: {
            required_interface: interfaceType,
            component_type: 'camera', // Default to camera, can be customized
            target_type: 'sbc'
          },
          auto_generated: true
        });
      }
    });
  }

  private static generateChipsetRules(data: any) {
    const chipsets = this.extractAllChipsets(data);
    
    // Ensure structured_validation_rules exists
    if (!data.compatibility_engine.structured_validation_rules) {
      data.compatibility_engine.structured_validation_rules = [];
    }
    
    const rules = data.compatibility_engine.structured_validation_rules;

    // Check if chipset whitelist rule exists
    const chipsetRuleExists = rules.some((rule: any) => 
      rule.type === 'chipset_whitelist'
    );

    if (!chipsetRuleExists && chipsets.length > 0) {
      rules.push({
        rule_id: 'auto_chipset_whitelist',
        type: 'chipset_whitelist',
        severity: 'error',
        message: 'WiFi chipset {wifi.chipset} is not supported by OpenHD',
        parameters: {
          component_type: 'wifi',
          use_global_whitelist: true
        },
        auto_generated: true
      });
    }
  }

  /**
   * Validate that all components reference valid chipsets/interfaces
   */
  static validateComponentReferences(data: any): string[] {
    const warnings: string[] = [];
    const config = data.compatibility_engine?.configuration;
    
    if (!config) return warnings;

    const validChipsets = new Set(config.supported_chipsets || []);
    const validInterfaces = new Set(config.supported_interfaces || []);
    const validStatuses = new Set(config.valid_statuses || []);

    Object.entries(data.component_categories || {}).forEach(([categoryName, category]: [string, any]) => {
      category.components?.forEach((component: any, index: number) => {
        const componentPath = `${categoryName}[${index}] (${component.name})`;

        // Check chipset
        if (component.chipset && !validChipsets.has(component.chipset)) {
          warnings.push(`${componentPath}: Unknown chipset '${component.chipset}'`);
        }

        // Check interface
        if (component.interface && !validInterfaces.has(component.interface)) {
          warnings.push(`${componentPath}: Unknown interface '${component.interface}'`);
        }

        // Check interfaces array
        if (Array.isArray(component.interfaces)) {
          component.interfaces.forEach((iface: string) => {
            if (!validInterfaces.has(iface)) {
              warnings.push(`${componentPath}: Unknown interface '${iface}' in interfaces array`);
            }
          });
        }

        // Check status
        if (component.status && !validStatuses.has(component.status)) {
          warnings.push(`${componentPath}: Unknown status '${component.status}'`);
        }
      });
    });

    return warnings;
  }

  /**
   * Generate usage report for configuration data
   */
  static generateUsageReport(data: any): any {
    const report = {
      chipset_usage: new Map<string, number>(),
      interface_usage: new Map<string, number>(),
      status_usage: new Map<string, number>(),
      manufacturer_usage: new Map<string, number>(),
      total_components: 0
    };

    Object.values(data.component_categories || {}).forEach((category: any) => {
      category.components?.forEach((component: any) => {
        report.total_components++;

        // Count chipset usage
        if (component.chipset) {
          report.chipset_usage.set(
            component.chipset,
            (report.chipset_usage.get(component.chipset) || 0) + 1
          );
        }

        // Count interface usage
        if (component.interface) {
          report.interface_usage.set(
            component.interface,
            (report.interface_usage.get(component.interface) || 0) + 1
          );
        }

        if (Array.isArray(component.interfaces)) {
          component.interfaces.forEach((iface: string) => {
            report.interface_usage.set(
              iface,
              (report.interface_usage.get(iface) || 0) + 1
            );
          });
        }

        // Count status usage
        if (component.status) {
          report.status_usage.set(
            component.status,
            (report.status_usage.get(component.status) || 0) + 1
          );
        }

        // Count manufacturer usage
        if (component.manufacturer) {
          report.manufacturer_usage.set(
            component.manufacturer,
            (report.manufacturer_usage.get(component.manufacturer) || 0) + 1
          );
        }
      });
    });

    // Convert Maps to Objects for JSON serialization
    return {
      chipset_usage: Object.fromEntries(report.chipset_usage),
      interface_usage: Object.fromEntries(report.interface_usage),
      status_usage: Object.fromEntries(report.status_usage),
      manufacturer_usage: Object.fromEntries(report.manufacturer_usage),
      total_components: report.total_components,
      generated_at: new Date().toISOString()
    };
  }
}
