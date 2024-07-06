const router = require('express').Router();
const path = require('path');
const Database = require('../DB');
const sha256 = require('sha256');

router.post('/register/save', async (req, res) => {
    const { email, name, password, role, phone_num, address } = req.body;
    const salt = 'your_secret_salt';
    const crypto_password = sha256(password + salt);

    try {
        const { db } = await Database();
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
        const { db } = await Database();
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

module.exports = router;
