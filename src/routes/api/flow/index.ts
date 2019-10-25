/*!
 * Source https://github.com/donmahallem/FlowServer
 */
import { FlowDate } from "@donmahallem/flow-api-types";
import { FlowApiClient } from "@donmahallem/flowapi";
import * as express from "express";
import { Response } from "request";
import { IConfig } from "../../../config";
const flowApiClient: FlowApiClient = new FlowApiClient();

export const rhGetActivityTimeLineForDay: express.RequestHandler
    = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const month: number = parseInt(req.params.month, 10);
        const day: number = parseInt(req.params.day, 10);
        const year: number = parseInt(req.params.year, 10);
        flowApiClient.getActivityTimelineForDay(new FlowDate(year, month, day))
            .then((dataRes) => {
                res.json(dataRes);
            })
            .catch((err: Error | Response) => {
                res.status(400).send("error");
            });
    };

export const createFlowApiRoute = (config: IConfig): express.Router => {
    const apiRoute: express.Router = express.Router();
    flowApiClient.signin(config.flow.email, config.flow.password).catch(console.error);
    apiRoute.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        next();
    });
    apiRoute.get("/activity/timeline/:year(\\d{4,4})/:month(\\d{2,2})/:day(\\d{2,2})", rhGetActivityTimeLineForDay);
    apiRoute.get("/sleep/nearby/:date(\\d{4,4}\\-\\d{2,2}\\-\\d{2,2})", rhGetActivityTimeLineForDay);
    apiRoute.get("/sleep/:id(\\d+)", rhGetActivityTimeLineForDay);
    return apiRoute;
};
