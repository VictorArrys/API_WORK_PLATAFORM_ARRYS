// src/middlewares/rateLimit.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones por IP por cada ventana de tiempo
    message: 'Too many requests from this IP, please try again later.'
});

module.exports = limiter;
