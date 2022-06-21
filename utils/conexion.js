const { Console } = require('console');
const mysql = require('mysql');

const Connection = require('mysql/lib/Connection');

const {promisify} = require('util');

const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection)=>{
    if(err){
        console.log(err);
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
        console.log('Base de datos conectada');
        return;
    }
});

pool.query = promisify(pool.query);

module.exports = pool;