// src/server.js
const express = require('express');
const morgan = require('morgan');
const cors = require('./middleware/corsConfig');
const helmet = require('./middleware/securityHeaders');
const rateLimiter = require('./middleware/rateLimit');
const routes = require('./routes');
require('dotenv').config();
const { port, baseRoute } = require('./config/config');

const app = express();

// Middlewares
app.use(morgan('dev')); // Details Http Petitions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors); // CORS CONFIG
app.use(helmet); // Security
app.use(rateLimiter); // Block brute force attacks

// Config port 
app.set('port', port);

// Atomated routes charging
app.use(baseRoute, routes);

module.exports = app;
