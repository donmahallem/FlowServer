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
    return (req, res, next) => {
        res.json({ url: gapiClient.generateAuthUrl() });
    }
};

export const createPostCodeRequestHandler = (gapiClient: Gapi): express.RequestHandler => {
    return (req, res, next) => {
        const validator: Validator = new Validator();
        const validatorResult: ValidatorResult = validator.validate(req.body, exchangeCodeSchema);
        if (validatorResult.valid) {
            gapiClient.exchangeCode(req.body.code)
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
    };
};

export const regexBearerToken: RegExp = new RegExp('^bearer\\ .*$', 'i');

export const createAuthRoute = (gapiClient: Gapi): express.Router => {
    const apiRoute: express.Router = express.Router();
    apiRoute.get('/url', createUrlRequestHandler(gapiClient));
    apiRoute.post('/code', createPostCodeRequestHandler(gapiClient));
    return apiRoute;
}