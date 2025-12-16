# Slutredovisning-fuktsensor för jord

## Användare och kontext 

### Användare:

Privatpersoner som har krukväxter i hemmet och saknar djup kunskap om växters bevattningsbehov. 

### Kontext: 
Användning sker i hemmiljö, ofta i vardagen, via mobiltelefon.
Användaren vill snabbt få svar på om växten behöver vatten

Problem:
Användare förlitar sig ofta på gissning eller känsla, vilket kan leda till över-eller undervattning.

Lösning:
En IoT-baserad artefakt som mäter jordfuktighet och presenterar informationen visuellt och begripligt i realtid.

Kurskoppling: användarcentrerad design, kontextanalys, artefakt i vardagsmiljö


## Sensor och byggnation (BOM- Bill Of Materials) 

Projektet är byggt på med ett plusivo-kit som innehåller följande komponenter:

* _Capacative Soil Moisture Sensor v2.0_ - Den mäter jordens fuktighet genom resistansen. 
* _NodeMCU ESP8266_ - En mikrokontroller som ansluter sensorn till internet som skickar senordata via MQTT. 
* _9V Batteri med DC Sladd_ - Detta behövs för att hålla igång sensorn och mikrokontrollern.
* _Breadboard Power Supply_ - Kopplar batteriet till breadboard. 
* _Kopplingskablar_ - Används för anslutning mellan sensor och mikrokontroller.

Kurskoppling: mikrokotroller, sensorer, prototypbyggnaden, BOM

## Designanpassning mot användare och kontext 

Tydligt designanpassning:

Eftersom användaren oftats använder mobiltelefon, har vi 
* Valt moblianpassad webbdesign
* Visat information med:
   * Text (”Vattna mig”, ”Lagom”, ”Vattna inte mer”)
   * Graf (linjediagram)
   * Visuell indikator (gauge)'

Resultat:

Användaren behöver inte tolka rådata – systemet översätter mätvärden till begriplig information.

Kurskoppling: UX, informationsvisualisering, designbeslut utifrån användare


## Förväntad kunskap hos användaren

Artefakten ger användaren följande kunskap över tid:

* Fuktvärdet i realtid för växten
* Trender för fuktnivån
* Hur ofta en specifik växt behöver vatten
* Sambandet mellan tid, fuktighet och bevattning

Detta leder till:

* Minskad risk för övervattning
* Mer medveten växtskötsel
* Lärande genom visualiserad data

Kurskoppling: Data → Information → Kunskap

## Konstruktion för minskad omgivningspåverkan

För att göra sensorn mindre känslig för yttre påverkan:

* Sensorn placeras stabilt i jorden
* Elektroniken hålls ovan jord
* Möjlig enkel kapsling (t.ex.låda) för:
   * skydd mot vatten
   * minskad påverkan från beröring och ljus

Kurskoppling: robust konstruktion, fysisk artefakt

## Kod och systemarkitektur

Systemets flöde:

* Fuktsensor mäter fuktnivån
* ESP8266 lagrar data i variabeln `value` och skickar via en MQTT topic
* Websida prenumererar på vår topic
* Data visualiseras med:
   * Text
   * Gauge
   * Line chart
  
Använda tekniker:

* C++ (NodeMCU programmering)
* MQTT (publish/subscribe)
* JavaScript, HTML, CSS 
* Charts.js

## Genomförande

1. Koppling av sensor och mikrokontroller
2. Programmering av ESP8266 för datainsamling och MQTT publishing i Arduino IDE
3. Utveckling av webgränssnitt med Charts.js, JavaScript, HTML och CSS

## Slutresultat

Resultatet är en fungerande IoT-artefakt som:
* Mäter jordfuktighet i realtid
* Visar trender för fuktnivån
* Presenterar data visuellt och begripligt
* Stödjer användaren i vardagliga beslut
* Är anpassad för mobil användning
