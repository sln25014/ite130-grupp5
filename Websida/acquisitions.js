// ============================================
// DATA STRUCTURES
// ============================================

/**
 * Representerar en fuktighetsmätning från sensorn
 * Konverterar automatiskt råvärdet till procent vid skapande
 */
class MoistureReading {
    constructor(rawValue, timestamp = new Date()) {
        this.rawValue = rawValue;           // Ursprungligt sensorvärde (200-700)
        this.percentValue = this.valueToPercent(rawValue);  // Konverterat till procent (0-100)
        this.timestamp = timestamp;          // När mätningen gjordes
    }

    /**
     * Konverterar sensorvärde (200-700) till fuktighetsprocent (0-100)
     * Lägre värde = blötare jord = högre procent
     */
    valueToPercent(value) {
        const wetValue = 200;   // Sensor visar ~200 när jorden är helt blöt
        const dryValue = 700;   // Sensor visar ~700 när jorden är helt torr
        const percent = ((dryValue - value) / (dryValue - wetValue)) * 100;
        return Math.max(0, Math.min(100, percent));  // Begränsa till 0-100%
    }
}

/**
 * Hanterar konfiguration och tröskelvärden för sensorn
 */
class SensorConfig {
    constructor(sensorId) {
        this.sensorId = sensorId;
        this.thresholds = { min: 300, max: 700 };  // Standardtrösklar för när jord är för blöt/torr
    }

    /**
     * Avgör om fuktighetsnivån är bra eller dålig
     * @returns 'too-dry', 'too-wet', eller 'perfect'
     */
    getStatus(rawValue) {
        if (rawValue > this.thresholds.max) return 'too-dry';   // Högre värde = torrare
        if (rawValue < this.thresholds.min) return 'too-wet';   // Lägre värde = blötare
        return 'perfect';
    }
}

/**
 * Lagrar historiska mätningar i en cirkulär buffer
 * Håller max 50 mätningar för att visa i diagram
 */
class TimeSeriesBuffer {
    constructor(maxSize = 50) {
        this.readings = [];      // Array med MoistureReading-objekt
        this.maxSize = maxSize;  // Max antal mätningar att spara
    }

    /**
     * Lägger till en ny mätning
     * Tar bort äldsta mätningen om buffern är full
     */
    add(reading) {
        this.readings.push(reading);
        if (this.readings.length > this.maxSize) {
            this.readings.shift();  // Ta bort första (äldsta) elementet
        }
    }

    /**
     * Förbereder data för Chart.js linjediagram
     * @returns Objekt med tidsetiketter och procentvärden
     */
    getChartData() {
        return {
            // Skapa tidsetiketter i format "HH:MM"
            labels: this.readings.map(r => {
                const h = r.timestamp.getHours().toString().padStart(2, '0');
                const m = r.timestamp.getMinutes().toString().padStart(2, '0');
                return `${h}:${m}`;
            }),
            // Använd redan konverterade procentvärden
            percentValues: this.readings.map(r => r.percentValue)
        };
    }

    /**
     * Beräknar statistik över alla lagrade mätningar
     * @returns Objekt med min, max, genomsnitt och senaste värdet
     */
    getStats() {
        if (this.readings.length === 0) return null;
        
        const percentValues = this.readings.map(r => r.percentValue);
        return {
            min: Math.min(...percentValues),        // Lägsta fuktighetsprocent
            max: Math.max(...percentValues),        // Högsta fuktighetsprocent
            avg: percentValues.reduce((a, b) => a + b, 0) / percentValues.length,  // Medelvärde
            count: percentValues.length,            // Antal mätningar
            latest: percentValues[percentValues.length - 1]  // Senaste mätningen
        };
    }
}

// ============================================
// INITIALIZE - Skapa sensor och databuffer
// ============================================
const sensorId = 'Group5-Moisture';
const sensorConfig = new SensorConfig(sensorId);
sensorConfig.thresholds = { min: 350, max: 600 };  // Anpassade tröskelvärden för vår växt

