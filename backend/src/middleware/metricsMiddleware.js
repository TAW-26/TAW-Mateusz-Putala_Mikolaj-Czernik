const { httpRequestsTotal, httpRequestDurationMs } = require('../config/metrics');

function metricsMiddleware(req, res, next) {
    const startMs = Date.now();

    res.on('finish', () => {
        const durationMs = Date.now() - startMs;
        // Pobieramy wzorzec ścieżki (np. /api/trips/:id), a nie unikalny adres URL
        const route = req.route?.path ?? req.path;

        const labels = {
            method: req.method,
            route: route,
            status_code: String(res.statusCode)
        };

        httpRequestsTotal.inc(labels);
        httpRequestDurationMs.observe(labels, durationMs);
    });

    next();
}

module.exports = { metricsMiddleware };