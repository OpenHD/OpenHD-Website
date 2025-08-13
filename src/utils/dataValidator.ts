/**
 * Data validation utilities for hardware configurator
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class DataValidator {
  /**
   * Validate hardware configurator JSON data
   */
  static validateConfiguratorData(data: any): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Check required top-level structure
    if (!data.component_categories) {
      result.errors.push('Missing component_categories');
      result.isValid = false;
    }

    if (!data.compatibility_engine) {
      result.errors.push('Missing compatibility_engine');
      result.isValid = false;
    }

    // Validate component consistency
    this.validateComponentConsistency(data, result);
    
    // Validate price consistency
    this.validatePriceConsistency(data, result);
    
    // Validate compatibility lists
    this.validateCompatibilityLists(data, result);

    return result;
  }

  private static validateComponentConsistency(data: any, result: ValidationResult) {
    if (!data.component_categories) return;

    Object.entries(data.component_categories).forEach(([categoryName, category]: [string, any]) => {
      if (!category.components) {
        result.errors.push(`Category ${categoryName} missing components array`);
        result.isValid = false;
        return;
      }

      category.components.forEach((component: any, index: number) => {
        const componentPath = `${categoryName}[${index}]`;

        // Check required fields
        if (!component.id) {
          result.errors.push(`${componentPath}: Missing required field 'id'`);
          result.isValid = false;
        }

        if (!component.name) {
          result.errors.push(`${componentPath}: Missing required field 'name'`);
          result.isValid = false;
        }

        if (!component.status) {
          result.warnings.push(`${componentPath}: Missing status field`);
        }

        // Check status values
        const validStatuses = ['recommended', 'supported', 'legacy', 'development', 'specialized', 'limited'];
        if (component.status && !validStatuses.includes(component.status)) {
          result.warnings.push(`${componentPath}: Invalid status '${component.status}'`);
        }

        // Check category-specific requirements
        if (categoryName === 'sbcs') {
          if (!component.role_support || !Array.isArray(component.role_support)) {
            result.errors.push(`${componentPath}: SBC missing role_support array`);
            result.isValid = false;
          }

          if (!component.interfaces || !Array.isArray(component.interfaces)) {
            result.errors.push(`${componentPath}: SBC missing interfaces array`);
            result.isValid = false;
          }
        }

        if (categoryName === 'cameras') {
          if (!component.interface) {
            result.errors.push(`${componentPath}: Camera missing interface`);
            result.isValid = false;
          }

          if (!component.sensor) {
            result.warnings.push(`${componentPath}: Camera missing sensor information`);
          }
        }

        if (categoryName === 'wifi_adapters') {
          if (!component.chipset) {
            result.errors.push(`${componentPath}: WiFi adapter missing chipset`);
            result.isValid = false;
          }

          if (!component.bands || !Array.isArray(component.bands)) {
            result.errors.push(`${componentPath}: WiFi adapter missing bands array`);
            result.isValid = false;
          }
        }
      });
    });
  }

  private static validatePriceConsistency(data: any, result: ValidationResult) {
    if (!data.component_categories) return;

    // Check for suspiciously consistent pricing
    Object.entries(data.component_categories).forEach(([categoryName, category]: [string, any]) => {
      if (!category.components) return;

      const pricesMap = new Map<number, string[]>();
      
      category.components.forEach((component: any) => {
        if (component.price_usd) {
          if (!pricesMap.has(component.price_usd)) {
            pricesMap.set(component.price_usd, []);
          }
          pricesMap.get(component.price_usd)!.push(component.name);
        }
      });

      // Flag if too many components have the same price
      pricesMap.forEach((components, price) => {
        if (components.length >= 3) {
          result.warnings.push(
            `Suspicious: ${components.length} ${categoryName} components have identical price $${price}: ${components.join(', ')}`
          );
        }
      });
    });
  }

  private static validateCompatibilityLists(data: any, result: ValidationResult) {
    if (!data.component_categories?.cameras) return;

    // Check camera compatibility lists
    data.component_categories.cameras.components.forEach((camera: any) => {
      if (camera.compatible_sbcs) {
        camera.compatible_sbcs.forEach((sbcId: string) => {
          const sbcExists = data.component_categories.sbcs?.components.some((sbc: any) => sbc.id === sbcId);
          if (!sbcExists) {
            result.warnings.push(`Camera ${camera.name}: References non-existent SBC '${sbcId}'`);
          }
        });
      }
    });

    // Check bidirectional compatibility
    const cameraCompatibilityMap = new Map<string, string[]>();
    data.component_categories.cameras.components.forEach((camera: any) => {
      if (camera.compatible_sbcs) {
        camera.compatible_sbcs.forEach((sbcId: string) => {
          if (!cameraCompatibilityMap.has(sbcId)) {
            cameraCompatibilityMap.set(sbcId, []);
          }
          cameraCompatibilityMap.get(sbcId)!.push(camera.id);
        });
      }
    });

    // Suggest missing compatibility entries
    data.component_categories.sbcs?.components.forEach((sbc: any) => {
      const compatibleCameras = cameraCompatibilityMap.get(sbc.id) || [];
      if (compatibleCameras.length === 0 && sbc.interfaces?.includes('csi')) {
        result.warnings.push(`SBC ${sbc.name}: No cameras list it as compatible, but it has CSI interface`);
      }
    });
  }

  /**
   * Validate individual component data
   */
  static validateComponent(component: any, category: string): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Basic field validation
    if (!component.id) {
      result.errors.push('Missing required field: id');
      result.isValid = false;
    } else if (!/^[a-z0-9_]+$/.test(component.id)) {
      result.warnings.push('ID should only contain lowercase letters, numbers, and underscores');
    }

    if (!component.name) {
      result.errors.push('Missing required field: name');
      result.isValid = false;
    }

    // URL validation
    if (component.links) {
      Object.entries(component.links).forEach(([key, url]: [string, any]) => {
        if (typeof url === 'string') {
          try {
            new URL(url);
          } catch {
            result.warnings.push(`Invalid URL in links.${key}: ${url}`);
          }
        }
      });
    }

    return result;
  }
}
