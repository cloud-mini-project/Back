const express = require('express');
const router = express.Router();
const setup = require('../DB');
const crypto = require('crypto');

// 계좌 번호와 비밀번호 암호화 함수
function generateAccountNumber() {
    return Math.floor(Math.random() * 9000000000) + 1000000000; // 10자리 난수
}

function hashPassword(password, salt) {
    return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

// 계좌 목록 조회
router.get('/accounts', async (req, res) => {
    const user_id = req.query.user_id;
    if (!user_id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const mysqldb = await setup();
        const query = `SELECT * FROM account WHERE user_id = ?`;
        const values = [user_id];

        mysqldb.MySQLDB.query(query, values, (err, results) => {
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
    const { account_type, account_password, user_id } = req.body;
    console.log('Received request to create account with:', req.body);
    const account_number = generateAccountNumber();
    const account_balance = 0;
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = hashPassword(account_password, salt);

    try {
        const mysqldb = await setup();
        const query = `INSERT INTO account (account_type, account_number, account_balance, user_id, account_password) VALUES (?, ?, ?, ?, ?)`;
        const values = [account_type, account_number, account_balance, user_id, hashedPassword];

        mysqldb.MySQLDB.query(query, values, (err, results) => {
            if (err) {
                console.error('계좌 생성 오류:', err);
                return res.status(500).json({ error: '계좌 생성에 실패했습니다.' });
            }

            const accountId = results.insertId;
            const saltQuery = `INSERT INTO account_salt (account_id, salt) VALUES (?, ?)`;
            const saltValues = [accountId, salt];

            mysqldb.MySQLDB.query(saltQuery, saltValues, (err, results) => {
                if (err) {
                    console.error('솔트 저장 오류:', err);
                    return res.status(500).json({ error: '솔트 저장에 실패했습니다.' });
                }
                res.json({ success: true });
            });
        });
    } catch (err) {
        console.error('DB 접속 실패:', err);
        res.status(500).json({ error: '서버 오류' });
    }
});



// 계좌 삭제
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const user_id = req.query.user_id;
    if (!user_id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const mysqldb = await setup();
        const query = `DELETE FROM account WHERE id = ? AND user_id = ?`;
        const values = [id, user_id];

        mysqldb.MySQLDB.query(query, values, (err, results) => {
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
router.post('/deposit', async (req, res) => {
    const { account_id, amount, user_id } = req.body;
    if (!user_id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const mysqldb = await setup();
        const query = `UPDATE account SET account_balance = account_balance + ? WHERE id = ? AND user_id = ?`;
        const values = [amount, account_id, user_id];

        mysqldb.MySQLDB.query(query, values, (err, results) => {
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
router.post('/withdraw', async (req, res) => {
    const { account_id, amount, user_id } = req.body;
    if (!user_id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const mysqldb = await setup();
        const query = `UPDATE account SET account_balance = account_balance - ? WHERE id = ? AND user_id = ?`;
        const values = [amount, account_id, user_id];

        mysqldb.MySQLDB.query(query, values, (err, results) => {
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
