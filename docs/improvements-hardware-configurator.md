# Hardware Configurator - Datenverbesserungen

## Identifizierte Probleme:

### 1. **Preisinkonsistenzen**
- Alle Arducam Kameras haben identischen Preis von $37 USD
- Realistische Preise sollten recherchiert und aktualisiert werden
- Preisspannen teilweise zu ungenau ("varies" für X86)

### 2. **Fehlende Kompatibilitätsinformationen**
- Radxa IMX415 als "limited" markiert, aber keine Details zu Einschränkungen
- X86 Systeme: Fehlende spezifische USB-Kamera-Empfehlungen
- Thermal cameras: Fehlende Setup-Komplexität-Angaben

### 3. **Validation Rules zu generisch**
- Rule evaluation zu unsicher (Function constructor)
- Einige Conditions könnten spezifischer sein
- Performance Matrix unvollständig

### 4. **Verbesserungsvorschläge für JSON:**

```json
{
  "component_categories": {
    "cameras": {
      "components": [
        {
          "id": "arducam_imx708",
          "price_usd": 39,  // Aktueller Preis statt 37
          "price_last_updated": "2025-01-11",
          "setup_complexity": "beginner",
          "performance_notes": {
            "best_resolution": "1080p@60fps",
            "recommended_bitrate": "10-15 Mbps",
            "power_consumption": "1.2W"
          }
        }
      ]
    },
    "wifi_adapters": {
      "components": [
        {
          "id": "blm8812eu",
          "warnings": ["no_certification", "high_power"],
          "power_requirements": {
            "external_power_needed": true,
            "recommended_supply": "5V/2A"
          },
          "regulatory_notes": "Not FCC/CE certified - check local regulations"
        }
      ]
    }
  },
  "compatibility_engine": {
    "validation_rules": [
      {
        "rule_id": "power_compatibility",
        "type": "warning",
        "condition": "wifi.power_requirements.external_power_needed && !sbc.high_power_usb",
        "severity": "warning",
        "message": "WiFi adapter {wifi.name} may require external power supply"
      }
    ],
    "setup_complexity_matrix": {
      "beginner": ["rpi_zero_2", "rpi_4b"],
      "intermediate": ["rpi_cm4", "radxa_rock5a"],
      "advanced": ["radxa_rock5b", "openhd_custom"],
      "expert": ["x86_generic"]
    }
  }
}
```

### 5. **Zusätzliche Datenfelder empfohlen:**

- `setup_complexity`: "beginner" | "intermediate" | "advanced" | "expert"
- `power_requirements.external_power_needed`: boolean
- `performance_notes`: Realistische Performance-Erwartungen
- `price_last_updated`: Datum der letzten Preisüberprüfung
- `regulatory_notes`: Wichtige rechtliche Hinweise
- `troubleshooting_url`: Link zu bekannten Problemen/Lösungen

### 6. **Use Case Templates erweitern:**

```json
{
  "use_case_templates": [
    {
      "id": "micro_drone",
      "name": "Micro Drone (<250g)",
      "description": "Ultra-lightweight setup for micro drones",
      "weight_budget_grams": 30,
      "power_budget_watts": 5,
      "recommended_components": {
        "sbcs": ["rpi_zero_2"],
        "cameras": ["arducam_imx477m"],
        "wifi_adapters": ["taobao_rtl8812au"]
      },
      "required_features": ["lightweight", "low_power"]
    }
  ]
}
```
