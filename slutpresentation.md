## Slutredovisning-fuktsensor för jord##

## användare och kontext 
Användare:

Privatpersoner som har krukväxter i hemmet och saknar djup kunskap om växters bevattningsbehov. 

Kontext: 
Användning sker i hemmiljö, ofta i vardagen, via mobiltelefon.
Användaren vill snabbt få svar på:

* Om växten behöver vatten
* Hur fuktigt jorden är just nu

Problem:
Användare förlitar sig ofta på gissning eller känsla, vilket kan leda till över-eller undervattning.

Lösning:
En IoT-baserad artefakt som mäter jordfuktighet och presenterar informationen visuellt och begripligt i realtid.

Kurskoppling: användarcentrerad design, kontextanalys, artefakt i vardagsmiljö


## Sensor och byggnation (BOM- Bill Of Materials) 

Projektet är byggt på med ett plusivo-kit och följande komponenter:

* _Capacative Soil Moisture Sensor v2.0_ - Den mäter jordens fuktighet genom resistansen. 
* _NodeMCU ESP8266_ - En mikrokontroller som ansluter sensorn till internet som skickarsenordata via MQTT. 
* _9V Batteri med DC Sladd_ - Detta behövs för att hålla igång sensorn och mikrokontrollern.
* _Breadboard Power Supply_ - Kopplar batteriet till breadboard. 
* _Kopplingskablar_ - Används för anslutning mellan sensor och mikrokontroller.

Kusrkoppling: mikrokotroller, sensorer, prototypbyggnaden, BOM

## Designanpassning mot användare och kontext 

Tydligt designanpassning:

Eftersom användaren oftats använder mobiltelefon, har vi 
* Valt moblianpassad webbdesign
* Visat information med:
   * Text (”Vattna mig”, ”Lagom”, ”Vattna inte mer”)
   * Graf (linjediagram)
   * Visuell indikator (gauge)'

Designen använder lugna gröna färger för att associera till natur och växter.
Resultat:

Användaren behöver inte tolka rådata – systemet översätter mätvärden till begriplig information.

Kurskoppling: UX, informationsvisualisering, designbeslut utifrån användare


##  Förväntad kunskap hos användaren

Artefakten ger användaren följande kunskap över tid:

* Hur snabbt jorden torkar efter vattning
* Hur ofta en specifik växt behöver vatten
* Sambandet mellan tid, fuktighet och bevattning

Detta leder till:

* minskad risk för övervattning
* mer medveten växtskötsel
* lärande genom visualiserad data

Kurskoppling:data → information → kunskap

## Konstruktion för minskad omgivningspåverkan

För att göra sensorn mindre känslig för yttre påverkan:

* Sensorn placeras stabilt i jorden, inte löst
* Elektroniken hålls ovan jord
* Möjlig enkel kapsling (t.ex.låda) för:
   * skydd mot vatten
   * minskad påverkan från beröring och ljus

Kurskoppling: robust konstruktion, fysisk artefakt

## Kod och systemarkitektur

Systemets flöde:

* Fuktsensor mäter värde
* ESP8266 lagrar data i variabeln `value` och skickar via en MQTT topic
* Websida prenumererar på vår topic
* Data visualiseras med:
   * Gauge
   * Text
   * Line chart
* Webbgränssnitt visar live-data
  
Använda tekniker:

* MQTT (publish/subscribe)
* Node-RED (flödesbaserad programmering)
* HTML, CSS, JavaScript
* Chart.js (visualisering)

## Genomförande (steg-för-steg)
1. Montering av sensor och mikrokontroller
2. Programmering av ESP8266 för datainsamling
3. Konfiguration av MQTT och Node-RED
4. Utveckling av webbgränssnitt
5. Test och justering av gränsvärden

## Slutresultat
Resultatet är en fungerande IoT-artefakt som:
* Mäter jordfuktighet i realtid
* Presenterar data visuellt och begripligt
* Stödjer användaren i vardagliga beslut
* Är anpassad för mobil användning



## Delar som används i Koden

## Genomförande 

1. Plusivo
2. Kod för sensor och få värden
3. Kod för hemsida
4. Test

## Slutresultat 

