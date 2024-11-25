// src/middlewares/rateLimit.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100, 
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, 
    legacyHeaders: false, 
    keyGenerator: (req) => {
        // Si no hay IP (caso raro), devuelve un identificador genérico
        return req.ip || 'unknown';
    }
});

module.exports = limiter;