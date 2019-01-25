import { fitness_v1, oauth2_v2 } from 'googleapis';
import { SampleClient } from './gapi-client';
import { IConfig } from '../../../config';
import { GetTokenResponse, OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client';
import { Credentials } from 'google-auth-library';

export class Gapi {

    private gClient: SampleClient;
    constructor(config: IConfig) {
        this.gClient = new SampleClient(config);
    }

    public generateAuthUrl(): string {
        return this.gClient.client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/fitness.body.read', 'https://www.googleapis.com/auth/fitness.body.write'],
            include_granted_scopes: true
        });
    }

    public exchangeCode(code: string): Promise<GetTokenResponse> {
        return this.gClient.client.getToken(code);
    }

    public getMe(creds: Credentials): Promise<oauth2_v2.Schema$Userinfoplus> {
        let bb = new OAuth2Client();
        bb.credentials = creds;
        console.log(this.gClient.client.getAccessToken());
        let aa = new oauth2_v2.Oauth2({
            auth: bb
        })
        return <any>aa.userinfo.get();
    }
}