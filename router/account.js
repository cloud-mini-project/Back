const express = require('express');
const router = express.Router();
const setup = require('../DB');

// 계좌 생성 폼 처리
router.post('/create', async (req, res) => {
    // 로그인 상태 확인
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const { account_type, account_number } = req.body;
    const account_balance = 0; // 기본값 설정

    try {
        const { mysqldb } = await setup();
        const query = `INSERT INTO account (account_type, account_number, account_balance, user_id) VALUES (?, ?, ?, ?)`;
        const values = [account_type, account_number, account_balance, req.session.user.id];

        mysqldb.query(query, values, (err, results) => {
            if (err) {
                console.error('계좌 생성 오류:', err);
                res.status(500).send('계좌 생성에 실패했습니다.');
            } else {
                res.redirect('/list');
            }
        });
    } catch (err) {
        console.error('DB 접속 실패:', err);
        res.status(500).send('서버 오류');
    }
});


// 계좌 삭제 처리
router.post('/delete', async (req, res) => {
    // 로그인 상태 확인
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const { account_id } = req.body;

    try {
        const { mysqldb } = await setup();
        const query = `DELETE FROM account WHERE id = ? AND user_id = ?`;
        const values = [account_id, req.session.user.id];

        mysqldb.query(query, values, (err, results) => {
            if (err) {
                console.error('계좌 삭제 오류:', err);
                res.status(500).send('계좌 삭제에 실패했습니다.');
            } else {
                res.redirect('/list');
            }
        });
    } catch (err) {
        console.error('DB 접속 실패:', err);
        res.status(500).send('서버 오류');
    }
});



// 입금 및 출금 처리
router.post('/transaction', async (req, res) => {
    // 로그인 상태 확인
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const { account_id, transaction_type, amount } = req.body;
    const isDeposit = transaction_type === 'deposit';

    try {
        const { mysqldb } = await setup();
        const getBalanceQuery = `SELECT account_balance FROM account WHERE id = ? AND user_id = ?`;
        const getBalanceValues = [account_id, req.session.user.id];

        mysqldb.query(getBalanceQuery, getBalanceValues, (err, results) => {
            if (err) {
                console.error('잔고 조회 오류:', err);
                res.status(500).send('잔고 조회에 실패했습니다.');
            } else {
                if (results.length > 0) {
                    let newBalance = results[0].account_balance;
                    if (isDeposit) {
                        newBalance += parseInt(amount);
                    } else {
                        if (newBalance >= amount) {
                            newBalance -= parseInt(amount);
                        } else {
                            return res.status(400).send('잔고가 부족합니다.');
                        }
                    }

                    const updateQuery = `UPDATE account SET account_balance = ? WHERE id = ? AND user_id = ?`;
                    const updateValues = [newBalance, account_id, req.session.user.id];

                    mysqldb.query(updateQuery, updateValues, (err, results) => {
                        if (err) {
                            console.error('계좌 업데이트 오류:', err);
                            res.status(500).send('계좌 업데이트에 실패했습니다.');
                        } else {
                            res.redirect('/list');
                        }
                    });
                } else {
                    res.status(404).send('계좌를 찾을 수 없습니다.');
                }
            }
        });
    } catch (err) {
        console.error('DB 접속 실패:', err);
        res.status(500).send('서버 오류');
    }
});

module.exports = router;
