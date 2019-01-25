import * as express from 'express';
import { IConfig } from '../../../config';
import { Gapi } from './gapi';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';


export const createGoogleApiRoute = (config: IConfig): express.Router => {
    const apiRoute: express.Router = express.Router();
    const aa = new Gapi(config);
    apiRoute.get('/auth/signin', (req, res, next) => {
        res.redirect(aa.generateAuthUrl());
    });
    apiRoute.get('/auth/callback', (req, res, next) => {
        aa.exchangeCode(req.query['code'])
            .then((resp: GetTokenResponse) => {
                console.log(resp.tokens);
                return aa.getMe(resp.tokens);
            })
            .then((resss) => {
                console.log(resss);
            })
            .catch((err: Error) => {
                console.error(err);
                res.status(400)
                    .send("error");
            });
    });
    return apiRoute;
}