const timeSeries = new TimeSeriesBuffer();  // Buffer för att lagra historik

// ============================================
// CHART SETUP - Linjediagram för historik
// ============================================
const chart = new Chart(
    document.getElementById('acquisitions'),
    {
        type: 'line',
        data: {
            labels: [],  // Tidsetiketter (fylls i dynamiskt)
            datasets: [{
                label: 'Moisture %',
                data: [],  // Fuktighetsvärden i procent (fylls i dynamiskt)
                fill: true,  // Fyll området under linjen
                backgroundColor: 'rgba(75, 192, 192, 0.1)',  // Ljusgrön fyllning
                borderColor: 'rgb(75, 192, 192)',  // Grön linje
                tension: 0.4,  // Mjuk kurva istället för raka linjer
                pointRadius: 3,  // Storlek på datapunkter
                pointHoverRadius: 5  // Större när man hovrar
            }]
        },
        options: {
            responsive: true,  // Anpassa till containerns storlek
            maintainAspectRatio: false,  // Låt höjden styras av CSS
            animation: false,  // Ingen animation för snabbare uppdatering
            scales: {
                x: {
                    title: { display: false },
                    ticks: { maxTicksLimit: 6 }  // Visa max 6 tidsetiketter
                },
                y: {
                    min: 0,    // Y-axeln börjar på 0%
                    max: 100,  // Y-axeln slutar på 100%
                    title: { display: false },
                    ticks: {
                        callback: function (value) {
                            return value + '%';  // Lägg till %-tecken på y-axeln
                        }
                    }
                }
            },
            plugins: {
                legend: { display: false }  // Dölj legendrutan
            }
        }
    }
);

