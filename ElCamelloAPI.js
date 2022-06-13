const express = require('express');
const req = require('express/lib/request');
const app = express();
const morgan = require('morgan');


app.set('port', process.env.PORT || 5000);
app.set('json spaces', 2);

//middlewares
//app.use(morgan('combined')) Obtiene detalles
app.use(morgan('dev'));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

//routes
app.use(require('./src/paths/paths_usuarios'))
app.use(require('./src/paths/paths_categorias'))
app.use(require('./src/paths/paths_perfilDemandante'))
app.use(require('./src/paths/paths_ofertasEmpleoEmpleador'))
app.use(require('./src/paths/paths_mensajeria'));
app.use(require('./src/paths/paths_reportesEmpleo'))
app.use(require('./src/paths/paths_estadisticas'))
app.use(require('./src/paths/paths_solicitudesEmpleoEmpleador'))
app.use(require('./src/paths/paths_perfilAspirante'))

//starting server
app.listen(app.get('port'), () => {
    console.log('El servidor se esta ejecutando en el puerto:', app.get('port'))
})