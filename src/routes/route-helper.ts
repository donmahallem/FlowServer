/*!
 * Source https://github.com/donmahallem/FlowServer
 */

import * as express from "express";
import { ServerError } from "../server-error";

export interface IRouteHelperResponse<T> {
    code?: number;
    body: object | string | T;
}
export class RouteHelper {

    public static promiseToResponse<T>(prom: (req: express.Request) =>
        Promise<IRouteHelperResponse<T>>): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            prom(req)
                .then((reg: IRouteHelperResponse<T>) => {
                    if (reg.code) {
                        res.status(reg.code);
                    } else {
                        res.status(200);
                    }
                    res.json(reg.body);
                })
                .catch(next);
        };
    }
}
