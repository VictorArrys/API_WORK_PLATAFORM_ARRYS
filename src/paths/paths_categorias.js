const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');

//Respuestas
const mensajes = require('../../utils/mensajes')

//Función para verificar el token
function verifyToken(token){
    var statusCode = 0;
    try{
        const tokenData = jwt.verify(token, keys.key); 
        console.log(tokenData);
  
        if (tokenData["tipo"] == "Administrador") {
            statusCode = 200
            return statusCode
        }else{
            //Caso que un token exista pero no contenga los permisos para la petición
            statusCode = 401
            return statusCode
          }
    
        } catch (error) { //Caso de un token invalido, es decir que no exista
            statusCode = 401
            return statusCode
            
        }
}

path.get('/v1/categoriasEmpleo', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)
 
    console.log(respuesta)
    if(respuesta == 200){

        var pool = mysqlConnection;

    
        pool.query('SELECT * FROM categoria_empleo;', (error, resultadoCategoria)=>{
            if(error){ 
                res.status(500)
                res.json(mensajes.errorInterno);
                
            }else if(resultadoCategoria[0].length == 0){
    
                res.status(404)
                res.json(mensajes.peticionIncorrecta);
     
            }else{
                var categoriasEmpleo = resultadoCategoria;
                res.status(200);
                res.json(categoriasEmpleo);
                
    
            }
    
        });
    }else if(respuesta == 401){
        res.status(respuesta)
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
        
    }

});


path.post('/v1/categoriasEmpleo', (req, res) => {
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)

    console.log(respuesta)
    if(respuesta == 200){

        const { nombre } = req.body
        var string = nombre;

        var query = 'INSERT INTO categoria_empleo (nombre) VALUES(?);';
        mysqlConnection.query(query, [string], (err, rows, fields) => {
            if (!err) {
            res.status(201);
            res.json(mensajes.registroExitoso);
            } else {
            console.log(err)
            res.status(500)
            res.json(mensajes.errorInterno);                
            
            }
        })

    }else if(respuesta == 401){
        res.status(respuesta)
        res.json(mensajes.tokenInvalido);

    }else{
        res.json(mensajes.errorInterno);
        res.status(500)
    }

});


path.patch('/v1/categoriasEmpleo/:idCategoriaEmpleo', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)
 
    console.log(respuesta)
    if(respuesta == 200){
   
        const { nombre } = req.body
        var string = nombre;
        console.log(string);
        var query = 'UPDATE categoria_empleo SET nombre = ? WHERE id_categoria_empleo = ?;';
        mysqlConnection.query(query, [string, req.params.idCategoriaEmpleo], (err, rows, fields) => {
            if (!err) {
                res.sendStatus(204)
            } else {
                console.log(err)
                res.status(500)
                res.json(mensajes.errorInterno);                
            
            }
        })
    }else if(respuesta == 401){
        res.status(respuesta)
        res.json(mensajes.tokenInvalido);

    }else{
        res.json(mensajes.errorInterno);
        res.status(500)
    }

});

path.delete('/v1/categoriasEmpleo/:idCategoriaEmpleo', (req, res) => {
    //Creamos la constante del token que recibimos
    const token = req.headers['x-access-token'];
    var respuesta = verifyToken(token)
 
    console.log(respuesta)
    if(respuesta == 200){

        var query = 'DELETE FROM categoria_empleo WHERE id_categoria_empleo = ?;';
        mysqlConnection.query(query, [req.params.idCategoriaEmpleo], (err, rows, fields) => {
            if (!err) {
                //res.status(204); 
                //Para los que no se manda nada, se debe poner sendStatus(statusCode)
                res.sendStatus(204)
            } else {
                console.log(err)
                res.status(500)
                res.json(mensajes.errorInterno);                
            
            }
        })

    }else if(respuesta == 401){
        res.status(respuesta)
        res.json(mensajes.tokenInvalido);

    }else{
        res.status(500)
        res.json(mensajes.errorInterno);
       
    }
});

module.exports = path;