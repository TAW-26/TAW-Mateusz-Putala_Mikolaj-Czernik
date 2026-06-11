const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Obiekt z pełnym kontekstem błędu (wymagany przez Issue)
    const errorLog = {
        timestamp: new Date().toISOString(),
        type: err.name || 'InternalServerError',
        message: err.message,
        context: {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip
        }
    };

    console.error(`❌ [ERROR LOG] ${JSON.stringify(errorLog, null, 2)}`);

    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };