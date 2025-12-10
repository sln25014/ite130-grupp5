import Chart from 'chart.js/auto';

// MQTT will be loaded from CDN script tag in HTML

// ============================================================
// DATA STRUCTURES
// ============================================================

class MoistureReading {
    constructor(value, timestamp = new Date(), sensorId = 'default') {
        this.value = value;
        this.timestamp = timestamp;
        this.sensorId = sensorId;
        this.id = `${sensorId}-${timestamp.getTime()}`;
    }
}

class SensorConfig {
    constructor(sensorId) {
        this.sensorId = sensorId;
        this.thresholds = { min: 300, max: 700 };
        this.displayName = sensorId;
    }

    getStatus(value) {
        if (value > this.thresholds.max) return 'too-dry';
        if (value < this.thresholds.min) return 'too-wet';
        return 'perfect';
    }
}

class TimeSeriesBuffer {
    constructor(maxSize = 100) {
        this.readings = [];
        this.maxSize = maxSize;
    }

    add(reading) {
        this.readings.push(reading);
        if (this.readings.length > this.maxSize) {
            this.readings.shift();
        }
    }

    getChartData() {
        return {
            labels: this.readings.map(r => {
                const h = r.timestamp.getHours().toString().padStart(2, '0');
                const m = r.timestamp.getMinutes().toString().padStart(2, '0');
                return `${h}:${m}`;
            }),
            values: this.readings.map(r => r.value),
            percentValues: this.readings.map(r => this.valueToPercent(r.value))
        };
    }

    valueToPercent(value) {
        // 200 = 100% (most wet), 700 = 0% (most dry)
        const wetValue = 200;
        const dryValue = 700;
        const percent = ((dryValue - value) / (dryValue - wetValue)) * 100;
        return Math.max(0, Math.min(100, percent)); // Clamp between 0-100
    }

    getStats() {
        if (this.readings.length === 0) return null;
        const values = this.readings.map(r => r.value);
        return {
            min: Math.min(...values),
            max: Math.max(...values),
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            count: values.length,
            latest: values[values.length - 1]
        };
    }
}

class Alert {
    constructor(reading, severity, message) {
        this.id = `alert-${Date.now()}`;
        this.reading = reading;
        this.severity = severity;
        this.message = message;
        this.timestamp = new Date();
        this.acknowledged = false;
    }
}

class DashboardState {
    constructor() {
        this.sensors = new Map();
        this.timeSeries = new Map();
        this.alerts = [];
        this.maxAlerts = 50;
    }

    addSensor(sensorId) {
        if (!this.sensors.has(sensorId)) {
            this.sensors.set(sensorId, new SensorConfig(sensorId));
            this.timeSeries.set(sensorId, new TimeSeriesBuffer());
        }
    }

    processReading(sensorId, value) {
        this.addSensor(sensorId);
        const reading = new MoistureReading(value, new Date(), sensorId);
        this.timeSeries.get(sensorId).add(reading);

        const config = this.sensors.get(sensorId);
        const status = config.getStatus(value);

        if (status !== 'perfect') {
            this.createAlert(reading, status);
        }

        return reading;
    }

    createAlert(reading, status) {
        let message = '';
        if (status === 'too-dry') {
            message = `Soil is too dry (${reading.value}) - plant needs water`;
        } else if (status === 'too-wet') {
            message = `Soil is too wet (${reading.value}) - check drainage`;
        }

        const alert = new Alert(reading, 'warning', message);
        this.alerts.unshift(alert);

        if (this.alerts.length > this.maxAlerts) {
            this.alerts = this.alerts.slice(0, this.maxAlerts);
        }
        return alert;
    }

    getSensorData(sensorId) {
        return {
            config: this.sensors.get(sensorId),
            timeSeries: this.timeSeries.get(sensorId),
            stats: this.timeSeries.get(sensorId)?.getStats()
        };
    }

