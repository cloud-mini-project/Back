const Express = require(`express`);
const App = Express();

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