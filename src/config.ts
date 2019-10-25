/*!
 * Source https://github.com/donmahallem/FlowServer
 */

import { randomBytes } from "crypto";
import * as nconf from "nconf";
export const createSecret = (length: number = 128): string =>
    randomBytes(length).toString("hex");

export interface IConfig {
    general: {
        port: number;
        secret: string;
        jwt_secret: string;
        host: string;
        localhost_only: boolean;
        static_files: string;
    };
    google: {
        client_id: string;
        client_secret: string;
        redirect_url: string;
    };
    flow: {
        email: string;
        password: string;
    };
}

export const getConfig = (): IConfig => {
    const initialConf: nconf.Provider = new nconf.Provider();
    initialConf
        .argv({
            c: {
                alias: "config",
                demand: true,
                describe: "Example description for usage generation",
            },
        }).required(["config"]);
    initialConf
        .file(initialConf.get("config"))
        .defaults({
            "general:host": "localhost",
            "general:jwt_secret": createSecret(256),
            "general:localhost_only": true,
            "general:port": 3000,
            "general:secret": createSecret(),
        })
        .required(["google:client_id",
            "google:client_secret",
            "google:redirect_url",
            "flow:email",
            "flow:password",
            "general:static_files"]);
    return {
        flow: {
            email: initialConf.get("flow:email"),
            password: initialConf.get("flow:password"),
        },
        general: {
            host: initialConf.get("general:host"),
            jwt_secret: initialConf.get("general:jwt_secret"),
            localhost_only: initialConf.get("general:localhost_only"),
            port: initialConf.get("general:port"),
            secret: initialConf.get("general:secret"),
            static_files: initialConf.get("general:static_files"),
        },
        google: {
            client_id: initialConf.get("google:client_id"),
            client_secret: initialConf.get("google:client_secret"),
            redirect_url: initialConf.get("google:redirect_url"),
        },
    };
};

class GoogleConfig {

    private conf: nconf.Provider;
    constructor(conf: nconf.Provider) {
        this.conf = conf;
    }
    public get clientSecret(): string {
        return this.conf.get(Config.GOOGLE_CLIENT_SECRET);
    }

    public get redirectUrl(): string {
        return this.conf.get(Config.GOOGLE_REDIRECT_URL);
    }

    public get clientId(): string {
        return this.conf.get(Config.GOOGLE_CLIENT_ID);
    }
}

class FlowConfig {
    private conf: nconf.Provider;
    constructor(conf: nconf.Provider) {
        this.conf = conf;
    }
    public get email(): string {
        return this.conf.get(Config.FLOW_EMAIL);
    }

    public get password(): string {
        return this.conf.get(Config.FLOW_PASSWORD);
    }
}

class GeneralConfig {

    private conf: nconf.Provider;
    constructor(conf: nconf.Provider) {
        this.conf = conf;
    }
    public get port(): string {
        return this.conf.get(Config.GENERAL_PORT);
    }
    public get host(): string {
        return this.conf.get(Config.GENERAL_HOST);
    }
    public get secret(): string {
        return this.conf.get(Config.GENERAL_SECRET);
    }
    public get jwtSecret(): string {
        return this.conf.get(Config.GENERAL_JWT_SECRET);
    }
    public get staticFiles(): string {
        return this.conf.get(Config.GENERAL_STATIC_FILES);
    }
}

export class Config {

    public get flow(): FlowConfig {
        return this.flowConfig;
    }

    public get google(): GoogleConfig {
        return this.googleConfig;
    }

    public get general(): GeneralConfig {
        return this.generalConfig;
    }
    public static readonly FLOW_EMAIL: string = "flow:email";
    public static readonly FLOW_PASSWORD: string = "flow:email";
    public static readonly GOOGLE_CLIENT_ID: string = "google:client_id";
    public static readonly GOOGLE_CLIENT_SECRET: string = "google:client_secret";
    public static readonly GOOGLE_REDIRECT_URL: string = "google:redirect_url";
    public static readonly GENERAL_PORT: string = "general:port";
    public static readonly GENERAL_HOST: string = "general:host";
    public static readonly GENERAL_SECRET: string = "general:secret";
    public static readonly GENERAL_JWT_SECRET: string = "general:jwt_secret";
    public static readonly GENERAL_STATIC_FILES: string = "general:static_files";
    private static conifgInstance: Config = null;
    private initialConf: nconf.Provider;
    private googleConfig: GoogleConfig;
    private flowConfig: FlowConfig;
    private generalConfig: GeneralConfig;
    private constructor() {

        const initialConf: nconf.Provider = new nconf.Provider();
        initialConf
            .argv({
                c: {
                    alias: "config",
                    demand: true,
                    describe: "Example description for usage generation",
                },
            }).required(["config"]);
        initialConf
            .file(initialConf.get("config"))
            .defaults({
                "general:host": "localhost",
                "general:localhost_only": true,
                "general:port": 3000,
                "general:secret": createSecret(256),
                "general:jwt_secret": createSecret(256),
            })
            .required([
                Config.GOOGLE_CLIENT_SECRET,
                Config.GOOGLE_CLIENT_ID,
                Config.GOOGLE_REDIRECT_URL,
                "flow:email",
                "flow:password",
                "general:static_files"]);
        this.googleConfig = new GoogleConfig(this.initialConf);
        this.flowConfig = new FlowConfig(this.initialConf);
        this.generalConfig = new GeneralConfig(this.initialConf);
    }
    public static get(): Config {
        if (Config.conifgInstance === undefined) {
            Config.conifgInstance = new Config();
        }
        return Config.conifgInstance;
    }

}
