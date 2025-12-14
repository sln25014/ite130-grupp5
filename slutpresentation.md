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
En LoT-baserad artefakt som mäter jordfuktighet och presenterar informationen visuellt och begripligt i realtid.

Kurskoppling:  användarcentrerad design, kontextanalys, artefakt i vardagsmiljö


## Sensor och byggnation (BOM- Bill Of Materials) 

Projektet är byggt på med ett plusivo-kit och följande komponenter:

* _Capasative Soil Moisture Sensor v2.0_ - Den mäter jordens fuktighet på ett kapacitivt sätt vilket resulterar till en mer noggrannt värde. 
* _NodeMCU ESP8266_ - En mikrokontroller som ansluter sensorn till internet som skickarsenordata via MQTT. 
* _9V Batteri med DC Sladd_ - Detta behövs för att hålla igång sensorn och mikrokontrollern.
* _Breadboard Power Supply_ - Förenklar strömfördelning under prototypfas. 
* _Kopplingskablar (jumper wires)_ - Används för anslutning mellan sensor och mikrokontroller.

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


## Kunskap 
Tiden det tar för jorden att torka ut 

## Delar som används i Koden

## Genomförande 

1. Plusivo
2. Kod för sensor och få värden
3. Kod för hemsida
4. Test

## Slutresultat 

