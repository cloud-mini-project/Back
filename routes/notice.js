const express = require(`express`);
const router = express.Router();

const connectToDatabase = require(`../DB`);

// 공지사항 작성
router.post(`/`, async (req, res) => {
    try {
        const { user_id, title, content, file, img } = req.body;
        const db = await connectToDatabase();
        const rows = await db.query(`INSERT INTO notice (user_id, title, content, file, img) VALUES (?, ?, ?, ?, ?)`, [user_id, title, content, file, img]);
        res.json(rows);
    } catch (error) {
        console.error(`Notice Error`, error);
        res.status(500).send({
            message: `Internal Server Error`
        })
    }
});

// 공지사항 목록
router.get(`/`, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const rows = await db.query(`SELECT user.id, member_id, name, email, role, title, content, created, file, img FROM notice, user WHERE notice.user_id = user.id ORDER BY notice_id DESC`);
        res.json(rows);
    } catch (error) {
        console.error(`Notice Error`, error);
        res.status(500).send({
            message: `Internal Server Error`
        })
    }
});

// 공지사항 상세
router.get(`/:notice_id`, async (req, res) => {
    try {
        const { notice_id } = req.params;
        const db = await connectToDatabase();
        const rows = await db.query(`SELECT user.id, member_id, name, email, role, title, content, created, file, img FROM notice, user WHERE notice.user_id = user.id AND notice_id = ?`, [notice_id]);
        res.json(rows);
    } catch (error) {
        console.error(`Notice Error`, error);
        res.status(500).send({
            message: `Internal Server Error`
        })
    }
});

// 공지사항 수정
router.put(`/:notice_id`, async (req, res) => {
    try {
        const { notice_id } = req.params;
        const { title, content, file, img } = req.body;
        const db = await connectToDatabase();
        const rows = await db.query(`UPDATE notice SET title = ?, content = ?, file = ?, img = ? WHERE notice_id = ?`, [title, content, file, img, notice_id]);
        res.json(rows);
    } catch (error) {
        console.error(`Notice Error`, error);
        res.status(500).send({
            message: `Internal Server Error`
        })
    }
});

// 공지사항 삭제
router.delete(`/:notice_id`, async (req, res) => {
    try {
        const { notice_id } = req.params;
        const db = await connectToDatabase();
        const rows = await db.query(`DELETE FROM notice WHERE notice_id = ?`, [notice_id]);
        res.json(rows);
    } catch (error) {
        console.error(`Notice Error`, error);
        res.status(500).send({
            message: `Internal Server Error`
        })
    }
});

module.exports = router;