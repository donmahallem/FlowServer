import { FlowApi } from "./flow-api";
import { Config, getConfig } from "./config";

const a: FlowApi = new FlowApi();

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as crypto from 'crypto';
import * as expressSession from "express-session";

const app = express();

/*
function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}*/

const apiRoute: express.Router = express.Router({
    caseSensitive: true
});
apiRoute.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 3600 * 24 * 30
    }
}));
apiRoute.use(bodyParser.json());
apiRoute.post("/login", (req, res, next) => {
    a.signin(req.body.email, req.body.password)
        .then((dataRes) => {
            if ((dataRes.statusCode >= 300 && dataRes.statusCode < 400) || dataRes.statusCode == 200) {
                function encrypt(text) {
                    let cipher = crypto.createCipher('aes-256-cbc', getConfig().cookiesecret);
                    let crypted = cipher.update(text, 'utf8', 'hex');
                    crypted += cipher.final('hex');
                    return crypted;
                }
                res.status(200)
                    .cookie("flowdata", encrypt(JSON.stringify(dataRes.headers["set-cookie"])), {
                        httpOnly: true,
                        expires: new Date(Date.now() + 60 * 60 * 1000 * 24 * 30)
                    })
                    .json({ data: true })
            } else {
                res.status(400).send("error");
            }
        })
        .catch((err) => {
            res.status(400).send("error");
        })
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.use("/api", apiRoute);

app.listen(getConfig().port, function () {
    console.log('Example app listening on port ' + getConfig().port + '!');
});

console.log(getConfig());