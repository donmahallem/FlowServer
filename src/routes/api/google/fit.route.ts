/*!
 * Source https://github.com/donmahallem/FlowServer
 */

import * as express from "express";
import { GetTokenResponse } from "google-auth-library/build/src/auth/oauth2client";
import { Schema, Validator, ValidatorResult } from "jsonschema";
import * as jwt from "jsonwebtoken";
import { IConfig } from "../../../config";
import { Gapi } from "./gapi";

export const createUrlRequestHandler = (gapiClient: Gapi): express.RequestHandler =>
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.json({ url: gapiClient.generateAuthUrl() });
    };

export const createRequireSigninMiddleware = () =>
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.gapi.signedIn) {
            next();
        } else {
            next(new Error("not authorized"));
        }
    };

export const createFitRoute = (gapiClient: Gapi): express.Router => {
    const apiRoute: express.Router = express.Router();
    apiRoute.use(createRequireSigninMiddleware());
    apiRoute.get("/me/dataSources", createUrlRequestHandler(gapiClient));
    return apiRoute;
};
