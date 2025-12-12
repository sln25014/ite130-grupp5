# Chart.js

Chart.js är ett lätt JavaScript-bibliotek som används för att skapa interaktiva och responsiva datavisualiseringar på webben. Det kan skapar många olika typer och grafer och diagram.

### Vad behöver man?
* Canvas-element som själva diagramet ritas på
* CDN-länk i HTML
* JS-kod som skapar chart-objektet

## Tutorial på hur man skapa chart 

### Steg 1 - Canvas(HTML)
I HTML skapar man detta med ett canvas-element:

```js
<canvas id="myChart"></canvas>
```
Canvas fungerar som en tom målarduk där grafen ska ritas upp.

### Steg 2 - laddar Chart.js (HTML)
Detta ligger också i HTML:

```js
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```
En script-tag hämtar Chart.js från en CDN, alltså ett online-bibliotek.

### Steg 3 - Skapar graf (JavaScript)
Detta är ett JavaScript-koden och ska ligga i acquisition.js

### Grundstruktur att skapa ett diagram

En chart Kräver:

-labels (x-axeln). De beskriver vad varje datapunkt representerar.

-datasets (värden). De värden som faktiskt syns i diagrammet.

-typ (ex."line"). 

```js

const ctxLine = document.getElementById('acquisitions').getContext('2d');
const chart = new Chart(ctxLine, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Moisture %',
            data: [],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        animation: false,
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: {
                min: 0,
                max: 100,
                title: { display: true, text: 'Moisture %' },
                ticks: {
                    callback: value => value + '%'
                }
            }
        }
    }
});
```
## Resultat 

<img width="855" height="447" alt="Screenshot 2025-12-10 at 18 57 37" src="https://github.com/user-attachments/assets/1233cf86-054a-4bf2-83f7-5322c998821b" />

### I vårt projekt behövde vi

- live-data från MQTT-sensorn
- En linje som visar fuktnivån över tid
- möjligheten finns att lägga till fler kurvor 
















