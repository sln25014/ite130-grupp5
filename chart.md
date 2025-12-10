# Chart.js

Chart.js är ett lätt JavaScript-bibliotek som används för att skapa interaktiva och responsiva datavisualiseringar på webben.Det kan skapar många olika typer och grafer och diagram.

### Vad behöver man?
* Canvas-element
* CDN-länk
* JS-kod

## Tutorial på hur man skapa graf

### Steg 1 - Canvas(HTML)
I HTML skapar man detta med ett canvas-element:

```js
<canvas id="myChart"></canvas>
```

### Steg 2 - laddar Chart.js (HTML)
Detta ligger också i HTML:

```js
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

### Steg 3 - Gauge chart (JavaScript)
Detta är ett JavaScript-koden och ska ligga i acquisition.js

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
### Resultat 

<img width="855" height="447" alt="Screenshot 2025-12-10 at 18 57 37" src="https://github.com/user-attachments/assets/1233cf86-054a-4bf2-83f7-5322c998821b" />







