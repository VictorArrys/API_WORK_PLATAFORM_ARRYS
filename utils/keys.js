const fs = require("fs");

module.exports = {
    database: {
        host : 'elcamelloapi.mysql.database.azure.com',
        database : 'deser_el_camello',
        user : 'elCamello_',
        password: "red_1729.42_",
        port: 3306,
        ssl: {
            ca : fs.readFileSync(__dirname + '/certificates/deser_el_camello_db.pem')
        }
    }
}
