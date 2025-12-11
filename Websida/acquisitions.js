// DATA STRUCTURES
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
    constructor(maxSize = 50) {
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
        const wetValue = 200;
        const dryValue = 700;
        const percent = ((dryValue - value) / (dryValue - wetValue)) * 100;
        return Math.max(0, Math.min(100, percent));
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
        this.maxAlerts = 10;
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

// INITIALIZE
const dashboard = new DashboardState();
const sensorId = 'Group5-Moisture';

dashboard.addSensor(sensorId);
const sensorConfig = dashboard.sensors.get(sensorId);
sensorConfig.displayName = 'Plant Moisture Sensor';
sensorConfig.thresholds = {
    min: 350,
    max: 600
};

// CHART SETUP
const chart = new Chart(
    document.getElementById('acquisitions'),
    {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Moisture %',
                data: [],
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: {
                    title: { display: false },
                    ticks: { maxTicksLimit: 6 }
                },
                y: {
                    min: 0,
                    max: 100,
                    title: { display: false },
                    ticks: {
                        callback: function (value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    }
);

// GAUGE SETUP
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
            responsive: true,
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

    document.getElementById('gauge-value-number').textContent = value;
    document.getElementById('gauge-value-number').style.color = color;

    const instructionEl = document.getElementById('moisture-instruction');
    instructionEl.textContent = instruction;
    instructionEl.style.color = color;
    instructionEl.style.background = status === 'too-dry' ? '#fef2f2' : (status === 'too-wet' ? '#fffbeb' : '#f0fdf4');
}

function updateChart() {
    const chartData = dashboard.timeSeries.get(sensorId).getChartData();
    chart.data.labels = chartData.labels;
    chart.data.datasets[0].data = chartData.percentValues;
    chart.update();
}

function updateStats() {
    const stats = dashboard.getSensorData(sensorId).stats;
    if (stats) {
        document.getElementById('stat-current').textContent = stats.latest;
        document.getElementById('stat-avg').textContent = Math.round(stats.avg);
        document.getElementById('stat-min').textContent = stats.min;
        document.getElementById('stat-max').textContent = stats.max;
    }
}

// MQTT CONNECTION
const brokerUrl = 'wss://test.mosquitto.org:8081';
const topic = '/MDU/ITE130/Group5/Moisture';
const client = mqtt.connect(brokerUrl);

client.on('connect', function () {
    console.log('Connected to MQTT broker');
    document.getElementById('connection-status').textContent = 'Connected';
    document.getElementById('connection-status').className = 'status-badge status-connected';

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
        updateStats();
    }
});

client.on('error', function (error) {
    console.error('MQTT error:', error);
    document.getElementById('connection-status').textContent = 'Disconnected';
    document.getElementById('connection-status').className = 'status-badge status-disconnected';
});

client.on('close', function () {
    document.getElementById('connection-status').textContent = 'Disconnected';
    document.getElementById('connection-status').className = 'status-badge status-disconnected';
});

window.dashboard = dashboard;