require('dotenv').config();
const path = require('path');

const express = require('express');
const app = express();

const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// DB 연결
const DB_connect = require('./DB');

// 라우터
const accountRouter = require('./router/account');
const noticeRouter = require('./router/notice');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: '암호화키',
    resave: false,
    saveUninitialized: false,
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const HOST = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;

app.use('/api/accounts', accountRouter);
app.use('/api/notice', noticeRouter);

DB_connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://${HOST}:${PORT}`);
    });
}).catch((err) => {
    console.error('DB connection failed:', err);
});
