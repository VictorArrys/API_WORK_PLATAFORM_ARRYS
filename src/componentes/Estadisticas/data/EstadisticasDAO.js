const MostrarError = require('../../../utils/MensajesConsolaAPI');
var mysqlConnection = require('../../../../utils/conexion');
var mensajes = require('../../../../utils/mensajes');

exports.EstadisticasDAO = class estadisticasDAO {

    static estadisticaUsoPlataforma(callback) {
        var pool = mysqlConnection;

        pool.query('SELECT * FROM deser_el_camello.estadisticas_uso_plataforma;', (error, resultadoEstadisticasUso)=>{
            if(error){ 
                callback(500, mensajes.errorInterno);
                
            }else if(resultadoEstadisticasUso.length == 0){
    
                callback(404, mensajes.peticionNoEncontrada)
     
            }else{
                var estadisticas_uso_plataforma = resultadoEstadisticasUso;
                callback(200, estadisticas_uso_plataforma)
          
            }
        });
    }

    static estadisticaEmpleos (callback) {
        var pool = mysqlConnection;

        pool.query('SELECT * FROM deser_el_camello.estadisticas_empleos;', (error, resultadoEstadisticasEmpleos)=>{
            if(error){ 
                callback(500, mensajes.errorInterno)
                
            }else if(resultadoEstadisticasEmpleos.length == 0){
    
                callback(404, mensajes.peticionNoEncontrada)
     
            }else{
                var estadisticas_empleos = resultadoEstadisticasEmpleos;
                callback(200, estadisticas_empleos)
          
            }
        });
    }

    static estadisticasOfertasEmpleo(callback) {
        var pool = mysqlConnection;
    
            pool.query('SELECT * FROM deser_el_camello.estadisticas_ofertas_empleo;', (error, resultadoEstadisticasOfertasEmpleo)=>{
                if(error){ 
                    callback(500, mensajes.errorInterno)
                    
                }else if(resultadoEstadisticasOfertasEmpleo.length == 0){
        
                    callback(200, [])
         
                }else{
                    var estadisticas_ofertas_empleo = resultadoEstadisticasOfertasEmpleo;
                    callback(200, estadisticas_ofertas_empleo)
              
                }
            });
    }

    static valoracionesAspirante(callback) {
        var pool = mysqlConnection;

        pool.query('SELECT * FROM deser_el_camello.valoraciones_aspirantes WHERE valoracion_aspirante;', (error, resultadoValoracionesAspirantes)=>{
            if(error){ 
                callback(500, mensajes.errorInterno)
                
            }else if(resultadoValoracionesAspirantes.length == 0){
    
                callback(200, [])
     
            }else{
                var valoraciones_aspirantes = resultadoValoracionesAspirantes;
                callback(200, valoraciones_aspirantes)
            }
        });
    }

    static valoracionesEmpleador(callback) {
        var pool = mysqlConnection;
  
        pool.query('SELECT * FROM deser_el_camello.valoraciones_empleadores WHERE valoracion_empleador;', (error, resultadoValoracionesEmpleadores)=>{
            if(error){ 
                callback(500, mensajes.errorInterno)
                
            }else if(resultadoValoracionesEmpleadores.length == 0){
    
                callback(200, [])
     
            }else{
                var valoraciones_empleadores = resultadoValoracionesEmpleadores;
                callback(200, valoraciones_empleadores)
          
            }
        });
    }

}