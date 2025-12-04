#include <ArduinoMqttClient.h>
#include <ESP8266WiFi.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);

const char broker[] = "test.mosquitto.org";
int port = 1883;
const char topicM[] = "/MDU/ITE130/Group5/Moisture";
const char topicT[] = "/MDU/ITE130/Group5/Time";

//set interval for sending messages (milliseconds)
const long interval = 8000;
unsigned long previousMillis = 0;

int count = 0;


void setup() {

  // Start the serial communication
  Serial.begin(115200);
  Serial.println();

  // Change **** to SSID and password of WiFi
  WiFi.begin("MDU_guest", "Frozen202512");

  timeClient.begin();

  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());

  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(broker);

  if (!mqttClient.connect(broker, port)) {
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqttClient.connectError());

    while (1)
      ;
  }

  Serial.println("You're connected to the MQTT broker!");
  Serial.println();

}

void loop() {
  // call poll() regularly to allow the library to send MQTT keep alive which
  // avoids being disconnected by the broker
  mqttClient.poll();

  timeClient.update();

  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    // save the last time a message was sent
    previousMillis = currentMillis;

    //record value from A0
    int value = analogRead(A0);

    // Print the the moisture topic in serial monitor
    Serial.print("Sending message to topic: ");
    Serial.println(topicM);
    Serial.println(value);

    // send message in moisture topic with the value of the sensor
    mqttClient.beginMessage(topicM);
    mqttClient.print(value);
    mqttClient.endMessage();

    mqttClient.beginMessage(topicT);
    mqttClient.print(timeClient.getFormattedTime());
    mqttClient.endMessage();

    Serial.println();
  }
}