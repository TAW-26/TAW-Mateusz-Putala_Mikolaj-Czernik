const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Brak autoryzacji'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Dostęp zabroniony dla roli: ${req.user.role}`
            });
        }

        next();
    };
};

module.exports = { authorize };


