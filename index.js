const express = require('express');
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
app.use(require('./src/paths/paths_index'))

//starting server
app.listen(app.get('port'), () => {
    console.log('El servidor se esta ejecutando en el puerto:', app.get('port'))
})