const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');

path.get('/v1/categoriasEmpleo', (req, res) => {
    var pool = mysqlConnection;

    pool.query('SELECT * FROM categoria_empleo;', (error, resultadoCategoria)=>{
        if(error){ 
            res.json({
                "resBody" : {
                "menssage" : "error interno del servidor"
                }
            });
            res.status(500)
        }

        if(resultadoCategoria[0].length == 0){

            res.status(404)
            res.json({
                "resBody" : {
                "menssage" : "peticion no encontrada"
                }
            });

            
        }else{
            var categoriasEmpleo = resultadoCategoria;

            res.json(categoriasEmpleo);
            res.status(200);

        }

    });

});


path.post('/v1/categoriasEmpleo', (req, res) => {
    const { nombre } = req.body
    var string = nombre;
    console.log(string);
    var query = 'INSERT INTO categoria_empleo (nombre) VALUES(?);';
    mysqlConnection.query(query, [string], (err, rows, fields) => {
        if (!err) {
          res.status(201).json(rows[0])
        } else {
          console.log(err)
        }
    })
});


module.exports = path;