    getActiveAlerts() {
        return this.alerts.filter(a => !a.acknowledged);
    }
}

// ============================================================
// INITIALIZE DASHBOARD
// ============================================================
const dashboard = new DashboardState();
const sensorId = 'Group5-Moisture';

dashboard.addSensor(sensorId);
const sensorConfig = dashboard.sensors.get(sensorId);
sensorConfig.displayName = 'Plant Moisture Sensor';
sensorConfig.thresholds = {
    min: 350,    // Below = too wet
    max: 600     // Above = too dry
};

// ============================================================
// CHART SETUP
// ============================================================
const chart = new Chart(
    document.getElementById('acquisitions'),
    {
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
                        callback: function (value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    }
);

// ============================================================
// GAUGE SETUP
// ============================================================
const gaugeMax = 1000;
const gaugeChart = new Chart(
    document.getElementById('moisture-gauge').getContext('2d'),
    {
        type: 'doughnut',
        data: {
            labels: ['Moisture', 'Remaining'],
            datasets: [{
                data: [0, gaugeMax],
                backgroundColor: ['rgb(75, 192, 192)', 'rgb(230, 230, 230)'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: true,
            rotation: -90,
            circumference: 180,
            cutout: '70%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            animation: false
        }
    }
);

function updateGauge(value, status) {
    const clamped = Math.max(0, Math.min(gaugeMax, value));

    let color = 'rgb(75, 192, 192)';
    let instruction = '✅ Moisture level is perfect';

    if (status === 'too-dry') {
        color = 'rgba(255, 0, 55, 1)';
        instruction = '🚨 Soil is too dry - water the plant!';
    } else if (status === 'too-wet') {
        color = 'rgb(255, 205, 86)';
        instruction = '⚠️ Soil is too wet - check drainage';
    }

    gaugeChart.data.datasets[0].backgroundColor[0] = color;
    gaugeChart.data.datasets[0].data[0] = clamped;
    gaugeChart.data.datasets[0].data[1] = gaugeMax - clamped;
    gaugeChart.update('none');

    const instructionEl = document.getElementById('moisture-instruction');
    if (instructionEl) {
        instructionEl.textContent = instruction;
        instructionEl.style.color = color;
        instructionEl.style.fontWeight = status === 'too-dry' ? 'bold' : 'normal';
    }
}

function updateChart() {
    const chartData = dashboard.timeSeries.get(sensorId).getChartData();
    chart.data.labels = chartData.labels;
    chart.data.datasets[0].data = chartData.percentValues;
    chart.update();
}

// ============================================================
// MQTT CONNECTION
// ============================================================
const brokerUrl = 'wss://test.mosquitto.org:8081';
const topic = '/MDU/ITE130/Group5/Moisture';
const client = mqtt.connect(brokerUrl);

client.on('connect', function () {
    console.log('Connected to MQTT broker');
    client.subscribe(topic, function (err) {
        if (!err) {
            console.log('Subscribed to', topic);
        } else {
            console.error('Subscription error:', err);
        }
    });
});

client.on('message', function (topic, message) {
    const value = parseInt(message.toString(), 10);

    if (!isNaN(value)) {
        dashboard.processReading(sensorId, value);
        const status = sensorConfig.getStatus(value);

        updateGauge(value, status);
        updateChart();

        const activeAlerts = dashboard.getActiveAlerts();
        if (activeAlerts.length > 0) {
            console.warn(`Alert: ${activeAlerts[0].message}`);
        }

        const stats = dashboard.getSensorData(sensorId).stats;
        if (stats && stats.count % 10 === 0) {
            console.log('Stats:', {
                min: stats.min.toFixed(0),
                max: stats.max.toFixed(0),
                avg: stats.avg.toFixed(0),
                latest: stats.latest
            });
        }
    }
});

client.on('error', function (error) {
    console.error('MQTT error:', error);
});

// ============================================================
// DEBUGGING
// ============================================================
window.dashboard = dashboard;