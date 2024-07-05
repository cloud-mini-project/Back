const router = require('express').Router();
const { Database } = require('../DB');
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

const DB_connect = require('../DB');
const sha = require('sha256');

router.get('/register', async(req, res) => {
    res.render('register');
})

router.post('/register', async (req, res) => {
    const MySQLDB = await DB_connect();
    const { 
        user_name,
        user_email,
        user_password,
        user_password2,
        user_phone,
        user_address,
        user_role

    } = req.body;

    try {
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

        // 필요한 로직 추가
    }
    catch(error) {
        console.error('Registration error:', error);
    }
});

router.get('/login', async(req, res) => {
    res.render('login');
})

router.post('/login', async(req, res) => {
    // 필요한 로직 추가
})

module.exports = router;
