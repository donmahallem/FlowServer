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
import { createValidateBodyMiddleware } from "../../../validate-body-middleware";

export const exchangeCodeSchema: Schema = {
    properties: {
        code: {
            type: "string",
        },
        scope: {
            items: {
                type: "string",
            },
            minItems: 1,
            type: "array",
        },
    },
    required: ["scope", "code"],
    type: "object",
};

export const createUrlRequestHandler = (gapiClient: Gapi): express.RequestHandler =>
    (req, res, next) => {
        res.json({ url: gapiClient.generateAuthUrl() });
    };

export const createPostCodeRequestHandler = (gapiClient: Gapi): express.RequestHandler =>
    (req, res, next) => {
        gapiClient.exchangeCode(req.body.code)
            .then((tokenResponse: GetTokenResponse) => {
                if (tokenResponse.res.status === 200) {
                    const data: IGapiJwtToken = { gapi: tokenResponse.tokens };
                    return JwtHelper.sign(data);
                } else {
                    return Promise.reject(new ServerError("Could not exchange code", tokenResponse.res.status));
                }
            })
            .then((jwtToken: string) => {
                res.json({
                    token: jwtToken,
                });
            }).catch((err: Error) => {
                next(err);
            });
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
                    .then((jwttoken: string) =>
                        ({
                            body: jwttoken,
                        }));
            } else {
                return Promise.reject(new ServerError("Invalid request", 400));
            }
        });

export const createAuthRoute = (gapiClient: Gapi): express.Router => {
    const apiRoute: express.Router = express.Router();
    apiRoute.get("/url", createUrlRequestHandler(gapiClient));
    apiRoute.post("/code", createValidateBodyMiddleware(exchangeCodeSchema), createPostCodeRequestHandler(gapiClient));
    return apiRoute;
};
