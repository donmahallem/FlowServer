import * as express from "express";
import { join, resolve } from "path";
import { IConfig } from "./config";
import { createAngularRoute, createApiRoute, createErrorHandler } from "./routes/api";

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
        app.use("/api", createApiRoute(this.config));
        app.use(createAngularRoute(this.config));
        app.use(createErrorHandler());
        console.log("pp", resolve(join(this.config.general.static_files, "index.html")));
        app.listen(this.config.general.port, () => {
            console.log("Example app listening on port " + this.config.general.port + "!");
        });
    }
}