// ============================================
// GAUGE SETUP - Halvmånegauge för aktuellt värde
// ============================================
const gaugeMax = 100;  // Maxvärde för gaugen (100%)
const gaugeChart = new Chart(
    document.getElementById('moisture-gauge').getContext('2d'),
    {
        type: 'doughnut',  // Donut-diagram som visar som en gauge
        data: {
            labels: ['Moisture', 'Remaining'],
            datasets: [{
                data: [0, gaugeMax],  // [aktuellt värde, återstående till max]
                backgroundColor: ['rgb(75, 192, 192)', 'rgb(230, 230, 230)'],  // [färg för värde, färg för bakgrund]
                borderWidth: 0  // Ingen ram
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            rotation: -90,      // Rotera så halvcirkeln är nedåt
            circumference: 180, // Visa bara halva cirkeln (180 grader)
            cutout: '70%',      // Stor hålstorlek i mitten för att skapa gauge-effekt
            plugins: { 
                legend: { display: false },   // Dölj legend
                tooltip: { enabled: false }   // Dölj tooltip
            },
            animation: false  // Ingen animation
        }
    }
);

/**
 * Uppdaterar gauge-visningen med nytt fuktighetsvärde
 * Ändrar färg och instruktionstext baserat på status
 */
function updateGauge(percentValue, status) {
    const clamped = Math.max(0, Math.min(gaugeMax, Math.round(percentValue)));  // Säkerställ 0-100

    // Bestäm färg och instruktion baserat på status
    let color = 'rgb(75, 192, 192)';          // Grön = bra
    let instruction = '✅ Fuktnivån är perfect';

    if (status === 'too-dry') {
        color = 'rgba(255, 0, 55, 1)';         // Röd = för torr
        instruction = '🚨 Jorden är för torr - vattna växten!';
    } else if (status === 'too-wet') {
        color = 'rgb(255, 205, 86)';           // Gul = för blöt
        instruction = '⚠️ Jorden är för blöt - vattna inte mer!';
    }

    // Uppdatera gauge-diagrammet
    gaugeChart.data.datasets[0].backgroundColor[0] = color;  // Sätt färg
    gaugeChart.data.datasets[0].data[0] = clamped;           // Aktuellt värde
    gaugeChart.data.datasets[0].data[1] = gaugeMax - clamped; // Återstående
    gaugeChart.update('none');  // Uppdatera utan animation

    // Uppdatera procenttalet i mitten av gaugen
    document.getElementById('gauge-value-number').textContent = Math.round(percentValue) + '%';
    document.getElementById('gauge-value-number').style.color = color;

    // Uppdatera instruktionstext och bakgrundsfärg
    const instructionEl = document.getElementById('moisture-instruction');
    instructionEl.textContent = instruction;
    instructionEl.style.color = color;
    instructionEl.style.background = status === 'too-dry' ? '#fef2f2' : (status === 'too-wet' ? '#fffbeb' : '#f0fdf4');
}

/**
 * Uppdaterar linjediagrammet med all historisk data
 */
function updateChart() {
    const chartData = timeSeries.getChartData();
    chart.data.labels = chartData.labels;              // Tidsetiketter
    chart.data.datasets[0].data = chartData.percentValues;  // Fuktighetsvärden
    chart.update();  // Uppdatera diagrammet
}

/**
 * Uppdaterar statistik-korten (nuvarande, genomsnitt, min, max)
 */
function updateStats() {
    const stats = timeSeries.getStats();
    if (stats) {
        document.getElementById('stat-current').textContent = Math.round(stats.latest) + '%';
        document.getElementById('stat-avg').textContent = Math.round(stats.avg) + '%';
        document.getElementById('stat-min').textContent = Math.round(stats.min) + '%';
        document.getElementById('stat-max').textContent = Math.round(stats.max) + '%';
    }
}

// ============================================
// MQTT CONNECTION - Anslut till broker och ta emot data
// ============================================
const brokerUrl = 'wss://test.mosquitto.org:8081';  // WebSocket-adress till MQTT-broker
const topic = '/MDU/ITE130/Group5/Moisture';        // Topic där sensorn publicerar data
const client = mqtt.connect(brokerUrl);              // Skapa MQTT-klient

/**
 * Händer när vi ansluter till MQTT-brokern
 */
client.on('connect', function () {
    console.log('Connected to MQTT broker');
    // Uppdatera anslutningsstatus i UI - visa bara en grön prick
    document.getElementById('connection-status').textContent = '●';
    document.getElementById('connection-status').className = 'status-badge status-connected';

    // Prenumerera på sensor-topicet
    client.subscribe(topic, function (err) {
        if (!err) {
            console.log('Subscribed to', topic);
        } else {
            console.error('Subscription error:', err);
        }
    });
});

/**
 * Händer när vi får ett nytt meddelande från sensorn
 * Detta är huvudloopen som processerar all ny data
 */
client.on('message', function (topic, message) {
    const value = parseInt(message.toString(), 10);  // Konvertera meddelande till nummer

    if (!isNaN(value)) {
        // Skapa ny mätning (konverterar automatiskt till procent)
        const reading = new MoistureReading(value);
        timeSeries.add(reading);  // Lägg till i historiken
        
        // Avgör om värdet är bra eller dåligt
        const status = sensorConfig.getStatus(value);

        // Uppdatera alla UI-komponenter
        updateGauge(reading.percentValue, status);  // Gaugen
        updateChart();                               // Linjediagrammet
        updateStats();                               // Statistikkorten
    }
});

/**
 * Händer vid MQTT-fel
 */
client.on('error', function (error) {
    console.error('MQTT error:', error);
    document.getElementById('connection-status').textContent = '●';
    document.getElementById('connection-status').className = 'status-badge status-disconnected';
});

/**
 * Händer när MQTT-anslutningen stängs
 */
client.on('close', function () {
    document.getElementById('connection-status').textContent = '●';
    document.getElementById('connection-status').className = 'status-badge status-disconnected';
});