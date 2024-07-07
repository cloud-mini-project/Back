const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');  // CORS 미들웨어 추가
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const accountRouter = require('./router/account');
const registerRouter = require('./router/register');
const loginRouter = require('./router/login');
const DB_connect = require('./DB');

const HOST = process.env.SERVER_HOST || '127.0.0.1';
const PORT = process.env.SERVER_PORT || 8080;

app.use(cors());  // CORS 미들웨어 사용
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: '암호화키',
    resave: false,
    saveUninitialized: false,
}));

app.use(express.static(path.join(__dirname, '../Front/public')));
app.use('/assets', express.static(path.join(__dirname, '../Front/src/assets')));

app.get('/', (req, res) => {
    console.log('Serving index.html');
    res.sendFile(path.join(__dirname, '../Front/public', 'index.html'));
});

app.use('/api/account', accountRouter);
app.use('/api', registerRouter);
app.use('/auth', loginRouter);

DB_connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://${HOST}:${PORT}`);
    });
}).catch((err) => {
    console.error('DB connection failed:', err);
});
