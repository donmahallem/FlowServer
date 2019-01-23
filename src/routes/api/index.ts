import * as express from 'express';
import { flowApiRoute } from './flow';
import { IConfig } from '../../config';
import { join, resolve } from 'path';

export const createApiRoute = (config: IConfig): express.Router => {
    const route: express.Router = express.Router({
        caseSensitive: true
    });
    route.use("/flow", flowApiRoute)

    return route;
};

export const createErrorHandler = (): express.ErrorRequestHandler => {
    return (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(500).send("Server Error occured");
    };
}

export const createAngularRoute = (config: IConfig): express.Router => {
    const route: express.Router = express.Router();
    route.use(express.static(config.general.static_files, {
        etag: true,
        fallthrough: true
    }));
    route.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
        res.status(404)
            .sendFile(resolve(join(config.general.static_files, "index.html")));
    });
    return route;
};