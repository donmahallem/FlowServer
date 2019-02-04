import * as express from 'express';
import { IConfig } from '../../../config';
import { Gapi } from './gapi';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';
import { Schema, Validator, ValidatorResult } from 'jsonschema';
import * as jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            gapi: GapiInfo
        }
    }
}
const exchangeCodeSchema: Schema = {
    type: "object",
    properties: {
        code: {
            type: "string",
        },
        scope: {
            type: "array",
            minItems: 1,
            items: {
                type: "string"
            }
        }
    },
    required: ["scope", "code"]
};
const exchangeCodeSchema2: Schema = {
    type: "object",
    properties: {
        code: {
            type: "string",
        },
        scope: {
            type: "string"
        }
    },
    required: ["scope", "code"]
};

export interface GapiInfo {
    signedIn: boolean;
    access_token?: string;
    refresh_token?: string;
    uid?: string;
}

export const createUrlRequestHandler = (gapiClient: Gapi): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.json({ url: gapiClient.generateAuthUrl() });
    }
};

export const createRequireSigninMiddleware = () => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.gapi.signedIn === true) {
            next();
        } else {
            next(new Error("not authorized"));
        }
    }
};

export const createFitRoute = (gapiClient: Gapi): express.Router => {
    const apiRoute: express.Router = express.Router();
    apiRoute.use(createRequireSigninMiddleware())
    apiRoute.get('/me/dataSources', createUrlRequestHandler(gapiClient));
    return apiRoute;
}