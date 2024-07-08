const mysql = require(`mysql2/promise`);
require(`dotenv`).config();

let db;
const connect = async () => {
    if (db) return db;

    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'app',
        });

        console.log(`MySQL 연결 성공`);
        return db;
    }
    catch (error) {
        console.error(`연결 오류`, error);
        throw error;
    }
};

module.exports = connect;
