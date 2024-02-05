const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config();

app.set('port',process.env.PORT || 5000);
app.set('json spaces', 2);

// Configuración de rutas según el entorno
const baseRoute = process.env.NODE_ENV === 'production' ? process.env.PROD_URL :
                  process.env.NODE_ENV === 'preproduction' ? process.env.PREPROD_URL :
                  process.env.NODE_ENV === 'development' ? process.env.DEV_URL : '/';
//middlewares
//app.use(morgan('combined')) //Obtiene detalles
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//routes

app.use(baseRoute, require('./src/paths'));
/*
// Rutas Estáticas
app.use(baseRoute, require('./src/paths/paths_categorias'))
app.use(baseRoute, require('./src/paths/paths_contratacionesAspirante'))
app.use(baseRoute,  require('./src/paths/paths_contratacionesDemandante'))
app.use(baseRoute, require('./src/paths/paths_contratacionesEmpleador'))
app.use(baseRoute, require('./src/paths/paths_estadisticas'))
app.use(baseRoute, require('./src/paths/paths_mensajeria'))
app.use(baseRoute, require('./src/paths/paths_ofertasEmpleoAspirante'))
app.use(baseRoute, require('./src/paths/paths_ofertasEmpleoEmpleador'))
app.use(baseRoute, require('./src/paths/paths_perfilAdministrador'))
app.use(baseRoute, require('./src/paths/paths_perfilAspirante'))
app.use(baseRoute, require('./src/paths/paths_perfilDemandante'))
app.use(baseRoute, require('./src/paths/paths_reportesEmpleo'))
app.use(baseRoute, require('./src/paths/paths_perfilEmpleador'))
app.use(baseRoute, require('./src/paths/paths_solicitudesEmpleoAspirante'))
app.use(baseRoute, require('./src/paths/paths_solicitudesEmpleoEmpleador'))
app.use(baseRoute, require('./src/paths/paths_solicitudesServicioAspirante'))
app.use(baseRoute, require('./src/paths/paths_solicitudesServicioDemandante'))
app.use(baseRoute, require('./src/paths/paths_usuarios'))
*/

// Starting server
app.listen(app.get('port'), () => {
    console.log('El servidor se está ejecutando en el puerto:', app.get('port'));
    console.log('Ruta del servidor:', baseRoute);    
    console.log(' | Mode API -->', process.env.NODE_ENV);

});