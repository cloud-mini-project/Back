const router = require('express').Router();
const path = require('path');
const connect = require('../db');
const sha256 = require('sha256');

router.post('/register/save', async (req, res) => {
    const { email, name, password, role, phone_num, address } = req.body;
    const salt = 'your_secret_salt';
    const crypto_password = sha256(password + salt);

    try {
        const { db } = await connect();
        const query = `
        INSERT INTO user (
            email,
            name,
            password,
            role,
            phone_num,
            address
        ) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [email, name, crypto_password, role, phone_num, address];

        await db.execute(query, values);
        res.status(201).json({ message: 'Register successful' });

    }
    catch (err) {
        console.error('DB Connect fail', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login/submit', async (req, res) => {
    const { email, password } = req.body;
    const salt = 'your_secret_salt';
    const crypto_password = sha256(password + salt);

    try {
        const { db } = await connect();
        const query = 'SELECT * FROM user WHERE email = ? AND password = ?';
        const [rows] = await db.execute(query, [email, crypto_password]);

        if (rows.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    }
    catch (err) {
        console.error('DB Connect fail', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { auth_id, password } = req.body;

    try {
        const MySQLDB = await connect();
        const query = `SELECT * FROM user WHERE email = ? AND password = ?`;
        const values = [auth_id, password];

        MySQLDB.query(query, values, (err, results) => {
            if (err) {
                console.error('로그인 오류:', err);
                return res.status(500).json({ success: false, message: '서버 오류' });
            }
            if (results.length > 0) {
                const user = results[0];
                req.session.user = user; // 세션에 사용자 정보 저장
                console.log(user);
                res.json({ success: true, user });
            } else {
                res.json({ success: false, message: '로그인 실패: 잘못된 아이디 또는 비밀번호' });
            }
        });
    } catch (err) {
        console.error('DB 접속 실패:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

module.exports = router;
