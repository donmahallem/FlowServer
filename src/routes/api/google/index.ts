/*!
 * Source https://github.com/donmahallem/FlowServer
 */

import * as express from "express";
import { Credentials } from "google-auth-library";
import { GetTokenResponse } from "google-auth-library/build/src/auth/oauth2client";
import { Schema, Validator, ValidatorResult } from "jsonschema";
import { VerifyErrors } from "jsonwebtoken";
import { IConfig } from "../../../config";
import { JwtHelper } from "../../../jwt-helper";
import { createAuthRoute } from "./auth.route";
import { createFitRoute } from "./fit.route";
import { Gapi } from "./gapi";
import { IGapiJwtToken } from "./gapi-jwt-token";
declare global {
    namespace Express {
        // tslint:disable-next-line:interface-name
        interface Request {
            gapi: IGapiInfo;
        }
    }
}
const exchangeCodeSchema: Schema = {
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
const exchangeCodeSchema2: Schema = {
    properties: {
        code: {
            type: "string",
        },
        scope: {
            type: "string",
        },
    },
    required: ["scope", "code"],
    type: "object",
};

export interface IGapiInfo {
    signedIn: boolean;
    credentials?: Credentials;
}

export const regexBearerToken: RegExp = new RegExp("^bearer\\ .*$", "i");

export const createGoogleApiAuthRoute = (config: IConfig): express.RequestHandler =>
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.gapi = {
            signedIn: false,
        };
        if (req.headers.authorization) {
            const authHeader: string = req.headers.authorization;
            if (regexBearerToken.test(authHeader)) {
                JwtHelper.verify(authHeader.split(" ")[1])
                    .then((decoded: IGapiJwtToken) => {
                        req.gapi = {
                            credentials: decoded.gapi,
                            signedIn: true,
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

export const createGoogleApiRoute = (config: IConfig): express.Router => {
    const apiRoute: express.Router = express.Router();
    const aa = new Gapi(config);
    apiRoute.use(createGoogleApiAuthRoute(config));
    apiRoute.use("/auth", createAuthRoute(aa));
    apiRoute.use("/fit", createFitRoute(aa));
    return apiRoute;
};
