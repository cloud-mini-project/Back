const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const uuid = require('uuid');

const connectToDatabase = require('../DB');

const router = express.Router();

// API 요청 미들웨어 추가
router.use((req, res, next) => {
    console.log('API Request:', req.method, req.originalUrl, req.body);
    next();
});

// 기본 폴더 생성 public이랑 notice 모두
if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

if (!fs.existsSync('public/notice')) {
    fs.mkdirSync('public/notice');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, `public/notice/${req.body.path}`);
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, `${uuid.v4()}${ext}`);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
});


// 폴더 생성
router.post('/folder', (req, res) => {
    try {
        let newPath;
        do {
            newPath = uuid.v4();
        } while (fs.existsSync(`public/notice/${newPath}`));

        fs.mkdirSync(`public/notice/${newPath}`);

        res.json({
            status: 'success',
            data: [
                {
                    path: newPath
                }
            ]
        });

    } catch (error) {
        console.error('폴더 생성 에러', error);
        res.status(500).send({
            status: "fail",
            message: 'Internal Server Error'
        })
    }
});

// 이미지 업로드
router.post('/img', (req, res) => {
    upload.single('img')(req, res, (err) => {
        try {
            if (err instanceof multer.MulterError) {
                console.error('Multer 에러', err);
                res.status(500).send({
                    status: "fail",
                    message: 'Internal Server Error'
                });
            } else {
                let filename = req.file.filename;
                console.log(filename);
                res.json({
                    status: 'success',
                    data: null
                });
            }
        } catch (error) {
            console.error(`Upload Error`, error);
            res.status(500).send({
                status: "fail",
                message: 'Internal Server Error'
            });
        }
    });
});

// 파일 업로드
router.post('/file', (req, res) => {
    upload.single('file')(req, res, (err) => {
        try {
            if (err instanceof multer.MulterError) {
                console.error('파일 업로드 에러', err);
                res.status(500).send({
                    status: "fail",
                    message: 'Internal Server Error'
                });
            } else {
                let filename = req.file.filename;
                console.log(filename);
                res.json({
                    status: 'success',
                    data: null
                });
            }
        } catch (error) {
            console.error('파일 업로드 에러', error);
            res.status(500).send({
                status: "fail",
                message: 'Internal Server Error'
            });
        }
    });
});

// 공지사항 작성
router.post('/', async (req, res) => {
    try {
        const { title, content, file, img } = req.body;

        // TODO: 로그인 및 관리자 확인 처리 필요

        const db = await connectToDatabase();

        // insert
        db.query('INSERT INTO notice (user_id, title, content, file, img, created) VALUES (?, ?, ?, ?, ?, ?)', [0, title, content, file, img, new Date()], (err, result) => {
            if (err) {
                console.error('DB 에러', err);
                res.status(500).send({
                    status: "fail",
                    message: 'Internal Server Error'
                });
            } else {
                res.json({
                    status: 'success',
                    data: [
                        {
                            notice_id: result.insertId
                        }
                    ]
                });
            }
        });
    } catch (error) {
        console.error('공지사항 작성 에러', error);
        res.status(500).send({
            status: "fail",
            message: 'Internal Server Error'
        })
    }
});

// 공지사항 목록
// TODO : 페이징 적용
router.get(`/`, async (req, res) => {
    try {
        const db = await connectToDatabase();
        db.query('SELECT user.id user_id, notice.id notice_id, name, email, role, title, content, created, file, img FROM notice, user WHERE notice.user_id = user.id ORDER BY notice.created DESC', (err, rows) => {
            if (err) {
                console.error('DB 에러', err);
                res.status(500).send({
                    status: "fail",
                    message: 'Internal Server Error'
                });
            } else {
                res.json({
                    status: 'success',
                    data: rows
                });
            }
        });
    } catch (error) {
        console.error('공지사항 목록 에러', error);
        res.status(500).send({
            status: "fail",
            message: 'Internal Server Error'
        })
    }
});

// 공지사항 상세
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await connectToDatabase();
        db.query('SELECT user.id user_id, notice.id notice_id, name, email, role, title, content, created, file, img FROM notice, user WHERE notice.user_id = user.id AND notice.id = ?', [id], (err, rows) => {
            if (err) {
                console.error('DB 에러', err);
                res.status(500).send({
                    status: "fail",
                    message: 'Internal Server Error'
                });
            } else {
                // 개수 확인
                if (rows.length === 0) {
                    res.status(404).send({
                        status: "fail",
                        message: '해당 공지사항이 존재하지 않습니다.'
                    });
                    return;
                }
                res.json({
                    status: 'success',
                    data: rows[0]
                });
            }
        });
    } catch (error) {
        console.error('공지사항 상세 에러', error);
        res.status(500).send({
            status: "fail",
            message: 'Internal Server Error'
        })
    }
});

// 공지사항 수정
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const db = await connectToDatabase();
        // 존재 확인
        db.query('SELECT id FROM notice WHERE id = ?', [id], (err, rows) => {
            if (err) {
                console.error('DB 에러', err);
                res.status(500).send({
                    status: "fail",
                    message: 'Internal Server Error'
                });
                return;
            }

            if (rows.length === 0) {
                res.status(404).send({
                    status: "fail",
                    message: '해당 공지사항이 존재하지 않습니다.'
                });
                return;
            }

            let sql = 'UPDATE notice SET ';
            let params = [];
            if (title) {
                sql += 'title = ?, ';
                params.push(title);
            }

            if (content) {
                sql += 'content = ?, ';
                params.push(content);
            }

            sql = sql.slice(0, -2);
            sql += ' WHERE id = ?';
            params.push(id);

            db.query(sql, params, (err, result) => {
                if (err) {
                    console.error('DB 에러', err);
                    res.status(500).send({
                        status: "fail",
                        message: 'Internal Server Error'
                    });
                } else {

                    res.json({
                        status: 'success',
                        data: null
                    });
                }
            });
        });




    } catch (error) {
        console.error('공지사항 수정 에러', error);
        res.status(500).send({
            status: "fail",
            message: 'Internal Server Error'
        })
    }
});

// 공지사항 삭제
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await connectToDatabase();

        // 존재 확인
        db.query('SELECT id FROM notice WHERE id = ?', [id], (err, rows) => {
            if (err) {
                console.error('DB 에러', err);
                res.status(500).send({
                    status: "fail",
                    message: 'Internal Server Error'
                });
                return;
            }

            if (rows.length === 0) {
                res.status(404).send({
                    status: "fail",
                    message: '해당 공지사항이 존재하지 않습니다.'
                });
                return;
            }

            db.query('DELETE FROM notice WHERE id = ?', [id], (err, result) => {
                if (err) {
                    console.error('DB 에러', err);
                    res.status(500).send({
                        status: "fail",
                        message: 'Internal Server Error'
                    });
                    return;
                }

                res.json({
                    status: 'success',
                    data: null
                });

            });
        });


    } catch (error) {
        console.error('공지사항 삭제 에러', error);
        res.status(500).send({
            status: "fail",
            message: 'Internal Server Error'
        })
    }
});

module.exports = router;