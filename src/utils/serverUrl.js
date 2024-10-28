// src/utils/getServerUrl.js
require('dotenv').config();
const { baseRoute } = require('./../config/config');

module.exports = (app) => {
    const port = process.env.PORT || 5000;
    const host = process.env.HOST || 'localhost';
    const protocol = process.env.PROTOCOL || 'http';
    const baseRouteAPI = baseRoute;
    
    return `${protocol}://${host}:${port}${baseRouteAPI}`;
};