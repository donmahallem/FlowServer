import * as yargs from 'yargs';
import { randomBytes } from 'crypto';
import * as nconf from 'nconf';
export const createSecret = (): string => {
    return randomBytes(48).toString("hex");
}

export interface IConfig {
    general: {
        port: number;
        secret: string;
        host: string;
        localhost_only: boolean;
    },
    google: {
        client_id: string;
        client_secret: string;
    },
    flow: {
        email: string;
        password: string;
    }
}

nconf
    .defaults({
        flow: {

        }
    })
    .argv({
        "x": {
            alias: 'example',
            describe: 'Example description for usage generation',
            demand: true,
            default: 'some-value',
            parseValues: true,
            transform: function (obj) {
                if (obj.key === 'foo') {
                    obj.value = 'baz';
                }
                return obj;
            }
        }
    });
export const getConfig = (): IConfig => {
    const initialConf: nconf.Provider = new nconf.Provider();
    initialConf
        .argv({
            "c": {
                alias: 'config',
                describe: 'Example description for usage generation',
                demand: true
            }
        }).required(["config"]);
    initialConf
        .file(initialConf.get("config"))
        .defaults({
            "general:port": 3000,
            "general:localhost_only": true,
            "general:secret": createSecret(),
            "general:host": "localhost"
        })
        .required(["google:client_id",
            "google:client_secret",
            "flow:email",
            "flow:password"]);
    return {
        flow: {
            email: initialConf.get("flow:email"),
            password: initialConf.get("flow:password")
        },
        general: {
            port: initialConf.get("general:port"),
            host: initialConf.get("general:host"),
            localhost_only: initialConf.get("general:localhost_only"),
            secret: initialConf.get("general:secret"),
        },
        google: {
            client_secret: initialConf.get("google:client_secret"),
            client_id: initialConf.get("google:client_id")
        }
    }
}