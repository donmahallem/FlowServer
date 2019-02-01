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

export const regexBearerToken: RegExp = new RegExp('^bearer\\ .*$', 'i');

export const createGoogleApiAuthRoute = (config: IConfig): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.gapi = {
            signedIn: false
        }
        if (req.headers['authorization']) {
            const authHeader: string = req.headers['authorization'];
            if (regexBearerToken.test(authHeader)) {
                jwt.verify(authHeader.split(' ')[1],
                    config.general.secret,
                    {
                        issuer: config.general.host
                    }, (err: jwt.VerifyErrors, decoded: string | Object) => {
                        if (err) {
                            req.gapi = {
                                signedIn: false
                            }
                        } else {
                            req.gapi = {
                                signedIn: true
                            }
                        }
                        next();
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
    apiRoute.get('/auth/signin', (req, res, next) => {
        res.redirect(aa.generateAuthUrl());
    });
    apiRoute.get('/auth/url', (req, res, next) => {
        res.json({ url: aa.generateAuthUrl() });
    });
    apiRoute.post('/auth/code', (req, res, next) => {
        const validator: Validator = new Validator();
        const validatorResult: ValidatorResult = validator.validate(req.body, exchangeCodeSchema);
        console.log("validate result", validatorResult.valid);
        if (validatorResult.valid) {
            aa.exchangeCode(req.body.code)
                .then((resp: GetTokenResponse) => {
                    console.log("token response", resp.tokens);
                    if (resp.res.status == 200) {
                        res.status(200).json(resp.tokens);
                    } else {
                        res.status(resp.res.status)
                            .json({
                                error: "An error occured"
                            });
                    }
                })
                .catch((err: any) => {
                    res.status(400).send("error");
                });
        } else {
            res.status(400).json({
                error: "Invalid Request"
            });
        }
    });
    apiRoute.get('/auth/code', (req, res, next) => {
        const validator: Validator = new Validator();
        const validatorResult: ValidatorResult = validator.validate(req.query, exchangeCodeSchema2);
        console.log("validate result", validatorResult.valid, validatorResult.errors);
        if (validatorResult.valid) {
            aa.exchangeCode(req.query.code)
                .then((resp: GetTokenResponse) => {
                    console.log("token response", resp.tokens);
                    if (resp.res.status == 200) {
                        res.status(200).json(resp.tokens);
                    } else {
                        res.status(resp.res.status)
                            .json({
                                error: "An error occured"
                            });
                    }
                })
                .catch((err: any) => {
                    console.log(err);
                    res.status(400).send("error");
                });
        } else {
            res.status(400).json({
                error: "Invalid Request"
            });
        }
    });

    apiRoute.get("/fit/datasources", (req, res, next) => {
        res.status(401).json({ redir: true });
    })
    return apiRoute;
}