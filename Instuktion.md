# Instruktioner för Moist-o-tron

## Inledning 

Detta är ett projekt för att mäta fuktnivån i en krukväxt med en sensor. Den genomförs med en NodeMCU esp8266 som är en del av ett Arduino kit.

## Material och Program som används

### Material

* Dator
* Arduino kit
* Esp8266
* Capacitive soil moisture sensor v2.0

### Program

* Arduino IDE
* Vs Code

## Bygga

Sätt fast Mikrokontrollern på breadboarden och anslut den orangea sladden från sensorn till pin A0, röd till 3,3 och svart till GND på mikrokontrollern.

## Arduino IDE setup och Arduino programmering

### Installera

Vi börjar att installera Arduinos IDE eller Integrated Development Environment som tillåter oss att skriva kod, kompilera denna och skicka till vår mikroprocessor.

[Länk för att installera](https://www.arduino.cc/en/software/#ide)

Installera versionen för ditt operativsystem och ändra ingenting i installationsprocessen och godkänn eventuella popups.

### Inställningar

Gå in på **Preferences** under fliken **File** (Se bild)

![bild](/bilder/Preferences.png)

För att sedan klistra in följande:

`http://arduino.esp8266.com/stable/package_esp8266com_index.json`

i rutan **Additional boards manager URLs** och tryck sedan på **OK**

Under fliken **BOARDS MANAGER** i den vänstra menyn sök sedan på **esp8266** och ladda ner följande 

![esp8266](/bilder/8266.png)

När det är klart gå till **Board** under fliken **Tools** (se bild)

![Boards](/bilder/boards.png)

och sedan under **esp8266** välj **Generic ESP8266 Module**

### Skicka kod till mikroprocessor

Börja med att koppla in din mikroprocessor till datorn och under fliken **Tools** se till att rätt **Port** är vald.

Klistra in följande kod:

```C++
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
```

Ändra `/MDU/ITE130/Group5/Moisture` till ett unikt namn för din topic och `"MDU_guest", "Frozen202512"` till ssid och lösenord till ditt WiFi.

Klicka sedan på knappen högst upp med en pil till höger som säger **Upload** och låt den tänka ett litet tag.

Koden för fuktsensorn är nu klar och installerad på mikrokontrollern.

## Websida med JS, HTML och CSS

Skapa dokumenten index.html, style.css och acquisition.js i en mapp i vs code och klistra in följande kod i respektive fil:

[index.html](https://github.com/sln25014/ite130-grupp5/blob/main/Websida/index.html)

[style.css](https://github.com/sln25014/ite130-grupp5/blob/main/Websida/style.css)

[acquisition.js](https://github.com/sln25014/ite130-grupp5/blob/main/Websida/acquisitions.js)

### Viktiga delar i koden

```JS
const brokerUrl = 'wss://test.mosquitto.org:8081';  // WebSocket-adress till MQTT-broker
const topic = '/MDU/ITE130/Group5/Moisture';        // Topic där sensorn publicerar data
const client = mqtt.connect(brokerUrl);              // Skapa MQTT-klient
```

Ändra `/MDU/ITE130/Group5/Moisture` till namnet på din topic
