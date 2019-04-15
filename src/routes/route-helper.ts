import * as express from 'express';
import { ServerError } from '../server-error';

export interface RouteHelperResponse<T> {
    code?: number,
    body: object | string | T
}
export class RouteHelper {

    public static promiseToResponse<T>(prom: (req: express.Request) => Promise<RouteHelperResponse<T>>): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            prom(req)
                .then((reg: RouteHelperResponse<T>) => {
                    if (reg.code) {
                        res.status(reg.code);
                    } else {
                        res.status(200);
                    }
                    res.json(reg.body);
                })
                .catch(next);
        }
    }
}