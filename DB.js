const MySQL = require('mysql2');
require('dotenv').config();

let MySQLDB;
const DB_connect = async () => {
    if (MySQLDB) {
        return MySQLDB;
    };

    try {
        const MySQL_HOST = process.env.MYSQL_HOST;
        const MYSQL_USER = process.env.MYSQL_USER;
        const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
        const MYSQL_DATABASE = process.env.MYSQL_DATABASE;

        MySQLDB = MySQL.createConnection({
            host: MySQL_HOST,
            user: MYSQL_USER,
            password: MYSQL_PASSWORD,
            database: MYSQL_DATABASE
        });

        MySQLDB.connect();
        console.log('MySQL connect success');
        return MySQLDB;
    }
    catch (error) {
        console.error('Connect Error', error);
    }
};

module.exports = DB_connect;
