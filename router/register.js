// const router = require('express').Router();
// const path = require('path');
// const Database = require('../DB');
// const sha256 = require('sha256');

// router.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../front/src/public/register.html'));
// });
// // res.sendFile(path.join(__dirname, '../Front/src/public/register.html'));

// router.post('/register', async(req, res) => {
//     const { email, name, password, role, phone_num, address } = req.body;
//     /** 패스워드 암호화 */
//     const genPassword = (length = 20) => {
//         const crypto = require(`crypto`);
//         return crypto.randomBytes(length).toString(`hex`);
//     };

//     if (req.body) {
//         const sqlSelect = `
//         SELECT * FROM user
//         WHERE
//             email = ?
//             name = ?
//             phone_num = ? 
//         `
//     }

//     /// 원본
//     try {
//         const { db } = await Database();
//         const query = `
//         INSERT INTO user (
//             email,
//             name,
//             password,
//             role,
//             phone_num,
//             address
//         ) VALUES (?, ?, ?, ?, ?, ?)`;
//         const values = [email, name, genPassword, role, phone_num, address];

//         await db.execute(query, values);
//         res.status(201).json({ message: 'Register successful' });

//     }
//     catch (err) {
//         console.error('DB Connect fail', err);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const path = require('path');
const Database = require('../DB');
const sha256 = require('sha256');

// GET /register route
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Front/src/public/register.html'));
});

// POST /register/save route
router.post('/register', async (req, res) => {
    const { email, name, password, role, phone_num, address } = req.body;
    const salt = 'your_secret_salt';
    const crypto_password = sha256(password + salt);

    try {
        const { db } = await Database();
        const query = `
            INSERT INTO user (
                email,
                name,
                crypto_password,
                role,
                phone_num,
                address
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [email, name, crypto_password, role, phone_num, address];

        await db.execute(query, values);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('DB Connect fail', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;