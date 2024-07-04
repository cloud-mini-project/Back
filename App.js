
const express = require('express');
const app = express();


require(`dotenv`).config();
const HOST = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;

const Express = require(`express`);
const App = Express();
App.use(Express.static("public"));

const session = require("express-session");
App.use(
    session({
        secret: "암호화키",
        resave: false,
        saveUninitialized: false,
    })
);


const path = require(`path`);
App.set(`views`, path.join(__dirname, `views`))
App.set('view engine', 'ejs');

const fs = require(`fs`);


const bodyParser = require(`body-parser`);
App.use(bodyParser.urlencoded({ extended : true }));
App.use(bodyParser.json());

const cookieParser = require("cookie-parser");
App.use(cookieParser());


/** MySQL Connect */
const MySQL = require(`./DB`);

require(`dotenv`).config();
/** Server set host */
const HOST = process.env.SERVER_HOST;
/** Server set port */
const PORT = process.env.SERVER_PORT;

const accountRouter = require('./router/account');

function Server_run() {
    try {
        MySQL();
        App.listen(PORT, async() => {
            console.log(`Server runing http://${HOST}:${PORT}`);
        });
        App.get(`/`, async(req, res) => {
            res.render(`index`)
        });

        App.use('/account', accountRouter);  // 계좌 관련 라우트 추가
    }
    catch (error) {
        console.error(`Server error`, error);
    }
}
Server_run();

const session = require('express-session');
app.use(session({
    secret: "암호화키",
    resave: false,
    saveUninitialized: false,
}));

const path = require('path');
app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mysql = require('./DB');

require('dotenv').config();
const HOST = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;

const accountRouter = require('./routes/account');

function Server_run() {
    try {
        mysql();
        app.listen(PORT, async() => {
            console.log(`Server running at http://${HOST}:${PORT}`);
        });

        app.get('/', async(req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });

        app.get('/accounts', async(req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'accounts.html'));
        });

        app.use('/api/account', accountRouter);
    }
    catch (error) {
        console.error(`Server error`, error);
    }
}
Server_run();

const register_router = require(`./router/register`);
App.use(`/register`, require(register_router));