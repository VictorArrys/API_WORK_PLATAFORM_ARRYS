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
          res.status(201);
          res.json({
            "resBody" : {
            "menssage" : "Registro exitoso",
            "categoria": [string]
            }
            });
        } else {
          console.log(err)
          res.json({
            "resBody" : {
            "menssage" : "error interno del servidor"
            }
            });
            res.status(500)
          
        }
    })
});


path.patch('/v1/categoriasEmpleo/:idCategoriaEmpleo', (req, res) => {

    console.log('Entro a editar xd')

    const { nombre } = req.body
    var string = nombre;
    console.log(string);
    var query = 'UPDATE categoria_empleo SET nombre = ? WHERE id_categoria_empleo = ?;';
    mysqlConnection.query(query, [string, req.params.idCategoriaEmpleo], (err, rows, fields) => {
        if (!err) {
          res.status(203);
          res.json({
            "resBody" : {
            "menssage" : "Actualización exitosa xd"
            }
            });
        } else {
            console.log(err)
            res.json({
                "resBody" : {
                "menssage" : "error interno del servidor"
            }
            });
            res.status(500)
          
        }
    })

});

path.delete('/v1/categoriasEmpleo/:idCategoriaEmpleo', (req, res) => {

    var query = 'DELETE FROM categoria_empleo WHERE id_categoria_empleo = ?;';
    mysqlConnection.query(query, [req.params.idCategoriaEmpleo], (err, rows, fields) => {
        if (!err) {
            //res.status(204); 
            //Para los que no se manda nada, se debe poner sendStatus(statusCode)
            res.sendStatus(204)
        } else {
            console.log(err)
            res.json({
                "resBody" : {
                "menssage" : "error interno del servidor"
                }
            });
            res.status(500)
          
        }
    })

});



module.exports = path;