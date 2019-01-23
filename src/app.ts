import { IConfig } from './config';
import * as express from 'express';
import { createApiRoute, createStaticRoute, createErrorHandler } from './routes/api';
import { join, resolve } from 'path';

export class HeartFitServerApp {

    private mConfig: IConfig;
    public constructor(config: IConfig) {
        this.mConfig = config;
    }

    public get config(): IConfig {
        return this.mConfig;
    }

    public start(): void {
        const app = express();
        app.use(createStaticRoute(this.config));
        app.use("/api", createApiRoute(this.config));
        app.use(createErrorHandler());
        console.log("pp", resolve(join(this.config.general.static_files, "index.html")));
        app.listen(this.config.general.port, () => {
            console.log('Example app listening on port ' + this.config.general.port + '!');
        });
    }
}