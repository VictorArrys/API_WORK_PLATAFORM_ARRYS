const express = require('express');
const morgan = require('morgan');
const cors = require('../src/middleware/corsConfig');
const helmet = require('../src/middleware/securityHeaders');
const routes = require('../src/routes');
require('dotenv').config();

const app = express();
app.set('trust proxy', 1); 
// Middlewares
app.use(morgan('dev')); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors); 
app.use(helmet); 

const serverless = require('serverless-http');

app.use("/api/" , routes);  

// Export handler serverless
export const handler = serverless(app);
console.log(`\n🚀 Servidor ejecutándose en Netlify...`);
console.log(`🌍 URL API ROUTE: ${route}`);
console.log(`⚙️  Modo API --> ${process.env.NODE_ENV}`);