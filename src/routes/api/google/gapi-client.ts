
import { } from 'googleapis';

import { drive_v3, GoogleApis, google, fitness_v1 } from 'googleapis';
import { URL } from 'url';
import { IConfig } from '../../../config';
export class SampleClient {

    private _options: any;
    private oAuth2Client: google.auth.OAuth2;
    private authorizeUrl: string;
    constructor(options, config: IConfig) {
        this._options = options || { scopes: [] };
        const redirectUri = "";// keys.redirect_uris[keys.redirect_uris.length - 1];
        const parts: URL = new URL(redirectUri);
        if (
            redirectUri.length === 0 ||
            parts.port !== '3000' ||
            parts.hostname !== 'localhost' ||
            parts.pathname !== '/oauth2callback'
        ) {
            throw new Error("invalidRedirectUri");
        }

        // create an oAuth client to authorize the API call
        this.oAuth2Client = new google.auth.OAuth2(
            config.google.client_id,
            config.google.client_secret,
            redirectUri
        );
    }

    public get client(): google.auth.OAuth2 {
        return this.oAuth2Client;
    }
}