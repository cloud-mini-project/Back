const router = require('express').Router();
const path = require('path');
const connect = require('../db');
const sha256 = require('sha256');

router.post('/register/save', async (req, res) => {
    const { email, name, password, role, phone_num, address } = req.body;
    const salt = 'your_secret_salt';
    const crypto_password = sha256(password + salt);

    try {
        const db = await connect();
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

    } catch (err) {
        console.error('DB Connect fail', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { auth_id, password } = req.body;
    const salt = 'your_secret_salt';
    const crypto_password = sha256(password + salt);

    try {
        const db = await connect();
        const query = 'SELECT * FROM user WHERE email = ? AND password = ?';
        const [rows] = await db.execute(query, [auth_id, crypto_password]);

        if (rows.length > 0) {
            console.log('User found:', rows[0]); // 사용자 정보 확인
            req.session.user = rows[0]; // 세션에 사용자 정보 저장
            res.status(200).json({ success: true, user: rows[0] });
        } else {
            console.log('Invalid email or password'); // 유효하지 않은 이메일 또는 비밀번호
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('DB Connect fail', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


module.exports = router;
