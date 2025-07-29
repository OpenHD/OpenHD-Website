# QOpenHD and Custom MAVLink

Integrating custom MAVLink messages with QOpenHD ground station software.

## Overview

Custom MAVLink integration enables:
- **Custom Telemetry**: Display custom flight data
- **Special Commands**: Send custom commands to aircraft
- **Sensor Data**: Handle custom sensor information
- **Mission Extensions**: Extend mission capabilities

## MAVLink Basics

### Message Structure
MAVLink messages consist of:
- **System ID**: Identifies the sending system
- **Component ID**: Identifies the component within system
- **Message ID**: Unique identifier for message type
- **Payload**: Message-specific data
- **Checksum**: Error detection

### Message Types
- **Common Messages**: Standard MAVLink messages
- **Custom Messages**: User-defined messages (ID 24000+)
- **Dialects**: Extended message sets
- **Microservices**: Specialized message groups

## QOpenHD Architecture

### MAVLink Integration
```cpp
// MAVLink message handling in QOpenHD
class MAVLinkManager : public QObject {
    Q_OBJECT

public:
    explicit MAVLinkManager(QObject *parent = nullptr);
    void processMessage(const mavlink_message_t &message);

signals:
    void customMessageReceived(const mavlink_message_t &message);

private slots:
    void handleCustomMessage(const mavlink_message_t &message);
};
```

### Message Processing Pipeline
```
UDP Socket → MAVLink Parser → Message Router → Custom Handler → UI Update
```

### Widget System
QOpenHD uses a widget-based system for displaying information:
- **Telemetry Widgets**: Display flight data
- **Custom Widgets**: User-defined display elements
- **OSD Elements**: On-screen display overlays
- **Controls**: Interactive control elements

## Custom Message Definition

### MAVLink XML Definition
```xml
<!-- custom_messages.xml -->
<mavlink>
  <include>common.xml</include>
  
  <enums>
    <enum name="CUSTOM_SENSOR_TYPE">
      <entry value="0" name="TEMPERATURE"/>
      <entry value="1" name="HUMIDITY"/>
      <entry value="2" name="PRESSURE"/>
    </enum>
  </enums>

  <messages>
    <message id="24001" name="CUSTOM_SENSOR_DATA">
      <description>Custom sensor data message</description>
      <field type="uint64_t" name="time_usec">Timestamp (microseconds since UNIX epoch)</field>
      <field type="uint8_t" name="sensor_type">Sensor type (CUSTOM_SENSOR_TYPE)</field>
      <field type="float" name="value">Sensor value</field>
      <field type="float" name="temperature">Temperature (celsius)</field>
    </message>

    <message id="24002" name="CUSTOM_COMMAND">
      <description>Custom command message</description>
      <field type="uint8_t" name="target_system">System ID</field>
      <field type="uint8_t" name="target_component">Component ID</field>
      <field type="uint16_t" name="command">Command ID</field>
      <field type="float" name="param1">Parameter 1</field>
      <field type="float" name="param2">Parameter 2</field>
    </message>
  </messages>
</mavlink>
```

### Code Generation
```bash
# Generate C headers from XML
python -m pymavlink.tools.mavgen --lang=C \
    --wire-protocol=2.0 \
    --output=generated \
    custom_messages.xml

# Generate QOpenHD-compatible code
python scripts/generate_qopenhd_messages.py custom_messages.xml
```

## QOpenHD Integration

### Message Handler Implementation
```cpp
// CustomMessageHandler.h
#include <QObject>
#include <mavlink.h>

class CustomMessageHandler : public QObject {
    Q_OBJECT

public:
    explicit CustomMessageHandler(QObject *parent = nullptr);
    void handleMessage(const mavlink_message_t &message);

signals:
    void sensorDataReceived(uint8_t sensor_type, float value, float temperature);
    void customCommandReceived(uint16_t command, float param1, float param2);

private:
    void handleSensorData(const mavlink_message_t &message);
    void handleCustomCommand(const mavlink_message_t &message);
};

// CustomMessageHandler.cpp
void CustomMessageHandler::handleMessage(const mavlink_message_t &message) {
    switch (message.msgid) {
        case MAVLINK_MSG_ID_CUSTOM_SENSOR_DATA:
            handleSensorData(message);
            break;
        case MAVLINK_MSG_ID_CUSTOM_COMMAND:
            handleCustomCommand(message);
            break;
        default:
            break;
    }
}

void CustomMessageHandler::handleSensorData(const mavlink_message_t &message) {
    mavlink_custom_sensor_data_t sensor_data;
    mavlink_msg_custom_sensor_data_decode(&message, &sensor_data);
    
    emit sensorDataReceived(sensor_data.sensor_type, 
                           sensor_data.value, 
                           sensor_data.temperature);
}
```

