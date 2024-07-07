const mysql = require(`mysql2`);
require(`dotenv`).config();

let db;
const connect = async () => {
    if (db) return db;

    try {
        db = mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'testdb',
        });

        // 명시적으로 연결을 시도
        db.connect(err => {
            if (err) {
                console.error('DB 연결 오류:', err);
                throw err;
            }
            console.log(`MySQL 연결 성공`);
        });
        return db;
    }
    catch (error) {
        console.error(`연결 오류`, error);
        throw error;
    }
};

module.exports = connect;
