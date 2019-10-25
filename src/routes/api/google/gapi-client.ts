/*!
 * Source https://github.com/donmahallem/FlowServer
 */

import {
    OAuth2Client,
} from "google-auth-library";
import { fitness_v1 } from "googleapis";
import { URL } from "url";
import { IConfig } from "../../../config";
export class SampleClient {

    private _options: any;
    private oAuth2Client: OAuth2Client;
    private authorizeUrl: string;
    constructor(config: IConfig) {
        /*const redirectUri = "";// keys.redirect_uris[keys.redirect_uris.length - 1];
        const parts: URL = new URL(redirectUri);
        if (
            redirectUri.length === 0 ||
            parts.port !== '3000' ||
            parts.hostname !== 'localhost' ||
            parts.pathname !== '/oauth2callback'
        ) {
            throw new Error("invalidRedirectUri");
        }
*/
        // create an oAuth client to authorize the API call
        this.oAuth2Client = new OAuth2Client(
            config.google.client_id,
            config.google.client_secret,
            config.google.redirect_url,
        );
    }

    public get client(): OAuth2Client {
        return this.oAuth2Client;
    }
}
