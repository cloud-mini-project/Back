const express = require('express');
const router = express.Router();
const setup = require('../DB');

// 계좌 목록 조회
router.get('/accounts', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const mysqldb = await setup();
        const query = `SELECT * FROM account WHERE user_id = ?`;
        const values = [req.session.user.id];

        mysqldb.query(query, values, (err, results) => {
            if (err) {
                console.error('계좌 조회 오류:', err);
                return res.status(500).json({ error: '계좌 조회에 실패했습니다.' });
            }
            res.json({ accounts: results });
        });
    } catch (err) {
        console.error('DB 접속 실패:', err);
        res.status(500).json({ error: '서버 오류' });
    }
});

// 계좌 생성
router.post('/accounts/create', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { account_type, account_password } = req.body;
    const account_number = Math.random().toString(36).substr(2, 10); // 계좌 번호 난수 생성
    const account_balance = 0;

    try {
        const mysqldb = await setup();
        const query = `INSERT INTO account (account_type, account_number, account_balance, user_id) VALUES (?, ?, ?, ?)`;
        const values = [account_type, account_number, account_balance, req.session.user.id];

        mysqldb.query(query, values, (err, results) => {
            if (err) {
                console.error('계좌 생성 오류:', err);
                return res.status(500).json({ error: '계좌 생성에 실패했습니다.' });
            }
            res.json({ success: true });
        });
    } catch (err) {
        console.error('DB 접속 실패:', err);
        res.status(500).json({ error: '서버 오류' });
    }
});

// 계좌 삭제
router.delete('/accounts/delete/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    try {
        const mysqldb = await setup();
        const query = `DELETE FROM account WHERE id = ? AND user_id = ?`;
        const values = [id, req.session.user.id];

        mysqldb.query(query, values, (err, results) => {
            if (err) {
                console.error('계좌 삭제 오류:', err);
                return res.status(500).json({ error: '계좌 삭제에 실패했습니다.' });
            }
            res.json({ success: true });
        });
    } catch (err) {
        console.error('DB 접속 실패:', err);
        res.status(500).json({ error: '서버 오류' });
    }
});

// 입금
router.post('/accounts/deposit', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { account_id, amount } = req.body;

    try {
        const mysqldb = await setup();
        const query = `UPDATE account SET account_balance = account_balance + ? WHERE id = ? AND user_id = ?`;
        const values = [amount, account_id, req.session.user.id];

        mysqldb.query(query, values, (err, results) => {
            if (err) {
                console.error('입금 오류:', err);
                return res.status(500).json({ error: '입금에 실패했습니다.' });
            }
            res.json({ success: true });
        });
    } catch (err) {
        console.error('DB 접속 실패:', err);
        res.status(500).json({ error: '서버 오류' });
    }
});

// 출금
router.post('/accounts/withdraw', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { account_id, amount } = req.body;

    try {
        const mysqldb = await setup();
        const query = `UPDATE account SET account_balance = account_balance - ? WHERE id = ? AND user_id = ?`;
        const values = [amount, account_id, req.session.user.id];

        mysqldb.query(query, values, (err, results) => {
            if (err) {
                console.error('출금 오류:', err);
                return res.status(500).json({ error: '출금에 실패했습니다.' });
            }
            res.json({ success: true });
        });
    } catch (err) {
        console.error('DB 접속 실패:', err);
        res.status(500).json({ error: '서버 오류' });
    }
});

module.exports = router;
