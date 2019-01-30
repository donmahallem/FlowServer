import { Request } from 'express';
import { GapiAuthInstance } from './gapi-auth.middleware';

export interface GapiAuthRequest extends Request {
    gapi: GapiAuthInstance;
}