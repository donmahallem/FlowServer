/*!
 * Source https://github.com/donmahallem/FlowServer
 */

import * as express from "express";
import { Credentials } from "google-auth-library";
import { GetTokenResponse } from "google-auth-library/build/src/auth/oauth2client";
import { Schema, Validator, ValidatorResult } from "jsonschema";
import * as jwt from "jsonwebtoken";
import { IConfig } from "../../../config";
import { Config } from "../../../config";
import { JwtHelper } from "../../../jwt-helper";
import { ServerError } from "../../../server-error";
import { RouteHelper } from "../../route-helper";
import { Gapi } from "./gapi";
import { IGapiJwtToken } from "./gapi-jwt-token";

export const exchangeCodeSchema: Schema = {
    type: "object",
    properties: {
        code: {
            type: "string",
        },
        scope: {
            type: "array",
            minItems: 1,
            items: {
                type: "string",
            },
        },
    },
    required: ["scope", "code"],
};

export const createUrlRequestHandler = (gapiClient: Gapi): express.RequestHandler =>
    (req, res, next) => {
        res.json({ url: gapiClient.generateAuthUrl() });
    };

export const createPostCodeRequestHandler = (gapiClient: Gapi): express.RequestHandler =>
    (req, res, next) => {
        const validator: Validator = new Validator();
        const validatorResult: ValidatorResult = validator.validate(req.body, exchangeCodeSchema);
        if (validatorResult.valid) {
            gapiClient.exchangeCode(req.body.code)
                .then((tokenResponse: GetTokenResponse) => {
                    if (tokenResponse.res.status === 200) {
                        const data: IGapiJwtToken = { gapi: tokenResponse.tokens };
                        return JwtHelper.sign(data);
                    } else {
                        return Promise.reject(new ServerError("Could not exchange code", tokenResponse.res.status));
                    }
                })
                .then((jwt: string) => {
                    console.log("JJJJJJ");
                    res.json({
                        token: jwt,
                    });
                }).catch((err: Error) => {
                    next(err);
                });
        } else {
            next(new ServerError("Invalid request", 400));
        }
    };
export const createPostCodeRequestHandler2 = (gapiClient: Gapi): express.RequestHandler =>
    RouteHelper
        .promiseToResponse((req: express.Request) => {

            const validator: Validator = new Validator();
            const validatorResult: ValidatorResult = validator.validate(req.body, exchangeCodeSchema);
            if (validatorResult.valid) {
                return gapiClient.exchangeCode(req.body.code)
                    .then((tokenResponse: GetTokenResponse) => {
                        if (tokenResponse.res.status === 200) {
                            const data: IGapiJwtToken = { gapi: tokenResponse.tokens };
                            return JwtHelper.sign(data);
                        } else {
                            return Promise.reject(new ServerError("Could not exchange code", tokenResponse.res.status));
                        }
                    })
                    .then((jwt: string) =>
                        ({
                            body: jwt,
                        }));
            } else {
                return Promise.reject(new ServerError("Invalid request", 400));
            }
        });

export const createAuthRoute = (gapiClient: Gapi): express.Router => {
    const apiRoute: express.Router = express.Router();
    apiRoute.get("/url", createUrlRequestHandler(gapiClient));
    apiRoute.post("/code", createPostCodeRequestHandler(gapiClient));
    return apiRoute;
};
