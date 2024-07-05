const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();
const accountRouter = require('./router/account'); // 이 부분이 중요합니다.
const registerRouter = require('./router/register');
const DB_connect = require('./DB');

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
app.use(express.static(path.join(__dirname, '../Front/public')));

const HOST = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;

app.use('/api/accounts', accountRouter);
app.use('/api', registerRouter);

DB_connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://${HOST}:${PORT}`);
    });
}).catch((err) => {
    console.error('DB connection failed:', err);
});