### Widget Creation
```cpp
// CustomSensorWidget.h
#include <QWidget>
#include <QLabel>
#include <QVBoxLayout>

class CustomSensorWidget : public QWidget {
    Q_OBJECT

public:
    explicit CustomSensorWidget(QWidget *parent = nullptr);

public slots:
    void updateSensorData(uint8_t sensor_type, float value, float temperature);

private:
    QLabel *m_sensorTypeLabel;
    QLabel *m_valueLabel;
    QLabel *m_temperatureLabel;
    QVBoxLayout *m_layout;
    
    QString getSensorTypeName(uint8_t type);
};

// CustomSensorWidget.cpp
CustomSensorWidget::CustomSensorWidget(QWidget *parent)
    : QWidget(parent)
{
    m_layout = new QVBoxLayout(this);
    
    m_sensorTypeLabel = new QLabel("Sensor: Unknown");
    m_valueLabel = new QLabel("Value: ---");
    m_temperatureLabel = new QLabel("Temp: ---°C");
    
    m_layout->addWidget(m_sensorTypeLabel);
    m_layout->addWidget(m_valueLabel);
    m_layout->addWidget(m_temperatureLabel);
    
    setLayout(m_layout);
}

void CustomSensorWidget::updateSensorData(uint8_t sensor_type, float value, float temperature) {
    m_sensorTypeLabel->setText(QString("Sensor: %1").arg(getSensorTypeName(sensor_type)));
    m_valueLabel->setText(QString("Value: %1").arg(value, 0, 'f', 2));
    m_temperatureLabel->setText(QString("Temp: %1°C").arg(temperature, 0, 'f', 1));
}
```

### Widget Registration
```cpp
// In main application
#include "CustomMessageHandler.h"
#include "CustomSensorWidget.h"

void MainApplication::setupCustomMAVLink() {
    // Create custom message handler
    m_customHandler = new CustomMessageHandler(this);
    
    // Create custom widget
    m_sensorWidget = new CustomSensorWidget();
    
    // Connect signals
    connect(m_customHandler, &CustomMessageHandler::sensorDataReceived,
            m_sensorWidget, &CustomSensorWidget::updateSensorData);
    
    // Register with MAVLink manager
    m_mavlinkManager->registerCustomHandler(m_customHandler);
    
    // Add widget to UI
    ui->customWidgetArea->addWidget(m_sensorWidget);
}
```

## Command Sending

### Command Interface
```cpp
// CustomCommandSender.h
class CustomCommandSender : public QObject {
    Q_OBJECT

public:
    explicit CustomCommandSender(QObject *parent = nullptr);
    
    void sendCustomCommand(uint8_t target_system,
                          uint8_t target_component,
                          uint16_t command,
                          float param1 = 0.0f,
                          float param2 = 0.0f);

private:
    MAVLinkManager *m_mavlinkManager;
};

// Implementation
void CustomCommandSender::sendCustomCommand(uint8_t target_system,
                                           uint8_t target_component,
                                           uint16_t command,
                                           float param1,
                                           float param2) {
    mavlink_message_t message;
    mavlink_custom_command_t cmd;
    
    cmd.target_system = target_system;
    cmd.target_component = target_component;
    cmd.command = command;
    cmd.param1 = param1;
    cmd.param2 = param2;
    
    mavlink_msg_custom_command_encode(255, 190, &message, &cmd);
    m_mavlinkManager->sendMessage(message);
}
```

### UI Integration
```cpp
// Control panel for custom commands
class CustomCommandPanel : public QWidget {
    Q_OBJECT

public:
    explicit CustomCommandPanel(QWidget *parent = nullptr);

private slots:
    void sendCommand1();
    void sendCommand2();
    void sendParameterizedCommand();

private:
    CustomCommandSender *m_commandSender;
    QPushButton *m_command1Button;
    QPushButton *m_command2Button;
    QSpinBox *m_param1SpinBox;
    QSpinBox *m_param2SpinBox;
    QPushButton *m_sendParamButton;
};
```

## Configuration and Settings

