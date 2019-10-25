import { createCipher, createDecipher, Cipher, Decipher } from "crypto";
import { create } from "domain";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { IConfig } from "../../../config";
import { GapiAuthHelper } from "./gapi-auth-helper";
export class GapiAuthInstance {
    private readonly COOKIE_NAME: string = "gsession";
    private mAccessToken: string;
    private mRefreshToken: string;
    private mResponse: Response;
    private mConfig: IConfig;
    private mIsAuthenticated: boolean = false;
    constructor(res: Response, config: IConfig) {
        this.mResponse = res;
        this.mConfig = config;
    }

    public load(req: Request): void {
        if (req.cookies[this.COOKIE_NAME]) {

        } else {
            this.mIsAuthenticated = false;
        }
    }

    public get isAuthenticated(): boolean {
        return this.mIsAuthenticated;
    }

    public updateToken(): void {
        const jwtToken: string = jwt.sign({
            access_token: GapiAuthHelper.encryptData(this.mAccessToken, this.mConfig.general.secret),
            refresh_token: GapiAuthHelper.encryptData(this.mRefreshToken, this.mConfig.general.secret),
        }, this.mConfig.general.secret, {
            expiresIn: "1h",
            issuer: this.mConfig.general.host,
        });
        this.mResponse.cookie(this.COOKIE_NAME, jwtToken, {
            httpOnly: true,
            signed: true,
        });
    }

    public set access_token(token: string) {
        this.mAccessToken = token;
        this.updateToken();
    }

    public get access_token(): string {
        return this.mAccessToken;
    }

    public set refresh_token(token: string) {
        this.mRefreshToken = token;
    }

    public get refresh_token(): string {
        return this.mRefreshToken;
    }

}

export const parseAuthorizationHeader = (auth: string): string | false => {
    if (auth.substr(0, 7).toLowerCase() !== "bearer ") {
        return false;
    }
    const spl: string[] = auth.split(" ");
    if (spl.length !== 2) {
        return false;
    }

};
