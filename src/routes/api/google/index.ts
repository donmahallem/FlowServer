import * as express from 'express';
import { IConfig } from '../../../config';


export const createGoogleApiRoute = (config: IConfig): express.Router => {
    const apiRoute: express.Router = express.Router();
    return apiRoute;
}