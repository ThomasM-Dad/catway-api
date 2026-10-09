const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Le token vient du cookie, ou à défaut du header Authorization
    let token = req.cookies && req.cookies.token;

    if (!token) {
        const header = req.headers.authorization;
        if (header && header.startsWith(`Bearer`)) {
            token = header.slice(7);
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Authentification requise' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
}