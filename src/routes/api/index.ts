import * as express from 'express';
import { flowApiRoute } from './flow';
import { IConfig } from '../../config';
import { join } from 'path';

export const createApiRoute = (config: IConfig): express.Router => {
    const route: express.Router = express.Router({
        caseSensitive: true
    });
    route.use("/flow", flowApiRoute)

    return route;
};

export const create404Handler = (config: IConfig): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.sendFile(join(config.general.static_files, "index.html"));
    };
};

export const createErrorHandler = (): express.ErrorRequestHandler => {
    return (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error(err);
        res.send(JSON.stringify(err));
    };
}

export const createStaticRoute = (config: IConfig): express.Router => {
    const route: express.Router = express.Router();
    route.use(express.static(config.general.static_files, {
        etag: true,
        index: false
    }));
    return route;
};