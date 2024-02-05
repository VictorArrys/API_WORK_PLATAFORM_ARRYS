const { Console } = require('console');
const mysql = require('mysql');
const Connection = require('mysql/lib/Connection');
const {promisify} = require('util');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config(); 

const pool = mysql.createPool({
    host: process.env.DB_ENV === 'production' ? process.env.PROD_DB_HOST : process.env.TEST_DB_HOST,
    database: process.env.DB_ENV === 'production' ? process.env.PROD_DB_DATABASE : process.env.TEST_DB_DATABASE,
    user: process.env.DB_ENV === 'production' ? process.env.PROD_DB_USER : process.env.TEST_DB_USER,
    password: process.env.DB_ENV === 'production' ? process.env.PROD_DB_PASSWORD : process.env.TEST_DB_PASSWORD,
    port: process.env.DB_ENV === 'production' ? parseInt(process.env.PROD_DB_PORT) : parseInt(process.env.TEST_DB_PORT),
    ssl: process.env.DB_ENV === 'production' ? { ca: fs.readFileSync(process.env.PROD_DB_SSL_CA_PATH) } : undefined
});

pool.getConnection((err, connection)=>{
    if(err){
        console.log(err);
        console.error('DATABASE ERROR BY: ' + err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTIONW AS CLOSED');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if(connection){ connection.release();
        const environment = process.env.DB_ENV === 'production' ? 'Online Service' : 'Local';
        console.log(`Base de datos conectada a: ${environment}`);
        return;
    }
});

pool.query = promisify(pool.query);

module.exports = pool;