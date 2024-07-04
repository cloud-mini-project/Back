const express = require('express');
const app = express();

<<<<<<< Updated upstream
require(`dotenv`).config();
const HOST = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;

const path = require(`path`);
const fs = require(`fs`);

const bodyParser = require(`body-parser`);
App.use(bodyParser.urlencoded({ extended : true }));

function Server_run() {
    App.listen(PORT, async(req, res) => {
        console.log(`Server runing http://${HOST}:${PORT}`);
    })
}
Server_run();
=======
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
>>>>>>> Stashed changes
