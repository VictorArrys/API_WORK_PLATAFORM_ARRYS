// src/config/config.js
require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    baseRoute: process.env.NODE_ENV === 'production' ? process.env.PROD_URL :
    process.env.NODE_ENV === 'preproduction' ? process.env.PREPROD_URL :
        process.env.NODE_ENV === 'development' ? process.env.DEV_URL : '/',
    nodeEnv: process.env.NODE_ENV || 'development'
};