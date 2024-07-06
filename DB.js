const MySQL = require(`mysql2`);
require(`dotenv`).config();

let MySQLDB;
const DB_connect = async () => {
    if (MySQLDB) {
        return MySQLDB;
    }

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

        MySQLDB.connect(err => {
            if (err) {
                console.error('DB 연결 오류:', err);
                throw err;
            }
            console.log(`MySQL 연결 성공`);
        });
        return MySQLDB;
    }
    catch (error) {
        console.error(`연결 오류`, error);
        throw error;
    }
};

module.exports = DB_connect;
