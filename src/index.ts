import { Config, getConfig } from "./config";
import * as express from 'express';
import { apiRoute } from "./routes/api";

const app: express.Express = express();

app.use('/api', apiRoute);

app.listen(getConfig().port, function () {
    console.log('Example app listening on port 3000!');
});