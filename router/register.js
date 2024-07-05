const router = require('express').Router();
const Database = require('../DB');
const sha256 = require('sha256');

router.get('/register', (req, res) => {
    res.sendFile('register');
});

router.post('/save', async (req, res) => {
    const {
        email,
        name,
        password,
        role,
        phone_number,
        address
    } = req.body;

    try {
        document.addEventListener()
        
        const DB = await Database();
        const Encrypto = sha256(password + 'salt');
        
        const sql = `
        INSERT INTO user (
            email,
            name,
            password,
            role,
            phone_number,
            address
        ) VALUES (?, ?, ?, ?, ?, ?)`

        const values = [
            email,
            name,
            Encrypto,
            role,
            phone_number,
            address
        ];

        const [result] = await DB.execute(sql, values);
        res.sendFile('index');
    }
    catch (error) {
        console.error('DB connect fail', error);
        res.status(500).render('register');
    }
});

module.exports = router;