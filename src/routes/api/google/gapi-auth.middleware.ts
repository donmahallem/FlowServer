import { Request, NextFunction, Response } from 'express';
import { IConfig } from '../../../config';
import { createCipher, createDecipher, Cipher, Decipher } from 'crypto';
import { GapiAuthRequest } from './gapi-auth.request';
import { create } from 'domain';
import * as jwt from 'jsonwebtoken';
export const createGapiAuthMiddleware = (config: IConfig) => {
    return (req: GapiAuthRequest, res: Response, next: NextFunction) => {
        req.gapi = new GapiAuthInstance(res, config);

    }
};

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
            access_token: this.encryptData(this.mAccessToken),
            refresh_token: this.encryptData(this.mRefreshToken)
        }, this.mConfig.general.secret, {
                expiresIn: "1h",
                issuer: this.mConfig.general.host
            });
        this.mResponse.cookie(this.COOKIE_NAME, jwtToken, {
            httpOnly: true,
            signed: true
        });
    }

    public set access_token(token: string) {
        this.mAccessToken = token;
        this.updateToken()
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
    const spl: string[] = auth.split(' ');
    if (spl.length != 2) {
        return false;
    }

};