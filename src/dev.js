const express = require('express');
const morgan = require('morgan');
const cors = require('./middleware/corsConfig');
const helmet = require('./middleware/securityHeaders');
const rateLimiter = require('./middleware/rateLimit');
const routes = require('./routes');
require('dotenv').config();

const app = express();
app.set('trust proxy', 1); 

// Middlewares
app.use(morgan('dev')); // Detalles de las peticiones HTTP
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors); // Configuración de CORS
app.use(helmet); // Seguridad
app.use(rateLimiter); // Prevenir ataques de fuerza bruta

// Configuración del puerto y rutas
const { port, baseRoute } = require('./config/config');
app.set('port', port);
app.use(baseRoute, routes);

// Modo desarrollo local
app.listen(app.get('port'), () => {
  console.log(`\n🚀 Servidor ejecutándose en desarrollo...`);
  console.log(`🌍 URL local: http://localhost:${app.get('port')}`);
  console.log(`🔗 Ruta base configurada: ${baseRoute}`);
  console.log(`⚙️  Modo API --> ${process.env.NODE_ENV}`);
});
  
  