import * as bodyParser from "body-parser";
import * as express from "express";
import { join, resolve } from "path";
import { IConfig } from "../../config";
import { createFlowApiRoute } from "./flow";
import { createGoogleApiRoute } from "./google";

export const createApiRoute = (config: IConfig): express.Router => {
    const route: express.Router = express.Router({
        caseSensitive: true,
    });
    route.use(bodyParser.json());
    route.use("/flow", createFlowApiRoute(config));
    route.use("/google", createGoogleApiRoute(config));
    route.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(404)
            .json({
                error: "Unknown route",
            });
    });
    return route;
};

export const createErrorHandler = (): express.ErrorRequestHandler =>
    (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(500).json({
            error: "Server Error occured",
        });
    };

export const createAngularRoute = (config: IConfig): express.Router => {
    const route: express.Router = express.Router();
    route.use(express.static(config.general.static_files, {
        etag: true,
        fallthrough: true,
    }));
    route.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
        res.status(404)
            .sendFile(resolve(join(config.general.static_files, "index.html")));
    });
    return route;
};
