import * as express from 'express';
import { IConfig } from '../../../config';
import { Gapi } from './gapi';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';
import { Schema, Validator, ValidatorResult } from 'jsonschema';
import { createAuthRoute } from './auth.route';
import { createFitRoute } from './fit.route';
import { JwtHelper } from '../../../jwt-helper';
import { VerifyErrors } from 'jsonwebtoken';
import { GapiJwtToken } from './gapi-jwt-token';
import { Credentials } from 'google-auth-library';
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
    credentials?: Credentials;
}

export const regexBearerToken: RegExp = new RegExp('^bearer\\ .*$', 'i');

export const createGoogleApiAuthRoute = (config: IConfig): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.gapi = {
            signedIn: false
        }
        if (req.headers['authorization']) {
            const authHeader: string = req.headers['authorization'];
            if (regexBearerToken.test(authHeader)) {
                JwtHelper.verify(authHeader.split(' ')[1])
                    .then((decoded: GapiJwtToken) => {
                        req.gapi = {
                            signedIn: true,
                            credentials: decoded.gapi
                        };
                        next();
                    }).catch((err: VerifyErrors) => {
                        next(err);
                    });
                return;
            }
        }
        next();
    };
}


export const createGoogleApiRoute = (config: IConfig): express.Router => {
    const apiRoute: express.Router = express.Router();
    const aa = new Gapi(config);
    apiRoute.use(createGoogleApiAuthRoute(config));
    apiRoute.use('/auth', createAuthRoute(aa));
    apiRoute.use('/fit', createFitRoute(aa));
    return apiRoute;
}