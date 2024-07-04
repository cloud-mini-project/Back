const Express = require(`express`);
const App = Express();

const session = require("express-session");
App.use(
    session({
        secret: "암호화키",
        resave: false,
        saveUninitialized: false,
    })
);

const path = require(`path`);
App.set(`views`, path.join(__dirname, `src/views`))
App.set('view engine', 'ejs');
App.use(Express.static("public"));

const fs = require(`fs`);

const cookieParser = require("cookie-parser");
App.use(cookieParser());

const bodyParser = require(`body-parser`);
App.use(bodyParser.urlencoded({ extended : true }));


/** MySQL Connect */
const MySQL = require(`./DB`);

require(`dotenv`).config();
/** Server set host */
const HOST = process.env.SERVER_HOST;
/** Server set port */
const PORT = process.env.SERVER_PORT;

function Server_run() {
    try {
        MySQL();
        App.listen(PORT, async() => {
            console.log(`Server runing http://${HOST}:${PORT}`);
        })
        App.get(`/`, async(req, res) => {
            res.render(`index`)
        })
    }
    catch (error) {
        console.error(`Server error`, error);
    }
}
Server_run();
// App.use(`/`, require(`./router/?`));