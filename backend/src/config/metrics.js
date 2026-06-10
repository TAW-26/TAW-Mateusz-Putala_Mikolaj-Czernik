const client = require('prom-client');

// Centralny rejestr metryk Prometheusa
const register = new client.Registry();

// Pobieranie domyślnych metryk Node.js (zużycie RAM, CPU itp.)
client.collectDefaultMetrics({ register });

// 1. Licznik żądań HTTP
const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Laczna liczba zadan HTTP',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register],
});

// 2. Histogram czasu odpowiedzi
const httpRequestDurationMs = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Czas trwania zadania w milisekundach',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [5, 10, 25, 50, 100, 250, 500, 1000],
    registers: [register],
});

module.exports = {
    register,
    httpRequestsTotal,
    httpRequestDurationMs
};