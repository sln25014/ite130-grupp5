# Moist-o-Tron

## Introduktion
En fuktsensor för att mäta fuktnivån i blomkrukor som hjälper användare med när de ska vattnas, och för att avgöra om jorden är torr, lagom fuktig eller vattenmättad.

## Användare
Nybörjare som sköter krukväxter inomhus.

Dessa användare har några få växter hemma, saknar djup kunskap om växtskötsel och känner ofta osäkerhet kring när de ska vattna.
De vill ha en enkel och pålitlig lösning som ger tydliga besked utan teknisk komplexitet.

* ~~Personer som har växter, hemma, på jobbet, eller i sina fritidshus.~~
* ~~Säljare i växtbutiker med växthus.~~
* ~~Personer som vill ha växter men inte har kunskap om dem.~~

## Kontext

Användningen av vår lösning är oftast i hemmet nära växten, via mobilen, i lugna och vardagliga situationer.

## Visualisering

Ett linechart för att se trender för fukten genom tid som på bilden.

<img width="458" height="286" alt="Skärmavbild 2025-12-03 kl  15 16 22" src="https://github.com/user-attachments/assets/a965d78b-4787-4afa-89ab-312de426465f" />

Även någon form av progress bar eller mätare för att se en livestatus för fuktnivån.

## Beskrivning av system
Systemet består av tre delar: Sensor, Universiell mikrokontroller, Webb gränssnitt

De program som används:
* MQTT
* Arduino (ESP8266 library)
* HTML
* CSS
* Chart.js

## Sensor 

Vi använder Capacitive soil moisture sensor v2.0

## Tidsplan

#### Vecka 1
* Gör en tidsplan för vårat arbete samt en plan för sensorn och microkontrollern.
* Gör koden för sensorn och testa för att se om det fungerar.
* Gör klart presentation för den 5/12
  
#### Vecka 2 
* Påbörja skiss och kod för hemsida, (detta fortsätter vi med vecka 3 också).
* Börja överföringen från Arduino till webbsidan.
* Testa! Fungerar det? Fungerar det inte? Finns det något som kan förbättras?
* Förbered inför presentation den 12/12
  
#### Vecka 3
* Gör klart projektet och påbörja presentationen för slutredovisning.
* Gå igenom allting en sista gång.
* Om tid finns: skapa en förvaringslåda/box för komponenterna.
* Slutredovisning 18/12! 😄

## Förväntat resultat och nytta

* Ett fungerande mätningssystem som visar jordfuktighet i realtid på en fungerande webbplats
* Att hjälpa användare få kunskap om när jorden behöver vattnas
* Fler växter överlever!! 🥰