### Settings Storage
```cpp
// Store custom widget settings
class CustomWidgetSettings {
public:
    static void saveSettings(const QString &widgetName, const QVariant &settings);
    static QVariant loadSettings(const QString &widgetName);
    
    static void saveWidgetGeometry(const QString &widgetName, const QWidget *widget);
    static void restoreWidgetGeometry(const QString &widgetName, QWidget *widget);
};

// Usage
void CustomSensorWidget::saveSettings() {
    QVariantMap settings;
    settings["visible"] = isVisible();
    settings["position"] = pos();
    settings["size"] = size();
    settings["update_rate"] = m_updateRate;
    
    CustomWidgetSettings::saveSettings("CustomSensorWidget", settings);
}
```

### Configuration Dialog
```cpp
// Custom widget configuration
class CustomWidgetConfig : public QDialog {
    Q_OBJECT

public:
    explicit CustomWidgetConfig(QWidget *parent = nullptr);
    
    void setUpdateRate(int rate);
    int updateRate() const;
    
    void setVisibleSensors(const QList<int> &sensors);
    QList<int> visibleSensors() const;

private:
    QSpinBox *m_updateRateSpinBox;
    QListWidget *m_sensorListWidget;
};
```

## Advanced Features

### Data Logging
```cpp
// Log custom MAVLink data
class CustomDataLogger : public QObject {
    Q_OBJECT

public:
    explicit CustomDataLogger(const QString &logPath, QObject *parent = nullptr);
    
public slots:
    void logSensorData(uint8_t sensor_type, float value, float temperature);
    void logCustomCommand(uint16_t command, float param1, float param2);

private:
    QFile m_logFile;
    QTextStream m_logStream;
    
    void writeLogEntry(const QString &messageType, const QVariantMap &data);
};
```

### Real-time Plotting
```cpp
// Plot custom sensor data
#include <QtCharts>

class CustomDataPlot : public QChartView {
    Q_OBJECT

public:
    explicit CustomDataPlot(QWidget *parent = nullptr);
    
public slots:
    void addDataPoint(uint8_t sensor_type, float value, qint64 timestamp);
    void clearData();

private:
    QChart *m_chart;
    QLineSeries *m_series;
    QValueAxis *m_axisX;
    QValueAxis *m_axisY;
    
    static const int MAX_POINTS = 100;
};
```

### Plugin System
```cpp
// Custom MAVLink plugin interface
class CustomMAVLinkPlugin {
public:
    virtual ~CustomMAVLinkPlugin() = default;
    
    virtual QString pluginName() const = 0;
    virtual QStringList supportedMessages() const = 0;
    virtual QWidget* createWidget() = 0;
    virtual void handleMessage(const mavlink_message_t &message) = 0;
};

// Plugin registration
#define REGISTER_CUSTOM_MAVLINK_PLUGIN(className) \
    extern "C" CustomMAVLinkPlugin* createPlugin() { \
        return new className(); \
    }
```

## Testing and Debugging

### Message Simulation
```cpp
// Simulate custom MAVLink messages for testing
class MAVLinkSimulator : public QObject {
    Q_OBJECT

public:
    explicit MAVLinkSimulator(QObject *parent = nullptr);
    
    void startSimulation();
    void stopSimulation();
    
private slots:
    void generateSensorData();
    void generateRandomCommand();

private:
    QTimer *m_simulationTimer;
    CustomMessageHandler *m_messageHandler;
};
```

### Debug Logging
```cpp
// Debug MAVLink messages
#define MAVLINK_DEBUG(msg) \
    qDebug() << "MAVLink:" << __FUNCTION__ << msg

void CustomMessageHandler::handleSensorData(const mavlink_message_t &message) {
    mavlink_custom_sensor_data_t sensor_data;
    mavlink_msg_custom_sensor_data_decode(&message, &sensor_data);
    
    MAVLINK_DEBUG(QString("Sensor data: type=%1, value=%2, temp=%3")
                  .arg(sensor_data.sensor_type)
                  .arg(sensor_data.value)
                  .arg(sensor_data.temperature));
    
    emit sensorDataReceived(sensor_data.sensor_type, 
                           sensor_data.value, 
                           sensor_data.temperature);
}
```

:::info MAVLink Resources
- MAVLink Developer Guide: https://mavlink.io/
- QOpenHD Source Code: https://github.com/OpenHD/QOpenHD
- MAVLink Message Definitions: https://github.com/mavlink/mavlink
:::

:::warning Message ID Conflicts
Always use message IDs in the custom range (24000+) to avoid conflicts with standard MAVLink messages.
:::