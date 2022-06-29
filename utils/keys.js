const fs = require("fs");


// Base de datos online

module.exports.SERVER_CREDENTTIALS = {
        host : 'elcamelloapi.mysql.database.azure.com',
        database : 'deser_el_camello',
        user : 'elCamello_',
        password: "red_1729.42_",
        port: 3306,
        ssl: {
            ca : fs.readFileSync(__dirname + '/certificates/deser_el_camello_db.pem')
        }
    
}


module.exports.TEST_CREDENTTIALS = {
        host : 'localhost',
        database : 'deser_el_camello',
        user : 'Camello',
        password: "root",
        port: 3306
}
