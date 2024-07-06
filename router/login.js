const express = require('express');
const router = express.Router();
const DB_connect = require('../DB');

router.post('/login', async (req, res) => {
    const { auth_id, password } = req.body;

    try {
        const MySQLDB = await DB_connect();
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
