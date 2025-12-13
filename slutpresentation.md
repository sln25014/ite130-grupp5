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


## Plusivo och byggnation av sensor (Bom lista) 

För att bygga ihop sennsorn har det använts ett Plusivo-kit och dessa komponenter:

* _Capasative Soil Moisture Sensor v2.0_ - Den mäter jordens fuktighet på ett kapacitivt sätt vilket resulterar till en mer noggrannt värde. 
* _NodeMCU ESP8266_ - En mikrokontroller som ansluter sensorn till internet. 
* _9V Batteri med DC Sladd_ - Detta behövs för att hålla igång sensorn och mikrokontrollern.
* _Breadboard Power Supply_ - Används för att på enklare sätt distrubera ström genom prototypen. 
* _Sladdar i olika färger_ - för att koppla ihop komponenterna

## Designanpassning mot användare och kontext 

Eftersom att användningen av sensorn främst skulle ske på telefon valde vi att prioritera en mobilvänlig lösning. Information och värden skickas till en webbsida som är tillämpad för mobilen vilket gör det enklare för användaren att snabbt få fram värden i realtid samt rekommendationen (ex. växten behöver vattnas).

## Kunskap 
Tiden det tar för jorden att torka ut 

## Delar som används i Koden

## Genomförande 

1. Plusivo
2. Kod för sensor och få värden
3. Kod för hemsida
4. Test

## Slutresultat 

