import { fitness_v1, oauth2_v2 } from 'googleapis';
import { SampleClient } from './gapi-client';
import { IConfig } from '../../../config';
import { GetTokenResponse, OAuth2Client, CodeChallengeMethod, GenerateAuthUrlOpts } from 'google-auth-library/build/src/auth/oauth2client';
import { Credentials } from 'google-auth-library';
import { AxiosPromise } from 'axios';
import * as crypto from 'crypto';

export class Gapi {

    private mConfig: IConfig;
    private gClient: SampleClient;
    constructor(config: IConfig) {
        this.gClient = new SampleClient(config);
        this.mConfig = config;
    }

    public createCodeVerifier(): string {
        return crypto.randomBytes(128).toString("hex").substr(0, 96);
    }

    public createCodeChallenge(codeVerifier: string): string {
        return crypto.createHash("sha256").update(codeVerifier).digest("base64");
    }

    public generateAuthUrl(): string {
        const options: GenerateAuthUrlOpts = {
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/fitness.body.read',
                'https://www.googleapis.com/auth/fitness.body.write'
            ],
            include_granted_scopes: true,
            redirect_uri: this.mConfig.google.redirect_url
            //code_challenge: this.createCodeChallenge(this.createCodeVerifier()),
            //code_challenge_method: CodeChallengeMethod.S256
        };
        return this.gClient.client.generateAuthUrl(options);
    }

    public exchangeCode(code: string): Promise<GetTokenResponse> {
        return this.gClient.client.getToken(code);
    }

    public getMe(creds: Credentials): Promise<oauth2_v2.Schema$Userinfoplus> {
        let bb = new OAuth2Client();
        bb.credentials = creds;
        console.log(this.gClient.client.getAccessToken());
        let aa = new oauth2_v2.Oauth2({
            auth: creds.access_token
        })
        return <any>aa.userinfo.get();
    }

    public getDataSources(creds: Credentials): Promise<any> {
        const client: OAuth2Client = new OAuth2Client();
        client.credentials = creds;
        const fitClient: fitness_v1.Fitness = new fitness_v1.Fitness({
            auth: creds.access_token
        });
        return fitClient.users.dataSources.list({ userId: "me" }).then((dd) => {
            return dd.data;
        });
    }

    public createDataSource(creds: Credentials): AxiosPromise<any> {
        const client: OAuth2Client = new OAuth2Client();
        client.credentials = creds;
        const fitClient: fitness_v1.Fitness = new fitness_v1.Fitness({
            auth: creds.access_token
        });
        return fitClient.users.dataSources.create({
            userId: "me",
            requestBody: {
                "dataStreamName": "PolarImport",
                "type": "raw",
                "application": {
                    //"packageName": "com.github.donmahallem.heartfit",
                    "detailsUrl": "https://donmahallem.github.io/ngHeartFit",
                    "name": "HeartFit",
                    "version": "1"
                },
                "dataType": {
                    "field": [
                        {
                            "name": "bpm",
                            "format": "floatPoint"
                        }
                    ],
                    "name": "com.google.heart_rate.bpm"
                },
                "device": {
                    "manufacturer": "Example Browser",
                    "model": "Browser",
                    "type": "unknown",
                    "uid": "1000001",
                    "version": "1.0"
                }
            }
        })
    }
}