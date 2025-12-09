#include <ArduinoMqttClient.h>
#include <ESP8266WiFi.h>

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

// Variables for MQTT connection and topic
const char broker[] = "test.mosquitto.org";
int port = 1883;
const char topic[] = "/MDU/ITE130/Group5/Moisture";

//set interval for sending messages (milliseconds)
const long interval = 8000;
unsigned long previousMillis = 0;

void setup() {

  // Start the serial communication
  Serial.begin(115200);
  Serial.println();

  // Connecting to the WiFi, change to SSID and password of WiFi
  WiFi.begin("MDU_guest", "Frozen202512");

  // Prints in serial monitor
  Serial.print("Connecting");

  // Print "." as long as the WiFi is not connected
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  // Prints in serial monitor
  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());

  // Prints in serial monitor
  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(broker);

  // If the connection to the MQTT broker fails print error message
  if (!mqttClient.connect(broker, port)) {
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqttClient.connectError());

    while (1)
      ;
  }

  // Writes in serial monitor
  Serial.println("You're connected to the MQTT broker!");
  Serial.println();
}

void loop() {
  // call poll() regularly to allow the library to send MQTT keep alive which
  // avoids being disconnected by the broker
  mqttClient.poll();

  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    // save the last time a message was sent
    previousMillis = currentMillis;

    // Assign the reading from pin A0 where the sensor is conneceted to "value"
    int value = analogRead(A0);

    // Print the the topic in serial monitor
    Serial.print("Sending message to topic: ");
    Serial.println(topic);
    Serial.println(value);

    // send message in topic with the value of the sensor
    mqttClient.beginMessage(topic);
    mqttClient.print(value);
    mqttClient.endMessage();

    Serial.println();
  }
}