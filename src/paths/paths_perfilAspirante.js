const { Router } = require('express');
const path = Router();
var mysqlConnection = require('../../utils/conexion');
const keys = require('../../settings/keys');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const ruta = require('path');

//
var almacenFotoPerfil = multer.diskStorage({
    destination: function(request,file, callback){
        callback(null, __dirname+'./../../utils/almacenFotografias')

    },
    filename:function(request, file, callback){
        console.log(file)
        callback(null, file.fieldname+'-'+Date.now()+ruta.extname(file.originalname))

    }
})

const multerUpload = multer({storage:multer.memoryStorage(), limits:{fileSize:8*1024*1024*10}})


//Respuestas
const mensajes = require('../../utils/mensajes');
const pool = require('../../utils/conexion');
const req = require('express/lib/request');
const res = require('express/lib/response');

function verifyToken(token){
    var statusCode = 0;
    try{
        const tokenData = jwt.verify(token, keys.key); 
        console.log(tokenData);
  
        if (tokenData["tipo"] == "Administrador" || tokenData["tipo"] == "Aspirante") { // verificar acceso
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

path.post('/v1/perfilAspirantes/:idPerfilUsuarioAspirante/fotografia', multerUpload.single("fotografia"), (req,res) => {

    var query = "UPDATE perfil_usuario SET fotografia = ? WHERE id_perfil_usuario = ?;"
    const { idPerfilUsuarioAspirante } = req.params
    const { fotografia } = req.body

    mysqlConnection.query(query, [req.file.buffer, idPerfilAspirante], (error, resultadoFotografia) => {
        if (error){
            res.status(500)
            res.json(mensajes.errorInterno)
        }else if(resultadoFotografia.length == 0){
            res.status(404)
            res.json(mensajes.peticionNoEncontrada)
        }else{
            res.status(200)
            res.json(mensajes.actualizacionExitosa)
        }
    })
});

path.post('/v1/perfilAspirantes/:idPerfilAspirante/curriculum', (req, res) => {// path opcional
  // comvertir array de bytes a documento y a video de lado de c#
});

path.post('/v1/perfilAspirantes/:idPerfilAspirante/video', (req, res) => {

});

/*function consulta(values){
    var querythree = 'INSERT INTO categoria_aspirante (id_aspirante_ca, id_categoria_ca, experiencia) VALUES ? ;'
    mysqlConnection.query(query3, [values], (err, rows, fields) => {
        if(err){
            res.status(500)
        }else if (rows.length == 0){
            res.status(404)
            res.json(peticionIncorrecta)
        }else{
            console.log('registro oficio exitoso')
        }
    })
}*/

path.get('/v1/perfilAspirantes', (req, res) => {
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)

    try {
        if (respuesta == 200){
            var query = 'SELECT * FROM perfil_aspirante;'
            pool = mysqlConnection

            pool.query(query, (error, resultadosAspirantes) => {
                if (error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if(resultadosAspirantes.length == 0){
                    res.status(404)
                    res.json(peticionIncorrecta)
                }else{
                    var aspirantes = resultadosAspirantes
                    
                    res.status(200)
                    res.json(aspirantes)
                }
            })
        }else if(respuesta == 401){
            res.status(respuesta)
            res.json(tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno) 
        }
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
})



path.get('/v1/perfilAspirantes/:idPerfilUsuarioAspirante', (req, res) => {
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)
    const { idPerfilUsuarioAspirante } = req.params

    try {
        if (respuesta == 200){
            var query = 'SELECT * FROM perfil_aspirante WHERE id_perfil_usuario_aspirante = ?;'
            pool = mysqlConnection

            pool.query(query, [idPerfilUsuarioAspirante], (error, resultadoAspirante) => {
                if (error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if(resultadoAspirante.length == 0){
                    res.status(404)
                    res.json(peticionIncorrecta)
                }else{
                    var aspirante = resultadoAspirante;

                    res.status(200);
                    res.json(aspirante)
                }
            })
        }else if (respuesta == 401){
            res.status(respuesta)
            res.json(tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }
});

path.post('/v1/perfilAspirantes', (req, res) => {
    var idDeUsuario = 0;
    const {clave, correoElectronico, direccion, estatus, fechaNacimiento, nombre, nombreUsuario, oficios,
        telefono } = req.body

    try {
        if (respuesta == 200){
            var queryOne = 'INSERT INTO perfil_usuario (nombre_usuario, estatus, clave, correo_electronico, tipo_usuario) VALUES (?, ?, ?, ?, ?);'
            var queryTwo = 'INSERT INTO perfil_aspirante ( id_perfil_usuario_aspirante, nombre, direccion, fecha_nacimiento, telefono) VALUES (?, ?, ?, ?, ?, ?); '
            var querythree = 'INSERT INTO categoria_aspirante (id_aspirante_ca, id_categoria_ca, experiencia) VALUES ? ;'
            const tipo = 'Aspirante'

            mysqlConnection.query(queryOne, [nombreUsuario, estatus, clave, correoElectronico, tipo], (error, registroUsuarioAspirante) => {
                if (error){
                    res.status(500)
                    res.json(mensajes.errorInterno)
                }else if(registroUsuarioAspirante.length == 0){
                    res.status(404)
                    res.json(mensajes.peticionNoEncontrada)
                }else{
                    console.log('exito al registrar un aspirante')
                    idDeUsuario = registroUsuarioAspirante.insertId
                    
                    mysqlConnection.query(queryTwo, [idDeUsuario, nombre, direccion, fechaNacimiento, telefono], (error, registroPerfilAspirante) => {
                        if (error){
                            res.status(500)
                            res.json(mensajes.errorInterno)
                        }else if(resultadoUsuarioAspirante == 0){
                            res.status(403)
                            res.json(mensajes.prohibido)
                        }else{
                            var idAspirante = 0

                            idAspirante = registroPerfilAspirante.insertId

                            var cont = 0

                            var valores = []

                            for(let i = 0; i < oficios.length; i++){
                                valores.push(i);
                            }

                            do{
                                valores[cont] = [idAspirante, oficios[cont].idCategoria, oficios[cont].experiencia]
                                cont = cont + 1
                             }while(cont != oficios.length)

                             mysqlConnection.query(querythree, [valores], (error, registroOficios) => {
                                 if (error){
                                    res.status(500)
                                    res.json(mensajes.errorInterno)
                                 }else if(registroOficios.length == 0){
                                     res.status(403)
                                     res.json(mensajes.prohibido)
                                 }else{
                                    console.log("exito, oficios insertados: " + registroOficios.affectedRows);

                                    var perfilAspirante = registroPerfilAspirante[0]
                                    var usuarioAspirante = registroUsuarioAspirante[0]
                                    var arrayFotografia = Uint8ClampedArray.from(Buffer.from(usuarioAspirante.fotografia, 'base64'))

                                    const registroPerfilAspirante = {}
                                    registroPerfilAspirante['application/json'] = {
                                        'clave': usuarioAspirante['clave'],
                                        'correoElectronico': usuarioAspirante['correo_electronico'],
                                        'direccion': perfilAspirante['direccion'],
                                        'estatus': perfilAspirante['estatus'],
                                        'fechaNacimiento': perfilAspirante['fecha_nacimiento'],
                                        'idPerfilUsuario': usuarioAspirante['id_perfil_usuario'],
                                        'nombre': perfilAspirante['nombre'],
                                        'nombreUsuario': usuarioAspirante['nombre_usuario'],
                                        'oficios': registroOficios,
                                        'telefono': perfilAspirante['telefono'],
                                        //'video': perfilAspirante['video'],
                                        'idPerfilAspirante': perfilAspirante['id_perfil_aspirante'],
                                        'fotografia': arrayFotografia
                                        //'curriculum': perfilAspirante['curriculum']
                                    }

                                    res.status(201)
                                    res.json(registroPerfilAspirante['application/json'])
                                 }
                             })


                        }
                    })
                }
            })
        }else if(respuesta == 401){
            res.status(respuesta)
            res.json(tokenInvalido)
        }else{
            res.status(500)
            res.json(mensajes.errorInterno)
        }
    } catch (error) {
        res.status(500)
        res.json(mensajes.errorInterno)
    }


});

path.put('/v1/perfilAspirantes/:idPerfilAspirante', (req, res) => {
    const token = req.headers['x-access-token']
    var respuesta = verifyToken(token)
    const { idPerfilAspirante } = req.params
})

module.exports = path;