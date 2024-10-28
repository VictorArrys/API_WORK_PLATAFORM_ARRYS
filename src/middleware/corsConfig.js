// src/middlewares/corsConfig.js
const cors = require('cors');

const allowedOrigins = [process.env.PROD_URL, process.env.PREPROD_URL, 'http://localhost:3000'];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
    maxAge: 3600
};

module.exports = cors(corsOptions);
