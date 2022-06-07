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

const multerUpload = multer({storage:almacenFotoPerfil})


//Respuestas
const mensajes = require('../../utils/mensajes');
const pool = require('../../utils/conexion');
const req = require('express/lib/request');
const res = require('express/lib/response');

path.post('/v1/perfilAspirantes/:idPerfilAspirante/fotografia', multerUpload.single("fotografia"), (req,res) => {

    var query = "UPDATE perfil_usuario SET fotografia = ? WHERE id_perfil_usuario = ?;"
    const { idPerfilAspirante } = req.params
    const { fotografia } = req.body

    console.log('fotografia1')
    console.log(fotografia)
    //console.log(req)



    /*console.log('formidable')
    var formulario = new formidable.IncomingForm()
    formulario.parse(req, function (error, fields, files) {
        if (error){
            console.log(error)
        }
    })

    //console.log(formulario)
    formulario.on('fileBegin', function(name, file) {
        console.log(file.name)
    })*/

    /*mysqlConnection.query(query, [fotografia, idPerfilAspirante], (error, resultadoFotografia) => {
        if (error){
            res.status(500)
            res.json(mensajes.errorInterno)
        }else if(resultadoFotografia.length == 0){
            res.status(404)
            res.json(mensajes.peticionNoEncontrada)
        }else{
            console.log('exi')
        }
    })*/
});

path.post('/v1/perfilAspirantes/:idPerfilAspirante/curriculum', (req, res) => {// path opcional

});

path.post('/v1/perfilAspirantes/:idPerfilAspirante/video', (req, res) => {

});

path.post('/v1/perfilAspirantes', (req, res) => { /////// poner try/catch

    var idDeUsuario = 0;
    const {clave, correoElectronico, direccion, estatus, fechaNacimiento, nombre, nombreUsuario, oficios,
        telefono } = req.body



    var query = 'INSERT INTO perfil_usuario (nombre_usuario, estatus, clave, correo_electronico, tipo_usuario) VALUES (?, ?, ?, ?, ?);'
    var query2 = 'INSERT INTO perfil_aspirante ( id_perfil_usuario_aspirante, nombre, direccion, fecha_nacimiento, telefono) VALUES (?, ?, ?, ?, ?, ?); '
    const tipo = 'Aspirante'
    var query3 = 'INSERT INTO categoria_aspirante (id_aspirante_ca, id_categoria_ca, experiencia) VALUES ? ;'

    mysqlConnection.query(query, [nombreUsuario, estatus, clave, correoElectronico, fotografia, tipo], (err, rows, fields) => {
        if (err){
            console.log(err)
            res.status(500)
        }else if (rows.length == 0){
            res.status(404)
            res.json(peticionIncorrecta)
        }else{
            console.log('exito')
            idDeUsuario = rows.insertId
            console.log(idDeUsuario)
            
           mysqlConnection.query(query2, [idDeUsuario, nombre, direccion, fechaNacimiento, telefono, curriculum, video], (err, rows, fields) => {
                if (err){
                    res.status(500)
                }else if (rows.length == 0){
                    res.status(404)
                    res.json(peticionIncorrecta)
                }else{
                    console.log('exito e registrar usuario')
                    var idAspirante = 0
                    idAspirante = rows.insertId
                    var cont = 0
                    var valores = []
                    for(let i = 0; i < oficios.length; i++){
                        valores.push(i);
                    }

                    do{
                       valores[cont] = [idAspirante, oficios[cont].idCategoria, oficios[cont].experiencia]
                       cont = cont + 1
                    }while(cont != oficios.length)

                    console.log(valores)

                    mysqlConnection.query(query3, [valores], (err, rows, fields) => {
                        if(err){
                            console.log(err)
                            res.status(500)
                        }else if (rows.length == 0){
                            console.log('jala')
                            res.status(404)
                            res.json(peticionIncorrecta)
                        }else{
                            console.log('jala')
                            console.log("Number of records inserted: " + rows.affectedRows);
                            res.status(200)
                        }
                    })


                }
            })
        }
    })
});

module.exports = path;