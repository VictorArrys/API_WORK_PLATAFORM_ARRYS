const MostrarError = require('../../../utils/MensajesConsolaAPI');
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');
const { AspiranteDAO } = require('./AspiranteDAO');
const { Contratacion } = require('../modelo/Contratacion')

exports.ContratacionDAO = class ContratacionDAO {
    //Empleador
    static existeContratacion(idOfertaEmpleo, callback){
        var pool = mysqlConnection
    
        pool.query('SELECT * FROM contratacion_empleo WHERE id_oferta_empleo_coe = ?;',[idOfertaEmpleo] , (error, existeContratacion)=>{
            if(error){
                console.log(error)
                callback(500, mensajes.errorInterno)
    
            }else if(existeContratacion.length == 0){
                         
                console.log('No existe la contratación')
                callback(404, mensajes.peticionNoEncontrada)
    
            }else{ //En caso de existir la contratación solo agregamos el aspirante a ella
                callback(200, existeContratacion[0]['id_contratacion_empleo'])
                
            }
    
        });  
    
    }


    static getContratacionEmpleo(idOfertaEmpleo, callback) {
         //Obtenemos la contratación
         var pool = mysqlConnection

         pool.query('SELECT * FROM contratacion_empleo WHERE id_oferta_empleo_coe = ?;',[idOfertaEmpleo] , (error, existeContratacion)=>{
            if(error){
                console.log(error);
                callback(500, mensajes.errorInterno)
 
            }else if(existeContratacion.length == 0){
                         
                console.log('No existe la contratación')
                callback(404, mensajes.peticionNoEncontrada)
 
            }else{ //Obtener la lista de las contrataciones de aspirantes
                
                console.log('Muestra')
                console.log(existeContratacion[0])
                var idContratacion = existeContratacion[0]['id_contratacion_empleo']
                const contratacionEmpleoDatos = existeContratacion[0]

                pool.query('SELECT contratacion_empleo_aspirante.id_perfil_aspirante_cea, perfil_aspirante.nombre as nombre_aspirante, perfil_aspirante.telefono, perfil_aspirante.direccion, perfil_aspirante.id_perfil_usuario_aspirante as idUser,contratacion_empleo_aspirante.valoracion_aspirante FROM contratacion_empleo_aspirante INNER JOIN perfil_aspirante ON perfil_aspirante.id_perfil_aspirante = contratacion_empleo_aspirante.id_perfil_aspirante_cea WHERE id_contratacion_empleo_cea = ?',[idContratacion] , (error, resultadoContratacionesAspirante)=>{
                    if(error){ 
                        MostrarError.MostrarError(error, 'Funcion: contratacionesEmpleo Paso: Consultar contratacionesAspirantes')
                        
                        callback(500, mensajes.errorInterno)
                
                    }else if(resultadoContratacionesAspirante.length == 0){
            
                        console.log('No se pudo obtener la contratación aspirante') 
                        //Estructura JSON contración
                        const contratacionGet = new Contratacion();

                        contratacionGet.estatus = contratacionEmpleoDatos['estatus']
                        contratacionGet.fechaContratacion = contratacionEmpleoDatos['fecha_contratacion']
                        contratacionGet.idContratacionEmpleo = contratacionEmpleoDatos['id_contratacion_empleo']
                        contratacionGet.idOfertaEmpleo = contratacionEmpleoDatos['id_oferta_empleo_coe']
                        contratacionGet.fechaFinalizacion = contratacionEmpleoDatos['fecha_finalizacion']
                        contratacionGet.contratados = null

                        callback(200, contratacionGet)

                    }else{
                        const contratacionesEmpleoAspirante = resultadoContratacionesAspirante
                        //Estructurar contración con contratados
                        const contratacionGet = new Contratacion();

                        contratacionGet.estatus = contratacionEmpleoDatos['estatus']
                        contratacionGet.fechaContratacion = contratacionEmpleoDatos['fecha_contratacion']
                        contratacionGet.idContratacionEmpleo = contratacionEmpleoDatos['id_contratacion_empleo']
                        contratacionGet.idOfertaEmpleo = contratacionEmpleoDatos['id_oferta_empleo_coe']
                        contratacionGet.fechaFinalizacion = contratacionEmpleoDatos['fecha_finalizacion']
                        contratacionGet.contratados = contratacionesEmpleoAspirante             
                        
                        callback(200, contratacionGet)
                    }
            
                });


             }
 
         });  
    }

    static patchEvaluarAspiranteContratado(idOfertaEmpleo, idAspirante, valoracionAspirante, callback) {
        //Obtenemos la contratación
        ContratacionDAO.existeContratacion(idOfertaEmpleo, (codigoRespuesta,contratacionEmpleo)=>{
           if(codigoRespuesta== 200){ 
                mysqlConnection.query('UPDATE contratacion_empleo_aspirante SET valoracion_aspirante = ? WHERE id_perfil_aspirante_cea = ? AND id_contratacion_empleo_cea = ?;',[valoracionAspirante, idAspirante, contratacionEmpleo] , (error, resultadoEvaluacionAspirante)=>{
                    if(!error){ 
                        AspiranteDAO.nombreAspirante(idAspirante, (codigoRespuesta,nombreAspirante)=>{          
                            if(codigoRespuesta == 200){
                                const valoracionAspiranteR = {}

                                valoracionAspiranteR['application/json'] = {
                                    'idAspirante': idAspirante,
                                    'valoracionAspirante': valoracionAspirante,
                                    'nombreAspirante': nombreAspirante
                                }
                                callback(200, valoracionAspiranteR['application/json'])  
    
                            }else{
                                callback(codigoRespuesta, nombreAspirante)
                            }
                        })    
                        
                    }
                    else{

                        console.log(error)
                        callback(500, mensajes.errorInterno)                                  
            
                    }
                });
           }else{
            callback(codigoRespuesta, contratacionEmpleo)
           } 

    })

    }

    //Aspirante
    static getContratacionesDeAspirante(idAspirante, callback) {
        var query = "select conEmp.id_contratacion_empleo as idContratacionEmpleo, conEmp.estatus, date_format(conEmp.fecha_contratacion, \"%Y-%m-%d\") as fechaContratacion, date_format(conEmp.fecha_finalizacion, \"%Y-%m-%d\") as fechaFinalizacion ,  ofertaEmp.* from contratacion_empleo as conEmp inner join contratacion_empleo_aspirante as conEmpAsp  on conEmp.id_contratacion_empleo = conEmpAsp.id_contratacion_empleo_cea inner join  ( select ofEmp.id_oferta_empleo as idOfertaEmpleo, ofEmp.nombre as nombreEmpleo, pefEmp.nombre as nombreEmpleador  from oferta_empleo as ofEmp inner join perfil_empleador as pefEmp  on ofEmp.id_perfil_oe_empleador = pefEmp.id_perfil_empleador ) as ofertaEmp  on ofertaEmp.idOfertaEmpleo = conEmp.id_oferta_empleo_coe where conEmpAsp.id_perfil_aspirante_cea = ?;";
        mysqlConnection.query(query, [idAspirante], (error, resultadoConsulta) => {
            if(error){ 
                callback(500, mensajes.errorInterno)
            } else {
                var listaContratacionesEmpleo = [];
                resultadoConsulta.forEach(fila => {
                    var contratacionEmpleo = {};
                    contratacionEmpleo = {
                        "idContratacionEmpleo": fila['idContratacionEmpleo'],
                        "idOfertaEmpleo": fila['idOfertaEmpleo'],
                        "nombreOfertaEmpleo": fila['nombreEmpleo'],
                        "nombreEmpleador": fila['nombreEmpleador'],
                        "estatus": fila['estatus'],
                        "fechaContratacion": fila['fechaContratacion'],
                        "fechaFinalizacion": fila['fechaFinalizacion']
                    }
                    listaContratacionesEmpleo.push(contratacionEmpleo);
                });
                callback(200, listaContratacionesEmpleo);
            }
        });
    }

    static getContratacionDeAspirante(idAspirante, IdContratacionEmpleo, callback) {
        var queryContratacion = `select conEmp.id_contratacion_empleo as idContratacionEmpleo, conEmp.estatus, date_format(conEmp.fecha_contratacion, "%Y-%m-%d") as fechaContratacion, date_format(conEmp.fecha_finalizacion, "%Y-%m-%d") as fechaFinalizacion ,  ofertaEmp.* from contratacion_empleo as conEmp inner join contratacion_empleo_aspirante as conEmpAsp on conEmp.id_contratacion_empleo = conEmpAsp.id_contratacion_empleo_cea inner join (select ofEmp.id_oferta_empleo as idOfertaEmpleo, ofEmp.nombre as nombreEmpleo, pefEmp.nombre as nombreEmpleador, catEmp.nombre as categoriaEmpleo, ofEmp.direccion, ofEmp.dias_laborales as diasLaborales, ofEmp.tipo_pago as tipoPago, ofEmp.cantidad_pago as cantidadPago, ofEmp.descripcion, ofEmp.hora_inicio, ofEmp.hora_fin from oferta_empleo as ofEmp inner join perfil_empleador as pefEmp on ofEmp.id_perfil_oe_empleador = pefEmp.id_perfil_empleador inner join categoria_empleo as catEmp on catEmp.id_categoria_empleo = ofEmp.id_categoria_oe ) as ofertaEmp on ofertaEmp.idOfertaEmpleo = conEmp.id_oferta_empleo_coe where conEmpAsp.id_perfil_aspirante_cea = ${idAspirante} AND conEmp.id_contratacion_empleo = ${IdContratacionEmpleo};`
        mysqlConnection.query(queryContratacion, (error, resultadoConsulta) => {
            if (error) {
                callback(500,mensajes.errorInterno);
            } else {
                var contratacionEmpleo = {}
                if (resultadoConsulta.length == 1) {
                    var consultaContratacion = resultadoConsulta[0];
                    contratacionEmpleo = {
                        "idContratacion" : consultaContratacion['idContratacionEmpleo'],
                        "estatus": consultaContratacion['estatus'],
                        "nombreEmpleo": consultaContratacion['nombreEmpleo'],
                        "categoriaEmpleo": consultaContratacion['categoriaEmpleo'],
                        "direccion": consultaContratacion['direccion'],
                        "diasLaborales": consultaContratacion['diasLaborales'],
                        "horaInicio": consultaContratacion['hora_inicio'],
                        "horaFin": consultaContratacion['hora_fin'],
                        "tipoPago": consultaContratacion['tipoPago'], 
                        "cantidadPago": consultaContratacion['cantidadPago'],
                        "fechaContratacion": consultaContratacion['fechaContratacion'],
                        "fechaFinalizacion": consultaContratacion['fechaFinalizacion'],
                        "descripcion": consultaContratacion['descripcion'],
                    }
                }
                callback(200, contratacionEmpleo);
            }
        });
    }

    static evaluarEmpleador(idAspirante, idContratacionEmpleo, puntuacion, callback) {
        var queryComprobacion = "SELECT if(count(*) = 1, true, false) AS esEvaluable FROM contratacion_empleo AS conEmp INNER JOIN contratacion_empleo_aspirante AS conEmpAsp ON (conEmp.id_contratacion_empleo = conEmpAsp.id_contratacion_empleo_cea) WHERE (conEmpAsp.id_perfil_aspirante_cea = ? AND conEmpAsp.id_contratacion_empleo_cea = ?) AND estatus = 0 and valoracion_empleador = 0;";
        mysqlConnection.query(queryComprobacion, [idAspirante, idContratacionEmpleo], (error, resultadoComprobacion) => {
            if (error) {
                callback(500,mensajes.errorInterno);
            } else {
                if(resultadoComprobacion[0]['esEvaluable'] == 1) {
                    var queryEvaluacion = "UPDATE contratacion_empleo_aspirante SET valoracion_empleador = ? WHERE id_contratacion_empleo_cea = ? AND id_perfil_aspirante_cea = ?;"
                    mysqlConnection.query(queryEvaluacion, [puntuacion, idContratacionEmpleo, idAspirante], (error, resultadoEvaluacion) => {
                        if(error) {
                            callback(500,mensajes.errorInterno);
                        } else {
                            callback(200,mensajes.evaluacionDeEmpleadorRegistrada);
                        }
                    });
                } else {
                    callback(422,mensajes.evaluacionDeEmpleadorDenegada);
                }
            }
        });
    }
}

