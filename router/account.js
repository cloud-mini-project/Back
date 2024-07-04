const express = require('express');
const router = express.Router();

const mysql = require('../DB');
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});


//////////////계좌 목록보기
router.get('/accounts', (req, res) => {
    const query = 'SELECT * FROM accounts WHERE user_id = ?';
    connection.query(query, [req.session.user.id], (error, results) => {
        if (error) return res.status(500).json({ error });
        res.json({ accounts: results });
    });
});



////////////계좌 생성
router.post('/create', (req, res) => {
    const { account_name } = req.body;
    const query = 'INSERT INTO accounts (user_id, account_name, balance) VALUES (?, ?, 0)';
    connection.query(query, [req.session.user.id, account_name], (error, results) => {
        if (error) return res.status(500).json({ error });
        res.json({ success: true });
    });
});

////////계좌 삭제
router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM accounts WHERE id = ? AND user_id = ?';
    connection.query(query, [id, req.session.user.id], (error, results) => {
        if (error) return res.status(500).json({ error });
        res.json({ success: true });
    });
});


///////////////입금
router.post('/deposit', (req, res) => {
    const { account_id, amount } = req.body;
    const query = 'UPDATE accounts SET balance = balance + ? WHERE id = ? AND user_id = ?';
    connection.query(query, [amount, account_id, req.session.user.id], (error, results) => {
        if (error) return res.status(500).json({ error });
        res.json({ success: true });
    });
});
////////////// 출금
router.post('/withdraw', (req, res) => {
    const { account_id, amount } = req.body;
    const query = 'UPDATE accounts SET balance = balance - ? WHERE id = ? AND user_id = ?';
    connection.query(query, [amount, account_id, req.session.user.id], (error, results) => {
        if (error) return res.status(500).json({ error });
        res.json({ success: true });
    });
});

module.exports = router;
