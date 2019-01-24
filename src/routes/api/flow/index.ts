import * as express from 'express';
import { FlowApiClient } from '@donmahallem/flowapi';
import { IConfig } from '../../../config';
import { Response } from 'request';
const flowApiClient: FlowApiClient = new FlowApiClient();

export const rhGetActivityTimeLineForDay: express.RequestHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    flowApiClient.getActivityTimelineForDay(2019, 1, 1)
        .then((dataRes) => {
            res.send(dataRes.body);
        })
        .catch((err: Error | Response) => {
            console.log(err);
            res.status(400).send("error");
        })
};


export const createFlowApiRoute = (config: IConfig): express.Router => {
    const apiRoute: express.Router = express.Router();
    flowApiClient.signin(config.flow.email, config.flow.password);
    apiRoute.use((req, res, next) => {
        console.log(req.path);
        next();
    })
    apiRoute.get("/activity/timeline/:date(\d{4,4}\-\d{2,2}\-\d{2,2})", rhGetActivityTimeLineForDay);
    apiRoute.get("/sleep/nearby/:date(\\d{4,4}\\-\\d{2,2}\\-\\d{2,2})", rhGetActivityTimeLineForDay);
    apiRoute.get("/sleep/:id(\\d+)", rhGetActivityTimeLineForDay);
    return apiRoute;
}